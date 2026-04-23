---
id: compose-bom
parent: gradle-configuration
label: Compose BOM
explored: false
order: 2
---

# Compose BOM

Le BOM (Bill of Materials) de Compose aligne automatiquement les versions de toutes les bibliothèques Compose entre elles. On déclare une seule version (celle du BOM) et toutes les dépendances Compose héritent de versions compatibles.

```kotlin
// libs.versions.toml
[versions]
composeBom = "2025.05.00"

[libraries]
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }

// build.gradle.kts
dependencies {
    val bom = platform(libs.androidx.compose.bom)
    implementation(bom)
    androidTestImplementation(bom)

    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.material3)
    debugImplementation(libs.androidx.compose.ui.tooling)
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
}
```

## Liens
- [Compose BOM](https://developer.android.com/jetpack/compose/bom)
- [BOM to library version mapping](https://developer.android.com/jetpack/compose/bom/bom-mapping)
