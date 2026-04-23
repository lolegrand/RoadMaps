---
id: gradle-dependances
parent: gradle
label: Gestion des dépendances
explored: false
order: 2
---

# Gestion des dépendances

La gestion moderne des dépendances Android combine le **Version Catalog** (`libs.versions.toml`) pour centraliser les versions, et `pluginManagement` dans `settings.gradle.kts` pour les plugins. Cette approche élimine les chaînes hardcodées, génère des accesseurs typés et facilite les mises à jour groupées.

```toml
# gradle/libs.versions.toml — source de vérité unique
[versions]
composeBom = "2025.05.00"
hilt       = "2.54"

[libraries]
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
hilt-android         = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }

[plugins]
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
```

## Liens
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Migrating to Version Catalogs](https://developer.android.com/build/migrate-to-catalogs)
