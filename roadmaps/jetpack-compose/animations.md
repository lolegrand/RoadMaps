---
id: animations
parent: graphisme
label: Animations
explored: false
order: 1
---

# Animations

Compose offre une API d'animation déclarative à plusieurs niveaux : `animateFloatAsState` pour les valeurs simples, `AnimatedVisibility` pour les entrées/sorties, et `Transition` pour les animations multi-propriétés coordonnées.

```kotlin
@Composable
fun ExpandableCard(expanded: Boolean) {
    AnimatedVisibility(
        visible = expanded,
        enter = expandVertically() + fadeIn(),
        exit = shrinkVertically() + fadeOut()
    ) {
        Text("Contenu masqué", modifier = Modifier.padding(16.dp))
    }
}
```

## Liens
- [Animation in Compose](https://developer.android.com/jetpack/compose/animation/introduction)
- [AnimatedVisibility](https://developer.android.com/jetpack/compose/animation/composables-modifiers#animatedvisibility)
