---
id: gradle-build-variants
parent: gradle-structure
label: Build Variants
explored: false
order: 1
---

# Build Variants

Les `buildTypes` (debug/release) et les `productFlavors` permettent de produire plusieurs variantes de l'app depuis un seul code source. Chaque variante peut avoir ses propres ressources, `BuildConfig` fields et dépendances.

```kotlin
// build.gradle.kts (app)
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    flavorDimensions += "env"
    productFlavors {
        create("staging") {
            dimension = "env"
            buildConfigField("String", "API_URL", "\"https://staging.api.example.com\"")
        }
        create("production") {
            dimension = "env"
            buildConfigField("String", "API_URL", "\"https://api.example.com\"")
        }
    }

    buildFeatures {
        buildConfig = true
        compose = true
    }
}
```

## Liens
- [Configure build variants](https://developer.android.com/build/build-variants)
- [Product flavors](https://developer.android.com/build/build-variants#product-flavors)
