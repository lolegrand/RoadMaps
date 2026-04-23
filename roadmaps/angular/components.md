---
id: components
parent: fondamentaux
label: Composants
explored: true
order: 2
---

# Composants

Le composant est l'unité de base d'une application Angular. Il encapsule un template HTML, du style CSS isolé, et une classe TypeScript qui gère la logique.

## Anatomie complète

```typescript
@Component({
  selector: 'app-product-card',   // <app-product-card> dans le HTML parent
  standalone: true,
  imports: [CurrencyPipe, RouterLink, NgClass],
  template: `
    <article [class.featured]="product.featured">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency:'EUR' }}</p>
      <button (click)="addToCart()">Ajouter</button>
    </article>
  `,
  styles: [`
    article { border: 1px solid #eee; padding: 1rem; border-radius: 8px; }
    article.featured { border-color: #dd0031; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnDestroy {

  // Inputs — données reçues du parent
  @Input({ required: true }) product!: Product;
  @Input() showDetails = false;

  // Outputs — événements émis vers le parent
  @Output() cartAdd = new EventEmitter<Product>();

  // Injection de dépendances dans le constructeur
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    console.log('Composant initialisé avec', this.product.name);
  }

  addToCart(): void {
    this.cartService.add(this.product);
    this.cartAdd.emit(this.product);
  }

  ngOnDestroy(): void {
    // Nettoyer subscriptions, timers, etc.
  }
}
```

## Interaction parent ↔ enfant

```typescript
// Parent — passe des données, écoute les événements
@Component({
  template: `
    <app-product-card
      [product]="selectedProduct"
      [showDetails]="true"
      (cartAdd)="onCartAdd($event)"
    />
  `
})
export class ProductPageComponent {
  selectedProduct = signal<Product>({ id: 1, name: 'Widget', price: 9.99, featured: true });

  onCartAdd(product: Product): void {
    console.log('Ajouté :', product.name);
  }
}
```

## ViewChild — accès direct à un enfant

```typescript
@Component({
  template: `<input #searchInput type="text" />`
})
export class SearchComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }
}
```

## Cycle de vie

```typescript
export class MyComponent implements OnInit, OnChanges, OnDestroy {

  ngOnChanges(changes: SimpleChanges): void {
    // Appelé quand un @Input change — avant ngOnInit au premier rendu
    if (changes['userId']) {
      this.loadUser(changes['userId'].currentValue);
    }
  }

  ngOnInit(): void {
    // Initialisation — les @Input sont disponibles ici
  }

  ngOnDestroy(): void {
    // Cleanup — se désabonner des Observables, clearTimeout, etc.
  }
}
```

## Liens

- [angular.dev — Components](https://angular.dev/guide/components)
- [angular.dev — Component lifecycle](https://angular.dev/guide/components/lifecycle)
- [angular.dev — Component interaction](https://angular.dev/guide/components/inputs)
