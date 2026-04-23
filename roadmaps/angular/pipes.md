---
id: pipes
parent: fondamentaux
label: Pipes
explored: false
order: 5
---

# Pipes

Les pipes transforment des données dans les templates sans modifier les données sources. Angular fournit des pipes intégrés (`date`, `currency`, `async`…) et permet d'en créer de personnalisés.

## Pipes intégrés essentiels

```html
<!-- date -->
{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
{{ order.createdAt | date:'relative' }}    <!-- "il y a 3 min" avec i18n -->

<!-- currency / number -->
{{ product.price | currency:'EUR':'symbol':'1.2-2' }}
{{ ratio | percent:'1.1-1' }}
{{ bigNumber | number:'1.0-0' }}

<!-- string -->
{{ title | uppercase }}
{{ slug | titlecase }}

<!-- async — souscrit automatiquement et se désabonne à la destruction -->
@if (user$ | async; as user) {
  <span>{{ user.name }}</span>
}
@for (item of items$ | async; track item.id) { ... }

<!-- json — utile pour le debug -->
<pre>{{ state | json }}</pre>

<!-- slice -->
{{ tags | slice:0:3 }}
```

## Pipe personnalisé

```typescript
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true,   // pure = recalculé seulement si l'input change (défaut)
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date | string): string {
    const now = Date.now();
    const past = new Date(date).getTime();
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);

    if (days > 0)    return `il y a ${days}j`;
    if (hours > 0)   return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes}min`;
    return 'à l\'instant';
  }
}
```

```html
{{ comment.createdAt | timeAgo }}
<!-- → "il y a 2h" -->
```

## Pipe impur — pour les Observables ou Maps

```typescript
@Pipe({
  name: 'filterBy',
  standalone: true,
  pure: false,  // recalculé à chaque cycle de détection — attention aux performances
})
export class FilterByPipe implements PipeTransform {
  transform<T>(items: T[], predicate: (item: T) => boolean): T[] {
    return items.filter(predicate);
  }
}
```

> **Règle** : préférer les pipes purs et filtrer/trier dans le composant via des signaux ou computed() pour les listes dynamiques.

## Liens

- [angular.dev — Pipes](https://angular.dev/guide/pipes)
- [angular.dev — Built-in pipes API](https://angular.dev/api?type=pipe)
