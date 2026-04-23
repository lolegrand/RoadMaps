---
id: ci-cd
parent: production
label: CI/CD avec Docker
explored: false
order: 3
---

# CI/CD avec Docker

Docker s'intègre dans les pipelines CI/CD pour builder, tester, scanner et déployer des images de manière reproductible.

## GitHub Actions — pipeline complet

```yaml
# .github/workflows/docker.yml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE:    ghcr.io/${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      security-events: write

    steps:
      - uses: actions/checkout@v4

      - name: Login → GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE }}
          tags: |
            type=sha,prefix=sha-
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      - name: Setup BuildX
        uses: docker/setup-buildx-action@v3

      - name: Build & Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha           # cache GitHub Actions
          cache-to:   type=gha,mode=max
          platforms: linux/amd64,linux/arm64

      - name: Scan Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE }}:sha-${{ github.sha }}
          format: sarif
          output: trivy.sarif
          severity: CRITICAL,HIGH
          exit-code: '1'

      - name: Upload → GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy.sarif
```

## GitLab CI

```yaml
# .gitlab-ci.yml
variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

stages: [build, test, scan, deploy]

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker buildx build --cache-from $CI_REGISTRY_IMAGE:cache
        --cache-to type=inline
        --tag $IMAGE --push .

scan:
  stage: scan
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 1 --severity CRITICAL,HIGH $IMAGE

deploy:
  stage: deploy
  only: [main]
  script:
    - docker pull $IMAGE
    - docker tag $IMAGE $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
```

## Tests dans Docker — isolation parfaite

```bash
# Lancer les tests dans le conteneur (même env que prod)
docker compose -f compose.yml -f compose.test.yml run --rm api npm test

# compose.test.yml
services:
  api:
    environment:
      NODE_ENV: test
      DATABASE_URL: postgresql://user:test@db:5432/testdb
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: test
    tmpfs:
      - /var/lib/postgresql/data  # DB en RAM pour les tests (rapide)
```

## Liens

- [docs.docker.com — CI/CD](https://docs.docker.com/build/ci/)
- [docker/build-push-action](https://github.com/docker/build-push-action)
- [docker/metadata-action](https://github.com/docker/metadata-action)
