---
id: validation-custom
parent: formulaires
label: Validation personnalisée
explored: false
order: 3
---

# Validation personnalisée

Angular permet de créer des validateurs synchrones, asynchrones (vérification serveur) et cross-field (comparaison de deux champs).

## Validateur synchrone

```typescript
// Validateur fonction — pour les Reactive Forms
export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  const hasUpper  = /[A-Z]/.test(value);
  const hasLower  = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[!@#$%^&*]/.test(value);

  if (hasUpper && hasLower && hasNumber && hasSymbol) return null;

  return {
    passwordStrength: {
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
    },
  };
}

// Dans le FormControl
password: this.fb.nonNullable.control('', [
  Validators.required,
  Validators.minLength(8),
  passwordStrengthValidator,
])
```

## Validateur de groupe — cross-field

```typescript
// Vérifie que "password" et "confirmPassword" sont identiques
export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pwd     = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pwd === confirm ? null : { passwordMismatch: true };
}

// Sur le FormGroup
this.fb.group({ password: [...], confirmPassword: [...] }, {
  validators: passwordMatchValidator,
})
```

## Validateur asynchrone — unicité côté serveur

```typescript
@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  private userService = inject(UserService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailTaken: true } : null)),
      catchError(() => of(null)),
      debounceTime(400),    // éviter un appel à chaque frappe
    );
  }
}

// Dans le FormControl
email: this.fb.control('', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [inject(UniqueEmailValidator)],
  updateOn: 'blur',   // valider seulement au blur, pas à chaque frappe
})
```

```html
<!-- Afficher l'état async -->
@if (emailCtrl.pending) {
  <span>Vérification...</span>
}
@if (emailCtrl.errors?.['emailTaken']) {
  <span>Cet email est déjà utilisé.</span>
}
```

## Directive de validation — pour Template-driven Forms

```typescript
@Directive({
  selector: '[appForbiddenValue]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValueDirective, multi: true }],
})
export class ForbiddenValueDirective implements Validator {
  @Input('appForbiddenValue') forbidden!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value === this.forbidden
      ? { forbiddenValue: { value: control.value } }
      : null;
  }
}
```

## Liens

- [angular.dev — Custom validators](https://angular.dev/guide/forms/form-validation#custom-validators)
- [angular.dev — Async validators](https://angular.dev/guide/forms/form-validation#creating-asynchronous-validators)
