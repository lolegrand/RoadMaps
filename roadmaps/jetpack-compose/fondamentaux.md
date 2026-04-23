---
id: fondamentaux
parent: jetpack-compose
label: Fondamentaux
explored: true
order: 1
---

# Fondamentaux

Les fondamentaux de Compose reposent sur des fonctions `@Composable` qui décrivent l'UI à partir d'un état. Quand l'état change, Compose recalcule automatiquement les parties concernées de l'interface (recomposition).

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clics : $count")
    }
}
```

## Liens
- [Thinking in Compose](https://developer.android.com/jetpack/compose/mental-model)
- [Composable functions](https://developer.android.com/jetpack/compose/composables)
