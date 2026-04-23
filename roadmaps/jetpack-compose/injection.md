---
id: injection
parent: architecture
label: Injection de dépendances
explored: false
order: 3
---

# Injection de dépendances

L'injection de dépendances (DI) découple la création des objets de leur utilisation. Sur Android/Compose, deux solutions dominent : **Hilt** (recommandée par Google, basée sur Dagger, vérifiée à la compilation) et **Koin** (DSL Kotlin, légère, sans génération de code).

```kotlin
// Sans DI — couplage fort, difficile à tester
class HomeScreen {
    private val repo = UserRepository(ApiService(), LocalDatabase())
}

// Avec DI — dépendances injectées, testable par mock
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repo: UserRepository
) : ViewModel()
```

## Liens
- [Dependency injection on Android](https://developer.android.com/training/dependency-injection)
- [Hilt vs Koin](https://developer.android.com/training/dependency-injection#choosing-di)
