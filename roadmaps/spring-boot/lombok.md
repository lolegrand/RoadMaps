---
id: lombok
parent: librairies
label: Lombok
explored: true
order: 1
---

# Lombok

Lombok génère automatiquement le code boilerplate Java (getters, setters, constructeurs, builders, equals/hashCode) via des annotations traitées à la compilation.

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

```java
@Data               // getters + setters + equals + hashCode + toString
@Builder            // pattern Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private BigDecimal price;
}

// Usage du builder
ProductDto dto = ProductDto.builder()
    .id(1L)
    .name("Widget")
    .price(new BigDecimal("9.99"))
    .build();
```

```java
// Dans les services — plus besoin de logger final static
@Slf4j
@Service
@RequiredArgsConstructor   // génère le constructeur pour les champs final
public class OrderService {

    private final OrderRepository orderRepository;

    public Order place(Cart cart) {
        log.info("Placing order for cart {}", cart.getId());
        return orderRepository.save(Order.from(cart));
    }
}
```

## Annotations les plus utiles

| Annotation | Effet |
|-----------|-------|
| `@Getter` / `@Setter` | Génère les accesseurs |
| `@Data` | `@Getter` + `@Setter` + `@EqualsAndHashCode` + `@ToString` |
| `@Builder` | Pattern Builder fluent |
| `@RequiredArgsConstructor` | Constructeur pour les champs `final` |
| `@Slf4j` | Champ `log` (SLF4J) prêt à l'emploi |
| `@Value` | Classe immuable (tous champs `final`) |

> **Note** : préférer les `record` Java 16+ pour les DTOs simples immuables — Lombok reste utile pour les entités JPA qui ne peuvent pas être des records.

## Liens

- [projectlombok.org](https://projectlombok.org/)
- [Lombok — Features](https://projectlombok.org/features/)
