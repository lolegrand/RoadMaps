---
id: compose
parent: root
label: Docker Compose
explored: false
order: 5
---

# Docker Compose

Docker Compose orchestre plusieurs conteneurs via un fichier YAML déclaratif. Il gère les dépendances, les réseaux et les volumes entre services. `docker compose` (v2, intégré à Docker CLI) remplace `docker-compose` (v1, Python, déprécié).

## Commandes essentielles

```bash
docker compose up              # démarrer tous les services (au premier plan)
docker compose up -d           # en arrière-plan
docker compose up --build      # rebuild les images avant de démarrer
docker compose up api          # démarrer seulement le service "api"

docker compose down            # arrêter et supprimer les conteneurs + réseaux
docker compose down -v         # + supprimer les volumes (⚠️ destructif)
docker compose down --rmi all  # + supprimer les images

docker compose ps              # état des services
docker compose logs -f         # logs de tous les services
docker compose logs -f api     # logs d'un service
docker compose exec api bash   # ouvrir un shell dans un service en cours
docker compose run api npm test  # lancer une commande one-shot

docker compose build           # rebuild les images
docker compose pull            # mettre à jour les images
docker compose restart api     # redémarrer un service
docker compose scale worker=3  # scaler un service (sans Swarm)

docker compose config          # valider et afficher la config résolue
docker compose top             # processus dans les conteneurs
```

## Liens

- [docs.docker.com — Compose](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/compose/compose-file/)
