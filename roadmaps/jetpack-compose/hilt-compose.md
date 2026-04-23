---
id: hilt-compose
parent: injection
label: Hilt & Injection
explored: false
order: 1
---

# Hilt & Injection

Hilt s'intègre nativement avec Compose via `hiltViewModel()`. Il fournit automatiquement les dépendances au ViewModel sans avoir à les passer manuellement dans les composables.

```kotlin
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val searchRepository: SearchRepository
) : ViewModel() {
    val results = MutableStateFlow<List<Result>>(emptyList())
}

@Composable
fun SearchScreen(
    viewModel: SearchViewModel = hiltViewModel()
) {
    val results by viewModel.results.collectAsStateWithLifecycle()
    // ...
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
hilt = "2.54"
hiltNavigationCompose = "1.2.0"

[libraries]
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-android-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }

[plugins]
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
kotlin-ksp = { id = "com.google.devtools.ksp", version = "2.1.0-1.0.29" }
```

```kotlin
// build.gradle.kts (app)
plugins {
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.kotlin.ksp)
}
dependencies {
    implementation(libs.hilt.android)
    ksp(libs.hilt.android.compiler)
    implementation(libs.hilt.navigation.compose) // pour hiltViewModel()
}
```

## Liens
- [Hilt and Compose](https://developer.android.com/jetpack/compose/libraries#hilt)
- [Dependency injection with Hilt](https://developer.android.com/training/dependency-injection/hilt-android)
