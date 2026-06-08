// Tipos del contenido de Griin.
//
// IMPORTANTE: estos tipos están deliberadamente alineados con el schema del CMS
// de Sistema Focus (apps/backend/seed/schemas/build-griin-v1.mjs) — mismos
// nombres de campo en snake_case. Hoy el contenido vive en archivos locales
// (src/data/*), y los getters de `src/lib/content.ts` lo devuelven. Cuando se
// cablee el sitio al CMS, solo cambia el INTERIOR de esos getters (leen del
// Focus SDK con fallback a estos datos); los componentes y estos tipos NO
// cambian.

export interface ImageRef {
  src: string;
  alt?: string;
}

export interface TextoItem {
  texto: string;
}

export interface NavLink {
  label: string;
  url: string;
}

// ── Propiedad (colección `propiedades`) ──────────────────────────────────

export type Operacion = 'venta' | 'arriendo';
export type TipoPropiedad =
  | 'parcela'
  | 'casa'
  | 'cabaña'
  | 'departamento'
  | 'terreno'
  | 'oficina'
  | 'campo';
export type EstadoPropiedad = 'disponible' | 'reservada' | 'vendida';

export interface Property {
  slug: string;
  codigo: string;
  titulo: string;
  operacion: Operacion;
  tipo: TipoPropiedad;
  comuna: string;
  precio_clp: number | null;
  precio_uf: number | null;
  superficie_construida_m2: number | null;
  superficie_terreno_m2: number | null;
  dormitorios: number | null;
  banos: number | null;
  estacionamientos: number | null;
  amenities: TextoItem[];
  descripcion: string;
  galeria: ImageRef[];
  video_url: string;
  destacado: boolean;
  estado: EstadoPropiedad;
}

// ── Secciones institucionales ────────────────────────────────────────────

export interface ConfigData {
  marca: { nombre: string; tagline: string };
  contacto: { email: string; telefono_display: string; telefono_e164: string; direccion: string };
  whatsapp: { numero: string; mensaje_default: string };
  nav: NavLink[];
  redes: { red: string; url: string }[];
  footer: { descripcion: string; bottom_links: NavLink[] };
  seo: { title: string; description: string; site_name: string; og_image: ImageRef };
  jsonld: { area_servida: string; zonas: TextoItem[] };
  analytics: {
    gtm_id: string;
    google_ads_id: string;
    plausible_domain: string;
    conversions: { evento: string; ads_label: string; plausible_goal: string }[];
    custom_scripts: { name: string; enabled: boolean; placement: 'head' | 'body-end'; code: string }[];
  };
}

export interface HeroData {
  eyebrow: string;
  titulo: string;
  imagen_fondo: ImageRef;
  ubicaciones: TextoItem[];
  buscador_placeholder: string;
}

export interface DestacadasData {
  titulo: string;
  subtitulo: string;
}

export interface ConservacionBannerData {
  eyebrow: string;
  titulo: string;
  imagen: ImageRef;
  cta_label: string;
  cta_url: string;
}

export interface FaqData {
  eyebrow: string;
  titulo: string;
  items: { pregunta: string; respuesta: string }[];
  cta_titulo: string;
  cta_imagen: ImageRef;
  cta_url: string;
}

export interface SomosData {
  eyebrow: string;
  titulo: string;
  intro: string;
  valores: { letra: string; nombre: string; descripcion: string }[];
}

export interface ServiciosData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  items: { titulo: string; descripcion: string; cta_label: string; cta_url: string }[];
}

export interface ConservacionData {
  eyebrow: string;
  titulo: string;
  cuerpo: string;
  imagen: ImageRef;
  cta_label: string;
  cta_url: string;
}

export interface ContactoData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  form_boton: string;
  form_success: string;
}

export interface PrivacidadData {
  titulo: string;
  actualizado: string;
  cuerpo: string;
}
