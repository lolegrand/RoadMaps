---
id: ktor-client
parent: reseau
label: Ktor Client
explored: false
order: 2
---

# Ktor Client

Ktor Client est un client HTTP 100% Kotlin, conçu pour les coroutines. Il est multiplatform (Android, iOS, Desktop) et configurable par plugins (`ContentNegotiation`, `Logging`, `Auth`). Idéal pour les projets Kotlin Multiplatform.

```kotlin
// Configuration du client
val httpClient = HttpClient(OkHttp) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            coerceInputValues = true
        })
    }
    install(Logging) {
        logger = Logger.ANDROID
        level = LogLevel.BODY
    }
    install(Auth) {
        bearer {
            loadTokens { BearerTokens(accessToken, refreshToken) }
            refreshTokens { /* logique refresh */ }
        }
    }
    defaultRequest {
        url("https://api.example.com/")
        contentType(ContentType.Application.Json)
    }
}

// Appels
suspend fun getUser(id: String): User =
    httpClient.get("users/$id").body()

suspend fun createUser(user: CreateUserRequest): User =
    httpClient.post("users") { setBody(user) }.body()
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
ktor = "3.1.2"

[libraries]
ktor-client-android              = { group = "io.ktor", name = "ktor-client-android", version.ref = "ktor" }
ktor-client-content-negotiation  = { group = "io.ktor", name = "ktor-client-content-negotiation", version.ref = "ktor" }
ktor-serialization-kotlinx-json  = { group = "io.ktor", name = "ktor-serialization-kotlinx-json", version.ref = "ktor" }
ktor-client-logging              = { group = "io.ktor", name = "ktor-client-logging", version.ref = "ktor" }
ktor-client-auth                 = { group = "io.ktor", name = "ktor-client-auth", version.ref = "ktor" }
```

```kotlin
// build.gradle.kts (module)
dependencies {
    implementation(libs.ktor.client.android)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.client.logging)
    implementation(libs.ktor.client.auth)
}
```

## Liens
- [Ktor Client](https://ktor.io/docs/client-create-new-application.html)
- [Ktor pour Android](https://ktor.io/docs/client-engines.html#android)
- [Ktor vs Retrofit](https://ktor.io/docs/client-supported-platforms.html)
