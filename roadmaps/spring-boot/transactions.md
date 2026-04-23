---
id: transactions
parent: donnees
label: Transactions
explored: false
order: 2
---

# Transactions

`@Transactional` délimite les transactions déclarativement. Spring crée un proxy autour de la méthode qui ouvre, commite ou rollback la transaction automatiquement.

```java
@Service
@Transactional(readOnly = true)   // défaut read-only pour les lectures
public class TransferService {

    private final AccountRepository accounts;

    @Transactional   // surcharge : read-write pour l'écriture
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accounts.findById(fromId).orElseThrow();
        Account to   = accounts.findById(toId).orElseThrow();

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException();
        }

        from.debit(amount);
        to.credit(amount);
        // rollback automatique sur toute RuntimeException non catchée
    }
}
```

## Propagations courantes

| Propagation | Comportement |
|-------------|-------------|
| `REQUIRED` (défaut) | Réutilise la transaction existante ou en crée une |
| `REQUIRES_NEW` | Suspend la courante, crée une transaction indépendante |
| `SUPPORTS` | Participe si une transaction existe, sinon exécute sans |

## Liens

- [Spring Docs — Transaction Management](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)
- [Baeldung — @Transactional](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring)
