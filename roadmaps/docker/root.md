---
id: root
label: Docker
explored: true
order: 0
---

# Docker

Docker est une plateforme de **conteneurisation** qui package une application et toutes ses dépendances dans une unité isolée appelée **conteneur**. Les conteneurs partagent le noyau de l'OS hôte — ils sont plus légers et démarrent en millisecondes contrairement aux VMs.

## VM vs Conteneur

```
Machine virtuelle             Conteneur Docker
┌─────────────────┐           ┌─────────────────┐
│   Application   │           │   Application   │
│   Librairies    │           │   Librairies    │
│   OS Invité     │           ├─────────────────┤
│   (2–20 GB)     │           │  Docker Engine  │  ← partage le kernel hôte
├─────────────────┤           ├─────────────────┤
│  Hyperviseur    │           │    OS Hôte      │
│    OS Hôte      │           └─────────────────┘
└─────────────────┘
Démarrage : 30–60s            Démarrage : < 1s
Taille : GB                   Taille : MB
```

## Concepts clés

| Concept | Définition |
|---------|-----------|
| **Image** | Template immuable (snapshot du filesystem + métadonnées) |
| **Conteneur** | Instance en cours d'exécution d'une image |
| **Dockerfile** | Script de construction d'une image |
| **Registry** | Dépôt d'images (Docker Hub, GHCR, ECR…) |
| **Volume** | Stockage persistant monté dans un conteneur |
| **Réseau** | Communication entre conteneurs |
| **Compose** | Orchestration multi-conteneurs en local |

## Flux de travail typique

```
Dockerfile
    │ docker build
    ▼
  Image  ──docker push──▶  Registry
    │ docker run               │ docker pull
    ▼                          ▼
Conteneur              Conteneur en prod
```

## Liens

- [docs.docker.com](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)
- [Docker GitHub](https://github.com/docker)
