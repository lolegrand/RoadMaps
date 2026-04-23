---
id: tests-unitaires
parent: tests
label: Tests unitaires & composants
explored: false
order: 1
---

# Tests unitaires & composants

`TestBed` monte un composant Angular en isolation avec ses dépendances mockées, permettant de tester le template et la logique ensemble.

## Test d'un service pur

```typescript
describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('ajoute un produit au panier', () => {
    const product: Product = { id: 1, name: 'Widget', price: 9.99 };
    service.add(product);
    expect(service.count()).toBe(1);
    expect(service.total()).toBe(9.99);
  });

  it('incrémente la quantité si le produit existe', () => {
    const p = { id: 1, name: 'A', price: 5 };
    service.add(p);
    service.add(p);
    expect(service.count()).toBe(2);
    expect(service.items().length).toBe(1);
  });
});
```

## Test d'un composant avec TestBed

```typescript
describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;

  const mockProduct: Product = { id: 1, name: 'Widget', price: 9.99, featured: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],  // Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('affiche le nom du produit', () => {
    const el = fixture.nativeElement.querySelector('h3');
    expect(el.textContent).toContain('Widget');
  });

  it('émet cartAdd au clic', () => {
    const spy = jest.fn();
    component.cartAdd.subscribe(spy);

    fixture.nativeElement.querySelector('button').click();
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });

  it('applique la classe featured si le produit est mis en avant', () => {
    component.product = { ...mockProduct, featured: true };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('article').classList).toContain('featured');
  });
});
```

## Test d'un composant avec HttpClient mocké

```typescript
describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture  = TestBed.createComponent(ProductListComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('affiche les produits chargés depuis l\'API', fakeAsync(() => {
    const req = httpMock.expectOne('/api/products');
    req.flush([{ id: 1, name: 'Widget', price: 9.99 }]);

    tick();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('app-product-card');
    expect(items.length).toBe(1);
  }));
});
```

## Test d'un pipe

```typescript
describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();

  it('retourne "à l\'instant" pour une date récente', () => {
    expect(pipe.transform(new Date())).toBe('à l\'instant');
  });

  it('retourne "il y a 2h"', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
    expect(pipe.transform(twoHoursAgo)).toBe('il y a 2h');
  });
});
```

## Liens

- [angular.dev — Component testing](https://angular.dev/guide/testing/components-basics)
- [angular.dev — TestBed](https://angular.dev/api/core/testing/TestBed)
- [angular.dev — HttpClientTestingModule](https://angular.dev/guide/testing/http)
