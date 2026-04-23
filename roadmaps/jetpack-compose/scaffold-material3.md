---
id: scaffold-material3
parent: material3-category
label: Scaffold & Material 3
explored: false
order: 1
---

# Scaffold & Material 3

`Scaffold` structure un écran complet avec TopAppBar, BottomBar, FAB et contenu principal. Material 3 fournit les composants visuels (Button, Card, TextField, Dialog…) conformes aux guidelines Google.

```kotlin
@Composable
fun MainScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Mon App") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = { }) {
                Icon(Icons.Default.Add, contentDescription = "Ajouter")
            }
        }
    ) { padding ->
        Content(Modifier.padding(padding))
    }
}
```

## Liens
- [Scaffold](https://developer.android.com/jetpack/compose/components/scaffold)
- [Material 3 Components](https://m3.material.io/components)
