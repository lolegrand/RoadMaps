---
id: jwt-oauth2
parent: securite
label: JWT & OAuth2
explored: false
order: 1
---

# JWT & OAuth2

Spring Boot peut agir comme **Resource Server** (valide les tokens JWT émis par un fournisseur OAuth2) ou comme **Authorization Server** autonome (Spring Authorization Server).

## Anatomie d'un JWT

Un JWT est composé de trois parties encodées en Base64URL séparées par des points :

```
eyJhbGciOiJSUzI1NiJ9          ← Header  (algo + type)
.eyJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTcxMDAwMDAwMCwiZXhwIjoxNzEwMDAzNjAwLCJyb2xlcyI6WyJVU0VSIl19
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   ← Signature RSA/HMAC
```

```json
// Payload décodé — les "claims"
{
  "sub":   "user-123",           // subject (identifiant utilisateur)
  "iat":   1710000000,           // issued at
  "exp":   1710003600,           // expiration (1 heure)
  "jti":   "a1b2c3d4",           // JWT ID — unique, utile pour la révocation
  "roles": ["USER"],
  "email": "alice@example.com"
}
```

## Access Token vs Refresh Token

| | Access Token | Refresh Token |
|---|---|---|
| **Durée de vie** | Courte (5–15 min) | Longue (7–30 jours) |
| **Stockage client** | Mémoire (SPA) / Header HTTP | HttpOnly Cookie sécurisé |
| **Usage** | Chaque appel API (Authorization: Bearer) | Obtenir un nouvel access token |
| **Révocable** | Difficile (stateless) | Oui (stocker en base) |
| **Exposé à l'API** | Oui | Non — uniquement vers `/auth/refresh` |

## Token Rotation

La rotation invalide le refresh token après chaque usage et en émet un nouveau, empêchant la réutilisation en cas de vol.

```
Client                     Auth Server                  Resource API
  │── POST /auth/refresh ──▶│                              │
  │   { refresh_token: R1 } │                              │
  │                         │ invalide R1                  │
  │◀── { access: A2,        │                              │
  │      refresh: R2 } ─────│                              │
  │                         │                              │
  │── GET /api/me ──────────────────────────────────────▶ │
  │   Authorization: Bearer A2                             │
```

Si R1 est réutilisé après rotation → **toute la famille de tokens est révoquée** (détection de vol).

## Implémentation — Resource Server (cas courant)

```yaml
# application.yml — déléguer la validation à Keycloak / Auth0 / Cognito
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.example.com/realms/myrealm
          # Spring télécharge automatiquement les clés publiques (JWKS)
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter conv = new JwtGrantedAuthoritiesConverter();
        conv.setAuthoritiesClaimName("roles");
        conv.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter jwtConv = new JwtAuthenticationConverter();
        jwtConv.setJwtGrantedAuthoritiesConverter(conv);
        return jwtConv;
    }
}
```

## Implémentation — Auth Server maison (sans provider externe)

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

```java
@Service
public class TokenService {

    @Value("${app.jwt.secret}")
    private String secret;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateAccessToken(UserDetails user) {
        return Jwts.builder()
            .subject(user.getUsername())
            .claim("roles", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList())
            .issuedAt(new Date())
            .expiration(Date.from(Instant.now().plusSeconds(900)))  // 15 min
            .signWith(key())
            .compact();
    }

    public String generateRefreshToken(UserDetails user) {
        return Jwts.builder()
            .subject(user.getUsername())
            .id(UUID.randomUUID().toString())   // jti — pour la rotation
            .issuedAt(new Date())
            .expiration(Date.from(Instant.now().plusSeconds(2_592_000)))  // 30 j
            .signWith(key())
            .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key()).build()
            .parseSignedClaims(token).getPayload();
    }
}
```

```java
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final TokenService tokenService;
    private final RefreshTokenRepository refreshTokenRepo;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req,
                                               HttpServletResponse res) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        UserDetails user = (UserDetails) auth.getPrincipal();

        String accessToken  = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        // Persister le refresh token (hash) pour permettre la révocation
        refreshTokenRepo.save(new RefreshToken(
            tokenService.parse(refreshToken).getId(),
            user.getUsername(),
            Instant.now().plusSeconds(2_592_000)
        ));

        // Refresh token dans un cookie HttpOnly — jamais dans le body
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true).secure(true).sameSite("Strict")
            .path("/auth/refresh").maxAge(Duration.ofDays(30))
            .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new TokenResponse(accessToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            @CookieValue("refresh_token") String refreshToken) {

        Claims claims = tokenService.parse(refreshToken);
        String jti = claims.getId();

        // Vérifier + invalider l'ancien token (rotation)
        RefreshToken stored = refreshTokenRepo.findByJti(jti)
            .orElseThrow(() -> new SecurityException("Token reuse detected — revoked"));
        refreshTokenRepo.delete(stored);

        // Émettre une nouvelle paire
        UserDetails user = userDetailsService.loadUserByUsername(claims.getSubject());
        return ResponseEntity.ok(new TokenResponse(tokenService.generateAccessToken(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse res) {
        String jti = tokenService.parse(refreshToken).getId();
        refreshTokenRepo.deleteByJti(jti);

        ResponseCookie clear = ResponseCookie.from("refresh_token", "")
            .httpOnly(true).secure(true).maxAge(0).path("/auth/refresh").build();
        res.addHeader(HttpHeaders.SET_COOKIE, clear.toString());
        return ResponseEntity.noContent().build();
    }
}
```

## Accéder au principal dans un contrôleur

```java
@GetMapping("/me")
public UserInfo me(@AuthenticationPrincipal Jwt jwt) {
    return new UserInfo(
        jwt.getSubject(),
        jwt.getClaimAsString("email"),
        jwt.getClaimAsStringList("roles")
    );
}
```

## Bonnes pratiques

- Signer avec **RS256** (asymétrique) en production — la clé privée reste côté serveur
- Ne jamais mettre d'informations sensibles dans le payload (il est lisible sans la clé)
- Stocker le refresh token en **base de données** (hash SHA-256) pour pouvoir le révoquer
- Durée de vie access token : **5–15 min** max
- Activer la **détection de réutilisation** : si un refresh token déjà consommé est présenté → révoquer toute la famille

## Liens

- [Spring Docs — OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
- [Spring Authorization Server](https://spring.io/projects/spring-authorization-server)
- [JJWT — GitHub](https://github.com/jwtk/jjwt)
- [RFC 6749 — OAuth2](https://datatracker.ietf.org/doc/html/rfc6749)
- [Auth0 — Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
