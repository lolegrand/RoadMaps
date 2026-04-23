---
id: root
label: Spring Boot
explored: true
order: 0
---

# Spring Boot

Spring Boot est un framework Java qui permet de créer des applications **production-ready** en quelques minutes, sans configuration XML, grâce à l'auto-configuration et aux starters.

## Philosophie

- **Convention over configuration** — des valeurs par défaut sensées pour tout
- **Standalone** — un JAR exécutable suffit, pas de serveur d'application externe
- **Production-ready** — métriques, health checks et logs intégrés d'emblée

## Démarrage rapide

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## Liens

- [spring.io — Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Initializr](https://start.spring.io/)
- [Documentation officielle](https://docs.spring.io/spring-boot/docs/current/reference/html/)
