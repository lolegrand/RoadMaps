---
id: retrofit
parent: reseau
label: Retrofit
explored: false
order: 1
---

# Retrofit

Retrofit transforme une interface Kotlin annotée en client HTTP. Combiné avec `kotlinx.serialization` ou Gson pour la désérialisation et OkHttp pour le transport, c'est la solution la plus répandue sur Android.

```kotlin
// Interface de l'API
interface UserApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): UserDto

    @POST("users")
    suspend fun createUser(@Body body: CreateUserRequest): UserDto

    @GET("users")
    suspend fun getUsers(@Query("page") page: Int): PagedResponse<UserDto>
}

// Construction du client
val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    })
    .addInterceptor { chain ->
        chain.proceed(
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        )
    }
    .build()

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(okHttpClient)
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .build()

val userApi: UserApiService = retrofit.create(UserApiService::class.java)
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
retrofit = "2.11.0"
okhttp   = "4.12.0"
retrofitKotlinxSerializationConverter = "1.0.0"

[libraries]
retrofit-core              = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
retrofit-converter-kotlinx = { group = "com.jakewharton.retrofit", name = "retrofit2-kotlinx-serialization-converter", version.ref = "retrofitKotlinxSerializationConverter" }
okhttp-logging             = { group = "com.squareup.okhttp3", name = "logging-interceptor", version.ref = "okhttp" }
```

```kotlin
// build.gradle.kts (module)
dependencies {
    implementation(libs.retrofit.core)
    implementation(libs.retrofit.converter.kotlinx)
    implementation(libs.okhttp.logging)
    implementation(libs.kotlinx.serialization.json) // déjà dans version catalog
}
```

## Liens
- [Retrofit](https://square.github.io/retrofit/)
- [OkHttp](https://square.github.io/okhttp/)
- [kotlinx-serialization converter](https://github.com/JakeWharton/retrofit2-kotlinx-serialization-converter)
