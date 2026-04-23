---
id: rxjs
parent: http
label: RxJS Essentials
explored: false
order: 3
---

# RxJS Essentials

RxJS est la bibliothèque de programmation réactive utilisée par Angular pour gérer les flux de données asynchrones. Comprendre les opérateurs clés est indispensable pour maîtriser Angular.

## Opérateurs les plus utilisés

```typescript
import { Observable, Subject, BehaviorSubject, combineLatest, forkJoin, of, EMPTY } from 'rxjs';
import { map, filter, switchMap, mergeMap, concatMap, exhaustMap,
         debounceTime, distinctUntilChanged, catchError, tap,
         takeUntil, takeUntilDestroyed, shareReplay, startWith } from 'rxjs/operators';
```

## Opérateurs de transformation

```typescript
// map — transforme chaque valeur
users$.pipe(map(users => users.map(u => u.name)))

// switchMap — annule l'Observable précédent (recherche, navigation)
searchQuery$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => productService.search(q)),   // annule la requête précédente
)

// mergeMap — exécute en parallèle, sans ordre garanti
ids$.pipe(mergeMap(id => productService.getById(id)))

// concatMap — exécute en séquence, dans l'ordre
saveActions$.pipe(concatMap(action => api.save(action)))

// exhaustMap — ignore les nouvelles valeurs si en cours (bouton submit)
submitClicks$.pipe(exhaustMap(data => api.createOrder(data)))
```

## Combinaison d'Observables

```typescript
// combineLatest — émet quand l'un des sources change
combineLatest([products$, filters$, sortBy$]).pipe(
  map(([products, filters, sort]) => applyFilters(products, filters, sort))
)

// forkJoin — attend que tous soient complétés (équivalent Promise.all)
forkJoin({
  user:     userService.getById(userId),
  orders:   orderService.getByUser(userId),
  addresses: addressService.getByUser(userId),
}).subscribe(({ user, orders, addresses }) => { ... })
```

## Gestion des erreurs

```typescript
// catchError — intercepter et gérer
products$.pipe(
  catchError(err => {
    console.error(err);
    return of([]);        // retourner une valeur de fallback
    // ou return EMPTY;   // terminer sans valeur
    // ou throwError(() => new CustomError(err)); // repropager
  })
)
```

## Désabonnement — éviter les memory leaks

```typescript
// takeUntilDestroyed — Angular 16+ — le meilleur moyen
@Component({ ... })
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(n => this.count.set(n));
  }
}

// async pipe — se désabonne automatiquement
@Component({
  template: `@for (p of products$ | async; track p.id) { ... }`
})

// Subject + takeUntil (ancienne façon)
private destroy$ = new Subject<void>();
ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
someObs$.pipe(takeUntil(this.destroy$)).subscribe(...)
```

## BehaviorSubject — état partagé (avant Signals)

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme$ = new BehaviorSubject<'light' | 'dark'>('light');

  readonly currentTheme$ = this.theme$.asObservable();  // lecture seule

  toggle(): void {
    this.theme$.next(this.theme$.value === 'light' ? 'dark' : 'light');
  }
}
```

## Liens

- [rxjs.dev — Operator decision tree](https://rxjs.dev/operator-decision-tree)
- [Learn RxJS](https://www.learnrxjs.io/)
- [RxJS Marbles — visualisation](https://rxmarbles.com/)
- [angular.dev — RxJS interop with Signals](https://angular.dev/guide/signals/rxjs-interop)
