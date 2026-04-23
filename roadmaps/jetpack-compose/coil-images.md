---
id: coil-images
parent: outillage
label: Coil & Images
explored: false
order: 3
---

# Coil & Images

Coil est la bibliothèque de chargement d'images recommandée pour Compose. `AsyncImage` charge et affiche une image depuis une URL avec gestion du cache, des placeholders et des transitions.

```kotlin
@Composable
fun UserAvatar(url: String) {
    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(url)
            .crossfade(true)
            .build(),
        contentDescription = "Avatar",
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape),
        contentScale = ContentScale.Crop,
        placeholder = painterResource(R.drawable.placeholder)
    )
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
coil = "3.1.0"

[libraries]
coil-compose = { group = "io.coil-kt.coil3", name = "coil-compose", version.ref = "coil" }
coil-network-okhttp = { group = "io.coil-kt.coil3", name = "coil-network-okhttp", version.ref = "coil" }
```

```kotlin
// build.gradle.kts (app)
dependencies {
    implementation(libs.coil.compose)
    implementation(libs.coil.network.okhttp) // pour charger depuis des URLs HTTP
}
```

## Liens
- [Coil pour Compose](https://coil-kt.github.io/coil/compose/)
- [AsyncImage](https://coil-kt.github.io/coil/compose/#asyncimage)
