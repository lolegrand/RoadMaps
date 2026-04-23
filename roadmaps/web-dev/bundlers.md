---
id: bundlers
parent: outillage
label: Bundlers & Build tools
explored: false
order: 2
---

# Bundlers & Build tools

Un bundler regroupe les modules JS/CSS/assets en fichiers optimisés pour le navigateur. Vite est le standard actuel pour les apps frontend ; esbuild et Rollup pour les librairies.

## Vite — le standard actuel

```bash
# Créer un projet
npm create vite@latest my-app -- --template vanilla-ts
npm create vite@latest my-app -- --template react-ts
npm create vite@latest my-app -- --template vue-ts
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },

  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Code splitting manuel
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Alertes si les chunks dépassent 500 kB
    chunkSizeWarningLimit: 500,
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    // Exposition sur le réseau local
    host: true,
  },

  // Variables d'environnement — VITE_ prefix requis
  // VITE_API_URL=http://localhost:8080 → import.meta.env.VITE_API_URL
});
```

## Pourquoi Vite est rapide

```
Dev server Webpack/CRA (ancien)
  → Bundle tout le code au démarrage
  → HMR : recompile le bundle entier
  → Démarrage : 30–60s sur grandes apps

Dev server Vite (nouveau)
  → Sert les modules ES natifs directement (pas de bundle)
  → HMR : ne remplace que le module modifié
  → Démarrage : < 300ms quelle que soit la taille
  → Build : esbuild (Go) + Rollup
```

## Variables d'environnement dans Vite

```bash
# .env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=MyApp

# .env.production
VITE_API_URL=https://api.production.com

# .env.local — jamais committé (secrets de dev)
VITE_STRIPE_TEST_KEY=sk_test_...
```

```typescript
// Accès dans le code frontend
const apiUrl  = import.meta.env.VITE_API_URL;
const isProd  = import.meta.env.PROD;      // boolean
const isDev   = import.meta.env.DEV;       // boolean
const mode    = import.meta.env.MODE;      // 'development' | 'production'
```

## Comparaison des bundlers

| Outil | Points forts | Cas d'usage |
|-------|-------------|-------------|
| **Vite** | DX, HMR ultra-rapide, plugins | Apps web (React, Vue, Svelte) |
| **esbuild** | Vitesse de build (Go) | Libs, builds custom, plugins Vite |
| **Rollup** | Tree-shaking optimal | Librairies npm |
| **Webpack** | Écosystème mature, configurabilité | Grandes apps legacy |
| **Parcel** | Zéro configuration | Prototypes rapides |
| **Turbopack** | Rust, successeur Webpack | Next.js (intégré) |

## Construire une librairie avec Vite + Rollup

```typescript
// vite.config.ts — mode lib
export default defineConfig({
  build: {
    lib: {
      entry:   resolve(__dirname, 'src/index.ts'),
      name:    'MyLib',
      formats: ['es', 'cjs'],
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],   // ne pas bundler les peerDeps
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
```

## Liens

- [vitejs.dev](https://vitejs.dev/)
- [esbuild.github.io](https://esbuild.github.io/)
- [rollupjs.org](https://rollupjs.org/)
- [bundlejs.com — analyser la taille d'un import](https://bundlejs.com/)
