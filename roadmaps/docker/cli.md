---
id: cli
parent: fondamentaux
label: CLI essentielle
explored: true
order: 1
---

# CLI essentielle

La CLI Docker est l'interface principale. Toutes les commandes suivent le pattern `docker <objet> <action>` (nouvelle syntaxe) ou `docker <action>` (ancienne syntaxe, toujours valide).

## Gestion des conteneurs

```bash
# Lancer un conteneur
docker run nginx                              # en avant-plan
docker run -d nginx                           # détaché (daemon)
docker run -d -p 8080:80 --name web nginx     # avec port et nom
docker run -it ubuntu bash                    # interactif + terminal
docker run --rm alpine echo "hello"           # supprimé après exécution

# État des conteneurs
docker ps                    # conteneurs en cours
docker ps -a                 # tous (arrêtés inclus)
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Cycle de vie
docker stop web              # arrêt propre (SIGTERM, puis SIGKILL après 10s)
docker kill web              # arrêt immédiat (SIGKILL)
docker start web             # redémarrer un conteneur arrêté
docker restart web
docker pause web             # gèle le processus (SIGSTOP)
docker unpause web

# Supprimer
docker rm web                # supprimer un conteneur arrêté
docker rm -f web             # forcer (même si en cours)
docker container prune       # supprimer tous les arrêtés

# Inspecter et déboguer
docker logs web              # stdout/stderr
docker logs -f web           # follow (tail -f)
docker logs --tail 50 web    # 50 dernières lignes
docker exec -it web bash     # ouvrir un shell dans un conteneur en cours
docker exec web cat /etc/nginx/nginx.conf
docker inspect web           # JSON complet (IP, volumes, env…)
docker stats                 # CPU/RAM/réseau en temps réel
docker top web               # processus dans le conteneur
docker diff web              # fichiers modifiés depuis le démarrage
docker cp web:/etc/nginx/nginx.conf ./nginx.conf   # copier un fichier
```

## Gestion des images

```bash
docker images                          # lister
docker images --filter dangling=true   # images sans tag (<none>)
docker pull nginx:1.27-alpine          # télécharger
docker push myrepo/myimage:1.0         # publier
docker rmi nginx                       # supprimer
docker image prune                     # supprimer les dangling
docker image prune -a                  # supprimer toutes les non-utilisées
docker tag myimage myrepo/myimage:1.0  # tagger
docker save nginx | gzip > nginx.tar.gz          # exporter en fichier
docker load < nginx.tar.gz                        # importer
docker history nginx:alpine            # couches de l'image
docker inspect nginx:alpine            # JSON métadonnées
```

## Nettoyage global

```bash
docker system df             # espace utilisé par Docker
docker system prune          # supprime : conteneurs arrêtés + images dangling + réseaux non utilisés
docker system prune -a       # + images non utilisées par aucun conteneur
docker system prune -a --volumes  # + volumes non montés (ATTENTION : destructif)
```

## Liens

- [docs.docker.com — CLI reference](https://docs.docker.com/engine/reference/commandline/docker/)
- [docs.docker.com — docker run](https://docs.docker.com/engine/reference/run/)
