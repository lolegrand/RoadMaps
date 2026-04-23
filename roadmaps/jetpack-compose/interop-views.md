---
id: interop-views
parent: outillage
label: Interop avec les Views
explored: false
order: 4
---

# Interop avec les Views

`AndroidView` intègre une View Android classique dans Compose (utile pour les composants sans équivalent Compose). `ComposeView` fait l'inverse : ajoute un composable dans une hiérarchie XML. Cela facilite la migration progressive.

```kotlin
// Intégrer une MapView dans Compose
@Composable
fun MapComponent() {
    AndroidView(
        factory = { context -> MapView(context).apply { onCreate(null) } },
        update = { mapView -> mapView.getMapAsync { /* configure */ } }
    )
}
```

## Liens
- [Interoperability APIs](https://developer.android.com/jetpack/compose/migrate/interoperability-apis)
- [AndroidView](https://developer.android.com/jetpack/compose/migrate/interoperability-apis/views-in-compose)
