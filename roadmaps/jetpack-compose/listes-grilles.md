---
id: listes-grilles
parent: ui-composants
label: Listes & Grilles
explored: false
order: 2
---

# Listes & Grilles

Compose propose des conteneurs lazy (virtualisés) pour afficher efficacement de grandes collections : `LazyColumn`, `LazyRow`, `LazyVerticalGrid` et `LazyVerticalStaggeredGrid`. Seuls les éléments visibles sont composés, ce qui remplace avantageusement RecyclerView.

```kotlin
@Composable
fun PhotoGrid(photos: List<Photo>) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 120.dp),
        contentPadding = PaddingValues(8.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        items(photos, key = { it.id }) { photo ->
            PhotoThumbnail(photo)
        }
    }
}
```

## Liens
- [Lazy layouts](https://developer.android.com/jetpack/compose/lists)
- [LazyVerticalGrid](https://developer.android.com/jetpack/compose/lists#lazy-grids)
