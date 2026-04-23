---
id: graphisme
parent: ui-composants
label: Graphisme & Animation
explored: false
order: 3
---

# Graphisme & Animation

Compose intègre nativement les animations déclaratives et le dessin vectoriel via `Canvas`. Ces APIs permettent de créer des interfaces riches sans dépendances tierces, en restant dans le paradigme composable.

```kotlin
@Composable
fun AnimatedRing(progress: Float) {
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing)
    )
    Canvas(modifier = Modifier.size(80.dp)) {
        drawArc(
            color = Color(0xFF3DDC84),
            startAngle = -90f,
            sweepAngle = 360f * animatedProgress,
            useCenter = false,
            style = Stroke(width = 8.dp.toPx(), cap = StrokeCap.Round)
        )
    }
}
```

## Liens
- [Animation in Compose](https://developer.android.com/jetpack/compose/animation/introduction)
- [Graphics in Compose](https://developer.android.com/jetpack/compose/graphics/draw/overview)
