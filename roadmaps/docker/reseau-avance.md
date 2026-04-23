---
id: reseau-avance
parent: reseau
label: Réseau avancé
explored: false
order: 1
---

# Réseau avancé

Au-delà des basics, Docker offre un contrôle fin sur les ports, les alias réseau, et la communication entre réseaux.

## Publication de ports

```bash
# -p HOST:CONTAINER — binding de port
docker run -p 8080:80 nginx              # toutes interfaces hôte
docker run -p 127.0.0.1:8080:80 nginx   # localhost seulement (plus sûr)
docker run -p 0.0.0.0:8080:80 nginx     # explicitement toutes interfaces
docker run -p 8080:80/udp nginx         # UDP

# Voir les ports publiés
docker port my-container
# 80/tcp -> 0.0.0.0:8080
```

## Alias et connectivité avancée

```bash
# Un conteneur peut avoir plusieurs noms sur le même réseau
docker network connect --alias db --alias postgres my-network my-db-container

# Connecter un conteneur à plusieurs réseaux (isolation par segment)
docker network connect frontend-net nginx-proxy
docker network connect backend-net  nginx-proxy
# nginx-proxy peut joindre les deux segments, les conteneurs frontend et backend restent isolés entre eux
```

## Host networking — Linux uniquement

```bash
# Le conteneur partage pile réseau de l'hôte : localhost = hôte
docker run --network host my-app
# Avantage : performances maximales (0 overhead NAT)
# Inconvénient : pas d'isolation, impossible sur Docker Desktop Mac/Windows
```

## Communication inter-conteneurs — cas pratiques

```bash
# Scénario : API qui parle à une BDD et à Redis
docker network create backend

docker run -d \
  --name postgres \
  --network backend \
  -e POSTGRES_PASSWORD=secret \
  postgres:17-alpine

docker run -d \
  --name redis \
  --network backend \
  redis:7-alpine

docker run -d \
  --name api \
  --network backend \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:secret@postgres:5432/mydb \
  -e REDIS_URL=redis://redis:6379 \
  my-api
# "postgres" et "redis" sont résolus par le DNS Docker
```

## Inspecter le réseau

```bash
docker network inspect backend
# Affiche : sous-réseau, gateway, liste des conteneurs avec leur IP

# Depuis un conteneur — déboguer la résolution DNS
docker exec api nslookup postgres
docker exec api ping -c 3 redis
docker exec api wget -qO- http://postgres:5432  # tester la connectivité TCP
```

## Liens

- [docs.docker.com — Container networking](https://docs.docker.com/network/network-tutorial-standalone/)
- [docs.docker.com — Host networking](https://docs.docker.com/network/host/)
