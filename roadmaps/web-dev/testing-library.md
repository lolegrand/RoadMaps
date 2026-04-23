---
id: testing-library
parent: tests
label: Testing Library
explored: false
order: 2
---

# Testing Library

Testing Library (React, Vue, Angular…) teste les composants comme un utilisateur — via le DOM visible, pas les détails d'implémentation (état interne, noms de classes, structure JSX).

## Philosophie

> « Plus vos tests ressemblent à la façon dont votre logiciel est utilisé, plus ils vous donnent confiance. »
> — Kent C. Dodds

```typescript
// ❌ Tester les détails d'implémentation — fragile
expect(component.state.isLoading).toBe(false);
expect(wrapper.find('.loading-spinner').exists()).toBe(false);

// ✅ Tester le comportement visible — robuste
expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
expect(screen.getByText('3 résultats')).toBeVisible();
```

## Setup Vitest + jsdom + React Testing Library

```bash
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test-setup.ts'] }
});

// src/test-setup.ts
import '@testing-library/jest-dom';  // matchers supplémentaires : toBeInTheDocument, toBeVisible…
```

## Tester un composant React

```typescript
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard.js';

const product = { id: 1, name: 'Widget Pro', price: 29.99, inStock: true };

describe('ProductCard', () => {
  it('affiche le nom et le prix', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: 'Widget Pro' })).toBeInTheDocument();
    expect(screen.getByText('29,99 €')).toBeVisible();
  });

  it('désactive le bouton si rupture de stock', () => {
    render(<ProductCard product={{ ...product, inStock: false }} />);
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeDisabled();
  });

  it('appelle onAddToCart au clic', async () => {
    const onAddToCart = vi.fn();
    const user = userEvent.setup();

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(onAddToCart).toHaveBeenCalledOnce();
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
```

## Tester un formulaire

```typescript
describe('LoginForm', () => {
  it('soumet les credentials corrects', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'alice@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: /connexion/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email:    'alice@test.com',
      password: 'password123',
    });
  });

  it('affiche une erreur si email invalide', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'pas-un-email');
    await user.tab();  // déclencher la validation au blur

    expect(screen.getByRole('alert')).toHaveTextContent('Email invalide');
    expect(screen.getByRole('button', { name: /connexion/i })).toBeDisabled();
  });
});
```

## Tester avec des données async

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

it('charge et affiche les utilisateurs', async () => {
  vi.mocked(fetchUsers).mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);

  render(<UserList />);

  // Attendre que le spinner disparaisse
  await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

  // Vérifier que les données sont affichées
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
});
```

## Queries — hiérarchie recommandée

```typescript
// Par ordre de préférence (du plus au moins accessible)
screen.getByRole('button', { name: /soumettre/i })   // 1. rôle ARIA + nom
screen.getByLabelText('Email')                        // 2. label de formulaire
screen.getByPlaceholderText('Rechercher…')            // 3. placeholder
screen.getByText('Bienvenue')                         // 4. contenu texte
screen.getByDisplayValue('Alice')                     // 5. valeur affichée
screen.getByAltText('Photo de profil')                // 6. alt d'image
screen.getByTitle('Fermer')                           // 7. attribut title
screen.getByTestId('submit-button')                   // 8. data-testid (dernier recours)
```

## Liens

- [testing-library.com](https://testing-library.com/)
- [testing-library.com — Queries](https://testing-library.com/docs/queries/about)
- [testing-library.com — user-event](https://testing-library.com/docs/user-event/intro)
- [Which query should I use?](https://testing-library.com/docs/guide-which-query)
