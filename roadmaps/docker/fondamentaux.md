---
id: fondamentaux
parent: root
label: Fondamentaux
explored: true
order: 1
---

# Fondamentaux

Les fondamentaux Docker recouvrent l'architecture interne, l'installation et les commandes de base pour gérer images et conteneurs.

## Architecture Docker

```
┌─────────────────────────────────────────────┐
│               Docker CLI (client)            │
│          docker build / run / push…          │
└──────────────────────┬──────────────────────┘
                       │ REST API (Unix socket)
┌──────────────────────▼──────────────────────┐
│              Docker Daemon (dockerd)         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Images  │  │ Conteneurs│  │  Réseaux  │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│  ┌──────────┐  ┌──────────────────────────┐  │
│  │ Volumes  │  │  containerd  (runtime)    │  │
│  └──────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Liens

- [docs.docker.com — Get started](https://docs.docker.com/get-started/)
- [docs.docker.com — Architecture](https://docs.docker.com/get-started/overview/)
