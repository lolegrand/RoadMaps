---
id: navigation-v2
parent: navigation
label: Navigation 2 (stable)
explored: false
order: 2
---

# Navigation 2 (stable)

Navigation 2.x est la bibliothèque stable. Elle repose sur un `NavHost` avec des routes déclarées comme composables. Depuis la version 2.8, les routes peuvent être pleinement typées via `@Serializable`. Elle gère aussi les graphes imbriqués, les deep links et la bottom navigation.

```kotlin
// Graphe imbriqué + bottom navigation
@Serializable object HomeRoute
@Serializable object ProfileRoute
@Serializable data class DetailRoute(val id: String)

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = false,
                    onClick = { navController.navigate(HomeRoute) },
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("Accueil") }
                )
            }
        }
    ) { padding ->
        NavHost(
            navController,
            startDestination = HomeRoute,
            modifier = Modifier.padding(padding)
        ) {
            composable<HomeRoute> { HomeScreen(navController) }
            composable<ProfileRoute> { ProfileScreen() }
            composable<DetailRoute> { entry ->
                val route: DetailRoute = entry.toRoute()
                DetailScreen(route.id)
            }
        }
    }
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
navigationCompose = "2.8.9"
kotlinxSerialization = "1.8.1"

[libraries]
androidx-navigation-compose     = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
kotlinx-serialization-json      = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "kotlinxSerialization" }

[plugins]
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
```

```kotlin
// build.gradle.kts (module)
plugins { alias(libs.plugins.kotlin.serialization) }
dependencies {
    implementation(libs.androidx.navigation.compose)
    implementation(libs.kotlinx.serialization.json)
}
```

## Liens
- [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
- [Type-safe navigation](https://developer.android.com/guide/navigation/design/type-safety)
- [Deep links](https://developer.android.com/jetpack/compose/navigation#deeplinks)
