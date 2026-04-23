---
id: nodejs
parent: root
label: Node.js
explored: true
order: 2
---

# Node.js

Node.js est un runtime JavaScript côté serveur basé sur le moteur V8 de Chrome. Il utilise une architecture event-driven non-bloquante, idéale pour les I/O intensives (APIs, outils CLI, build tools).

## Architecture Node.js

```
Code JavaScript
      │
┌─────▼─────────────────────────────────────┐
│               Node.js Process              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  │
│  │  V8 JS  │  │  libuv   │  │ Node API │  │
│  │ Engine  │  │ (I/O     │  │ (fs, http│  │
│  │         │  │  async)  │  │ crypto…) │  │
│  └─────────┘  └──────────┘  └──────────┘  │
│           Event Loop (single thread)       │
│  ┌───────────────────────────────────────┐ │
│  │ Thread Pool (libuv) — 4 threads       │ │
│  │ → opérations bloquantes : fs, crypto  │ │
│  └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

## Gestion des versions — nvm / fnm

```bash
# fnm (Fast Node Manager) — recommandé
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 22       # LTS actuel
fnm install --lts    # dernière LTS
fnm use 22
fnm default 22

# .nvmrc / .node-version — version par projet
echo "22" > .nvmrc
fnm use              # lit automatiquement .nvmrc

# Versions LTS importantes
# Node 18 — support jusqu'à avril 2025
# Node 20 — LTS actuel, support jusqu'à avril 2026
# Node 22 — LTS depuis octobre 2024
```

## Liens

- [nodejs.org](https://nodejs.org/)
- [Node.js — Documentation](https://nodejs.org/en/docs/)
- [fnm — Fast Node Manager](https://github.com/Schniz/fnm)
