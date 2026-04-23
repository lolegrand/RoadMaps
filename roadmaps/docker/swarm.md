---
id: swarm
parent: ecosysteme
label: Docker Swarm
explored: false
order: 1
---

# Docker Swarm

Docker Swarm est l'orchestrateur natif de Docker pour déployer des conteneurs sur un cluster de machines. Moins populaire que Kubernetes mais beaucoup plus simple à opérer.

## Initialiser un cluster Swarm

```bash
# Sur le nœud manager
docker swarm init --advertise-addr 192.168.1.10
# → Affiche un token pour rejoindre le cluster

# Sur les nœuds workers
docker swarm join --token SWMTKN-1-... 192.168.1.10:2377

# Gérer les nœuds
docker node ls
docker node inspect node-01
docker node update --availability drain node-01   # vider un nœud (maintenance)
docker node promote node-02                        # promouvoir en manager
```

## Services — la brique de base Swarm

```bash
# Créer un service (l'équivalent Swarm de docker run)
docker service create \
  --name api \
  --replicas 3 \
  --publish published=80,target=3000 \
  --network app-network \
  --update-parallelism 1 \
  --update-delay 10s \
  my-app:latest

# Scaler
docker service scale api=5

# Mise à jour rolling (zero-downtime)
docker service update \
  --image my-app:v2.0.0 \
  --update-parallelism 1 \
  --update-delay 10s \
  --rollback-on-failure \
  api

# Rollback
docker service rollback api

# Inspecter
docker service ls
docker service ps api      # état de chaque réplique
docker service logs api -f
```

## Stack — Compose pour Swarm

```yaml
# compose.swarm.yml
version: "3.9"
services:
  api:
    image: my-app:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first    # démarrer le nouveau avant d'arrêter l'ancien
      rollback_config:
        parallelism: 1
      restart_policy:
        condition: on-failure
        max_attempts: 3
      placement:
        constraints:
          - node.role == worker
          - node.labels.env == production
    networks:
      - app-network
    secrets:
      - db_password

secrets:
  db_password:
    external: true    # docker secret create db_password ./secret.txt

networks:
  app-network:
    driver: overlay
    attachable: true
```

```bash
docker stack deploy -c compose.swarm.yml my-stack
docker stack ls
docker stack ps my-stack
docker stack rm my-stack
```

## Liens

- [docs.docker.com — Swarm](https://docs.docker.com/engine/swarm/)
- [docs.docker.com — Swarm secrets](https://docs.docker.com/engine/swarm/secrets/)
