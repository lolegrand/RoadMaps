---
id: ngrx
parent: state-management
label: NgRx Store
explored: false
order: 2
---

# NgRx Store

NgRx est l'implémentation Redux pour Angular. Il impose un flux de données unidirectionnel strict : **Actions → Reducers → State → Selectors → Components**. Adapté aux applications complexes avec beaucoup de logique partagée.

```bash
npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
```

## Les 5 pièces du puzzle

```
Composant  ──dispatch(action)──▶  Store
   ▲                                │
   │ select(selector)           reducer(state, action)
   │                                │
   └────────── state ◀──────────────┘
                                Effects
                           (side effects async)
```

## Actions

```typescript
// products.actions.ts
import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products':         emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Select Product':        props<{ id: number }>(),
    'Create Product':        props<{ payload: CreateProductDto }>(),
  },
});
// Génère : ProductActions.loadProducts(), .loadProductsSuccess(), etc.
```

## Reducer

```typescript
// products.reducer.ts
import { createEntityAdapter, EntityState } from '@ngrx/entity';

interface ProductsState extends EntityState<Product> {
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
}

const adapter = createEntityAdapter<Product>();
const initialState = adapter.getInitialState({ selectedId: null, isLoading: false, error: null });

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts,        state => ({ ...state, isLoading: true, error: null })),
  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, { ...state, isLoading: false })),
  on(ProductActions.loadProductsFailure, (state, { error }) =>
    ({ ...state, isLoading: false, error })),
  on(ProductActions.selectProduct,       (state, { id }) =>
    ({ ...state, selectedId: id })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
```

## Effects — effets de bord asynchrones

```typescript
// products.effects.ts
@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getAll().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(err => of(ProductActions.loadProductsFailure({ error: err.message })))
        )
      )
    )
  );
}
```

## Selectors — lecture optimisée

```typescript
// products.selectors.ts
const selectProductsFeature = createFeatureSelector<ProductsState>('products');

export const selectAllProducts  = createSelector(selectProductsFeature, selectAll);
export const selectIsLoading    = createSelector(selectProductsFeature, s => s.isLoading);
export const selectSelectedId   = createSelector(selectProductsFeature, s => s.selectedId);
export const selectSelected     = createSelector(
  selectProductsFeature, selectSelectedId,
  (state, id) => id != null ? state.entities[id] : null
);
```

## Dans un composant

```typescript
@Component({
  template: `
    @if (isLoading$ | async) { <app-spinner /> }
    @for (p of products$ | async; track p.id) {
      <app-product-card [product]="p" (click)="select(p.id)" />
    }
  `
})
export class ProductListComponent {
  private store = inject(Store);

  products$ = this.store.select(selectAllProducts);
  isLoading$ = this.store.select(selectIsLoading);

  ngOnInit(): void { this.store.dispatch(ProductActions.loadProducts()); }
  select(id: number): void { this.store.dispatch(ProductActions.selectProduct({ id })); }
}
```

## Liens

- [ngrx.io — Store](https://ngrx.io/guide/store)
- [ngrx.io — Effects](https://ngrx.io/guide/effects)
- [ngrx.io — Entity](https://ngrx.io/guide/entity)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
