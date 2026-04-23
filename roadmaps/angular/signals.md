---
id: signals
parent: architecture
label: Signals
explored: false
order: 3
---

# Signals

Les Signals (Angular 16+, stable Angular 17+) sont des valeurs réactives qui notifient Angular précisément quand elles changent, permettant une détection de changements granulaire sans Zone.js.

## Primitives

```typescript
import { signal, computed, effect } from '@angular/core';

// signal() — valeur mutable
const count = signal(0);
count();           // lire : 0
count.set(5);      // écrire : 5
count.update(n => n + 1);  // mettre à jour depuis la valeur actuelle : 6

// computed() — dérivé, recalculé seulement si ses dépendances changent
const doubled   = computed(() => count() * 2);
const isEven    = computed(() => count() % 2 === 0);

// effect() — effet de bord déclenché à chaque changement
effect(() => {
  console.log(`Count vaut maintenant ${count()}`);
  // Retourner une fonction de cleanup si nécessaire
});
```

## Signals dans un composant

```typescript
@Component({
  template: `
    <p>{{ count() }} (× 2 = {{ doubled() }})</p>
    <button (click)="increment()">+</button>
    <button (click)="reset()">Réinitialiser</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  count   = signal(0);
  doubled = computed(() => this.count() * 2);

  increment(): void { this.count.update(n => n + 1); }
  reset(): void     { this.count.set(0); }
}
```

## Signal Inputs & Outputs (Angular 17.1+)

```typescript
@Component({ selector: 'app-user', ... })
export class UserComponent {
  // Signal input — remplace @Input()
  userId = input.required<string>();          // requis
  theme  = input<'light' | 'dark'>('light'); // avec valeur par défaut

  // Signal output — remplace @Output() + EventEmitter
  selected = output<User>();

  // Computed depuis un input
  userLabel = computed(() => `Utilisateur #${this.userId()}`);

  select(user: User): void {
    this.selected.emit(user);
  }
}
```

## toSignal / toObservable — interop avec RxJS

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

  // Observable → Signal
  search(query: string): Signal<Product[]> {
    return toSignal(
      this.http.get<Product[]>('/api/products', { params: { q: query } }),
      { initialValue: [] }
    );
  }
}

@Component({
  template: `@for (p of results(); track p.id) { <li>{{ p.name }}</li> }`
})
export class SearchComponent {
  query   = signal('');
  // Signal → Observable (pour debounce/switchMap) → Signal
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q ? inject(ProductService).search(q) : of([])),
    ),
    { initialValue: [] as Product[] }
  );
}
```

## Resource API (Angular 19 — expérimental)

```typescript
// Chargement de données déclaratif, lié aux signaux
userResource = resource({
  request: () => ({ id: this.userId() }),
  loader: ({ request }) =>
    fetch(`/api/users/${request.id}`).then(r => r.json()),
});

// userResource.value()   — la donnée
// userResource.isLoading() — booléen
// userResource.error()   — l'erreur éventuelle
```

## Liens

- [angular.dev — Signals](https://angular.dev/guide/signals)
- [angular.dev — Signal inputs](https://angular.dev/guide/components/inputs#signal-inputs)
- [angular.dev — resource()](https://angular.dev/guide/signals/resource)
- [RFC — Angular Signals](https://github.com/angular/angular/discussions/49685)
