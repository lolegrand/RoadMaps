---
id: graalvm-native
parent: production
label: GraalVM Native Image
explored: false
order: 4
---

# GraalVM Native Image

Spring Boot 3 supporte la compilation AOT (Ahead-of-Time) vers un exécutable natif GraalVM : démarrage en millisecondes, empreinte mémoire réduite de 90%.

```bash
# Compiler en natif avec le plugin Maven
./mvnw -Pnative native:compile

# Ou générer une image OCI native directement
./mvnw -Pnative spring-boot:build-image
```

```xml
<!-- pom.xml — activer le support natif -->
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

```java
// Aide GraalVM à connaître les classes utilisées par réflexion
@RegisterReflectionForBinding({MyDto.class, AnotherDto.class})
@Configuration
public class NativeHints implements RuntimeHintsRegistrar {

    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        hints.resources().registerPattern("templates/*.html");
    }
}
```

## Comparaison JVM vs Natif

| Critère | JVM | Natif |
|---------|-----|-------|
| Démarrage | ~2–5 s | ~50–200 ms |
| Mémoire RSS | ~300 MB | ~30–80 MB |
| Throughput pic | Excellent (JIT) | Bon |
| Temps de build | Rapide | Lent (~5–15 min) |

## Liens

- [Spring Docs — GraalVM Native](https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html)
- [GraalVM — Native Image](https://www.graalvm.org/latest/reference-manual/native-image/)
