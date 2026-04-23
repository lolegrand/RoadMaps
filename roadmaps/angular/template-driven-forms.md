---
id: template-driven-forms
parent: formulaires
label: Template-driven Forms
explored: false
order: 2
---

# Template-driven Forms

Les formulaires template-driven utilisent `ngModel` pour synchroniser le DOM et le modèle. Adaptés aux formulaires simples où la logique de validation reste dans le HTML.

```typescript
@Component({
  imports: [FormsModule],
  template: `
    <form #loginForm="ngForm" (ngSubmit)="submit(loginForm)">

      <input
        name="email"
        type="email"
        [(ngModel)]="credentials.email"
        required email
        #emailCtrl="ngModel"
      />
      @if (emailCtrl.invalid && emailCtrl.touched) {
        @if (emailCtrl.errors?.['required']) { <span>Email requis</span> }
        @if (emailCtrl.errors?.['email'])    { <span>Email invalide</span> }
      }

      <input
        name="password"
        type="password"
        [(ngModel)]="credentials.password"
        required
        minlength="8"
        #pwdCtrl="ngModel"
      />
      @if (pwdCtrl.errors?.['minlength'] && pwdCtrl.touched) {
        <span>8 caractères minimum</span>
      }

      <button type="submit" [disabled]="loginForm.invalid">Connexion</button>
    </form>
  `
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  submit(form: NgForm): void {
    if (form.invalid) return;
    console.log(this.credentials);
  }
}
```

## Liens

- [angular.dev — Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)
