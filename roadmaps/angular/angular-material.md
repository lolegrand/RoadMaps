---
id: angular-material
parent: tooling
label: Angular Material & CDK
explored: false
order: 2
---

# Angular Material & CDK

Angular Material est la bibliothèque de composants officielle basée sur Material Design. Le CDK (Component Dev Kit) fournit des primitives headless pour construire ses propres composants.

```bash
ng add @angular/material
```

## Composants courants

```typescript
// Importer directement les composants standalone
import { MatButtonModule }   from '@angular/material/button';
import { MatTableModule }    from '@angular/material/table';
import { MatDialogModule }   from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule }     from '@angular/material/icon';
```

```html
<!-- Formulaire Material -->
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput type="email" [formControl]="emailCtrl" />
  <mat-icon matSuffix>email</mat-icon>
  <mat-error>{{ emailError }}</mat-error>
</mat-form-field>

<!-- Table avec tri et pagination -->
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
    <td mat-cell *matCellDef="let row">{{ row.name }}</td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
<mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25]" />
```

## Thème personnalisé (Material 3 — Angular 17+)

```scss
// styles.scss
@use '@angular/material' as mat;

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$rose-palette,
  ),
  density: (scale: 0),
));

:root {
  @include mat.all-component-themes($theme);
}

// Dark mode
@media (prefers-color-scheme: dark) {
  :root {
    @include mat.all-component-colors(mat.define-theme((
      color: (theme-type: dark, primary: mat.$azure-palette),
    )));
  }
}
```

## CDK — primitives headless

```typescript
// Overlay — positionner une popup n'importe où dans le DOM
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

// Virtual Scroll — rendre seulement les éléments visibles
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
```

```html
<!-- Virtual scroll — listes de milliers d'éléments sans lag -->
<cdk-virtual-scroll-viewport itemSize="56" style="height: 400px;">
  @for (item of items; track item.id) {
    <div *cdkVirtualFor="let item of items" class="item">{{ item.name }}</div>
  }
</cdk-virtual-scroll-viewport>
```

## Liens

- [material.angular.io](https://material.angular.io/)
- [material.angular.io — CDK](https://material.angular.io/cdk)
- [angular.dev — Material theming](https://material.angular.io/guide/theming)
