---
id: gradle-plugins
parent: gradle-dependances
label: Gestion des plugins
explored: false
order: 2
---

# Gestion des plugins

`pluginManagement` dans `settings.gradle.kts` centralise les dépôts et résolutions de plugins pour tout le projet. Les plugins sont déclarés dans le Version Catalog et référencés via `alias()`, ce qui évite de dupliquer les versions dans chaque module.

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
```

```toml
# gradle/libs.versions.toml
[versions]
agp = "8.7.3"
kotlin = "2.1.0"
hilt = "2.54"
ksp = "2.1.0-1.0.29"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
android-library    = { id = "com.android.library", version.ref = "agp" }
kotlin-android     = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose     = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
hilt-android       = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
kotlin-ksp         = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## Liens
- [Plugin Management](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_management)
- [Version Catalog — plugins](https://docs.gradle.org/current/userguide/version_catalogs.html#sec:plugins)
