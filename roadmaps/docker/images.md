---
id: images
parent: fondamentaux
label: Images & Layers
explored: true
order: 2
---

# Images & Layers

Une image Docker est une **pile de couches (layers) immuables** empilées les unes sur les autres. Chaque instruction `RUN`, `COPY`, `ADD` dans un Dockerfile crée une nouvelle couche. Les couches sont partagées entre images, ce qui économise de l'espace disque et accélère les pull/push.

## Anatomie d'une image

```
┌─────────────────────────────┐  ← Couche conteneur (lecture/écriture)
├─────────────────────────────┤  ← COPY app/ /app  (lecture seule)
├─────────────────────────────┤  ← RUN npm install   (lecture seule)
├─────────────────────────────┤  ← WORKDIR /app      (lecture seule)
├─────────────────────────────┤  ← Image de base node:22-alpine
└─────────────────────────────┘
```

```bash
# Visualiser les couches et leur taille
docker history my-app:latest
docker history --no-trunc my-app:latest  # commandes complètes

# IMAGE          CREATED         CREATED BY                 SIZE
# a3f2...        2 min ago       COPY . /app                1.2MB
# b8d1...        2 min ago       RUN npm ci --omit=dev      45MB
# c9e4...        5 days ago      node:22-alpine             ...
```

## Images de base — choisir la bonne

| Image | Taille | Usage |
|-------|--------|-------|
| `ubuntu:24.04` | ~78 MB | Débogage, compatibilité maximale |
| `debian:bookworm-slim` | ~74 MB | Bon compromis |
| `alpine:3.20` | ~7 MB | Production légère (musl libc) |
| `distroless/static` | ~2 MB | Binaires statiques (Go, Rust) |
| `distroless/java21` | ~200 MB | Java — pas de shell en prod |
| `scratch` | 0 MB | Binaires auto-suffisants uniquement |

## Pull et cache de couches

```bash
# Docker réutilise les couches déjà présentes en local
docker pull node:22-alpine
# Layer 1/5: Pull complete     ← nouvelle couche
# Layer 2/5: Already exists    ← partagée avec une autre image

# Lister les images partagées
docker images --digests
```

## Inspecter le contenu d'une image

```bash
# Explorer le filesystem sans lancer le conteneur
docker run --rm -it nginx sh
docker run --rm alpine cat /etc/os-release

# Voir la config (CMD, ENV, EXPOSE, entrypoint…)
docker inspect nginx:alpine | jq '.[0].Config'

# Outil tiers — dive : UI pour explorer les couches
brew install dive
dive nginx:alpine
```

## Liens

- [docs.docker.com — Images](https://docs.docker.com/storage/storagedriver/)
- [GitHub — distroless](https://github.com/GoogleContainerTools/distroless)
- [dive — layer explorer](https://github.com/wagoodman/dive)
