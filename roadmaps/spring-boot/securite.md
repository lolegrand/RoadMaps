---
id: securite
parent: root
label: Sécurité
explored: false
order: 4
---

# Sécurité

Spring Security protège les applications Spring Boot contre les menaces classiques (CSRF, session fixation, clickjacking) et fournit un modèle d'authentification et d'autorisation extensible.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)        // APIs REST stateless
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .build();
    }
}
```

## Liens

- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Baeldung — Spring Security](https://www.baeldung.com/security-spring)
