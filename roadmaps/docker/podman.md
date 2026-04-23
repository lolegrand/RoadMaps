---
id: podman
parent: ecosysteme
label: Podman & alternatives
explored: false
order: 3
---

# Podman & alternatives

Podman est l'alternative open-source à Docker développée par Red Hat. Ses différences principales : **pas de daemon** (rootless natif), **compatible OCI**, et une CLI quasi-identique à Docker.

## Docker vs Podman

| | Docker | Podman |
|---|---|---|
| Architecture | Daemon central (dockerd) | Sans daemon (fork/exec) |
| Rootless | Optionnel (Docker rootless) | Par défaut |
| Compatibilité | Standard de facto | Compatible OCI + CLI Docker |
| Compose | Docker Compose | Podman Compose / podman-compose |
| Pods | Non | Oui (groupe de conteneurs) |
| Systemd | Manuel | Génération automatique d'unités |
| Plateforme | Linux/Mac/Windows | Linux natif, Mac via VM |

## Utiliser Podman

```bash
# Installer
brew install podman          # macOS
sudo dnf install podman      # Fedora/RHEL

# Initialiser la VM (macOS)
podman machine init
podman machine start

# CLI quasi-identique à Docker
podman pull nginx:alpine
podman run -d -p 8080:80 --name web nginx:alpine
podman ps
podman logs web
podman exec -it web sh
podman stop web && podman rm web

# Alias Docker → Podman (compatibilité totale)
alias docker=podman
```

## Pods — groupes de conteneurs

```bash
# Un pod = plusieurs conteneurs partageant le même réseau et namespaces
podman pod create --name my-pod -p 8080:80

podman run -d --pod my-pod --name nginx nginx:alpine
podman run -d --pod my-pod --name sidecar my-sidecar

podman pod ps
podman pod stop my-pod
podman pod rm my-pod
```

## Générer des unités systemd

```bash
# Générer un service systemd pour un conteneur
podman generate systemd --new --name web > ~/.config/systemd/user/web.service
systemctl --user enable --now web

# Générer pour un pod entier
podman generate systemd --new --files --name my-pod
```

## Buildah — build d'images sans daemon

```bash
brew install buildah

# Construire depuis un Dockerfile
buildah build -t my-app:latest .

# Construire programmatiquement (sans Dockerfile)
ctr=$(buildah from alpine:3.20)
buildah run $ctr apk add --no-cache nodejs
buildah copy $ctr ./app /app
buildah config --cmd "node /app/server.js" $ctr
buildah commit $ctr my-app:latest
buildah push my-app:latest docker://myrepo/my-app:latest
```

## Liens

- [podman.io](https://podman.io/)
- [buildah.io](https://buildah.io/)
- [podman-compose](https://github.com/containers/podman-compose)
- [docs.docker.com — Rootless Docker](https://docs.docker.com/engine/security/rootless/)
