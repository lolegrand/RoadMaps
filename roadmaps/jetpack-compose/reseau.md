---
id: reseau
parent: jetpack-compose
label: Réseau & HTTP
explored: false
order: 8
---

# Réseau & HTTP

Les deux bibliothèques principales pour les appels HTTP Android sont **Retrofit** (annotation-based, mature, largement adopté) et **Ktor Client** (100% Kotlin, multiplatform, coroutines-first). Les deux s'intègrent avec les coroutines et les ViewModels Compose.

```kotlin
// Pattern commun : repository qui abstrait la lib réseau
class UserRepository @Inject constructor(
    private val api: UserApiService
) {
    suspend fun getUser(id: String): Result<User> = runCatching {
        api.getUser(id)
    }
}
```

## Liens
- [Réseau sur Android](https://developer.android.com/training/basics/network-ops)
- [Retrofit vs Ktor — comparaison](https://ktor.io/docs/client-supported-platforms.html)
