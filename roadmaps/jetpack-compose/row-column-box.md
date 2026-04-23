---
id: row-column-box
parent: blocs-construction
label: Arrangement & Alignment
explored: true
order: 3
---

# Row, Column, Box

Les trois layouts de base permettent de construire n'importe quelle mise en page. `Arrangement` contrôle la distribution de l'espace entre enfants, `Alignment` leur positionnement sur l'axe transversal.

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
) {
    Text("Gauche")
    Text("Droite")
}
```

## Liens
- [Layouts basics](https://developer.android.com/jetpack/compose/layouts/basics)
- [Arrangement](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement)
