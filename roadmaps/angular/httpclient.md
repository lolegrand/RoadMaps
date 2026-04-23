---
id: httpclient
parent: http
label: HttpClient
explored: false
order: 1
---

# HttpClient

`HttpClient` effectue des requêtes HTTP typées et retourne des Observables. Il gère automatiquement la sérialisation JSON et offre une API fluide pour les headers, params et gestion d'erreur.

## Requêtes typées

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http   = inject(HttpClient);
  private apiUrl = inject(API_URL);

  // GET — liste paginée
  getAll(filters?: ProductFilters): Observable<Page<Product>> {
    return this.http.get<Page<Product>>(`${this.apiUrl}/products`, {
      params: new HttpParams({ fromObject: { ...filters } }),
    });
  }

  // GET — ressource unique
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // POST avec body
  create(payload: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, payload);
  }

  // PATCH
  update(id: number, patch: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, patch);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Upload multipart
  uploadImage(productId: number, file: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/products/${productId}/image`,
      form
    );
  }

  // Téléchargement avec progression
  downloadExport(): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiUrl}/products/export`, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }
}
```

## Dans un composant — patterns courants

```typescript
@Component({
  template: `
    @if (products$ | async; as page) {
      @for (p of page.content; track p.id) {
        <app-product-card [product]="p" />
      }
    }
  `
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private route          = inject(ActivatedRoute);

  // Rechargement automatique si les query params changent
  products$ = this.route.queryParams.pipe(
    switchMap(params => this.productService.getAll(params)),
    shareReplay(1),
  );
}
```

## Gestion d'erreur locale

```typescript
loadProduct(id: number): void {
  this.productService.getById(id).pipe(
    tap(() => this.isLoading.set(true)),
    finalize(() => this.isLoading.set(false)),
    catchError(err => {
      this.error.set(err.status === 404 ? 'Produit introuvable' : 'Erreur serveur');
      return EMPTY;
    })
  ).subscribe(product => this.product.set(product));
}
```

## Liens

- [angular.dev — HttpClient](https://angular.dev/guide/http/making-requests)
- [angular.dev — HttpParams](https://angular.dev/api/common/http/HttpParams)
