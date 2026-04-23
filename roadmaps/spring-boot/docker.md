---
id: docker
parent: production
label: Docker & Containerisation
explored: false
order: 3
---

# Docker & Containerisation

Spring Boot 3 supporte la génération d'images OCI optimisées (layers, BuildPacks) sans Dockerfile, via le plugin Maven/Gradle.

```bash
# Générer une image OCI avec Cloud Native Buildpacks (sans Dockerfile)
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=myapp:latest

# Ou avec Docker classique — multi-stage pour minimiser la taille
```

```dockerfile
# Dockerfile multi-stage avec layers Spring Boot
FROM eclipse-temurin:21-jre AS builder
WORKDIR /app
COPY target/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/extracted/dependencies/ ./
COPY --from=builder /app/extracted/spring-boot-loader/ ./
COPY --from=builder /app/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/extracted/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

```yaml
# compose.yml — développement local
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/mydb
      SPRING_PROFILES_ACTIVE: dev
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
```

## Liens

- [Spring Boot — Docker](https://spring.io/guides/topicals/spring-boot-docker/)
- [Buildpacks.io](https://buildpacks.io/)
