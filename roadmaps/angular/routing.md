---
id: routing
parent: root
label: Routing
explored: false
order: 3
---

# Routing

Le Router Angular gère la navigation SPA : il mappe des URLs à des composants, sans rechargement de page. Il supporte les routes imbriquées, les paramètres, les guards et le lazy loading.

## Configuration des routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Accueil',
  },
  {
    path: 'products',
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent },
      { path: ':id/edit', component: ProductEditComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: '**',    // catch-all — doit être en dernier
    component: NotFoundComponent,
  },
];
```

## Navigation dans les templates et le code

```html
<!-- routerLink — navigation déclarative -->
<a routerLink="/products" routerLinkActive="active">Produits</a>
<a [routerLink]="['/products', product.id]">{{ product.name }}</a>
<a [routerLink]="['/search']" [queryParams]="{ q: 'angular', page: 1 }">Rechercher</a>
```

```typescript
@Component({ ... })
export class ProductComponent {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  // Lire les paramètres de route
  productId = this.route.snapshot.paramMap.get('id');

  // Avec Signal (Angular 17+ + withComponentInputBinding)
  @Input() id!: string;   // injecté automatiquement depuis :id

  goToEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goBack(): void {
    this.router.navigate(['/products'], { queryParamsHandling: 'preserve' });
  }
}
```

## Liens

- [angular.dev — Routing](https://angular.dev/guide/routing)
- [angular.dev — Router reference](https://angular.dev/api/router/Router)
