---
id: navigation-v3
parent: navigation
label: Navigation 3 (alpha)
explored: false
order: 3
---

# Navigation 3 (alpha)

Navigation 3 est une refonte complète, plus idiomatique Compose. Elle remplace `NavHost` par `NavDisplay` et introduit une back stack observable comme `List<Any>`. L'état de navigation est entièrement contrôlé par l'appelant, sans `NavController` implicite.

```kotlin
// La back stack est une liste observable
@Serializable object Home
@Serializable data class Detail(val id: String)

@Composable
fun AppNavigation() {
    val backStack = rememberNavBackStack(Home)

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryDecorators = listOf(rememberSceneSetupNavEntryDecorator()),
    ) { entry ->
        when (val key = entry.key) {
            is Home   -> HomeScreen(
                onNavigate = { backStack.add(Detail("42")) }
            )
            is Detail -> DetailScreen(
                id = key.id,
                onBack = { backStack.removeLastOrNull() }
            )
            else      -> error("Route inconnue : $key")
        }
    }
}
```

> **Statut** : alpha en avril 2025 — API susceptible de changer avant la version stable.

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
navigation3 = "1.0.0-alpha11"
kotlinxSerialization = "1.8.1"

[libraries]
androidx-navigation3-runtime = { group = "androidx.navigation3", name = "navigation3-runtime", version.ref = "navigation3" }
androidx-navigation3-ui      = { group = "androidx.navigation3", name = "navigation3-ui", version.ref = "navigation3" }
kotlinx-serialization-json   = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "kotlinxSerialization" }
```

```kotlin
// build.gradle.kts (module)
dependencies {
    implementation(libs.androidx.navigation3.runtime)
    implementation(libs.androidx.navigation3.ui)
    implementation(libs.kotlinx.serialization.json)
}
```

## Liens
- [Navigation 3 — annonce](https://android-developers.googleblog.com/2025/03/navigation3-jetpack-compose.html)
- [Navigation 3 — API reference](https://developer.android.com/reference/kotlin/androidx/navigation3/package-summary)
- [Sample Navigation 3](https://github.com/android/navigation-samples)
