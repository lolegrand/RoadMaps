---
id: clean-architecture
parent: architecture-app
label: Clean Architecture
explored: false
order: 2
---

# Clean Architecture

La Clean Architecture divise l'app en trois couches indépendantes. La couche **Domain** est pure Kotlin (pas d'Android), la couche **Data** implémente les interfaces du Domain, et la couche **Presentation** contient les ViewModels et les composables Compose.

```
feature/home/
├── domain/
│   ├── model/Article.kt              // entité pure
│   ├── repository/ArticleRepository.kt  // interface
│   └── usecase/GetArticlesUseCase.kt
├── data/
│   ├── repository/ArticleRepositoryImpl.kt
│   ├── remote/ArticleApiService.kt
│   └── local/ArticleDao.kt
└── presentation/
    ├── ArticleViewModel.kt
    ├── ArticleUiState.kt
    └── ArticleScreen.kt
```

```kotlin
// domain/usecase/GetArticlesUseCase.kt
class GetArticlesUseCase @Inject constructor(
    private val repository: ArticleRepository
) {
    suspend operator fun invoke(): Result<List<Article>> =
        repository.getArticles()
}

// presentation/ArticleViewModel.kt
@HiltViewModel
class ArticleViewModel @Inject constructor(
    private val getArticles: GetArticlesUseCase
) : ViewModel() {

    private val _state = MutableStateFlow<ArticleUiState>(ArticleUiState.Loading)
    val state: StateFlow<ArticleUiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            getArticles()
                .onSuccess { _state.value = ArticleUiState.Success(it) }
                .onFailure { _state.value = ArticleUiState.Error(it.message) }
        }
    }
}

// presentation/ArticleUiState.kt
sealed interface ArticleUiState {
    data object Loading : ArticleUiState
    data class Success(val articles: List<Article>) : ArticleUiState
    data class Error(val message: String?) : ArticleUiState
}
```

## Liens
- [Guide d'architecture Android](https://developer.android.com/topic/architecture)
- [Domain layer](https://developer.android.com/topic/architecture/domain-layer)
- [Now in Android — référence](https://github.com/android/nowinandroid)
