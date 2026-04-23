---
id: ui-composants
parent: jetpack-compose
label: UI & Composants
explored: false
order: 2
---

# UI & Composants

Compose fournit un ensemble de composants Material 3 prêts à l'emploi et des conteneurs de mise en page (`Row`, `Column`, `Box`) pour structurer l'écran. Tout est composable et personnalisable via des paramètres Kotlin.

```kotlin
@Composable
fun ProfileCard() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.Person, contentDescription = null)
        Spacer(Modifier.width(8.dp))
        Text("Alice")
    }
}
```

## Liens
- [Layouts in Compose](https://developer.android.com/jetpack/compose/layouts/basics)
- [Material 3 pour Compose](https://m3.material.io/develop/android/jetpack-compose)
