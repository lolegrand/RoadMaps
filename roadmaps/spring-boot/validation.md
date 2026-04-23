---
id: validation
parent: web-rest
label: Validation
explored: false
order: 2
---

# Validation

Spring Boot intègre Bean Validation (Jakarta EE) pour valider les données entrantes avec des annotations déclaratives.

```java
public record CreateUserRequest(
    @NotBlank @Size(min = 2, max = 50)
    String name,

    @Email @NotBlank
    String email,

    @NotNull @Min(18) @Max(120)
    Integer age,

    @Valid
    @NotNull
    AddressRequest address
) {}

public record AddressRequest(
    @NotBlank String street,
    @Pattern(regexp = "\\d{5}") String zipCode
) {}
```

```java
// Dans le contrôleur — @Valid déclenche la validation
@PostMapping
public UserDto create(@Valid @RequestBody CreateUserRequest req) {
    return userService.create(req);
}
```

## Validation métier avec groups

```java
@PostMapping
public void update(@Validated(UpdateGroup.class) @RequestBody UpdateRequest req) { ... }
```

## Liens

- [Spring Docs — Validation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validation)
- [Jakarta Bean Validation constraints](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/package-summary.html)
