---
id: javascript
parent: fondamentaux
label: JavaScript Core
explored: true
order: 3
---

# JavaScript Core

JavaScript est le seul langage de programmation natif des navigateurs. Maîtriser ses fondamentaux — closures, prototypes, event loop, async — est indispensable avant tout framework.

## L'event loop — comprendre l'asynchronisme JS

```
┌─────────────────────────────────────────────────────┐
│  Call Stack          │  Web APIs / Node APIs         │
│  ┌──────────────┐   │  setTimeout, fetch, fs.read…  │
│  │ console.log  │   │              │                 │
│  │ main()       │   │              ▼                 │
│  └──────────────┘   │  ┌─────────────────────────┐  │
│                      │  │  Callback / Task Queue  │  │
│  ┌──────────────┐   │  │  (macrotasks)            │  │
│  │  Event Loop  │◀──┼──│  setTimeout cb, I/O cb  │  │
│  └──────────────┘   │  └─────────────────────────┘  │
│                      │  ┌─────────────────────────┐  │
│                      │  │  Microtask Queue         │  │
│                      │  │  Promise.then, queueMicrotask │
│                      │  └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

```javascript
console.log('1');                          // call stack
setTimeout(() => console.log('4'), 0);    // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');                          // call stack
// Sortie : 1, 2, 3, 4
```

## Closures & scope

```javascript
// Une closure capture les variables de son scope parent
function makeCounter(start = 0) {
  let count = start;  // variable privée
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.value();     // 12
```

## Prototypes & héritage

```javascript
// Sous le capot des classes ES6
class Animal {
  #name;   // propriété privée (ES2022)
  constructor(name) { this.#name = name; }
  speak() { return `${this.#name} fait un bruit.`; }
  get name() { return this.#name; }
}

class Dog extends Animal {
  #breed;
  constructor(name, breed) {
    super(name);
    this.#breed = breed;
  }
  speak() { return `${this.name} aboie !`; }
  toString() { return `Dog(${this.name}, ${this.#breed})`; }
}
```

## Async / Await & gestion d'erreurs

```javascript
// async/await — sucre syntaxique sur les Promises
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Traitement parallèle
async function loadDashboard(userId) {
  // ❌ Séquentiel — 3 appels l'un après l'autre
  const user    = await fetchUser(userId);
  const orders  = await fetchOrders(userId);

  // ✅ Parallèle — 3 appels simultanés
  const [user2, orders2, prefs] = await Promise.all([
    fetchUser(userId),
    fetchOrders(userId),
    fetchPreferences(userId),
  ]);

  // Premier qui résout — utile pour les timeouts
  const data = await Promise.race([
    fetchUser(userId),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
  ]);
}

// Gestion d'erreurs propre avec AbortController
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Requête annulée (timeout)');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

## Manipulation du DOM

```javascript
// Sélection
const btn = document.querySelector('#submit-btn');
const items = document.querySelectorAll('.list-item');  // NodeList

// Modifier
btn.textContent = 'Chargement…';
btn.classList.add('loading');
btn.setAttribute('aria-busy', 'true');
btn.disabled = true;

// Créer et insérer
const li = document.createElement('li');
li.textContent = 'Nouvel élément';
li.dataset.id = '42';
document.querySelector('ul').append(li);

// Événements
btn.addEventListener('click', handleClick, { once: true });

// Délégation — un seul listener pour tous les enfants
document.querySelector('ul').addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]');
  if (item) deleteItem(item.dataset.id);
});

// Observer les changements DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => console.log('DOM changed:', m));
});
observer.observe(document.body, { childList: true, subtree: true });
observer.disconnect();
```

## Patterns modernes ES2020+

```javascript
// Optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Ville inconnue';
user?.notify?.();   // appel optionnel

// Destructuring avancé
const { name, address: { city = 'Paris', ...restAddress } = {} } = user;
const [first, , third, ...rest] = array;

// Spread / Object merging
const updated = { ...original, ...patch, updatedAt: Date.now() };

// Object.groupBy (ES2024)
const byStatus = Object.groupBy(orders, order => order.status);
// { pending: [...], shipped: [...], delivered: [...] }

// Array methods
const activeUsers = users
  .filter(u => u.active)
  .map(u => ({ id: u.id, name: u.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

// WeakRef & FinalizationRegistry — gestion mémoire avancée
const ref = new WeakRef(largeObject);
ref.deref()?.doSomething();   // null si GC a collecté l'objet
```

## Liens

- [MDN — JavaScript Guide](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide)
- [javascript.info](https://fr.javascript.info/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
- [MDN — Event Loop](https://developer.mozilla.org/fr/docs/Web/JavaScript/Event_loop)
