---
id: previews
parent: outillage
label: Previews & Tooling
explored: true
order: 1
---

# Previews & Tooling

`@Preview` affiche un composable directement dans Android Studio sans lancer l'émulateur. On peut créer plusieurs previews (thème clair/sombre, différentes tailles d'écran) pour valider rapidement les designs.

```kotlin
@Preview(name = "Clair", showBackground = true)
@Preview(name = "Sombre", uiMode = UI_MODE_NIGHT_YES)
@Composable
fun GreetingPreview() {
    MyAppTheme {
        Greeting("Monde")
    }
}
```

## Liens
- [Compose tooling](https://developer.android.com/jetpack/compose/tooling)
- [Preview annotations](https://developer.android.com/jetpack/compose/tooling/previews)
