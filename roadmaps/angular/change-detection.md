---
id: change-detection
parent: performance
label: Change Detection
explored: false
order: 1
---

# Change Detection

Angular vérifie les bindings du template à chaque événement pour synchroniser le DOM. Comprendre ce mécanisme est clé pour éviter les lenteurs dans les grandes applications.

## Zone.js — le mécanisme par défaut

Zone.js patche les APIs asynchrones du navigateur (`setTimeout`, `fetch`, événements DOM…) pour notifier Angular de chaque événement potentiellement déclencheur. Angular déclenche alors un cycle de vérification sur **tout** l'arbre de composants (top-down).

```
Zone.js détecte un event
  ↓
Angular DecChange (ApplicationRef.tick())
  ↓
Vérifie chaque composant de haut en bas
  ↓
Met à jour le DOM si un binding a changé
```

## OnPush — stratégie optimisée

Avec `OnPush`, Angular ne vérifie un composant que si :
1. Un `@Input()` reçoit une nouvelle **référence**
2. Un `Observable` auquel le composant est abonné via `async` émet
3. Un `Signal` lu dans le template change
4. `markForCheck()` ou `detectChanges()` est appelé manuellement

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ product.name }} — {{ count() }}</p>`
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;  // référence immuable
  count = signal(0);  // Signal → OnPush sait exactement quand mettre à jour
}

// ❌ Mutation — OnPush ne détecte pas le changement
this.product.name = 'Nouveau nom';

// ✅ Nouvelle référence — détecté par OnPush
this.product = { ...this.product, name: 'Nouveau nom' };
```

## Zoneless — Angular 18+ (stable)

```typescript
// app.config.ts — supprimer Zone.js complètement
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // ...
  ],
};
```

```typescript
// Avec Zoneless, seuls les Signals déclenchent la détection
@Component({
  template: `
    <p>{{ name() }}</p>
    <button (click)="rename()">Renommer</button>
  `
})
export class ZonelessComponent {
  name = signal('Angular');

  rename(): void {
    this.name.set('Angular Zoneless');
    // Angular est notifié précisément par le signal — pas de tick global
  }
}
```

## Comparaison

| Stratégie | Déclencheurs | Performances |
|-----------|-------------|--------------|
| Default | Tout événement asynchrone | Lent sur grandes apps |
| OnPush | Nouveaux inputs + async + signals + markForCheck | Bon |
| Zoneless + Signals | Uniquement les signaux | Optimal |

## Liens

- [angular.dev — Change detection](https://angular.dev/best-practices/runtime-performance)
- [angular.dev — Zoneless](https://angular.dev/guide/experimental/zoneless)
- [Zone.js — GitHub](https://github.com/angular/angular/tree/main/packages/zone.js)
