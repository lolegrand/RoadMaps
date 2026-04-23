---
id: formulaires
parent: root
label: Formulaires
explored: false
order: 4
---

# Formulaires

Angular propose deux approches de gestion des formulaires. **Template-driven** pour les formulaires simples, **Reactive Forms** pour les formulaires complexes avec logique dynamique.

## Comparaison

| | Template-driven | Reactive Forms |
|---|---|---|
| Définition | Dans le template (ngModel) | Dans la classe TypeScript |
| Accès au modèle | `#formRef.value` | `formGroup.value` |
| Validation | Attributs HTML + directives | Validators dans le code |
| Tests | Difficile (DOM) | Facile (pur TypeScript) |
| Dynamique | Limité | Complet (add/remove controls) |
| Cas d'usage | Petits formulaires | Formulaires complexes |

## Liens

- [angular.dev — Forms](https://angular.dev/guide/forms)
- [angular.dev — Choosing an approach](https://angular.dev/guide/forms#choosing-an-approach)
