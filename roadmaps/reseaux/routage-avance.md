---
id: routage-avance
parent: root
label: Routage avancé
explored: false
order: 6
---

# Routage avancé

Le routage avancé couvre les protocoles qui permettent à Internet de fonctionner à grande échelle : BGP entre opérateurs, OSPF/IS-IS dans les réseaux d'entreprise, et MPLS/SD-WAN pour le transport optimisé.

## Terminologie

```
IGP (Interior Gateway Protocol)  : protocole de routage INTRA-AS
  → OSPF, IS-IS, EIGRP, RIP
  → Optimise le chemin à l'intérieur d'un réseau

EGP (Exterior Gateway Protocol)  : protocole de routage INTER-AS
  → BGP (seul EGP utilisé sur Internet)
  → Échange de politiques entre opérateurs

AS (Autonomous System) : ensemble de réseaux sous une même politique de routage
  → Chaque opérateur, entreprise connectée à Internet a un ASN
  → ASN sur 32 bits : 1–64495 (publics), 64512–65534 (privés)
  → Exemples : AS15169 (Google), AS32934 (Facebook), AS3356 (Lumen)
```

## Protocoles enfants

| Protocole | Type | Algorithme | Usage |
|-----------|------|------------|-------|
| BGP | EGP | Path vector | Internet inter-AS |
| OSPF | IGP | Dijkstra (SPF) | Entreprises, FAI |
| IS-IS | IGP | Dijkstra | FAI, datacenters |
| EIGRP | IGP | DUAL | Réseaux Cisco |
| RIP | IGP | Bellman-Ford | Obsolète |
| MPLS | Plan de données | — | Transport optimisé |

## Liens

- [RFC 4271 — BGP-4](https://www.rfc-editor.org/rfc/rfc4271)
- [RFC 2328 — OSPF v2](https://www.rfc-editor.org/rfc/rfc2328)
- [RFC 3031 — MPLS](https://www.rfc-editor.org/rfc/rfc3031)
