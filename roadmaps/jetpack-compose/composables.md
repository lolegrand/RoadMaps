---
id: composables
parent: modele-declaratif
label: Fonctions Composables
explored: true
order: 1
---

# Fonctions Composables

Une fonction `@Composable` est la brique de base de Compose. Elle décrit une portion d'UI et peut être appelée depuis n'importe quelle autre fonction composable. Les composables sont idempotents : le même état produit toujours le même rendu.

```kotlin
@Composable
fun UserBadge(name: String, isAdmin: Boolean) {
    Row {
        Text(name)
        if (isAdmin) {
            Icon(Icons.Default.Star, contentDescription = "Admin")
        }
    }
}
```

## Liens
- [Composable functions](https://developer.android.com/jetpack/compose/composables)
- [Kotlin pour Compose](https://developer.android.com/jetpack/compose/kotlin)
