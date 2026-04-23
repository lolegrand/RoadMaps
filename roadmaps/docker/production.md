---
id: production
parent: root
label: Production
explored: false
order: 7
---

# Production

Déployer Docker en production nécessite de gérer les ressources, les logs, le monitoring, la haute disponibilité et les mises à jour sans interruption.

## Checklist production

- Images basées sur digest SHA256 (pas sur `latest`)
- Utilisateur non-root dans le Dockerfile
- `--read-only` + tmpfs pour les données temporaires
- Limites mémoire et CPU définies
- Healthcheck configuré et testé
- Logs centralisés (pas dans les conteneurs)
- Volumes pour toutes les données persistantes
- Redémarrage automatique (`--restart unless-stopped`)
- Secrets via variables d'environnement injectées, pas dans l'image

## Liens

- [docs.docker.com — Production deployment](https://docs.docker.com/get-started/07_multi_container/)
- [Docker — Production checklist](https://docs.docker.com/engine/security/)
