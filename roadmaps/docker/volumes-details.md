---
id: volumes-details
parent: volumes
label: Volumes nommés & Bind mounts
explored: false
order: 1
---

# Volumes nommés & Bind mounts

## Volumes nommés — recommandés pour la production

```bash
# Créer et gérer des volumes
docker volume create mydata
docker volume ls
docker volume inspect mydata
# → Mountpoint: /var/lib/docker/volumes/mydata/_data
docker volume rm mydata
docker volume prune           # supprimer les non montés

# Monter dans un conteneur
docker run -d \
  --name postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:17-alpine

# Partager un volume entre plusieurs conteneurs
docker run -d --name app1 -v shared-data:/data my-app
docker run -d --name app2 -v shared-data:/data my-app  # lecture seule :ro
docker run -d --name app3 -v shared-data:/data:ro my-app
```

## Options de montage

```bash
# Syntaxe longue --mount (préférée pour sa clarté)
docker run -d \
  --mount type=volume,source=postgres-data,target=/var/lib/postgresql/data \
  postgres:17-alpine

# Read-only
docker run --mount type=volume,source=config,target=/etc/config,readonly my-app

# Volume avec options de driver (NFS, etc.)
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.100,rw \
  --opt device=:/exports/data \
  nfs-data
```

## Bind mounts — idéaux pour le développement

```bash
# Monter le code source local dans le conteneur
docker run -d \
  --name dev-app \
  -v $(pwd):/app \           # code source monté en live
  -v /app/node_modules \     # volume anonyme pour éviter d'écraser node_modules
  -p 3000:3000 \
  my-app:dev

# Syntaxe --mount pour les bind mounts
docker run --mount type=bind,source=$(pwd)/config,target=/etc/app/config,readonly my-app
```

## Backup et restauration

```bash
# Sauvegarder un volume vers une archive tar
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restaurer depuis une archive
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /data

# Copier des données entre volumes via un conteneur temporaire
docker run --rm \
  -v source-volume:/from \
  -v dest-volume:/to \
  alpine cp -r /from/. /to/
```

## tmpfs — données temporaires en RAM

```bash
# Fichiers temporaires sensibles — jamais écrits sur le disque
docker run \
  --mount type=tmpfs,target=/tmp,tmpfs-size=100m,tmpfs-mode=1777 \
  my-app

# Ou
docker run --tmpfs /tmp:rw,size=100m my-app
```

## Liens

- [docs.docker.com — Volumes](https://docs.docker.com/storage/volumes/)
- [docs.docker.com — Bind mounts](https://docs.docker.com/storage/bind-mounts/)
- [docs.docker.com — tmpfs](https://docs.docker.com/storage/tmpfs/)
