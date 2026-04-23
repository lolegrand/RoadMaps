---
id: mapstruct
parent: librairies
label: MapStruct
explored: false
order: 2
---

# MapStruct

MapStruct génère à la compilation des mappers entre objets Java (entité ↔ DTO) sans réflexion, ce qui le rend aussi rapide qu'un mapping manuel.

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.6.3</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.6.3</version>
    <scope>provided</scope>
</dependency>
```

```java
// Entité JPA
@Entity
public class Product {
    @Id Long id;
    String name;
    BigDecimal price;
    @ManyToOne Category category;
}

// DTO exposé par l'API
public record ProductDto(Long id, String name, BigDecimal price, String categoryName) {}
```

```java
@Mapper(componentModel = "spring")   // génère un @Component Spring
public interface ProductMapper {

    // Mapping simple — champs de même nom mappés automatiquement
    @Mapping(source = "category.name", target = "categoryName")
    ProductDto toDto(Product product);

    // Mapping inverse — ignore l'id (géré par JPA)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductDto dto);

    List<ProductDto> toDtoList(List<Product> products);
}
```

```java
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repo;
    private final ProductMapper mapper;

    public ProductDto findById(Long id) {
        return repo.findById(id)
            .map(mapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
```

## Liens

- [mapstruct.org](https://mapstruct.org/)
- [MapStruct — Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
- [Baeldung — Quick Guide to MapStruct](https://www.baeldung.com/mapstruct)
