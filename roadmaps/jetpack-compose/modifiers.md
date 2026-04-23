---
id: modifiers
parent: blocs-construction
label: Modifiers
explored: true
order: 2
---

# Modifiers

Les `Modifier` permettent de décorer ou configurer un composable : taille, padding, fond, clics, etc. Ils s'enchaînent de gauche à droite, et l'ordre est significatif (ex: padding avant background ≠ background avant padding).

```kotlin
Box(
    Modifier
        .fillMaxWidth()
        .padding(16.dp)
        .background(Color.LightGray)
        .clickable { /* action */ }
) {
    Text("Cliquez ici")
}
```

## Liens
- [Modifiers](https://developer.android.com/jetpack/compose/modifiers)
- [Modifier list](https://developer.android.com/jetpack/compose/modifiers-list)
