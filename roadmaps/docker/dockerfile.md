---
id: dockerfile
parent: root
label: Dockerfile
explored: true
order: 2
---

# Dockerfile

Un Dockerfile est un script texte qui décrit comment construire une image Docker, couche par couche. Chaque instruction crée une couche, mise en cache entre les builds.

## Instructions principales

```dockerfile
# Commentaire

# Image de base — toujours la première instruction
FROM node:22-alpine AS base

# Métadonnées OCI standard
LABEL org.opencontainers.image.source="https://github.com/myorg/myapp"
LABEL org.opencontainers.image.version="1.0.0"

# Variables de build (passées avec --build-arg)
ARG NODE_ENV=production
ARG APP_PORT=3000

# Variables d'environnement dans le conteneur
ENV NODE_ENV=${NODE_ENV} \
    PORT=${APP_PORT}

# Répertoire de travail (créé automatiquement)
WORKDIR /app

# Copier des fichiers (COPY src dest)
COPY package*.json ./           # copier d'abord pour profiter du cache
COPY --chown=node:node . .      # changer le propriétaire

# Exécuter des commandes pendant le build
RUN npm ci --omit=dev && \
    npm cache clean --force

# Port exposé (documentation, pas de binding automatique)
EXPOSE 3000

# Healthcheck intégré
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Utilisateur pour l'exécution (non-root !)
USER node

# Point d'entrée — ne peut pas être surchargé facilement
ENTRYPOINT ["node"]

# Commande par défaut — peut être surchargée avec docker run
CMD ["server.js"]
```

## ENTRYPOINT vs CMD

```dockerfile
# CMD seul — toute la commande, facilement surchargeable
CMD ["node", "server.js"]
# docker run myapp python script.py  → lance python à la place

# ENTRYPOINT + CMD — le binaire est fixé, les args sont flexibles
ENTRYPOINT ["node"]
CMD ["server.js"]
# docker run myapp other.js  → lance "node other.js"

# Forme shell vs exec
RUN apt-get install nginx          # shell form — /bin/sh -c "..."
RUN ["apt-get", "install", "nginx"] # exec form — pas de shell, signals corrects
```

## Liens

- [docs.docker.com — Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [docs.docker.com — Best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
