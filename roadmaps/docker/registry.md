---
id: registry
parent: fondamentaux
label: Registry
explored: true
order: 4
---

# Registry

Un registry est un serveur de stockage et distribution d'images Docker. Docker Hub est le registry public par défaut ; les entreprises utilisent des registries privés (GHCR, ECR, Harbor…).

## Docker Hub

```bash
# S'authentifier
docker login                          # Docker Hub
docker login ghcr.io                  # GitHub Container Registry
docker login registry.gitlab.com      # GitLab Registry
docker login <account>.dkr.ecr.<region>.amazonaws.com  # AWS ECR

# Nommage : registry/namespace/image:tag
docker pull nginx:1.27-alpine                        # Docker Hub officiel
docker pull myuser/myapp:latest                      # Docker Hub perso
docker pull ghcr.io/myorg/myapp:v1.2.3               # GHCR
docker pull 123456789.dkr.ecr.eu-west-1.amazonaws.com/myapp:latest  # ECR

# Push
docker tag my-app:latest myuser/my-app:1.0.0
docker push myuser/my-app:1.0.0
docker push myuser/my-app:latest      # plusieurs tags pour la même image
```

## Principaux registries

| Registry | URL | Cas d'usage |
|----------|-----|-------------|
| Docker Hub | hub.docker.com | Public, images officielles |
| GHCR | ghcr.io | CI/CD GitHub, gratuit pour public |
| GitLab Registry | registry.gitlab.com | Intégré aux pipelines GitLab |
| AWS ECR | *.dkr.ecr.*.amazonaws.com | Déploiements AWS |
| Google Artifact Registry | pkg.dev | GKE, Cloud Run |
| Harbor | auto-hébergé | On-premise, scanning intégré |

## Registry local (développement / air-gapped)

```bash
# Lancer un registry privé local
docker run -d -p 5000:5000 --name registry \
  -v registry-data:/var/lib/registry \
  registry:2

# Pousser vers le registry local
docker tag my-app localhost:5000/my-app:latest
docker push localhost:5000/my-app:latest

# Lister les images stockées
curl http://localhost:5000/v2/_catalog
curl http://localhost:5000/v2/my-app/tags/list
```

## Authentification en CI/CD

```bash
# GitHub Actions — pousser sur GHCR
echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
docker push ghcr.io/${{ github.repository }}/my-app:${{ github.sha }}

# AWS ECR — login via CLI
aws ecr get-login-password --region eu-west-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.eu-west-1.amazonaws.com
```

## Liens

- [docs.docker.com — Registry](https://docs.docker.com/registry/)
- [Docker Hub](https://hub.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Harbor — Open source registry](https://goharbor.io/)
