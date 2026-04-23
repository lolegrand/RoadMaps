---
id: production
parent: root
label: Production
explored: false
order: 5
---

# Production

Spring Boot embarque tout ce qu'il faut pour opérer une application en production : observabilité, packaging, et compilation native GraalVM.

## Checklist production

- `spring.jpa.open-in-view=false`
- `spring.flyway.enabled=true`
- `management.endpoints.web.exposure.include=health,info,metrics,prometheus`
- Secrets via variables d'environnement, jamais en clair dans les fichiers
- `server.tomcat.threads.max` dimensionné selon la charge

## Liens

- [Spring Boot — Production-ready features](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [12-factor App](https://12factor.net/)
