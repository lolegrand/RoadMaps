---
id: tests
parent: production
label: Tests
explored: false
order: 2
---

# Tests

Spring Boot fournit `@SpringBootTest`, `@WebMvcTest` et `@DataJpaTest` pour tester chaque couche en isolation ou en intégration.

```java
// Test de la couche web — contexte léger, sans JPA ni services réels
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired MockMvc mvc;
    @MockBean ProductService productService;

    @Test
    void get_returnsProduct() throws Exception {
        given(productService.findById(1L))
            .willReturn(new ProductDto(1L, "Widget", new BigDecimal("9.99")));

        mvc.perform(get("/api/v1/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Widget"));
    }
}
```

```java
// Test d'intégration complet avec Testcontainers
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class OrderIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired TestRestTemplate rest;

    @Test
    void placeOrder_returnsCreated() {
        ResponseEntity<OrderDto> resp = rest.postForEntity(
            "/api/v1/orders", new PlaceOrderRequest(...), OrderDto.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

## Liens

- [Spring Docs — Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [Testcontainers — Spring Boot](https://testcontainers.com/guides/testing-spring-boot-rest-api-using-testcontainers/)
