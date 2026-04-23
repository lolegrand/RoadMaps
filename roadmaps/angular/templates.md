---
id: templates
parent: fondamentaux
label: Templates & Data Binding
explored: true
order: 3
---

# Templates & Data Binding

Angular compile les templates HTML en code JavaScript optimisé. Le data binding relie la classe TypeScript au DOM via une syntaxe déclarative.

## Les quatre types de binding

```html
<!-- 1. Interpolation {{ }} — affiche une valeur -->
<h1>{{ title }}</h1>
<p>{{ user.firstName + ' ' + user.lastName }}</p>
<span>{{ price | currency:'EUR' }}</span>

<!-- 2. Property binding [ ] — lie une propriété DOM à une expression -->
<img [src]="product.imageUrl" [alt]="product.name" />
<button [disabled]="isLoading" [class.active]="isActive">Envoyer</button>
<app-card [title]="pageTitle" [items]="filteredItems" />

<!-- 3. Event binding ( ) — réagit à un événement DOM -->
<button (click)="submit()">Valider</button>
<input (input)="onInput($event)" (keydown.enter)="search()" />
<form (ngSubmit)="onSubmit()">...</form>

<!-- 4. Two-way binding [( )] — synchronise un champ et une propriété -->
<input [(ngModel)]="searchTerm" />
<!-- Équivalent explicite : -->
<input [value]="searchTerm" (input)="searchTerm = $event.target.value" />
```

## Nouveaux blocs de contrôle Angular 17+ (recommandés)

```html
<!-- @if / @else — remplace *ngIf -->
@if (user$ | async; as user) {
  <p>Bonjour, {{ user.name }}</p>
} @else {
  <p>Chargement...</p>
}

<!-- @for — remplace *ngFor, avec $index, $first, $last, $even, $odd -->
@for (product of products; track product.id) {
  <app-product-card [product]="product" />
} @empty {
  <p>Aucun produit trouvé.</p>
}

<!-- @switch — remplace ngSwitch -->
@switch (status) {
  @case ('loading') { <app-spinner /> }
  @case ('error')   { <app-error-banner /> }
  @default          { <app-content /> }
}

<!-- @defer — chargement paresseux d'un bloc de template -->
@defer (on viewport) {
  <app-heavy-chart [data]="chartData" />
} @placeholder {
  <div class="chart-skeleton" />
} @loading (minimum 200ms) {
  <app-spinner />
}
```

## Template variables et références

```html
<!-- Variable de template — référence un élément ou un composant -->
<input #emailInput type="email" />
<button (click)="send(emailInput.value)">Envoyer</button>

<!-- Référence à un composant enfant -->
<app-modal #modal />
<button (click)="modal.open()">Ouvrir</button>
```

## Liens

- [angular.dev — Templates](https://angular.dev/guide/templates)
- [angular.dev — Built-in control flow](https://angular.dev/guide/templates/control-flow)
- [angular.dev — @defer](https://angular.dev/guide/defer)
