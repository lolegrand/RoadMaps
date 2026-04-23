---
id: material3-category
parent: ui-composants
label: Material Design 3
explored: false
order: 1
---

# Material Design 3

Material Design 3 (Material You) est le système de design de Google pour Android. Compose propose une implémentation complète : composants prêts à l'emploi (Button, Card, TextField, Dialog…), un système de theming dynamique et des guidelines de mise en page via `Scaffold`.

```kotlin
@Composable
fun SampleCard() {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Titre", style = MaterialTheme.typography.titleMedium)
            Text("Description", style = MaterialTheme.typography.bodyMedium)
            TextButton(onClick = { }) { Text("Action") }
        }
    }
}
```

## Liens
- [Material 3 pour Compose](https://m3.material.io/develop/android/jetpack-compose)
- [Composants Material 3](https://m3.material.io/components)
