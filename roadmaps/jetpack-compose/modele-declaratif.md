---
id: modele-declaratif
parent: fondamentaux
label: Modèle déclaratif
explored: true
order: 1
---

# Modèle déclaratif

Compose adopte un paradigme déclaratif : on décrit *ce que* l'UI doit afficher en fonction d'un état, et le framework se charge de *comment* mettre à jour l'écran. C'est un changement de modèle fondamental par rapport aux vues XML impératives Android.

```kotlin
// Déclaratif : l'UI est une fonction de l'état
@Composable
fun LoginButton(isLoading: Boolean) {
    if (isLoading) {
        CircularProgressIndicator()
    } else {
        Button(onClick = { /* ... */ }) { Text("Connexion") }
    }
}
```

## Liens
- [Thinking in Compose](https://developer.android.com/jetpack/compose/mental-model)
- [Compose vs View system](https://developer.android.com/jetpack/compose/migrate/strategy)
