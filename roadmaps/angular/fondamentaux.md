---
id: fondamentaux
parent: root
label: Fondamentaux
explored: true
order: 1
---

# Fondamentaux

Les fondamentaux Angular reposent sur quatre concepts clés : les composants (UI), les services (logique), le système de templates, et l'injection de dépendances. Tout le reste est construit par-dessus.

```
Application Angular
├── Composants     → ce qu'on voit (template + logique locale)
├── Services       → ce qu'on fait (logique métier, HTTP, état)
├── Directives     → comment on modifie le DOM
├── Pipes          → comment on formate les données
└── Modules/Standalone → comment on organise tout ça
```

## Cycle de vie d'un composant

```
ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit
→ ngAfterContentChecked → ngAfterViewInit → ngAfterViewChecked
→ ngOnDestroy
```

## Liens

- [angular.dev — Components](https://angular.dev/guide/components)
- [angular.dev — Understanding Angular](https://angular.dev/overview)
