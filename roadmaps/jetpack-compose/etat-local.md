---
id: etat-local
parent: architecture
label: Etat local
explored: true
order: 1
---

# Etat local

L'état local est géré directement dans les composables avec `remember` et `mutableStateOf`. Lorsque l'état doit être partagé entre composables, il est hissé (state hoisting) vers le composant ancêtre commun. Les side effects gèrent les actions à déclencher en réaction aux changements d'état.

```kotlin
@Composable
fun SearchBar(
    query: String,             // état hissé : reçu en paramètre
    onQueryChange: (String) -> Unit
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        placeholder = { Text("Rechercher…") }
    )
}
```

## Liens
- [State in Compose](https://developer.android.com/jetpack/compose/state)
- [State hoisting](https://developer.android.com/jetpack/compose/state-hoisting)
