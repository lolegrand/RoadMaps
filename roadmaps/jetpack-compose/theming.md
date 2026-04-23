---
id: theming
parent: material3-category
label: Theming & Couleurs
explored: false
order: 2
---

# Theming & Couleurs

Le thème Material 3 définit la palette de couleurs, la typographie et les formes de l'application. `MaterialTheme` expose ces valeurs via CompositionLocal pour que tous les composants enfants y accèdent automatiquement.

```kotlin
@Composable
fun MyAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Color(0xFF3DDC84),
            secondary = Color(0xFF03DAC5)
        ),
        typography = Typography(),
        content = content
    )
}
```

## Liens
- [Theming in Compose](https://developer.android.com/jetpack/compose/designsystems/material3)
- [Material Theme Builder](https://m3.material.io/theme-builder)
