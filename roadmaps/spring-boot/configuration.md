---
id: configuration
parent: fondamentaux
label: Configuration & Profiles
explored: true
order: 3
---

# Configuration & Profiles

Spring Boot centralise la configuration dans `application.properties` (ou `.yml`) et permet de surcharger les valeurs par profil (`dev`, `prod`, etc.).

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: user
    password: secret

app:
  features:
    new-checkout: true
  pagination:
    default-size: 20
```

```java
// Lier une section entière à une classe typée
@ConfigurationProperties(prefix = "app")
@Validated
public record AppProperties(
    Features features,
    Pagination pagination
) {
    public record Features(boolean newCheckout) {}
    public record Pagination(@Min(1) @Max(100) int defaultSize) {}
}
```

## Profiles

```yaml
# application-prod.yml — actif quand SPRING_PROFILES_ACTIVE=prod
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/mydb
logging:
  level.root: WARN
```

```java
@Bean
@Profile("prod")
public EmailSender realEmailSender() { return new SmtpEmailSender(); }

@Bean
@Profile("!prod")
public EmailSender fakeEmailSender() { return new FakeEmailSender(); }
```

## Liens

- [Spring Docs — Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Spring Docs — Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles)
