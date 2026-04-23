---
id: version-catalog
parent: gradle-dependances
label: Version Catalog
explored: false
order: 1
---

# Version Catalog

Le Version Catalog (`libs.versions.toml`) centralise toutes les versions et dépendances du projet. Gradle génère des accesseurs typés (`libs.androidx.compose.bom`) ce qui élimine les chaînes hardcodées et facilite les mises à jour.

```toml
# gradle/libs.versions.toml
[versions]
agp = "8.7.3"
kotlin = "2.1.0"
composeBom = "2025.05.00"
hilt = "2.54"
navigationCompose = "2.8.9"
coil = "3.1.0"
lifecycleViewmodelCompose = "2.9.0"

[libraries]
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version = "1.2.0" }
coil-compose = { group = "io.coil-kt.coil3", name = "coil-compose", version.ref = "coil" }
coil-network-okhttp = { group = "io.coil-kt.coil3", name = "coil-network-okhttp", version.ref = "coil" }
lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleViewmodelCompose" }
lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycleViewmodelCompose" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
```

## Liens
- [Gradle Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Android avec Version Catalog](https://developer.android.com/build/migrate-to-catalogs)
