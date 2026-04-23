---
id: apis-protocoles
parent: root
label: APIs & Protocoles
explored: false
order: 5
---

# APIs & Protocoles

Le web est fondamentalement construit sur HTTP. Les APIs REST en sont l'usage principal, mais WebSockets, GraphQL et les protocoles temps réel sont tout aussi importants selon les besoins.

## HTTP — fondamentaux

```
Méthodes sémantiques :
GET    → lire (idempotent, safe)
POST   → créer
PUT    → remplacer entièrement (idempotent)
PATCH  → modifier partiellement
DELETE → supprimer (idempotent)

Codes de statut importants :
2xx → Succès
  200 OK               400 Bad Request
  201 Created          401 Unauthorized
  204 No Content       403 Forbidden
3xx → Redirection      404 Not Found
  301 Moved Perm.      409 Conflict
  304 Not Modified     422 Unprocessable Entity
                       429 Too Many Requests
5xx → Erreur serveur   503 Service Unavailable
  500 Internal Error
```

## Liens

- [MDN — HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP)
- [HTTP Status Codes — httpstatuses.com](https://httpstatuses.com/)
