---
id: state-remember
parent: etat-local
label: State & remember
explored: true
order: 1
---

# State & remember

`remember` conserve une valeur entre les recompositions. Combiné avec `mutableStateOf`, il crée un état local observable. Quand la valeur change, Compose recompose les composables qui le lisent.

```kotlin
@Composable
fun ToggleButton() {
    var enabled by remember { mutableStateOf(false) }
    Switch(
        checked = enabled,
        onCheckedChange = { enabled = it }
    )
}
```

## Liens
- [State in Compose](https://developer.android.com/jetpack/compose/state)
- [State hoisting](https://developer.android.com/jetpack/compose/state-hoisting)
