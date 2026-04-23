---
id: optimisation-assets
parent: performance
label: Optimisation des assets
explored: false
order: 1
---

# Optimisation des assets

Images, polices, scripts et feuilles de style représentent l'essentiel du poids d'une page. Les optimiser réduit le temps de chargement et améliore le LCP.

## Images — format et lazy loading

```html
<!-- Format moderne WebP/AVIF avec fallback -->
<picture>
  <source type="image/avif" srcset="/hero.avif 1x, /hero@2x.avif 2x" />
  <source type="image/webp" srcset="/hero.webp 1x, /hero@2x.webp 2x" />
  <img
    src="/hero.jpg"
    alt="Description précise pour l'accessibilité"
    width="1200"
    height="600"
    loading="eager"     <!-- eager pour l'image above-the-fold (LCP) -->
    fetchpriority="high" <!-- priorité de fetch pour le LCP -->
    decoding="sync"
  />
</picture>

<!-- Images below-the-fold → lazy loading natif -->
<img
  src="/product.jpg"
  alt="Produit X"
  width="400"
  height="300"
  loading="lazy"      <!-- chargé quand il approche du viewport -->
  decoding="async"
/>

<!-- srcset responsive — servir la bonne taille selon l'écran -->
<img
  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px"
  src="/hero-800.webp"
  alt="Hero"
  width="1200"
  height="600"
/>
```

```bash
# Convertir et optimiser avec sharp (Node.js)
import sharp from 'sharp';

await sharp('input.jpg')
  .resize(800, null, { withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile('output.webp');

await sharp('input.jpg')
  .resize(800)
  .avif({ quality: 70 })
  .toFile('output.avif');

# CLI : squoosh, imagemin, vips
npx @squoosh/cli --webp '{"quality":85}' --avif '{"quality":70}' input.jpg
```

## Polices — éliminer le FOUT/FOIT

```html
<!-- Preload de la police critique -->
<link rel="preload" href="/fonts/inter-var.woff2"
      as="font" type="font/woff2" crossorigin />
```

```css
/* font-display: swap — texte visible immédiatement avec police de fallback */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* Correspondance de métriques — réduire le layout shift au swap */
@font-face {
  font-family: 'Inter-fallback';
  src: local('Arial');
  ascent-override:   92.77%;
  descent-override:  24.63%;
  line-gap-override: 0%;
  size-adjust:       107.18%;
}
body { font-family: 'Inter', 'Inter-fallback', sans-serif; }
```

## JavaScript — code splitting et Tree-shaking

```typescript
// Import dynamique — charge seulement si nécessaire
const { Chart } = await import('chart.js');

// Tree-shaking — importer seulement ce qu'on utilise
import { format, parseISO } from 'date-fns';       // ✅ seules ces fonctions
import * as dateFns from 'date-fns';               // ❌ toute la lib

// Analyser le bundle
import { visualizer } from 'rollup-plugin-visualizer';
// vite.config.ts
plugins: [visualizer({ open: true, gzipSize: true })]
```

## CSS critique — inline au-dessus de la ligne de flottaison

```html
<!-- CSS critique inline → pas de requête bloquante -->
<style>
  /* Styles minimaux pour le rendu initial (above-the-fold) */
  body { margin: 0; font-family: system-ui, sans-serif; }
  header { ... }
  .hero { ... }
</style>
<!-- CSS complet en asynchrone -->
<link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/styles.css" /></noscript>
```

```bash
# Générer le CSS critique automatiquement
npx critical dist/index.html --inline --minify > dist/index.critical.html
```

## Compression & Headers

```nginx
# nginx — compression gzip/brotli
gzip              on;
gzip_comp_level   6;
gzip_types        text/plain text/css application/json application/javascript;
brotli            on;
brotli_comp_level 6;

# Cache agressif pour les assets versionnés (hash dans le nom)
location ~* \.(js|css|woff2|png|webp|avif)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
# HTML — jamais de cache long
location ~* \.html$ {
  add_header Cache-Control "no-cache";
}
```

## Liens

- [web.dev — Optimize images](https://web.dev/fast/#optimize-your-images)
- [squoosh.app — compresser en ligne](https://squoosh.app/)
- [Fontsource — polices auto-hébergées](https://fontsource.org/)
- [bundlephobia.com — coût d'un package npm](https://bundlephobia.com/)
