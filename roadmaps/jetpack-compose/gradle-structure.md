---
id: gradle-structure
parent: gradle
label: Structure du projet
explored: false
order: 3
---

# Structure du projet

La structure Gradle d'un projet Android moderne repose sur les **build variants** (debug/release/flavors) pour gérer les variantes de build, et le **multi-module** pour diviser l'app en modules indépendants. Ces deux patterns sont complémentaires et scalent bien sur les gros projets.

```
app/           ← module applicatif (android.application)
core/
  data/        ← accès données (android.library)
  ui/          ← composants partagés (android.library + compose)
feature/
  home/        ← fonctionnalité isolée (android.library + compose)
  settings/
gradle/
  libs.versions.toml
settings.gradle.kts   ← tout est centralisé ici
build.gradle.kts      ← plugins déclarés, apply false
```

## Liens
- [Android app modularization](https://developer.android.com/topic/modularization)
- [Build variants](https://developer.android.com/build/build-variants)
