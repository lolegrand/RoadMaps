---
id: side-effects
parent: etat-local
label: Side Effects
explored: false
order: 2
---

# Side Effects

Les side effects permettent d'exécuter du code en dehors de la composition (analytics, navigation, timers). `LaunchedEffect` lance une coroutine liée au cycle de vie du composable, `DisposableEffect` nettoie des ressources.

```kotlin
@Composable
fun AutoRefreshScreen(id: String) {
    val viewModel: MyViewModel = viewModel()

    LaunchedEffect(id) {
        viewModel.load(id) // relancé si `id` change
    }

    DisposableEffect(Unit) {
        onDispose { viewModel.cancel() }
    }
}
```

## Dépendances

```toml
# gradle/libs.versions.toml — inclus dans le BOM Compose
[libraries]
androidx-compose-runtime = { group = "androidx.compose.runtime", name = "runtime" }
```

```kotlin
// build.gradle.kts (app)
// LaunchedEffect et DisposableEffect font partie de androidx.compose.runtime,
// inclus automatiquement via le BOM Compose
dependencies {
    val bom = platform(libs.androidx.compose.bom)
    implementation(bom)
    implementation(libs.androidx.compose.runtime) // transitif, rarement déclaré seul
}
```

## Liens
- [Side-effects in Compose](https://developer.android.com/jetpack/compose/side-effects)
- [LaunchedEffect, DisposableEffect](https://developer.android.com/jetpack/compose/side-effects#launchedeffect)
