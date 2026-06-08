// @focus/sdk — cliente del Sistema Focus para sitios Astro custom.
// Versión local copiada del monorepo (sin re-export de @focus/schema).
//
// Dos modos:
//   1. Producción (default): lee JSONs commiteados en `content/` del repo Astro.
//      No hace red, no llama a PocketBase. El publisher service ya commiteó los
//      archivos al repo del cliente.
//   2. Development: si FOCUS_PB_URL está seteado, lee directo de PocketBase
//      (status=draft del tenant). Útil mientras Daniel itera el diseño.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface FocusSDKOptions {
  contentDir?: string;
  pbUrl?: string;
  tenantSlug?: string;
  status?: "draft" | "published";
}

export interface FocusSDK {
  section<T = Record<string, unknown>>(key: string): Promise<T>;
  list<T = Record<string, unknown>>(key: string, opts?: { limit?: number; offset?: number }): Promise<T[]>;
  has(key: string): Promise<boolean>;
}

export function createFocusSDK(opts: FocusSDKOptions = {}): FocusSDK {
  const contentDir = opts.contentDir ?? "./content";
  const usePb = !!opts.pbUrl;
  const cache = new Map<string, unknown>();

  async function loadFromFile(key: string): Promise<unknown> {
    if (cache.has(key)) return cache.get(key);
    const path = join(contentDir, `${key}.json`);
    try {
      const raw = await readFile(path, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      cache.set(key, parsed);
      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        cache.set(key, null);
        return null;
      }
      throw err;
    }
  }

  async function loadFromPb(key: string): Promise<unknown> {
    if (cache.has(key)) return cache.get(key);
    if (!opts.pbUrl) throw new Error("pbUrl required for PB mode");
    if (!opts.tenantSlug) throw new Error("tenantSlug required for PB mode");
    const status = opts.status ?? "published";
    const url = new URL("/api/collections/cms_content/records", opts.pbUrl);
    url.searchParams.set("filter", `tenant.slug = "${opts.tenantSlug}" && section_key = "${key}" && status = "${status}"`);
    url.searchParams.set("perPage", "1");
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`PB fetch failed: ${res.status}`);
    const json = (await res.json()) as { items?: Array<{ data: unknown }> };
    const data = json.items?.[0]?.data ?? null;
    cache.set(key, data);
    return data;
  }

  const load = usePb ? loadFromPb : loadFromFile;

  return {
    async section<T>(key: string): Promise<T> {
      const data = await load(key);
      if (data === null) throw new Error(`section "${key}" no encontrada`);
      return data as T;
    },
    async list<T>(key: string, listOpts?: { limit?: number; offset?: number }): Promise<T[]> {
      const data = await load(key);
      if (data === null) return [];
      if (!Array.isArray(data)) throw new Error(`section "${key}" no es una lista`);
      let items = data as T[];
      if (listOpts?.offset) items = items.slice(listOpts.offset);
      if (listOpts?.limit !== undefined) items = items.slice(0, listOpts.limit);
      return items;
    },
    async has(key: string): Promise<boolean> {
      const data = await load(key);
      return data !== null;
    },
  };
}

export const focus = createFocusSDK({
  contentDir: process?.env?.FOCUS_CONTENT_DIR ?? "./content",
  pbUrl: process?.env?.FOCUS_PB_URL,
  tenantSlug: process?.env?.FOCUS_TENANT_SLUG,
  status: (process?.env?.FOCUS_STATUS as "draft" | "published" | undefined) ?? "published",
});
