---
id: layouts-base
parent: blocs-construction
label: Layouts de base
explored: true
order: 2
---

# Layouts de base

`Column`, `Row` et `Box` sont les trois conteneurs fondamentaux de Compose. `Column` empile verticalement, `Row` horizontalement, `Box` superpose les enfants. Ils remplacent LinearLayout et FrameLayout du système XML.

```kotlin
@Composable
fun CardLayout() {
    Column(modifier = Modifier.padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(40.dp).background(Color.Blue))
            Spacer(Modifier.width(8.dp))
            Text("Titre", style = MaterialTheme.typography.titleMedium)
        }
        Text("Description du contenu de la carte.")
    }
}
```

## Liens
- [Column, Row, Box](https://developer.android.com/jetpack/compose/layouts/basics)
- [Alignment et Arrangement](https://developer.android.com/jetpack/compose/layouts/basics#alignment)
