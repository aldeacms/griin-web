// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://griin.cl',
  output: 'static',
  // Rutas heredadas → listado unificado de propiedades.
  redirects: {
    '/parcelas': '/propiedades',
    '/arriendos': '/propiedades',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});