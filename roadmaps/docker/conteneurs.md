---
id: conteneurs
parent: fondamentaux
label: Conteneurs
explored: true
order: 3
---

# Conteneurs

Un conteneur est une **instance en cours d'exécution** d'une image. Il ajoute une couche en écriture (copy-on-write) par-dessus les couches immuables de l'image et partage le noyau de l'hôte via des namespaces Linux.

## Isolation par namespaces Linux

```
Conteneur A                  Conteneur B
├── PID namespace            ├── PID namespace
│   pid 1 = mon processus   │   pid 1 = mon processus
├── NET namespace            ├── NET namespace
│   eth0: 172.17.0.2         │   eth0: 172.17.0.3
├── MNT namespace            ├── MNT namespace
│   / = son filesystem       │   / = son filesystem
├── UTS namespace            ├── UTS namespace
│   hostname = container-a   │   hostname = container-b
└── USER namespace           └── USER namespace
    uid 0 = root (dans conteneur)
```

## Options `docker run` essentielles

```bash
# Variables d'environnement
docker run -e NODE_ENV=production -e PORT=3000 my-app
docker run --env-file .env my-app

# Ports : -p HOST_PORT:CONTAINER_PORT
docker run -p 8080:80 nginx           # localhost:8080 → conteneur:80
docker run -p 127.0.0.1:8080:80 nginx # lié uniquement à localhost
docker run -P nginx                   # mappe tous les EXPOSE sur ports aléatoires

# Ressources (cgroups)
docker run --memory 512m --memory-swap 512m my-app   # RAM max 512 MB
docker run --cpus 1.5 my-app          # max 1.5 CPU
docker run --pids-limit 100 my-app    # max 100 processus

# Politique de redémarrage
docker run --restart always my-app         # toujours redémarrer
docker run --restart unless-stopped my-app # sauf si stoppé manuellement
docker run --restart on-failure:5 my-app   # max 5 tentatives en cas d'échec

# Réseau
docker run --network my-network my-app
docker run --network host my-app       # partage le réseau de l'hôte

# Identité
docker run --user 1000:1000 my-app    # UID:GID explicite (non-root)
docker run --read-only my-app         # filesystem en lecture seule
docker run --cap-drop ALL my-app      # supprimer toutes les capabilities Linux

# Nom et hostname
docker run --name api --hostname api my-app
```

## États d'un conteneur

```
           docker create
               │
               ▼
           Created ──docker start──▶ Running
                                        │
                               docker stop/kill
                                        │
                                        ▼
                                    Stopped ──docker start──▶ Running
                                        │
                                   docker rm
                                        │
                                        ▼
                                    (supprimé)
```

## Liens

- [docs.docker.com — Containers](https://docs.docker.com/get-started/02_our_app/)
- [Linux namespaces — man page](https://man7.org/linux/man-pages/man7/namespaces.7.html)
