---
id: viewmodel-integration
parent: architecture-app
label: ViewModel & StateFlow
explored: false
order: 1
---

# ViewModel & StateFlow

Le ViewModel survit aux recompositions et aux rotations d'écran. `collectAsStateWithLifecycle()` convertit un `StateFlow` en état Compose, en respectant le cycle de vie pour éviter les fuites mémoire.

```kotlin
class TaskViewModel : ViewModel() {
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    fun addTask(task: Task) {
        _tasks.update { it + task }
    }
}

@Composable
fun TaskScreen(vm: TaskViewModel = viewModel()) {
    val tasks by vm.tasks.collectAsStateWithLifecycle()
    LazyColumn { items(tasks) { TaskItem(it) } }
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
lifecycle = "2.9.0"

[libraries]
lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }
lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
```

```kotlin
// build.gradle.kts (app)
dependencies {
    implementation(libs.lifecycle.viewmodel.compose)
    implementation(libs.lifecycle.runtime.compose) // pour collectAsStateWithLifecycle
}
```

## Liens
- [ViewModel in Compose](https://developer.android.com/jetpack/compose/libraries#viewmodel)
- [collectAsStateWithLifecycle](https://developer.android.com/topic/libraries/architecture/coroutines#collectasstatewithlifecycle)
