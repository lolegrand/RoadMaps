---
id: reseau
parent: root
label: Réseau
explored: false
order: 3
---

# Réseau

Docker crée un réseau virtuel entre les conteneurs. Chaque réseau est un espace d'adressage isolé ; les conteneurs sur le même réseau se voient par leur **nom** (DNS interne automatique).

## Drivers réseau

| Driver | Description | Cas d'usage |
|--------|-------------|-------------|
| `bridge` | Réseau privé NAT sur l'hôte (défaut) | Dev, Compose |
| `host` | Partage le réseau de l'hôte | Performance max, Linux only |
| `none` | Pas de réseau | Isolation totale |
| `overlay` | Réseau multi-hôtes chiffré | Docker Swarm |
| `macvlan` | Adresse MAC propre, visible sur le LAN | Intégration réseau physique |

```bash
# Gérer les réseaux
docker network ls
docker network create my-network                          # bridge par défaut
docker network create --driver bridge --subnet 172.20.0.0/16 my-network
docker network inspect my-network
docker network connect    my-network my-container         # attacher
docker network disconnect my-network my-container         # détacher
docker network rm my-network
docker network prune                                      # supprimer les non utilisés
```

## DNS interne — les conteneurs se trouvent par nom

```bash
# Créer un réseau custom (le réseau "bridge" par défaut n'a PAS le DNS automatique)
docker network create app-network

# Lancer deux conteneurs sur ce réseau
docker run -d --name db      --network app-network postgres:17
docker run -d --name api     --network app-network -e DB_HOST=db my-api

# L'API peut joindre la base de données par son nom "db"
# Équivalent : ping db depuis le conteneur api → résolu en 172.20.0.2
```

## Liens

- [docs.docker.com — Networking](https://docs.docker.com/network/)
- [docs.docker.com — Bridge networks](https://docs.docker.com/network/bridge/)
