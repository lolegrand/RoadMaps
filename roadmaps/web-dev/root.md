---
id: root
label: Développement Web
explored: true
order: 0
---

# Développement Web

Le développement web recouvre l'ensemble des technologies permettant de créer des applications accessibles via un navigateur. Il s'organise autour de trois couches fondamentales et d'un écosystème d'outils en constante évolution.

## Les trois couches du web

```
┌─────────────────────────────────────────────┐
│  HTML  — Structure et sémantique du contenu  │
├─────────────────────────────────────────────┤
│  CSS   — Présentation, layout, animations    │
├─────────────────────────────────────────────┤
│  JS    — Comportement, interactivité, logique│
└─────────────────────────────────────────────┘
```

## Frontend vs Backend vs Fullstack

| Rôle | Technologies | Responsabilité |
|------|-------------|---------------|
| **Frontend** | HTML, CSS, JS, frameworks UI | Ce que l'utilisateur voit et interagit |
| **Backend** | Node.js, bases de données, APIs | Logique métier, persistance, sécurité |
| **Fullstack** | Les deux | De la BDD à l'interface |

## Rendu : SSR vs CSR vs SSG

| Approche | Rendu | Exemples | Forces |
|----------|-------|---------|--------|
| **CSR** (Client-Side) | Dans le navigateur | React SPA, Angular | Interactivité, hors-ligne |
| **SSR** (Server-Side) | À chaque requête | Next.js, Nuxt | SEO, TTFB rapide |
| **SSG** (Static) | Au build | Astro, Eleventy | Performance, CDN |
| **ISR** (Incremental) | Hybride | Next.js ISR | Meilleur des deux |

## Liens

- [MDN Web Docs](https://developer.mozilla.org/fr/)
- [web.dev — Learn](https://web.dev/learn/)
- [roadmap.sh — Frontend](https://roadmap.sh/frontend)
- [State of JS](https://stateofjs.com/)
