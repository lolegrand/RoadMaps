---
id: securite
parent: root
label: Sécurité Web
explored: false
order: 8
---

# Sécurité Web

La sécurité web protège les utilisateurs et l'application contre les attaques. L'OWASP Top 10 recense les vulnérabilités les plus critiques.

## OWASP Top 10 (2021)

| # | Vulnérabilité | Exemple |
|---|--------------|---------|
| A01 | Broken Access Control | Accéder aux données d'un autre utilisateur |
| A02 | Cryptographic Failures | Mots de passe en MD5 ou en clair |
| A03 | Injection (SQL, XSS, cmd) | `SELECT * WHERE id='${input}'` |
| A04 | Insecure Design | Absence de rate limiting |
| A05 | Security Misconfiguration | Headers par défaut, debug en prod |
| A06 | Vulnerable Components | Dépendances avec CVE connues |
| A07 | Auth Failures | Passwords faibles, pas de MFA |
| A08 | Data Integrity Failures | Deserialisation non sécurisée |
| A09 | Logging Failures | Pas de traces des accès |
| A10 | SSRF | Forcer le serveur à faire des requêtes internes |

## Liens

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
