---
id: ioc-di
parent: fondamentaux
label: IoC & Injection de dépendances
explored: true
order: 1
---

# IoC & Injection de dépendances

L'Inversion of Control (IoC) délègue la création et la liaison des objets au conteneur Spring. L'injection de dépendances (DI) est le mécanisme concret : Spring fournit les dépendances là où elles sont déclarées.

```java
@Service
public class OrderService {

    private final PaymentGateway paymentGateway;
    private final InventoryClient inventoryClient;

    // Injection par constructeur — recommandée (immuable, testable)
    public OrderService(PaymentGateway paymentGateway,
                        InventoryClient inventoryClient) {
        this.paymentGateway = paymentGateway;
        this.inventoryClient = inventoryClient;
    }

    public Order place(Cart cart) {
        inventoryClient.reserve(cart.items());
        paymentGateway.charge(cart.total());
        return Order.from(cart);
    }
}
```

## Scopes disponibles

| Scope | Durée de vie |
|-------|-------------|
| `singleton` (défaut) | Une instance par contexte Spring |
| `prototype` | Nouvelle instance à chaque injection |
| `request` | Une instance par requête HTTP |
| `session` | Une instance par session HTTP |

## Liens

- [Spring Docs — Dependency Injection](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)
- [Baeldung — Spring DI](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)
