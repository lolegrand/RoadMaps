# Roadmap Explorer — Guide Claude

App web locale de visualisation de mindmaps technologiques, chargées depuis des dossiers de fichiers Markdown.

## Démarrage

```bash
npm install
npm start   # → http://localhost:3000
```

---

## Générer une roadmap

Chaque roadmap est un **dossier** dans `roadmaps/` contenant :
- `_meta.yaml` — métadonnées de la roadmap
- un fichier `.md` par nœud — avec frontmatter YAML + contenu Markdown libre

```
roadmaps/
└── typescript/
    ├── _meta.yaml
    ├── root.md
    ├── types.md
    ├── generics.md
    └── async.md
```

### `_meta.yaml`

```yaml
title: TypeScript
description: JavaScript typé par Microsoft
color: "#3178C6"
```

### Fichier nœud `.md`

```markdown
---
id: generics
parent: types
label: Generics
explored: false
order: 2
---

# Generics

Contenu Markdown complètement libre, sans contrainte de syntaxe YAML.

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

## Liens
- [Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
```

### Champs frontmatter

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| `id` | ✅ | Identifiant unique dans la roadmap (slug, sans espaces) |
| `label` | ✅ | Texte affiché dans la mindmap |
| `parent` | — | `id` du nœud parent (absent = racine) |
| `explored` | — | `true` / `false` (défaut : `false`) |
| `order` | — | Ordre parmi les frères (entier, défaut : 999) |

### Règles importantes

- **Un seul nœud racine** par roadmap — celui sans `parent`
- **`id`** : minuscules, tirets autorisés, pas d'espaces (ex : `error-handling`)
- **`order`** : commence à 1, définit l'ordre des enfants dans la mindmap
- **Nom de fichier** : libre, mais utiliser le même slug que `id` pour la lisibilité
- **Éviter dans `label`** : `:` `#` `[` `]` (caractères YAML spéciaux)

### Taille recommandée

| Critère | Valeur idéale |
|---------|---------------|
| Nœuds total | 15 – 40 |
| Profondeur max | 3 – 4 niveaux |
| Enfants directs de la racine | 4 – 7 catégories |

### Structure type d'une roadmap

```
root (la techno)
├── Concepts fondamentaux   syntaxe, types, primitives…
├── Fonctionnalités clés    ce qui rend la techno unique
├── Patterns / Bonnes pratiques
├── Écosystème / Outils
└── Avancé / Cas d'usage
```

### Conventions pour le contenu Markdown

Chaque fichier `.md` doit contenir dans l'ordre :

1. **`# Titre`** — reprend le label du nœud
2. **Explication courte** (2–4 phrases) — le quoi et le pourquoi
3. **Exemple de code** avec la bonne langue (` ```typescript `, ` ```rust `…)
4. **Section `## Liens`** avec doc officielle + tutoriels utiles

### État `explored`

- `explored: true` → concepts introductifs (syntaxe de base, notions fondamentales)
- `explored: false` → concepts intermédiaires/avancés (défaut)

### Couleurs suggérées

| Techno | Couleur |
|--------|---------|
| Rust | `"#CE422B"` |
| JavaScript | `"#F7DF1E"` |
| TypeScript | `"#3178C6"` |
| Python | `"#3776AB"` |
| Go | `"#00ADD8"` |
| Swift | `"#F05138"` |
| Kotlin | `"#7F52FF"` |
| Java | `"#ED8B00"` |
| React | `"#61DAFB"` |
| Vue | `"#42B883"` |
| Docker | `"#2496ED"` |
| Kubernetes | `"#326CE5"` |
| AWS | `"#FF9900"` |
| Linux | `"#FCC624"` |
| Git | `"#F05032"` |

### Checklist avant de sauvegarder

- [ ] `_meta.yaml` présent avec `title`
- [ ] Un seul nœud sans `parent` (la racine)
- [ ] Tous les `parent` référencent un `id` existant
- [ ] Les `id` sont uniques dans la roadmap
- [ ] Chaque `.md` commence par `---` (frontmatter valide)
- [ ] Chaque `summary` commence par un `# Titre` H1
- [ ] Les blocs de code ont une langue spécifiée
- [ ] Les URLs dans les liens sont réelles

---

## Stack technique

| Couche | Outil |
|--------|-------|
| Serveur | Node.js + `js-yaml` + `chokidar` |
| Mindmap | D3.js v7 (radial tree) |
| Markdown | marked.js |
| Coloration syntaxique | highlight.js |
| Frontend | Vanilla JS, aucun framework |

## Structure du projet

```
roadmap/
├── CLAUDE.md           ← ce fichier
├── server.js           serveur HTTP + SSE live reload
├── package.json
├── roadmaps/           ← un dossier par technologie
│   └── rust/
│       ├── _meta.yaml
│       └── *.md        (un fichier par nœud)
└── public/
    ├── index.html
    ├── style.css       thème clair/sombre
    └── app.js          logique frontend complète
```
