---
id: actuator
parent: production
label: Actuator & Observabilité
explored: false
order: 1
---

# Actuator & Observabilité

Spring Boot Actuator expose des endpoints HTTP pour monitorer l'état de l'application. Couplé à Micrometer, il pousse des métriques vers Prometheus, Datadog, ou tout autre backend.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    tags:
      application: ${spring.application.name}
```

## Health checks personnalisés

```java
@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    private final ExternalApiClient client;

    @Override
    public Health health() {
        try {
            client.ping();
            return Health.up().withDetail("latency", "ok").build();
        } catch (Exception e) {
            return Health.down().withException(e).build();
        }
    }
}
```

## Liens

- [Spring Docs — Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer — Prometheus](https://micrometer.io/docs/registry/prometheus)
