---
id: migrations
parent: donnees
label: Migrations (Flyway)
explored: false
order: 3
---

# Migrations (Flyway)

Flyway versionne le schéma de base de données via des scripts SQL numérotés, appliqués automatiquement au démarrage de l'application.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```
src/main/resources/db/migration/
├── V1__init_schema.sql
├── V2__add_orders_table.sql
└── V3__add_customer_index.sql
```

```sql
-- V2__add_orders_table.sql
CREATE TABLE orders (
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT        NOT NULL REFERENCES customers(id),
    total       NUMERIC(15,2) NOT NULL,
    status      VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
```

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true   # utile pour les bases existantes
```

## Liens

- [Flyway — Getting Started](https://flywaydb.org/documentation/getstarted/)
- [Baeldung — Spring Boot with Flyway](https://www.baeldung.com/database-migrations-with-flyway)
