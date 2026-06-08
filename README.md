# Builder Era 4 Headless (Clean Slate)

Este es el motor base para proyectos **WaaS (Website as a Service)**. Ha sido diseñado bajo los principios de **Arquitectura Headless** y **Metodología Era 4**.

## Principios de Desarrollo

1.  **Astro + Tailwind 4 Puro:** No se usa CSS global para estilos visuales. Todo el diseño vive encapsulado en componentes `.astro` usando utilidades nativas.
2.  **Componentes Data-Ready:** Todo componente define sus `Props` mediante interfaces TypeScript, anticipando que los datos vendrán de una API (Headless WordPress).
3.  **Patrón SEO Aldea:** Separación estricta entre importancia semántica y visual.
    -   **Eyebrow:** Tag `h2` para palabras clave SEO.
    -   **Headline:** Tag `p` para impacto visual.
4.  **Zero JS por Defecto:** Máximo rendimiento. Solo se añade interactividad (`client:*`) cuando es estrictamente necesario.

## Estructura de Componentes

-   `Section.astro`: Contenedor base con patrón SEO integrado.
-   `Header.astro / Footer.astro`: Componentes de navegación tipados.
-   `Layout.astro`: Estructura base semántica.

## Comandos

```bash
npm install     # Instalar dependencias
npm run dev     # Iniciar servidor de desarrollo
npm run build   # Compilar para producción
```

---
*Life Focus Framework | v4.0.0 Headless*
