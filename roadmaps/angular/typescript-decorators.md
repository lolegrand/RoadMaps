---
id: typescript-decorators
parent: fondamentaux
label: TypeScript & Decorators
explored: true
order: 1
---

# TypeScript & Decorators

Angular est écrit en TypeScript et en tire pleinement parti. Les décorateurs (`@Component`, `@Injectable`…) sont la syntaxe centrale qui permet à Angular d'enrichir les classes ordinaires avec des métadonnées.

## Décorateurs principaux

```typescript
// @Component — transforme une classe en composant UI
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<h2>{{ user.name }}</h2>`,
  styles: [`h2 { color: #dd0031; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() selected = new EventEmitter<User>();
}

// @Injectable — rend une classe injectable dans le système DI
@Injectable({ providedIn: 'root' })
export class UserService { ... }

// @Pipe — transforme des données dans les templates
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}

// @Directive — ajoute un comportement à un élément DOM
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective { ... }
```

## Types TypeScript utiles dans Angular

```typescript
// Typage strict des inputs/outputs
@Input({ required: true }) userId!: string;   // requis, Angular 16+
@Input() transform = input<string>();          // Signal input, Angular 17+

// Generic services
@Injectable({ providedIn: 'root' })
export class CacheService<T> {
  private cache = new Map<string, T>();
  get(key: string): T | undefined { return this.cache.get(key); }
  set(key: string, value: T): void { this.cache.set(key, value); }
}

// Types d'injection token pour les valeurs primitives
export const API_URL = new InjectionToken<string>('API_URL');
```

## Liens

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [angular.dev — TypeScript configuration](https://angular.dev/tools/cli/template-typecheck)
- [TC39 — Decorators proposal](https://github.com/tc39/proposal-decorators)
