---
id: resolvers
parent: routing
label: Resolvers
explored: false
order: 3
---

# Resolvers

Les resolvers préchargent des données avant l'activation d'une route, garantissant que le composant reçoit ses données immédiatement sans état de chargement intermédiaire.

## Functional resolver (Angular 14+)

```typescript
// product.resolver.ts
export const productResolver: ResolveFn<Product> = (route) => {
  const productService = inject(ProductService);
  const router         = inject(Router);
  const id             = Number(route.paramMap.get('id'));

  return productService.getById(id).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;   // stoppe la navigation
    })
  );
};
```

```typescript
// Route avec resolver
{
  path: 'products/:id',
  component: ProductDetailComponent,
  resolve: { product: productResolver },
}
```

```typescript
// Composant — données disponibles dès ngOnInit
@Component({ ... })
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  product!: Product;

  ngOnInit(): void {
    // Via snapshot (valeur fixe)
    this.product = this.route.snapshot.data['product'];

    // Via Observable (se met à jour si les params changent)
    this.route.data.subscribe(data => {
      this.product = data['product'];
    });
  }
}

// Avec withComponentInputBinding() dans provideRouter — encore plus simple
@Component({ ... })
export class ProductDetailComponent {
  @Input() product!: Product;   // injecté automatiquement depuis resolve
}
```

## Plusieurs resolvers en parallèle

```typescript
{
  path: 'products/:id',
  component: ProductDetailComponent,
  resolve: {
    product:  productResolver,
    reviews:  reviewsResolver,
    related:  relatedProductsResolver,
  },
}
// Les trois resolvers s'exécutent en parallèle (forkJoin interne)
```

## Liens

- [angular.dev — ResolveFn](https://angular.dev/api/router/ResolveFn)
- [angular.dev — withComponentInputBinding](https://angular.dev/api/router/withComponentInputBinding)
