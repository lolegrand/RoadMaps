---
id: directives
parent: fondamentaux
label: Directives
explored: false
order: 4
---

# Directives

Les directives modifient le comportement ou l'apparence d'éléments DOM existants. Il en existe deux types : **attribut** (modifie un élément) et **structurelle** (ajoute/supprime des éléments — préfixées `*` dans l'ancienne syntaxe).

## Directive attribut personnalisée

```typescript
@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
})
export class TooltipDirective {
  @Input('appTooltip') text = '';

  private tooltipEl: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  show(): void {
    this.tooltipEl = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.text)
    );
    this.renderer.addClass(this.tooltipEl, 'tooltip');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipEl);
  }

  hide(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
```

```html
<button [appTooltip]="'Enregistrer les modifications'">Sauvegarder</button>
```

## Directive structurelle personnalisée

```typescript
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') requiredRole!: string;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.hasRole(this.requiredRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

```html
<button *appHasRole="'ADMIN'">Supprimer</button>
<!-- Nouvelle syntaxe équivalente sans * -->
<ng-template appHasRole="ADMIN">
  <button>Supprimer</button>
</ng-template>
```

## HostListener et HostBinding

```typescript
@Directive({ selector: '[appDragDrop]', standalone: true })
export class DragDropDirective {

  @HostBinding('class.drag-over') isDragOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave')
  onDragLeave(): void { this.isDragOver = false; }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    // traiter le fichier...
  }
}
```

## Liens

- [angular.dev — Directives](https://angular.dev/guide/directives)
- [angular.dev — Attribute directives](https://angular.dev/guide/directives/attribute-directives)
- [angular.dev — Structural directives](https://angular.dev/guide/directives/structural-directives)
