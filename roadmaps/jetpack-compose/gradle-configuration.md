---
id: gradle-configuration
parent: gradle
label: Configuration Compose
explored: true
order: 1
---

# Configuration Compose

Activer Compose dans un projet Android nécessite deux étapes : appliquer le plugin Kotlin Compose dans `build.gradle.kts` du module, puis déclarer les dépendances Compose via le BOM. Depuis Kotlin 2.0, le compilateur Compose est distribué séparément du compilateur Kotlin.

```kotlin
// build.gradle.kts (app)
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose) // nouveau depuis Kotlin 2.0
}

android {
    buildFeatures { compose = true }
}

dependencies {
    val bom = platform(libs.androidx.compose.bom)
    implementation(bom)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.material3)
    debugImplementation(libs.androidx.compose.ui.tooling)
}
```

## Liens
- [Setup Compose](https://developer.android.com/develop/ui/compose/setup)
- [Compose BOM](https://developer.android.com/jetpack/compose/bom)
