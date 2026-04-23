---
id: custom-drawing
parent: graphisme
label: Canvas & Dessin custom
explored: false
order: 2
---

# Canvas & Dessin custom

`Canvas` donne accès à une surface de dessin 2D via `DrawScope`. On peut tracer des formes, des chemins, du texte et des images. `Modifier.drawBehind` permet de dessiner derrière un composable existant.

```kotlin
@Composable
fun ProgressArc(progress: Float) {
    Canvas(modifier = Modifier.size(100.dp)) {
        drawArc(
            color = Color(0xFF3DDC84),
            startAngle = -90f,
            sweepAngle = 360f * progress,
            useCenter = false,
            style = Stroke(width = 8.dp.toPx())
        )
    }
}
```

## Liens
- [Graphics in Compose](https://developer.android.com/jetpack/compose/graphics/draw/overview)
- [Canvas](https://developer.android.com/jetpack/compose/graphics/draw/basic)
