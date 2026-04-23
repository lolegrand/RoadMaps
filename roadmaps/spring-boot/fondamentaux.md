---
id: fondamentaux
parent: root
label: Fondamentaux
explored: true
order: 1
---

# Fondamentaux

Les fondamentaux de Spring Boot reposent sur le conteneur IoC de Spring et le mécanisme d'auto-configuration qui élimine la configuration boilerplate.

```java
// Composants détectés automatiquement par le scan de classpath
@Component      // bean générique
@Service        // couche métier
@Repository     // couche données
@Controller     // couche web
```

## Liens

- [Spring Core — IoC Container](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)
- [Baeldung — Spring Boot Basics](https://www.baeldung.com/spring-boot)
