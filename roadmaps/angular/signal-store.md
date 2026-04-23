---
id: signal-store
parent: state-management
label: Signal Store (NgRx)
explored: false
order: 1
---

# Signal Store (NgRx)

`@ngrx/signals` est un store léger basé sur les Signals Angular. Moins verbeux que NgRx classique, il est idéal pour gérer l'état d'une feature ou de l'application entière.

```bash
npm install @ngrx/signals
```

## Définir un store

```typescript
import { signalStore, withState, withComputed, withMethods, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface ProductState {
  products: Product[];
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },  // ou dans les providers d'une route

  withState(initialState),

  withComputed(({ products, selectedId }) => ({
    // Signaux dérivés — recalculés automatiquement
    selectedProduct: computed(() =>
      products().find(p => p.id === selectedId()) ?? null
    ),
    totalCount: computed(() => products().length),
  })),

  withMethods((store, productService = inject(ProductService)) => ({

    // Méthode synchrone
    select(id: number): void {
      patchState(store, { selectedId: id });
    },

    // Méthode async avec RxJS (rxMethod)
    loadAll: rxMethod<ProductFilters | void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(filters =>
          productService.getAll(filters ?? {}).pipe(
            tapResponse({
              next: products => patchState(store, { products, isLoading: false }),
              error: (err: HttpErrorResponse) =>
                patchState(store, { error: err.message, isLoading: false }),
            })
          )
        )
      )
    ),

    async create(payload: CreateProductDto): Promise<void> {
      const product = await lastValueFrom(productService.create(payload));
      patchState(store, { products: [...store.products(), product] });
    },
  })),

  withHooks({
    onInit(store) {
      store.loadAll();  // charge au démarrage
    },
  })
);
```

## Utilisation dans un composant

```typescript
@Component({
  providers: [ProductStore],   // scope au composant si non global
  template: `
    @if (store.isLoading()) {
      <app-spinner />
    } @else {
      @for (p of store.products(); track p.id) {
        <app-product-card [product]="p" (click)="store.select(p.id)" />
      }
      <p>{{ store.totalCount() }} produits</p>
    }
  `
})
export class ProductListComponent {
  store = inject(ProductStore);
}
```

## Liens

- [ngrx.io — Signal Store](https://ngrx.io/guide/signals/signal-store)
- [ngrx.io — rxMethod](https://ngrx.io/guide/signals/rxjs-integration)
