---
id: couche4-transport
parent: root
label: Couche 4 — Transport
explored: false
order: 4
---

# Couche 4 — Transport

La couche transport assure la communication **de bout en bout** entre processus (pas entre machines). Elle ajoute la notion de **port**, de **fiabilité** (TCP) ou de **rapidité** (UDP), et gère la segmentation des données.

## Rôle dans le modèle OSI

```
Application  ↕  données brutes
Transport    ↕  segments (TCP) / datagrammes (UDP)
Réseau       ↕  paquets IP
Liaison      ↕  trames
Physique     ↕  bits
```

## Ports et multiplexage

```
Port source  (16 bits) : choisi aléatoirement par l'OS (ephemeral port: 49152–65535)
Port destination       : identifie le service cible

Ports réservés (well-known) :
  20/21   FTP (data/control)
  22      SSH
  25      SMTP
  53      DNS (UDP + TCP)
  80      HTTP
  443     HTTPS
  3306    MySQL
  5432    PostgreSQL
  6379    Redis
  27017   MongoDB

Socket = (adresse IP, port, protocole) — identifiant unique d'une connexion
```

## Protocoles enfants

| Protocole | Fiabilité | Connexion | Ordre | Usage |
|-----------|-----------|-----------|-------|-------|
| TCP | ✅ garantie | Oui (3-way) | ✅ | HTTP, SSH, BDD |
| UDP | ❌ best-effort | Non | ❌ | DNS, streaming, jeux |
| QUIC | ✅ par stream | Oui (1-RTT) | ✅/stream | HTTP/3 |
| SCTP | ✅ | Oui (4-way) | ✅ | Signalisation, 5G |
| DCCP | ❌ + CC | Oui | ❌ | Streaming temps réel |

## Liens

- [RFC 793 — TCP](https://www.rfc-editor.org/rfc/rfc793)
- [RFC 768 — UDP](https://www.rfc-editor.org/rfc/rfc768)
- [RFC 9000 — QUIC](https://www.rfc-editor.org/rfc/rfc9000)
