---
id: ressources-limits
parent: production
label: Ressources & Limites
explored: false
order: 2
---

# Ressources & Limites

Docker utilise les **cgroups Linux** pour limiter la consommation CPU, mémoire et I/O d'un conteneur. Sans limites, un conteneur peut consommer toutes les ressources de l'hôte.

## Limites mémoire

```bash
# Mémoire RAM seulement
docker run --memory 512m my-app

# RAM + swap (swap = mémoire - memory)
docker run --memory 512m --memory-swap 512m my-app   # pas de swap
docker run --memory 512m --memory-swap 1g  my-app   # 512m de swap

# Swap illimité (déconseillé)
docker run --memory 512m --memory-swap -1 my-app

# Mémoire partagée (shm) — utile pour certaines applis (Redis, etc.)
docker run --shm-size 256m my-app

# Comportement si dépassement : le processus est tué (OOMKilled)
docker inspect my-app | jq '.[].State.OOMKilled'
```

## Limites CPU

```bash
# Nombre de CPUs (peut être décimal)
docker run --cpus 0.5 my-app    # 50% d'un CPU
docker run --cpus 2   my-app    # 2 CPUs max

# Affinité CPU — utiliser seulement les CPUs 0 et 1
docker run --cpuset-cpus "0,1" my-app

# Priorité relative (1 à 1024, défaut 1024)
docker run --cpu-shares 512 low-priority-job     # priorité réduite
docker run --cpu-shares 1024 high-priority-app   # priorité normale
```

## Limites I/O

```bash
# Limiter les opérations disque
docker run \
  --device-read-bps /dev/sda:10mb \    # max 10 MB/s en lecture
  --device-write-bps /dev/sda:5mb \    # max 5 MB/s en écriture
  --device-read-iops /dev/sda:100 \    # max 100 IOPS en lecture
  my-app
```

## Monitoring des ressources en temps réel

```bash
# Stats en temps réel
docker stats                   # tous les conteneurs
docker stats my-app            # un seul
docker stats --no-stream       # snapshot unique (bon pour scripts)
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Résultat :
# NAME     CPU %   MEM USAGE / LIMIT
# my-app   2.3%    128MiB / 512MiB
```

## Dans Compose

```yaml
services:
  api:
    image: my-api
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
          pids: 100         # limite le nombre de processus
        reservations:
          cpus: "0.25"      # garantit au minimum 0.25 CPU
          memory: 128M
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

## Liens

- [docs.docker.com — Resource constraints](https://docs.docker.com/config/containers/resource_constraints/)
- [docs.docker.com — Runtime metrics](https://docs.docker.com/config/containers/runmetrics/)
