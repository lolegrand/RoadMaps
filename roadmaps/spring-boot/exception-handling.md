---
id: exception-handling
parent: web-rest
label: Gestion des erreurs
explored: false
order: 1
---

# Gestion des erreurs

Spring Boot propose `@ControllerAdvice` pour centraliser la gestion des exceptions et retourner des réponses d'erreur cohérentes (RFC 7807 / Problem Details).

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail notFound(ResourceNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage()
        );
        pd.setTitle("Resource not found");
        return pd;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ProblemDetail validationError(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);
        pd.setTitle("Validation failed");
        pd.setProperty("errors", ex.getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .toList());
        return pd;
    }
}
```

## Liens

- [Spring Docs — Problem Details (RFC 7807)](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-rest-exceptions)
- [Baeldung — Exception Handling for REST](https://www.baeldung.com/exception-handling-for-rest-with-spring)
