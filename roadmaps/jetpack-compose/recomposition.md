---
id: recomposition
parent: modele-declaratif
label: Recomposition
explored: false
order: 2
---

# Recomposition

La recomposition est le mécanisme par lequel Compose réexécute les fonctions `@Composable` quand leurs états ou paramètres changent. Compose optimise en ne recomposant que les composables dont les entrées ont changé (smart recomposition).

```kotlin
@Composable
fun ExpensiveList(items: List<String>) {
    // Ne recompose que si `items` change réellement
    items.forEach { item ->
        key(item) { ListItem(item) }
    }
}
```

## Liens
- [Recomposition](https://developer.android.com/jetpack/compose/mental-model#recomposition)
- [Phases of Compose](https://developer.android.com/jetpack/compose/phases)
