---
id: buildkit
parent: dockerfile
label: BuildKit & BuildX
explored: false
order: 3
---

# BuildKit & BuildX

BuildKit est le backend de build de nouvelle génération de Docker (par défaut depuis Docker 23). Il apporte le build parallèle, le cache avancé, les secrets de build et le multi-platform.

## Activer BuildKit

```bash
# Docker 23+ — activé par défaut
# Pour les versions antérieures :
DOCKER_BUILDKIT=1 docker build .

# Ou dans /etc/docker/daemon.json
{ "features": { "buildkit": true } }
```

## Cache monté — ne pas recréer les caches à chaque build

```dockerfile
# --mount=type=cache — cache persistant entre les builds (non inclus dans l'image)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends curl

RUN --mount=type=cache,target=/go/pkg/mod \
    go build ./...
```

## Secrets de build — ne pas laisser de traces dans les couches

```dockerfile
# Monter un secret temporairement, il n'apparaît PAS dans les layers
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci

RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN=$(cat /run/secrets/github_token) \
    ./download-private-dependency.sh
```

```bash
# Passer le secret au build
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker build --secret id=github_token,env=GITHUB_TOKEN .
```

## SSH forwarding — accès aux repos privés pendant le build

```dockerfile
RUN --mount=type=ssh \
    git clone git@github.com:myorg/private-lib.git
```

```bash
eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519
docker build --ssh default .
```

## Multi-platform avec BuildX

```bash
# Créer un builder multi-platform
docker buildx create --name multiplatform --use
docker buildx inspect --bootstrap

# Builder pour plusieurs architectures
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t myrepo/my-app:latest \
  --push .      # push directement dans le registry

# Vérifier
docker buildx imagetools inspect myrepo/my-app:latest
```

## Bake — définir des builds complexes en fichier HCL

```hcl
# docker-bake.hcl
group "default" {
  targets = ["api", "worker"]
}

target "api" {
  context    = "."
  dockerfile = "Dockerfile"
  target     = "api"
  tags       = ["myrepo/api:latest", "myrepo/api:${VERSION}"]
  platforms  = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=registry,ref=myrepo/api:buildcache"]
  cache-to   = ["type=registry,ref=myrepo/api:buildcache,mode=max"]
}
```

```bash
docker buildx bake
docker buildx bake --set "*.platform=linux/amd64,linux/arm64"
```

## Liens

- [docs.docker.com — BuildKit](https://docs.docker.com/build/buildkit/)
- [docs.docker.com — Bake](https://docs.docker.com/build/bake/)
- [docs.docker.com — Multi-platform](https://docs.docker.com/build/building/multi-platform/)
