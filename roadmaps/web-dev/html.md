---
id: html
parent: fondamentaux
label: HTML Sémantique
explored: true
order: 1
---

# HTML Sémantique

L'HTML sémantique utilise les balises selon leur sens, pas leur apparence. Le bon élément au bon endroit améliore l'accessibilité (lecteurs d'écran), le SEO, et la maintenabilité.

## Structure de page moderne

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Description pour les moteurs de recherche, 150 car max" />
  <title>Titre de la page — Nom du site</title>
  <link rel="canonical" href="https://example.com/page" />
  <!-- Preload des ressources critiques -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header>
    <nav aria-label="Navigation principale">
      <ul>
        <li><a href="/" aria-current="page">Accueil</a></li>
        <li><a href="/produits">Produits</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Titre de l'article</h1>
        <time datetime="2024-03-15">15 mars 2024</time>
      </header>
      <p>Contenu…</p>
      <section aria-labelledby="comments-title">
        <h2 id="comments-title">Commentaires</h2>
      </section>
    </article>

    <aside aria-label="Articles similaires">
      <!-- Contenu secondaire -->
    </aside>
  </main>

  <footer>
    <address>
      <a href="mailto:contact@example.com">contact@example.com</a>
    </address>
  </footer>
</body>
</html>
```

## Éléments sémantiques clés

```html
<!-- Contenu interactif -->
<details>
  <summary>Voir les détails</summary>
  <p>Contenu caché par défaut, révélé au clic.</p>
</details>

<dialog id="modal">
  <form method="dialog">
    <p>Êtes-vous sûr ?</p>
    <button value="cancel">Annuler</button>
    <button value="confirm">Confirmer</button>
  </form>
</dialog>
<button onclick="document.getElementById('modal').showModal()">Ouvrir</button>

<!-- Données structurées -->
<figure>
  <img src="chart.png" alt="Ventes T4 2024 : +23% vs T4 2023" />
  <figcaption>Fig. 1 — Croissance des ventes au T4 2024</figcaption>
</figure>

<!-- Listes de définitions -->
<dl>
  <dt>API REST</dt>
  <dd>Interface de programmation suivant les contraintes REST.</dd>
</dl>
```

## Accessibilité (a11y) — ARIA

```html
<!-- ARIA uniquement quand pas d'élément natif équivalent -->
<div role="alert" aria-live="polite">Formulaire soumis avec succès</div>

<!-- Bouton avec icône — label explicite pour les lecteurs d'écran -->
<button aria-label="Fermer la modal">
  <svg aria-hidden="true"><use href="#icon-x" /></svg>
</button>

<!-- Formulaires accessibles -->
<label for="email">Adresse email <span aria-hidden="true">*</span></label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-hint email-error"
/>
<p id="email-hint">Format : nom@domaine.fr</p>
<p id="email-error" role="alert" aria-atomic="true"></p>
```

## Open Graph & données structurées

```html
<!-- Open Graph — aperçu lors d'un partage social -->
<meta property="og:title"       content="Titre de la page" />
<meta property="og:description" content="Description courte" />
<meta property="og:image"       content="https://example.com/og.jpg" />
<meta property="og:type"        content="article" />

<!-- JSON-LD — données structurées pour Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Titre",
  "author": { "@type": "Person", "name": "Alice" },
  "datePublished": "2024-03-15"
}
</script>
```

## Liens

- [MDN — HTML elements reference](https://developer.mozilla.org/fr/docs/Web/HTML/Element)
- [web.dev — Learn HTML](https://web.dev/learn/html/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Google — Données structurées](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
