---
id: blocs-construction
parent: fondamentaux
label: Blocs de construction
explored: true
order: 2
---

# Blocs de construction

Les blocs de construction de Compose sont les `Modifier` (décoration et comportement), et les conteneurs de mise en page (`Row`, `Column`, `Box`). Maîtriser ces primitives suffit pour construire n'importe quelle interface.

```kotlin
@Composable
fun ActionCard(title: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable(onClick = onClick),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, modifier = Modifier.weight(1f))
        Icon(Icons.Default.ChevronRight, contentDescription = null)
    }
}
```

## Liens
- [Layouts basics](https://developer.android.com/jetpack/compose/layouts/basics)
- [Modifiers](https://developer.android.com/jetpack/compose/modifiers)
