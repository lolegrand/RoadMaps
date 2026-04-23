---
id: navcontroller
parent: nav-concepts
label: NavController
explored: false
order: 1
---

# NavController

Le `NavController` est le point d'entrée de la navigation. Il gère la back stack et les transitions entre écrans. On l'obtient via `rememberNavController()` et on le passe aux composants qui ont besoin de naviguer.

```kotlin
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController, startDestination = "home") {
        composable("home") { HomeScreen(navController) }
        composable("profile") { ProfileScreen(navController) }
    }
}

// Dans HomeScreen :
Button(onClick = { navController.navigate("profile") }) {
    Text("Voir le profil")
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
navigationCompose = "2.8.9"

[libraries]
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
```

```kotlin
// build.gradle.kts (app)
dependencies {
    implementation(libs.androidx.navigation.compose)
}
```

## Liens
- [NavController](https://developer.android.com/jetpack/compose/navigation#nav-controller)
- [Navigate to a composable](https://developer.android.com/jetpack/compose/navigation#navigate)
