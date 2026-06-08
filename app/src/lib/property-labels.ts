// Labels legibles para los tipos de propiedad.
//
// El campo `tipo` de una propiedad es un slug en snake_case (ej. `local_comercial`).
// Aquí lo traducimos a su etiqueta es-CL para mostrarla en cards, filtros y ficha.
// Único punto de verdad: NO capitalizar el slug crudo en los componentes.

import type { TipoPropiedad } from '../types/griin';

export const TIPO_LABELS: Record<TipoPropiedad, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  cabaña: 'Cabaña',
  parcela: 'Parcela',
  sitio: 'Sitio',
  terreno: 'Terreno',
  terreno_industrial: 'Terreno industrial',
  oficina: 'Oficina',
  local_comercial: 'Local comercial',
  bodega: 'Bodega',
  industrial: 'Industrial',
  edificio: 'Edificio',
  hotel: 'Hotel',
  hostal: 'Hostal',
  propiedad_turistica: 'Propiedad turística',
  conservacion: 'Conservación',
  estacionamiento: 'Estacionamiento',
  atracadero: 'Atracadero',
  otra: 'Otra',
};

/** Devuelve la etiqueta legible de un tipo; si es desconocido, capitaliza el slug. */
export function tipoLabel(t: string | null | undefined): string {
  if (!t) return '';
  const known = TIPO_LABELS[t as TipoPropiedad];
  if (known) return known;
  return t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, ' ');
}
