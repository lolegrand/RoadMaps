---
id: volumes
parent: root
label: Volumes & Persistance
explored: false
order: 4
---

# Volumes & Persistance

Par défaut, les données écrites dans un conteneur disparaissent à sa suppression. Docker propose trois mécanismes pour persister les données : **volumes nommés**, **bind mounts** et **tmpfs**.

## Les trois mécanismes

```
┌─────────────────────────────────────────────────────────┐
│                        Hôte                              │
│                                                          │
│  /home/user/data   ←── bind mount ───┐                  │
│  /var/lib/docker/volumes/mydata/ ←── volume nommé ──┐   │
│  RAM                              ←── tmpfs ──────┐  │  │
│                                                   │  │  │
│  ┌─────────────────────────────────────────────┐  │  │  │
│  │              Conteneur                       │  │  │  │
│  │   /tmp  ←────────────────────────────────────┘  │  │  │
│  │   /app/data  ←───────────────────────────────────┘  │  │
│  │   /var/lib/postgresql/data  ←───────────────────────┘  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

| | Volume nommé | Bind mount | tmpfs |
|---|---|---|---|
| Géré par Docker | ✅ | ❌ | ✅ |
| Partage entre conteneurs | ✅ | ✅ | ❌ |
| Persistant | ✅ | ✅ | ❌ |
| Performance | Bonne | Dépend de l'OS | Excellente |
| Backup facile | ✅ | Dépend | ❌ |

## Liens

- [docs.docker.com — Volumes](https://docs.docker.com/storage/volumes/)
- [docs.docker.com — Storage overview](https://docs.docker.com/storage/)
