---
id: fondamentaux
parent: root
label: Fondamentaux
explored: true
order: 1
---

# Fondamentaux

HTML, CSS et JavaScript sont les trois langages natifs du navigateur. Aucun outil, framework ou transpileur ne peut les remplacer — ils sont la couche finale que le navigateur interprète.

## Le navigateur comme runtime

```
Code source (React, TypeScript, SCSS)
          │ Build (Vite, esbuild…)
          ▼
HTML + CSS + JS minifiés
          │ HTTP / CDN
          ▼
    Navigateur
  ├── Parser HTML → DOM
  ├── Parser CSS  → CSSOM
  ├── DOM + CSSOM → Render Tree
  ├── Layout (positions, tailles)
  ├── Paint (pixels)
  └── Composite (layers GPU)
```

## Priorité d'apprentissage

1. HTML sémantique — accessibilité et SEO sont gratuits si bien écrit
2. CSS — flexbox, grid, custom properties, responsive
3. JavaScript — DOM, événements, fetch, async/await, modules
4. TypeScript — typage statique sur JS
5. Outils — npm, bundler, linter

## Liens

- [MDN — HTML](https://developer.mozilla.org/fr/docs/Web/HTML)
- [MDN — CSS](https://developer.mozilla.org/fr/docs/Web/CSS)
- [MDN — JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
