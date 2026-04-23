---
id: dockerfile-best-practices
parent: dockerfile
label: Bonnes pratiques Dockerfile
explored: false
order: 2
---

# Bonnes pratiques Dockerfile

Un bon Dockerfile produit une image **petite**, **sécurisée**, avec un **cache efficace** et un **build reproductible**.

## 1. Ordonner les instructions pour maximiser le cache

```dockerfile
# ❌ Mauvais — copier tout invalide le cache à chaque changement de code
COPY . .
RUN npm install

# ✅ Bien — les dépendances sont cachées si package.json n'a pas changé
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
```

## 2. Minimiser le nombre de couches et la taille

```dockerfile
# ❌ 3 couches inutiles
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# ✅ 1 seule couche, propre
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
```

## 3. Utiliser .dockerignore

```dockerignore
# .dockerignore
.git
.gitignore
node_modules
dist
*.log
*.md
.env
.env.*
coverage/
.DS_Store
Dockerfile*
docker-compose*
```

## 4. Ne jamais exécuter en root

```dockerfile
# Créer un utilisateur dédié
RUN addgroup --system --gid 1001 appgroup && \
    adduser  --system --uid 1001 --ingroup appgroup appuser

WORKDIR /app
COPY --chown=appuser:appgroup . .

USER appuser   # à placer juste avant CMD/ENTRYPOINT
```

## 5. Fixer les versions précisément

```dockerfile
# ❌ Non reproductible — "latest" change sans prévenir
FROM node:latest
RUN apt-get install -y curl

# ✅ Reproductible
FROM node:22.11.0-alpine3.20
RUN apt-get install -y --no-install-recommends curl=8.7.1-2
```

## 6. Utiliser les images distroless en production

```dockerfile
# Runtime sans shell, sans package manager, sans outils inutiles
FROM gcr.io/distroless/nodejs22-debian12
COPY --from=builder /app /app
CMD ["/app/server.js"]
```

## 7. HEALTHCHECK systématique

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## 8. Variables de build vs runtime

```dockerfile
# ARG — uniquement pendant le build (ne persiste pas dans le conteneur)
ARG COMMIT_SHA=unknown
LABEL git.sha=${COMMIT_SHA}

# ENV — disponible dans le conteneur au runtime
ENV NODE_ENV=production
# ⚠️ Ne jamais mettre de secrets dans ENV ou ARG — ils apparaissent dans docker inspect
```

## 9. Vérification d'intégrité des dépendances

```dockerfile
# Vérifier le checksum d'un binaire téléchargé
RUN curl -fsSL https://example.com/tool.tar.gz -o tool.tar.gz && \
    echo "abc123def456  tool.tar.gz" | sha256sum -c - && \
    tar xzf tool.tar.gz && \
    rm tool.tar.gz
```

## Liens

- [docs.docker.com — Best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [docs.docker.com — .dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
- [Google — distroless](https://github.com/GoogleContainerTools/distroless)
