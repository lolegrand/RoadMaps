---
id: koin-compose
parent: injection
label: Koin & Injection
explored: false
order: 2
---

# Koin & Injection

Koin est une alternative légère à Hilt, sans génération de code ni annotation processing. Il repose sur une DSL Kotlin pour déclarer les modules. `koinViewModel()` récupère un ViewModel injecté directement depuis un composable, sans `@HiltViewModel` ni KSP.

```kotlin
// Déclaration du module Koin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl(get()) }
    single { UserApiService(get()) }
    viewModel { UserListViewModel(get()) }
    viewModel { (id: String) -> UserDetailViewModel(id, get()) }
}

// Application
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApp)
            androidLogger(Level.DEBUG)
            modules(appModule)
        }
    }
}

// Composable
@Composable
fun UserListScreen(
    viewModel: UserListViewModel = koinViewModel()
) {
    val users by viewModel.users.collectAsStateWithLifecycle()
    LazyColumn { items(users) { UserItem(it) } }
}

// ViewModel avec paramètre
@Composable
fun UserDetailScreen(userId: String) {
    val viewModel = koinViewModel<UserDetailViewModel>(
        parameters = { parametersOf(userId) }
    )
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
koin = "4.0.2"

[libraries]
koin-android         = { group = "io.insert-koin", name = "koin-android", version.ref = "koin" }
koin-androidx-compose = { group = "io.insert-koin", name = "koin-androidx-compose", version.ref = "koin" }
```

```kotlin
// build.gradle.kts (module)
dependencies {
    implementation(libs.koin.android)
    implementation(libs.koin.androidx.compose)
    // Pas besoin de KSP ni de kapt
}
```

## Koin vs Hilt

| | Koin | Hilt |
|---|---|---|
| Setup | Simple, DSL Kotlin | Plugin Gradle + annotations |
| Compilation | Aucune génération | KSP (compile-time) |
| Erreurs | Runtime | Compile-time |
| KMP | Oui | Non |
| Recommandé par Google | Non | Oui |

## Liens
- [Koin pour Android](https://insert-koin.io/docs/reference/koin-android/start)
- [Koin pour Compose](https://insert-koin.io/docs/reference/koin-android/compose)
