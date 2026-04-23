---
id: web-rest
parent: root
label: Web & REST
explored: true
order: 2
---

# Web & REST

Spring Boot intègre Tomcat (ou Netty) et Spring MVC pour exposer des APIs REST sans aucune configuration XML.

```java
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductDto> list(Pageable pageable) {
        return productService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable Long id) {
        return productService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto create(@Valid @RequestBody CreateProductRequest req) {
        return productService.create(req);
    }
}
```

## Liens

- [Spring Docs — Web MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [Baeldung — REST with Spring](https://www.baeldung.com/rest-with-spring-series)
