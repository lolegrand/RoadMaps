---
id: lazy-lists
parent: listes-grilles
label: Listes Lazy
explored: false
order: 1
---

# Listes Lazy

`LazyColumn` et `LazyRow` ne composent que les éléments visibles à l'écran, ce qui les rend efficaces pour les longues listes. Ils remplacent RecyclerView. `LazyVerticalGrid` gère les grilles.

```kotlin
@Composable
fun ItemList(items: List<Item>) {
    LazyColumn {
        items(items, key = { it.id }) { item ->
            ItemRow(item)
        }
    }
}
```

## Liens
- [Lazy layouts](https://developer.android.com/jetpack/compose/lists)
- [LazyColumn performance](https://developer.android.com/jetpack/compose/lists#item-keys)
