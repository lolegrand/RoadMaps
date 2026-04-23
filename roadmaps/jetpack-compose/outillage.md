---
id: outillage
parent: jetpack-compose
label: Outillage
explored: false
order: 8
---

# Outillage

L'écosystème Compose bénéficie d'un outillage riche : **Previews** pour visualiser les composables sans émulateur, un **framework de test** dédié, **Coil** pour les images asynchrones, et les APIs d'interopérabilité pour migrer progressivement depuis les vues XML.

```kotlin
// Tout l'outillage s'intègre au cycle de développement
@Preview @Composable fun MyComponentPreview() { MyComponent() }
// → visible immédiatement dans Android Studio sans compiler
```

## Liens
- [Compose tooling](https://developer.android.com/jetpack/compose/tooling)
- [Testing in Compose](https://developer.android.com/jetpack/compose/testing)
