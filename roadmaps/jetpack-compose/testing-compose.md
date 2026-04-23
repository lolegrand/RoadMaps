---
id: testing-compose
parent: outillage
label: Testing
explored: false
order: 2
---

# Testing

Le framework de test Compose utilise `ComposeTestRule` pour interagir avec les composables via des sémantiques d'accessibilité. On trouve des noeuds par texte, rôle ou tag de test, puis on vérifie leur état ou on simule des interactions.

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun counterIncrements() {
    composeTestRule.setContent { Counter() }

    composeTestRule.onNodeWithText("Clics : 0").assertIsDisplayed()
    composeTestRule.onNodeWithText("Clics : 0").performClick()
    composeTestRule.onNodeWithText("Clics : 1").assertIsDisplayed()
}
```

## Dépendances

```toml
# gradle/libs.versions.toml — inclus dans le BOM Compose
[libraries]
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
```

```kotlin
// build.gradle.kts (app)
dependencies {
    val bom = platform(libs.androidx.compose.bom)
    androidTestImplementation(bom)
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
```

## Liens
- [Testing in Compose](https://developer.android.com/jetpack/compose/testing)
- [Compose testing cheatsheet](https://developer.android.com/jetpack/compose/testing-cheatsheet)
