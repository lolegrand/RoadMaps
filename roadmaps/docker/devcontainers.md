---
id: devcontainers
parent: ecosysteme
label: Dev Containers
explored: false
order: 4
---

# Dev Containers

Les Dev Containers (VS Code / GitHub Codespaces) permettent d'ouvrir un projet directement dans un conteneur Docker — même environnement de développement garanti pour toute l'équipe, sans "ça marche chez moi".

## Configuration de base

```json
// .devcontainer/devcontainer.json
{
  "name": "My App Dev",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:22",

  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },

  "forwardPorts": [3000, 5432],
  "portsAttributes": {
    "3000": { "label": "App", "onAutoForward": "openBrowser" }
  },

  "postCreateCommand": "npm install",
  "postStartCommand": "npm run dev",

  "mounts": [
    "source=${localEnv:HOME}/.ssh,target=/home/node/.ssh,type=bind,readonly"
  ],

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  }
}
```

## Avec Docker Compose (services multiples)

```json
// .devcontainer/devcontainer.json
{
  "name": "Full Stack Dev",
  "dockerComposeFile": ["../compose.yml", "compose.dev.yml"],
  "service": "api",          // conteneur principal où VS Code s'attache
  "workspaceFolder": "/app",

  "postCreateCommand": "npm install",
  "forwardPorts": [3000, 5432, 6379]
}
```

```yaml
# .devcontainer/compose.dev.yml — surcharge pour le dev
services:
  api:
    volumes:
      - ..:/app                    # code source en live
      - /app/node_modules          # éviter d'écraser node_modules
    environment:
      NODE_ENV: development
  db:
    ports: ["5432:5432"]           # exposer la BDD pour les outils SQL
```

## Depuis un Dockerfile personnalisé

```json
{
  "name": "Custom Dev",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "..",
    "args": { "NODE_VERSION": "22" }
  },
  "remoteUser": "node"
}
```

```dockerfile
# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG NODE_VERSION=22
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs

# Outils de dev supplémentaires
RUN npm install -g tsx @angular/cli
```

## Liens

- [containers.dev](https://containers.dev/)
- [VS Code — Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Codespaces](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration)
- [Dev Container features](https://containers.dev/features)
