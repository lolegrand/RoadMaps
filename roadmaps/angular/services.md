---
id: services
parent: architecture
label: Services
explored: false
order: 2
---

# Services

Les services encapsulent la logique métier, les appels HTTP et l'état partagé. Ils sont injectables et en général des singletons au niveau root.

## Service typique

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http    = inject(HttpClient);
  private apiUrl  = inject(API_URL);

  // Retourne un Observable — le composant souscrit via async pipe
  getAll(params?: ProductFilters): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}/products`, {
      params: toHttpParams(params),
    });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  create(payload: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, payload);
  }

  update(id: number, patch: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, patch);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}
```

## Service avec état (Signals)

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  // Lecture — signaux dérivés
  readonly count    = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
  readonly total    = computed(() => this.items().reduce((s, i) => s + i.price * i.qty, 0));
  readonly isEmpty  = computed(() => this.items().length === 0);

  add(product: Product, qty = 1): void {
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...items, { productId: product.id, name: product.name, price: product.price, qty }];
    });
  }

  remove(productId: number): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
  }

  clear(): void { this.items.set([]); }
}
```

## Utilisation dans un composant

```typescript
@Component({
  template: `
    <p>{{ cart.count() }} articles — {{ cart.total() | currency:'EUR' }}</p>
    @for (item of items$ | async; track item.id) {
      <app-product-card [product]="item" (cartAdd)="cart.add($event)" />
    }
  `
})
export class ShopComponent {
  cart     = inject(CartService);
  products = inject(ProductService);
  items$   = this.products.getAll();
}
```

## Liens

- [angular.dev — Services](https://angular.dev/guide/di/creating-injectable-service)
- [angular.dev — Sharing data between components](https://angular.dev/guide/components/inputs)
