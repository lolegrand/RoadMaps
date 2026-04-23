---
id: spring-data-jpa
parent: donnees
label: Spring Data JPA
explored: false
order: 1
---

# Spring Data JPA

Spring Data JPA génère l'implémentation des repositories à partir des interfaces déclarées. Les entités JPA mappent les tables de base de données.

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
```

## Requêtes dérivées et JPQL

```java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Dérivée du nom de méthode
    List<Order> findByStatusAndCustomerId(OrderStatus status, Long customerId);

    // JPQL explicite
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findWithItems(@Param("id") Long id);

    // Projection — ne charge que les champs nécessaires
    List<OrderSummary> findByCustomerId(Long customerId);
}
```

## Liens

- [Spring Data JPA Docs](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Baeldung — Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
- [Vlad Mihalcea — JPA best practices](https://vladmihalcea.com/tutorials/hibernate/)
