---
id: gradle
parent: jetpack-compose
label: Gradle & Build
explored: false
order: 7
---

# Gradle & Build

Gradle est le système de build d'Android. Pour Jetpack Compose, il faut activer le compilateur Compose, gérer les versions via le BOM officiel et organiser les dépendances avec le Version Catalog. La migration vers Kotlin DSL est aujourd'hui la norme.

```kotlin
// build.gradle.kts (app)
android {
    buildFeatures { compose = true }
}

dependencies {
    val bom = platform("androidx.compose:compose-bom:2025.05.00")
    implementation(bom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
}
```

## Liens
- [Compose and Kotlin compatibility](https://developer.android.com/jetpack/androidx/releases/compose-kotlin)
- [Compose BOM](https://developer.android.com/jetpack/compose/bom)
