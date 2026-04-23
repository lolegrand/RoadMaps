---
id: securite
parent: root
label: Sécurité
explored: false
order: 6
---

# Sécurité

La sécurité Docker couvre quatre axes : les images (supply chain), l'exécution des conteneurs (isolation), les secrets (credentials), et le scan de vulnérabilités.

## Principes fondamentaux

- **Moindre privilège** : jamais root, capabilities minimales, réseau interne si possible
- **Immutabilité** : filesystem en lecture seule, `--read-only`
- **Images minimales** : distroless, alpine, scratch — moins de surface d'attaque
- **Secrets** : jamais dans les layers d'image, jamais dans les variables d'environnement visibles

## Liens

- [docs.docker.com — Security](https://docs.docker.com/engine/security/)
- [OWASP — Container Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
