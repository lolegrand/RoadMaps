---
id: nav-concepts
parent: navigation
label: Concepts de base
explored: true
order: 1
---

# Concepts de base

La navigation dans Compose repose sur deux primitives communes à toutes les versions : le **NavController** (gère la back stack et les transitions) et les **routes** (identifiants des destinations). Les routes peuvent être des chaînes simples ou des objets `@Serializable` pour une navigation pleinement typée.

```kotlin
// Deux styles de routes
// Style chaîne (Navigation 2, basique)
navController.navigate("detail/42")

// Style type-safe (Navigation 2.8+ ou Navigation 3)
@Serializable data class DetailRoute(val id: String)
navController.navigate(DetailRoute("42"))
```

## Liens
- [Navigation Compose — overview](https://developer.android.com/jetpack/compose/navigation)
- [Choisir une version](https://developer.android.com/guide/navigation)
