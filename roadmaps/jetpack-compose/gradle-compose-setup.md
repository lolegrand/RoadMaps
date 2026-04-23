---
id: gradle-compose-setup
parent: gradle-configuration
label: Activer Compose
explored: true
order: 1
---

# Activer Compose

Pour utiliser Jetpack Compose, il faut activer `buildFeatures.compose` dans le module `app` et s'assurer que le plugin Kotlin Android est bien appliqué. Depuis AGP 8+, le compilateur Compose est inclus via le plugin dédié.

```kotlin
// build.gradle.kts (app)
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose) // requis depuis Kotlin 2.0
}

android {
    compileSdk = 35

    defaultConfig {
        minSdk = 24
        targetSdk = 35
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val bom = platform(libs.androidx.compose.bom)
    implementation(bom)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.material3)
    debugImplementation(libs.androidx.compose.ui.tooling)
}
```

## Liens
- [Setup Compose](https://developer.android.com/develop/ui/compose/setup)
- [Compose Compiler plugin](https://developer.android.com/jetpack/androidx/releases/compose-compiler)
