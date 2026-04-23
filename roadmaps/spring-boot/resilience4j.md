---
id: resilience4j
parent: librairies
label: Resilience4j
explored: false
order: 4
---

# Resilience4j

Resilience4j apporte les patterns de résilience aux appels distants : circuit breaker, retry, rate limiter et bulkhead, intégrés nativement avec Spring Boot Actuator.

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>
```

```yaml
resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        sliding-window-size: 10
        failure-rate-threshold: 50        # ouvre le circuit à 50% d'échecs
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 3

  retry:
    instances:
      paymentService:
        max-attempts: 3
        wait-duration: 500ms
        retry-exceptions:
          - java.net.ConnectException
          - java.util.concurrent.TimeoutException
```

```java
@Service
public class PaymentService {

    private final PaymentGatewayClient client;

    // Circuit Breaker + Retry combinés — l'ordre des annotations compte
    @CircuitBreaker(name = "paymentService", fallbackMethod = "payFallback")
    @Retry(name = "paymentService")
    public PaymentResult pay(PaymentRequest req) {
        return client.charge(req);
    }

    // Appelé quand le circuit est ouvert ou que les retries sont épuisés
    private PaymentResult payFallback(PaymentRequest req, Exception ex) {
        log.warn("Payment fallback triggered: {}", ex.getMessage());
        return PaymentResult.deferred(req.orderId());
    }
}
```

## Liens

- [resilience4j.readme.io](https://resilience4j.readme.io/docs/getting-started)
- [Baeldung — Resilience4j](https://www.baeldung.com/resilience4j)
