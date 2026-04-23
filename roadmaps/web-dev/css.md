---
id: css
parent: fondamentaux
label: CSS & Layout
explored: true
order: 2
---

# CSS & Layout

CSS moderne (2024) offre Flexbox, Grid, Container Queries, les Custom Properties et les couches cascade pour créer des layouts complexes sans JavaScript.

## Flexbox — layout 1D

```css
.container {
  display: flex;
  flex-direction: row;        /* row | column | row-reverse | column-reverse */
  justify-content: space-between; /* axe principal */
  align-items: center;        /* axe transversal */
  gap: 1rem;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 200px; /* flex-grow flex-shrink flex-basis */
  /* flex: 1  → grandit pour remplir l'espace disponible */
  /* flex: 0 0 200px → taille fixe, ne grandit pas */
}
```

## Grid — layout 2D

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-template-rows: auto;
  gap: 1.5rem;
}

/* Layout nommé */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "aside  main"
    "footer footer";
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}
.header { grid-area: header; }
.aside  { grid-area: aside;  }
.main   { grid-area: main;   }
.footer { grid-area: footer; }

/* Positionnement explicite */
.featured {
  grid-column: 1 / -1;        /* s'étend sur toutes les colonnes */
  grid-row: span 2;
}
```

## Custom Properties (CSS Variables)

```css
/* Thème via variables — modifiables par JS ou :root */
:root {
  --color-primary:   #0ea5e9;
  --color-surface:   #ffffff;
  --color-text:      #1e293b;
  --radius-md:       0.5rem;
  --shadow-lg:       0 10px 15px -3px rgb(0 0 0 / 0.1);
  --font-sans:       'Inter', system-ui, sans-serif;
  --spacing-4:       1rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #0f172a;
    --color-text:    #f1f5f9;
  }
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-4);
}
```

## Responsive — Container Queries (moderne)

```css
/* Media query — basé sur la fenêtre (ancien) */
@media (min-width: 768px) {
  .card { flex-direction: row; }
}

/* Container query — basé sur le parent (moderne, 2023+) */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
  .card__image { width: 40%; }
}
```

## CSS Modernes incontournables

```css
/* Logical properties — RTL/LTR automatique */
.box {
  margin-inline: auto;       /* margin-left + margin-right */
  padding-block: 1rem;       /* padding-top + padding-bottom */
  border-inline-start: 2px solid currentColor;
}

/* :has() — sélecteur parent */
form:has(input:invalid) .submit-btn { opacity: 0.5; }
.card:has(img) { display: grid; grid-template-columns: 200px 1fr; }

/* CSS Nesting (natif, 2023+) */
.button {
  background: var(--color-primary);
  &:hover { filter: brightness(1.1); }
  &.danger { background: #ef4444; }
  & .icon { margin-inline-end: 0.5rem; }
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; translate: 0 -8px; }
  to   { opacity: 1; translate: 0 0; }
}
.modal { animation: fade-in 200ms ease-out; }

/* View Transitions API */
@view-transition { navigation: auto; }
```

## Liens

- [MDN — CSS](https://developer.mozilla.org/fr/docs/Web/CSS)
- [web.dev — Learn CSS](https://web.dev/learn/css/)
- [CSS Tricks — A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Tricks — A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Can I use](https://caniuse.com/)
