---
id: donnees
parent: root
label: Données
explored: true
order: 3
---

# Données

Spring Boot simplifie l'accès aux bases de données via Spring Data, qui fournit des repositories prêts à l'emploi, et auto-configure les pools de connexions (HikariCP par défaut).

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: user
    password: secret
    hikari:
      maximum-pool-size: 20
      connection-timeout: 3000
  jpa:
    open-in-view: false          # bonne pratique : désactiver
    hibernate:
      ddl-auto: validate         # en prod : validate ou none
```

## Liens

- [Spring Data Commons](https://docs.spring.io/spring-data/commons/docs/current/reference/html/)
- [HikariCP — configuration](https://github.com/brettwooldridge/HikariCP#frequently-used)
