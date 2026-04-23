---
id: routes-arguments
parent: nav-concepts
label: Routes & Arguments
explored: false
order: 2
---

# Routes & Arguments

Les routes sont des chaînes (ou des types sérialisables avec la navigation type-safe). Les arguments sont passés directement dans l'URL de la route ou via des arguments optionnels. Kotlin Serialization permet des routes pleinement typées.

```kotlin
// Type-safe avec @Serializable (Navigation 2.8+)
@Serializable
data class DetailRoute(val itemId: String)

NavHost(navController, startDestination = HomeRoute) {
    composable<HomeRoute> { HomeScreen(navController) }
    composable<DetailRoute> { backStackEntry ->
        val route: DetailRoute = backStackEntry.toRoute()
        DetailScreen(route.itemId)
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
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
kotlinx-serialization-json = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "kotlinxSerialization" }

[plugins]
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
```

```kotlin
// build.gradle.kts (app)
plugins {
    alias(libs.plugins.kotlin.serialization)
}
dependencies {
    implementation(libs.androidx.navigation.compose)
    implementation(libs.kotlinx.serialization.json)
}
```

## Liens
- [Pass data between destinations](https://developer.android.com/jetpack/compose/navigation#nav-with-args)
- [Type-safe navigation](https://developer.android.com/guide/navigation/design/type-safety)
