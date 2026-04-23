---
id: openapi
parent: web-rest
label: OpenAPI / Swagger
explored: false
order: 3
---

# OpenAPI / Swagger

`springdoc-openapi` génère automatiquement une spec OpenAPI 3 depuis les contrôleurs Spring MVC et expose une UI Swagger interactive.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

```java
@RestController
@Tag(name = "Products", description = "Product catalog management")
public class ProductController {

    @Operation(summary = "Get a product by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Product found"),
        @ApiResponse(responseCode = "404", description = "Not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    @GetMapping("/api/v1/products/{id}")
    public ProductDto get(@Parameter(description = "Product ID") @PathVariable Long id) {
        return productService.findById(id);
    }
}
```

```yaml
# application.yml
springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /api-docs
```

## Liens

- [springdoc-openapi](https://springdoc.org/)
- [OpenAPI 3 Specification](https://spec.openapis.org/oas/v3.1.0)
