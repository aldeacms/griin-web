// Capa de acceso al contenido de Griin (CABLEADA al CMS de Sistema Focus).
//
// Cada getter intenta leer la sección desde el Focus SDK (modo file en build,
// modo PB si FOCUS_PB_URL está seteado) y cae al JSON commiteado en `content/`
// como fallback — así el sitio nunca queda en blanco. Los componentes leen
// SIEMPRE desde aquí; nunca importan el contenido directo.

import { focus } from './focus-sdk';
import type {
  Property, Operacion,
  ConfigData, HeroData, DestacadasData, ConservacionBannerData, FaqData,
  SomosData, ServiciosData, ConservacionData, ContactoData, PrivacidadData, ImageRef,
} from '../types/griin';

import configJson from '../../content/config.json';
import heroJson from '../../content/hero.json';
import destacadasJson from '../../content/destacadas.json';
import conservacionBannerJson from '../../content/conservacion_banner.json';
import faqJson from '../../content/faq.json';
import somosJson from '../../content/somos.json';
import serviciosJson from '../../content/servicios.json';
import conservacionJson from '../../content/conservacion.json';
import contactoJson from '../../content/contacto.json';
import privacidadJson from '../../content/privacidad.json';
import propiedadesJson from '../../content/propiedades.json';

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    return ((await focus.section<T>(key)) ?? fallback) as T;
  } catch {
    return fallback;
  }
}

// ── Getters de secciones ─────────────────────────────────────────────────

export const getConfig = () => read<ConfigData>('config', configJson as unknown as ConfigData);
export const getHero = () => read<HeroData>('hero', heroJson as unknown as HeroData);
export const getDestacadas = () => read<DestacadasData>('destacadas', destacadasJson as unknown as DestacadasData);
export const getConservacionBanner = () => read<ConservacionBannerData>('conservacion_banner', conservacionBannerJson as unknown as ConservacionBannerData);
export const getFaq = () => read<FaqData>('faq', faqJson as unknown as FaqData);
export const getSomos = () => read<SomosData>('somos', somosJson as unknown as SomosData);
export const getServicios = () => read<ServiciosData>('servicios', serviciosJson as unknown as ServiciosData);
export const getConservacion = () => read<ConservacionData>('conservacion', conservacionJson as unknown as ConservacionData);
export const getContacto = () => read<ContactoData>('contacto', contactoJson as unknown as ContactoData);
export const getPrivacidad = () => read<PrivacidadData>('privacidad', privacidadJson as unknown as PrivacidadData);

// ── Getters de la colección de propiedades ───────────────────────────────

const propsFallback = propiedadesJson as unknown as Property[];

export const getProperties = async (): Promise<Property[]> => {
  try {
    const list = await focus.list<Property>('propiedades');
    return list.length ? list : propsFallback;
  } catch {
    return propsFallback;
  }
};
export const getProperty = async (slug: string): Promise<Property | undefined> =>
  (await getProperties()).find((p) => p.slug === slug);
export const getPropertiesByOperacion = async (op: Operacion): Promise<Property[]> =>
  (await getProperties()).filter((p) => p.operacion === op);
export const getFeaturedProperties = async (limit = 9): Promise<Property[]> => {
  const all = await getProperties();
  const featured = all.filter((p) => p.destacado);
  return (featured.length ? featured : all).slice(0, limit);
};

// ── Helpers de presentación ──────────────────────────────────────────────

const clpFmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const numFmt = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

export function formatCLP(v: number | null | undefined): string {
  return typeof v === 'number' ? clpFmt.format(v) : '';
}
export function formatUF(v: number | null | undefined): string {
  return typeof v === 'number' ? `${numFmt.format(v)} UF` : '';
}
export function formatM2(v: number | null | undefined): string {
  return typeof v === 'number' ? `${numFmt.format(v)} m²` : '';
}

export function imgSrc(v: unknown): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v !== null && 'src' in v) return (v as ImageRef).src ?? '';
  return '';
}
export function imgAlt(v: unknown, fallback = ''): string {
  if (v && typeof v === 'object' && 'alt' in v) return (v as ImageRef).alt ?? fallback;
  return fallback;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function mdInline(s: unknown): string {
  if (typeof s !== 'string' || !s) return '';
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
}
export function renderProse(s: unknown): string {
  if (typeof s !== 'string' || !s) return '';
  return s
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith('## ') ? `<h2>${mdInline(b.slice(3))}</h2>` : `<p>${mdInline(b).replace(/\n/g, '<br>')}</p>`))
    .join('\n');
}
