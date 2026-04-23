---
id: root
label: Angular
explored: true
order: 0
---

# Angular

Angular est un framework TypeScript **opinioné et full-featured** maintenu par Google. Il fournit tout ce dont une application d'entreprise a besoin : routeur, formulaires, HTTP, tests, SSR — sans avoir à assembler des librairies tierces.

## Versions importantes

| Version | Apport majeur |
|---------|--------------|
| Angular 2 (2016) | Réécriture complète, TypeScript natif |
| Angular 9 (2020) | Ivy renderer par défaut |
| Angular 14 (2022) | Standalone Components (preview) |
| Angular 16 (2023) | Signals (preview), esbuild par défaut |
| Angular 17 (2023) | Standalone par défaut, `@if` / `@for` built-in, SSR hydration |
| Angular 18 (2024) | Signals stable, zoneless (preview) |
| Angular 19 (2024) | Signal components, resource API |

## Démarrage rapide

```bash
npm install -g @angular/cli
ng new my-app --standalone --style=scss
cd my-app && ng serve
```

## Philosophie

- **Opinioné** — une seule façon correcte de faire les choses
- **TypeScript first** — typage statique partout, sans compromis
- **Batteries included** — DI, routing, forms, HTTP, testing intégrés
- **Évolutif** — conçu pour des équipes et des projets à grande échelle

## Liens

- [angular.dev](https://angular.dev/) — documentation officielle (nouvelle)
- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Blog](https://blog.angular.dev/)
- [Angular GitHub](https://github.com/angular/angular)
