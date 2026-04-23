---
id: gradle-multimodule
parent: gradle-structure
label: Multi-module
explored: false
order: 2
---

# Multi-module

La structure multi-module moderne centralise tout dans `settings.gradle.kts` : résolution des dépôts (`dependencyResolutionManagement`) et gestion des plugins (`pluginManagement`). Le `build.gradle.kts` racine ne fait que déclarer les plugins sans les appliquer (`apply false`), laissant chaque module choisir ce dont il a besoin.

```
monApp/
├── settings.gradle.kts       ← source de vérité unique
├── build.gradle.kts          ← plugins déclarés, apply false
├── gradle/
│   └── libs.versions.toml
├── app/
│   └── build.gradle.kts      ← alias(libs.plugins.android.application)
├── core/
│   ├── data/
│   │   └── build.gradle.kts  ← alias(libs.plugins.android.library)
│   └── ui/
│       └── build.gradle.kts
└── feature/
    ├── home/
    │   └── build.gradle.kts
    └── profile/
        └── build.gradle.kts
```

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

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MonApp"

include(":app")
include(":core:data")
include(":core:ui")
include(":feature:home")
include(":feature:profile")
```

```kotlin
// build.gradle.kts (racine) — déclaration uniquement, aucune application
plugins {
    alias(libs.plugins.android.application)  apply false
    alias(libs.plugins.android.library)      apply false
    alias(libs.plugins.kotlin.android)       apply false
    alias(libs.plugins.kotlin.compose)       apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.hilt.android)         apply false
    alias(libs.plugins.kotlin.ksp)           apply false
}
```

```kotlin
// feature/home/build.gradle.kts — application sélective
plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.feature.home"
    compileSdk = 35
    defaultConfig { minSdk = 24 }
    buildFeatures { compose = true }
}

dependencies {
    implementation(project(":core:ui"))
    val bom = platform(libs.androidx.compose.bom)
    implementation(bom)
    implementation(libs.androidx.material3)
}
```

## Liens
- [Structure multi-module Android](https://developer.android.com/topic/modularization)
- [dependencyResolutionManagement](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)
- [Now in Android — référence multi-module](https://github.com/android/nowinandroid)
