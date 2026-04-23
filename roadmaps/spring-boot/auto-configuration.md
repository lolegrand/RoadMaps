---
id: auto-configuration
parent: fondamentaux
label: Auto-configuration
explored: true
order: 2
---

# Auto-configuration

Spring Boot détecte les dépendances présentes dans le classpath et configure automatiquement les beans correspondants. C'est le cœur de la "magie" Spring Boot.

```java
// Déclarer sa propre auto-configuration conditionnelle
@Configuration
@ConditionalOnClass(DataSource.class)          // si JDBC est dans le classpath
@ConditionalOnMissingBean(DataSource.class)    // et qu'aucun DataSource n'est défini
public class MyDataSourceAutoConfig {

    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return DataSourceBuilder.create()
            .url(props.getUrl())
            .username(props.getUsername())
            .password(props.getPassword())
            .build();
    }
}
```

## Déboguer l'auto-configuration

```bash
# Voir quelles configurations sont actives ou exclues
java -jar app.jar --debug

# Ou dans application.properties
logging.level.org.springframework.boot.autoconfigure=DEBUG
```

## Liens

- [Spring Docs — Auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration)
- [Baeldung — Custom Auto-configuration](https://www.baeldung.com/spring-boot-custom-auto-configuration)
