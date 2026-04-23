---
id: navigation
parent: jetpack-compose
label: Navigation
explored: false
order: 4
---

# Navigation

La bibliothèque Navigation Compose remplace les Fragments pour gérer les écrans. On définit un graphe de navigation avec des routes typées et un `NavController` pour les transitions.

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable("detail/{id}") { backStackEntry ->
        DetailScreen(backStackEntry.arguments?.getString("id"))
    }
}
```

## Liens
- [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
- [Type-safe Navigation](https://developer.android.com/guide/navigation/design/type-safety)
