---
id: state-management
parent: root
label: State Management
explored: false
order: 6
---

# State Management

Angular offre plusieurs niveaux de gestion d'état selon la complexité de l'application. Les Signals couvrent la majorité des cas depuis Angular 17 ; NgRx reste pertinent pour les apps très complexes.

## Niveaux d'état

| Niveau | Solution | Exemples |
|--------|----------|---------|
| Local (composant) | Signal / propriété | Formulaire, toggle, pagination |
| Partagé (feature) | Service + Signals | Panier, filtres de recherche |
| Global (app) | NgRx / Signal Store | Auth, notifications, config |
| Serveur | resource() / TanStack Query | Cache API, mutations |

## Liens

- [angular.dev — State management](https://angular.dev/guide/signals)
- [ngrx.io](https://ngrx.io/)
