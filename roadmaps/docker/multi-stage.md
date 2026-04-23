---
id: multi-stage
parent: dockerfile
label: Multi-stage builds
explored: false
order: 1
---

# Multi-stage builds

Les builds multi-stages permettent d'utiliser plusieurs `FROM` dans un même Dockerfile. Le résultat final ne contient que ce qui est copié dans la dernière étape — les outils de build (compilateurs, npm, SDK) n'atterrissent pas en production.

## Exemple Node.js — builder vs runtime

```dockerfile
# ── Étape 1 : build ───────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                         # installe aussi les devDependencies
COPY . .
RUN npm run build                  # compile TypeScript, bundle, etc.
RUN npm prune --omit=dev           # supprime les devDependencies

# ── Étape 2 : runtime ─────────────────────────────────────────
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copier UNIQUEMENT le nécessaire depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

```bash
# Résultat
docker build -t my-app .
docker images my-app
# my-app    latest    a3f2...    142 MB   ← sans les outils de build (700+ MB)
```

## Exemple Java Spring Boot — layers

```dockerfile
FROM eclipse-temurin:21-jre AS builder
WORKDIR /app
COPY target/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

FROM eclipse-temurin:21-jre
WORKDIR /app
# Couches séparées → Docker cache les dépendances, re-copie seulement l'app
COPY --from=builder /app/extracted/dependencies/          ./
COPY --from=builder /app/extracted/spring-boot-loader/    ./
COPY --from=builder /app/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/extracted/application/           ./
USER 1001
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

## Exemple Go — binaire statique dans scratch

```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app ./cmd/server

# Image finale = 0 MB de base + le binaire seulement
FROM scratch
COPY --from=builder /app /app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
ENTRYPOINT ["/app"]
# Taille totale : ~10 MB
```

## Builder une étape spécifique

```bash
# Builder uniquement l'étape "builder" (utile pour les tests en CI)
docker build --target builder -t my-app:builder .

# Réutiliser une image externe comme étape
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=node:22-alpine /usr/local/bin/node /usr/local/bin/node
```

## Liens

- [docs.docker.com — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [docs.docker.com — BuildKit](https://docs.docker.com/build/buildkit/)
