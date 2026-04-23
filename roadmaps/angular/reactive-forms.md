---
id: reactive-forms
parent: formulaires
label: Reactive Forms
explored: false
order: 1
---

# Reactive Forms

Les Reactive Forms définissent la structure du formulaire dans le code TypeScript avec `FormGroup`, `FormControl` et `FormArray`. Ils sont synchrones, fortement typés (Angular 14+) et testables.

## Formulaire typé (Angular 14+)

```typescript
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

interface RegisterForm {
  email:     FormControl<string>;
  password:  FormControl<string>;
  profile: FormGroup<{
    firstName: FormControl<string>;
    lastName:  FormControl<string>;
  }>;
}

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" type="email" />
      @if (form.controls.email.invalid && form.controls.email.touched) {
        <span class="error">{{ emailError }}</span>
      }

      <div formGroupName="profile">
        <input formControlName="firstName" />
        <input formControlName="lastName" />
      </div>

      <button type="submit" [disabled]="form.invalid || isSubmitting">
        S'inscrire
      </button>
    </form>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group<RegisterForm>({
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(8),
      passwordStrengthValidator,
    ]),
    profile: this.fb.group({
      firstName: this.fb.nonNullable.control('', Validators.required),
      lastName:  this.fb.nonNullable.control('', Validators.required),
    }),
  });

  isSubmitting = false;

  get emailError(): string {
    const ctrl = this.form.controls.email;
    if (ctrl.hasError('required'))   return 'Email requis';
    if (ctrl.hasError('email'))      return 'Email invalide';
    return '';
  }

  submit(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    console.log(this.form.getRawValue());  // type-safe !
  }
}
```

## FormArray — liste dynamique

```typescript
@Component({
  template: `
    <div formArrayName="tags">
      @for (ctrl of tags.controls; track $index; let i = $index) {
        <input [formControlName]="i" />
        <button (click)="removeTag(i)">×</button>
      }
    </div>
    <button (click)="addTag()">+ Tag</button>
  `
})
export class TagsFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    tags: this.fb.array([this.fb.control('angular')]),
  });

  get tags(): FormArray { return this.form.get('tags') as FormArray; }

  addTag(): void    { this.tags.push(this.fb.control('')); }
  removeTag(i: number): void { this.tags.removeAt(i); }
}
```

## Liens

- [angular.dev — Reactive forms](https://angular.dev/guide/forms/reactive-forms)
- [angular.dev — Typed forms](https://angular.dev/guide/forms/typed-forms)
- [Baeldung — Angular Reactive Forms](https://www.baeldung.com/spring-boot-angular-reactive-forms)
