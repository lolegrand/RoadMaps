---
id: architecture-app
parent: architecture
label: Architecture applicative
explored: false
order: 2
---

# Architecture applicative

L'architecture recommandée par Google pour les apps Compose combine **ViewModel** (survie aux recompositions et rotations), **StateFlow** (état observable réactif) et **Clean Architecture** (séparation Domain / Data / Presentation). Ce trio permet une app testable, maintenable et scalable.

```
Presentation  ←  ViewModel  ←  UseCase  ←  Repository  ←  DataSource
    (Compose)                  (Domain)        (Data)
```

```kotlin
// Le ViewModel est la frontière entre UI et logique métier
@HiltViewModel
class FeedViewModel @Inject constructor(
    private val getFeed: GetFeedUseCase
) : ViewModel() {
    val state = getFeed().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = FeedUiState.Loading
    )
}
```

## Liens
- [Guide d'architecture Android](https://developer.android.com/topic/architecture)
- [Now in Android — référence](https://github.com/android/nowinandroid)
