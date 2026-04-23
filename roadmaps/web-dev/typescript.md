---
id: typescript
parent: fondamentaux
label: TypeScript
explored: true
order: 4
---

# TypeScript

TypeScript est JavaScript avec un système de types statiques. Il détecte les erreurs à la compilation, améliore l'autocomplétion et documente le code sans commentaires.

## Types essentiels

```typescript
// Types primitifs et tableaux
let name: string = 'Alice';
let age: number = 30;
let active: boolean = true;
let tags: string[] = ['ts', 'node'];
let matrix: number[][] = [[1, 2], [3, 4]];

// Union & Intersection
type Status = 'pending' | 'active' | 'archived';
type AdminUser = User & { adminLevel: 1 | 2 | 3 };

// Literal types
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Optionnel & readonly
interface Product {
  readonly id: number;
  name: string;
  price: number;
  description?: string;        // optionnel
  tags: readonly string[];     // tableau immuable
}
```

## Generics

```typescript
// Fonction générique
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Generic avec contrainte
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic service
class Repository<T extends { id: number }> {
  private items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  save(item: T): T {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index >= 0) this.items[index] = item;
    else this.items.push(item);
    return item;
  }
}
```

## Types utilitaires intégrés

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

type CreateUserDto  = Omit<User, 'id' | 'createdAt'>;       // sans id et createdAt
type UpdateUserDto  = Partial<Omit<User, 'id'>>;             // tous optionnels sauf id
type PublicUser     = Pick<User, 'id' | 'name' | 'role'>;   // seulement ces champs
type ReadonlyUser   = Readonly<User>;                         // tout en readonly
type UserRecord     = Record<string, User>;                   // dictionnaire
type NonNullUser    = Required<User>;                         // rien d'optionnel

// ReturnType, Parameters — extraire les types d'une fonction
type FetchReturn = Awaited<ReturnType<typeof fetchUser>>;
type FetchParams = Parameters<typeof fetchUser>[0];
```

## Types conditionnels & inférence

```typescript
// Conditional types
type IsArray<T> = T extends any[] ? true : false;
type Flatten<T> = T extends Array<infer Item> ? Item : T;

// Template literal types (TypeScript 4.1+)
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// → 'onClick' | 'onFocus' | 'onBlur'

// Discriminated unions — pattern très puissant
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error';   error: string; code: number }
  | { status: 'loading' };

function handleResult<T>(result: ApiResult<T>): void {
  switch (result.status) {
    case 'success': console.log(result.data);  break;  // result.data typé T
    case 'error':   console.error(result.error); break; // result.error typé string
    case 'loading': showSpinner();               break;
  }
}
```

## Configuration tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",           // ou ESNext pour le frontend
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src",

    // Typage strict — activer dans tous les nouveaux projets
    "strict": true,                  // active les 8 options strict ci-dessous
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true, // tableau[index] peut être undefined
    "exactOptionalPropertyTypes": true,

    // Qualité
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,

    // Imports
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Liens

- [typescriptlang.org — Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [typescriptlang.org — Playground](https://www.typescriptlang.org/play)
- [Total TypeScript — Matt Pocock](https://www.totaltypescript.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
