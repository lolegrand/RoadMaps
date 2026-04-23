---
id: devtools
parent: debogage
label: DevTools Navigateur
explored: false
order: 1
---

# DevTools Navigateur

Les Chrome DevTools (aussi disponibles dans Firefox et Edge) sont l'outil de débogage le plus utilisé pour le frontend. Maîtriser les onglets Elements, Console, Sources, Network et Performance est indispensable.

## Console — bien plus que console.log

```javascript
// Niveaux de log
console.log('Info normale');
console.info('Information');
console.warn('Avertissement');           // fond jaune dans la console
console.error('Erreur', new Error());    // stack trace complète

// Formatage
console.log('User: %o', userObject);     // %o = objet interactif
console.log('%cStyled!', 'color:red; font-size:20px; font-weight:bold');

// Groupement
console.group('Auth flow');
console.log('Token request sent');
console.log('Token received');
console.groupEnd();

// Table — pour les tableaux d'objets
console.table(users, ['id', 'name', 'email']);  // colonnes filtrées

// Mesurer le temps
console.time('fetch-users');
await fetchUsers();
console.timeEnd('fetch-users');    // → fetch-users: 234ms

// Compteur
users.forEach(u => console.count('user processed'));
console.countReset('user processed');

// Assertion — log seulement si faux
console.assert(response.ok, 'API call failed:', response.status);

// Stack trace
console.trace('Comment suis-je appelé ?');
```

## Breakpoints — stopper l'exécution

```javascript
// Breakpoint programmatique — s'arrête si DevTools est ouvert
debugger;

// Conditionnel
if (user.id === 42) debugger;  // ou via l'interface : clic droit → Add conditional breakpoint

// DOM change breakpoint
// Onglet Elements → clic droit sur un élément → Break on → subtree modifications
// Utile pour trouver quel JS modifie le DOM

// XHR/Fetch breakpoint
// Onglet Sources → XHR/fetch Breakpoints → + → ajouter une URL
// S'arrête sur chaque appel réseau contenant ce pattern d'URL

// Event listener breakpoint
// Onglet Sources → Event Listener Breakpoints → Mouse → click
```

## Onglet Network — analyser les requêtes

```
Filtres    : XHR/Fetch, JS, CSS, Img, Doc, WS, Wasm
Colonnes   : Name, Status, Type, Size, Time, Waterfall

Astuces :
- Clic sur une requête → Preview (JSON formaté), Headers, Timing
- Throttling → simuler une connexion 3G/4G
- "Preserve log" → ne pas vider au rechargement
- "Disable cache" → forcer le rechargement des ressources
- Clic droit sur une requête → Copy → Copy as cURL (reproduire hors navigateur)
- Onglet Timing → DNS + TCP + TLS + TTFB + Download
```

## Onglet Performance — profiler le rendu

```
1. Ouvrir l'onglet Performance
2. Cliquer "Record" (Ctrl+E)
3. Interagir avec la page
4. Stop

Lire le résultat :
- Flame chart (Call Tree) — quelle fonction prend du temps
- Long Tasks (rouge) — tâches > 50ms qui bloquent le main thread
- Layout shifts (bleu) — recalculs de mise en page
- FPS graph — chutes d'images

Astuces :
- "CPU: 4× slowdown" → simuler un mobile bas de gamme
- Filtrer par nom de fonction dans le call tree
```

## Live expressions & modifications

```javascript
// Live expressions — surveiller une valeur en temps réel
// Console → 👁️ (Create live expression) → taper : window.scrollY

// Modifier le CSS en live
// Elements → Styles → cliquer sur une propriété → modifier

// Modifier le JS en live (local override)
// Sources → Overrides → ajouter un dossier local
// Modifier le fichier → rechargements utiliseront votre version locale
```

## Onglet Application — storage & workers

```
Local Storage / Session Storage → lire, modifier, supprimer
IndexedDB → parcourir les données
Cookies → inspecter, modifier, supprimer
Cache Storage → voir ce qui est en cache (Service Workers)
Service Workers → status, update, bypass
```

## Liens

- [Chrome DevTools — Documentation](https://developer.chrome.com/docs/devtools/)
- [Firefox DevTools](https://firefox-source-docs.mozilla.org/devtools-user/)
- [web.dev — Performance profiling](https://web.dev/articles/rail)
