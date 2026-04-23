# Roadmap Explorer

Visualise tes explorations technologiques sous forme de **mindmap radiale**, chargée depuis de simples fichiers YAML.

![Light theme, mindmap radiale avec panneau latéral](https://placehold.co/900x460/eef2ff/4f46e5?text=Roadmap+Explorer)

## Fonctionnalités

- **Mindmap radiale** avec zoom/pan libre (molette + drag)
- **Panneau latéral** au clic sur un nœud — markdown rendu avec coloration syntaxique
- **État exploré/à explorer** par nœud, persisté en localStorage
- **Live reload** — édite un fichier `.yaml` et la mindmap se met à jour instantanément
- **Thème clair**, animations fluides, design responsive

## Démarrage

```bash
npm install
npm start
# → http://localhost:3000
```

Ajoute tes fichiers `.yaml` dans le dossier `roadmaps/` — ils apparaissent automatiquement sur la page d'accueil.

## Format des fichiers

Chaque technologie est un fichier `roadmaps/<nom>.yaml` :

```yaml
title: Rust
description: Langage système sûr et performant   # affiché sur la carte d'accueil
color: "#CE422B"                                  # couleur d'accent (optionnel)

root:
  label: Rust
  explored: true          # état initial (modifiable dans l'app)
  summary: |
    # Rust

    Description en **Markdown** libre.

    ```rust
    fn main() {
        println!("Hello, world!");
    }
    ```

    ## Liens
    - [The Rust Book](https://doc.rust-lang.org/book/)

  children:
    - label: Ownership
      explored: true
      summary: |
        # Ownership
        ...
      children:
        - label: Borrowing
          explored: false
          summary: |
            ...
          children: []   # nœud feuille
```

### Règles de format

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| `title` | ✅ | Nom affiché dans l'app |
| `root` | ✅ | Nœud racine de la mindmap |
| `root.label` | ✅ | Texte du nœud |
| `description` | — | Sous-titre sur la carte d'accueil |
| `color` | — | Couleur hexadécimale (`#RRGGBB`) |
| `explored` | — | `true` / `false` (défaut : `false`) |
| `summary` | — | Contenu Markdown du panneau latéral |
| `children` | — | Liste de nœuds enfants |

Le champ `summary` supporte tout le Markdown : titres, listes, tableaux, blocs de code avec syntaxe (` ```rust `, ` ```js `, ` ```python `...), liens.

## Raccourcis

| Action | Geste |
|--------|-------|
| Zoom | Molette / pinch |
| Pan | Clic-drag sur le fond |
| Ouvrir un nœud | Clic sur le nœud |
| Fermer le panneau | `✕` ou clic sur le fond |
| Marquer exploré | Bouton dans le panneau |

## Stack

- **Serveur** : Node.js + `js-yaml` + `chokidar`
- **Mindmap** : D3.js v7
- **Markdown** : marked.js + highlight.js
- **Frontend** : Vanilla JS, aucun framework

## Structure du projet

```
roadmap/
├── server.js           serveur HTTP + SSE
├── package.json
├── roadmaps/
│   └── rust.yaml       exemple fourni
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```
