---
id: compose-avance
parent: compose
label: Compose avancé
explored: false
order: 2
---

# Compose avancé

Profiles, override, secrets, et interpolation permettent d'adapter le même `compose.yml` à plusieurs environnements.

## Interpolation de variables et fichier .env

```bash
# .env (chargé automatiquement par Compose)
POSTGRES_VERSION=17-alpine
API_PORT=3000
IMAGE_TAG=latest
```

```yaml
# compose.yml — utilisation des variables
services:
  db:
    image: postgres:${POSTGRES_VERSION:-16-alpine}  # valeur par défaut si absent
  api:
    image: my-app/api:${IMAGE_TAG}
    ports:
      - "${API_PORT}:3000"
```

```bash
# Surcharger via la CLI
API_PORT=3001 docker compose up
docker compose --env-file .env.prod up
```

## Override — surcharger selon l'environnement

```yaml
# compose.yml — base commune
services:
  api:
    build: .
    environment:
      NODE_ENV: production
```

```yaml
# compose.override.yml — chargé automatiquement en dev
services:
  api:
    build:
      target: dev               # étape dev du Dockerfile
    volumes:
      - .:/app                  # live reload du code
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: npm run dev
  db:
    ports:
      - "5432:5432"             # exposer la BDD en dev uniquement
```

```bash
# Dev — compose.yml + compose.override.yml (automatique)
docker compose up

# Prod — compose.yml uniquement
docker compose -f compose.yml up

# CI — compose.yml + compose.ci.yml
docker compose -f compose.yml -f compose.ci.yml up
```

## Profiles — services optionnels

```yaml
services:
  api:
    image: my-api              # toujours démarré

  db:
    image: postgres:17
    profiles: [dev, test]      # seulement avec le profil dev ou test

  mailhog:
    image: mailhog/mailhog
    profiles: [dev]            # outil de mail fictif, dev seulement

  prometheus:
    image: prom/prometheus
    profiles: [monitoring]
```

```bash
docker compose up                          # api seulement
docker compose --profile dev up            # api + db + mailhog
docker compose --profile dev --profile monitoring up  # tout
COMPOSE_PROFILES=dev,monitoring docker compose up
```

## Secrets Compose (Docker Swarm mode)

```yaml
services:
  api:
    image: my-api
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt    # en développement
  jwt_secret:
    external: true                      # en production (Swarm secret)
```

## Depends_on avec conditions

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy    # attend que le healthcheck passe
        restart: true                 # redémarre si db redémarre
      migration:
        condition: service_completed_successfully  # attend la fin du job
  migration:
    image: my-api
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
```

## Liens

- [docs.docker.com — Compose profiles](https://docs.docker.com/compose/profiles/)
- [docs.docker.com — Multiple compose files](https://docs.docker.com/compose/multiple-compose-files/)
- [docs.docker.com — Compose secrets](https://docs.docker.com/compose/secrets/)
