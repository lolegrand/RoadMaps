---
id: compose-fichier
parent: compose
label: Fichier Compose
explored: false
order: 1
---

# Fichier Compose

Le fichier `compose.yml` (ou `docker-compose.yml`) déclare les services, réseaux, volumes et leur configuration.

## Exemple complet — application web full stack

```yaml
# compose.yml
name: my-app

services:

  # ── Base de données PostgreSQL ───────────────────────────────
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB:       mydb
      POSTGRES_USER:     user
      POSTGRES_PASSWORD: secret    # En prod : utiliser secrets:
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ── Cache Redis ──────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass secret --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "secret", "ping"]
      interval: 10s

  # ── API backend ──────────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime          # étape multi-stage
      args:
        NODE_ENV: production
    image: my-app/api:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV:     production
      DATABASE_URL: postgresql://user:secret@db:5432/mydb
      REDIS_URL:    redis://:secret@redis:6379
    env_file:
      - .env.production
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend
      - frontend
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M

  # ── Reverse proxy Nginx ──────────────────────────────────────
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - api
    networks:
      - frontend

  # ── Worker de tâches en arrière-plan ────────────────────────
  worker:
    build:
      context: .
      target: runtime
    command: node worker.js
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://user:secret@db:5432/mydb
      REDIS_URL:    redis://:secret@redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true    # pas d'accès internet depuis ce réseau

volumes:
  postgres-data:
  redis-data:
```

## Liens

- [Compose file reference — services](https://docs.docker.com/compose/compose-file/05-services/)
- [Compose file reference — networks](https://docs.docker.com/compose/compose-file/06-networks/)
- [Compose file reference — volumes](https://docs.docker.com/compose/compose-file/07-volumes/)
