---
id: architecture
parent: jetpack-compose
label: Architecture
explored: false
order: 3
---

# Architecture

La gestion d'état est centrale dans Compose. L'état doit être hissé (state hoisting) vers le composant parent pour rester testable et réutilisable. L'intégration avec ViewModel et les flux réactifs (StateFlow, LiveData) est native.

```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    Text(uiState.message)
}
```

## Liens
- [State and Jetpack Compose](https://developer.android.com/jetpack/compose/state)
- [Architecture avec Compose](https://developer.android.com/jetpack/compose/architecture)
