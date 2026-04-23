---
id: spring-cache
parent: librairies
label: Spring Cache & Redis
explored: false
order: 3
---

# Spring Cache & Redis

Spring Cache fournit une abstraction de mise en cache via des annotations. Redis est le backend le plus courant en production ; Caffeine est utilisé pour un cache in-process.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
  cache:
    type: redis
    redis:
      time-to-live: 10m
```

```java
@SpringBootApplication
@EnableCaching
public class DemoApplication { ... }
```

```java
@Service
public class ProductService {

    // Met en cache le résultat — clé = id
    @Cacheable(value = "products", key = "#id")
    public ProductDto findById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElseThrow();
    }

    // Met à jour le cache après modification
    @CachePut(value = "products", key = "#result.id")
    public ProductDto update(Long id, UpdateProductRequest req) { ... }

    // Invalide l'entrée du cache
    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
```

## Cache local avec Caffeine (pas de Redis)

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```yaml
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=500,expireAfterWrite=5m
```

## Liens

- [Spring Docs — Cache Abstraction](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
- [Spring Data Redis](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
- [Caffeine — GitHub](https://github.com/ben-manes/caffeine)
