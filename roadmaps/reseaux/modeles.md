---
id: modeles
parent: root
label: Modèles de référence
explored: true
order: 1
---

# Modèles de référence

Les modèles OSI et TCP/IP sont des abstractions qui décomposent la communication réseau en couches indépendantes. Chaque couche a une responsabilité précise et ne communique qu'avec les couches adjacentes.

## Le principe de l'encapsulation

Chaque couche ajoute son propre **en-tête** (header) aux données reçues de la couche supérieure avant de les transmettre vers le bas. À la réception, chaque couche retire son en-tête et remonte les données.

```
Couche N+1  →  Données
Couche N    →  [En-tête N | Données]        ← encapsulation
Couche N-1  →  [En-tête N-1 | En-tête N | Données]
```

## PDU (Protocol Data Unit) — nom des données par couche

| Couche OSI | PDU | Exemple |
|-----------|-----|---------|
| 7 Application | Message / Data | "GET /index HTTP/1.1" |
| 4 Transport | Segment (TCP) / Datagramme (UDP) | TCP segment, UDP datagram |
| 3 Réseau | Paquet | IP packet |
| 2 Liaison | Trame | Ethernet frame |
| 1 Physique | Bits | 010110… |

## Liens

- [OSI Model — Wikipedia](https://en.wikipedia.org/wiki/OSI_model)
- [RFC 1122 — Requirements for Internet Hosts](https://www.rfc-editor.org/rfc/rfc1122)
