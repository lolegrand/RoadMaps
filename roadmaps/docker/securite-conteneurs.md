---
id: securite-conteneurs
parent: securite
label: Sécuriser l'exécution
explored: false
order: 1
---

# Sécuriser l'exécution

Un conteneur Docker n'est pas une VM — il partage le noyau de l'hôte. Une mauvaise configuration peut permettre une évasion de conteneur. Voici comment durcir l'exécution.

## Ne jamais exécuter en root

```dockerfile
# Dockerfile — créer et utiliser un utilisateur non-root
FROM node:22-alpine
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
```

```bash
# Vérifier l'utilisateur actif dans un conteneur
docker exec my-container whoami   # doit afficher autre chose que root

# Forcer un UID non-root au runtime
docker run --user 1001:1001 my-image
```

## Capabilities Linux — réduire au strict minimum

```bash
# Supprimer TOUTES les capabilities et n'ajouter que celles nécessaires
docker run \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \   # si l'app doit écouter sur les ports < 1024
  my-app

# En Compose
services:
  api:
    cap_drop: [ALL]
    cap_add:  [NET_BIND_SERVICE]
```

## Filesystem en lecture seule

```bash
docker run \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \   # répertoire tmp writable en RAM
  --tmpfs /var/run:rw,noexec,nosuid \
  my-app
```

```yaml
# compose.yml
services:
  api:
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=100m
```

## Seccomp — restreindre les appels système

```bash
# Profil Docker par défaut bloque ~44 syscalls dangereux
# Utiliser un profil personnalisé encore plus restrictif
docker run --security-opt seccomp=./my-seccomp-profile.json my-app

# Ou le profil strict fourni par Docker
docker run --security-opt seccomp=default my-app

# Désactiver seccomp (déconseillé)
docker run --security-opt seccomp=unconfined my-app
```

## AppArmor / SELinux

```bash
# AppArmor (Ubuntu/Debian)
docker run --security-opt apparmor=docker-default my-app
docker run --security-opt apparmor=my-custom-profile my-app

# SELinux (RedHat/Fedora)
docker run --security-opt label=type:container_t my-app
```

## Empêcher l'escalade de privilèges

```bash
docker run --security-opt no-new-privileges:true my-app
```

```yaml
# compose.yml
services:
  api:
    security_opt:
      - no-new-privileges:true
      - seccomp:./seccomp-profile.json
```

## Configuration du daemon Docker

```json
// /etc/docker/daemon.json
{
  "userns-remap": "default",        // User namespace remapping
  "no-new-privileges": true,
  "seccomp-profile": "/etc/docker/seccomp.json",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## Liens

- [docs.docker.com — Seccomp](https://docs.docker.com/engine/security/seccomp/)
- [docs.docker.com — AppArmor](https://docs.docker.com/engine/security/apparmor/)
- [docs.docker.com — Rootless Docker](https://docs.docker.com/engine/security/rootless/)
