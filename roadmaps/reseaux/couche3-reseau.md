---
id: couche3-reseau
parent: root
label: Couche 3 — Réseau
explored: true
order: 4
---

# Couche 3 — Réseau

La couche réseau assure l'**adressage logique** et le **routage** des paquets entre réseaux différents. C'est la couche où vit l'adresse IP — identifiant universel de chaque interface sur Internet.

## IP — Internet Protocol

IP est un protocole **non-orienté connexion, non-fiable, best-effort** : il fait de son mieux pour livrer les paquets mais ne garantit ni l'ordre, ni la livraison. La fiabilité est déléguée aux couches supérieures (TCP).

## IPv4 — En-tête

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
├───┤───────┤───────────────┤──────────────────────────────────────┤
│Ver│  IHL  │      DSCP     │              Total Length            │
├───────────────────────────┤──┤───────────────────────────────────┤
│        Identification     │Fl│         Fragment Offset           │
├───────────────┤───────────┤──────────────────────────────────────┤
│      TTL      │ Protocol  │           Header Checksum            │
├───────────────────────────────────────────────────────────────────┤
│                      Source IP Address                            │
├───────────────────────────────────────────────────────────────────┤
│                   Destination IP Address                          │
└───────────────────────────────────────────────────────────────────┘

TTL (Time To Live) : décrémenté par chaque routeur → évite les boucles infinies
Protocol : 6=TCP  17=UDP  1=ICMP  89=OSPF  47=GRE  50=ESP (IPsec)
```

## Sous-réseaux et CIDR

```
CIDR (Classless Inter-Domain Routing) :
  192.168.1.0/24   → masque 255.255.255.0  → 254 hôtes
  10.0.0.0/8       → masque 255.0.0.0      → 16 777 214 hôtes
  172.16.0.0/12    → masque 255.240.0.0    → 1 048 574 hôtes

Adresses privées (RFC 1918) — non routables sur Internet :
  10.0.0.0/8         (Classe A privée)
  172.16.0.0/12      (Classe B privée)
  192.168.0.0/16     (Classe C privée)

Adresses spéciales :
  127.0.0.1/8        Loopback
  169.254.0.0/16     Link-local (APIPA — pas de DHCP)
  224.0.0.0/4        Multicast
  255.255.255.255    Broadcast limité

Découper un /24 en sous-réseaux :
  /25 → 2 réseaux de 126 hôtes
  /26 → 4 réseaux de 62 hôtes
  /27 → 8 réseaux de 30 hôtes
  /28 → 16 réseaux de 14 hôtes
  /30 → 64 réseaux de 2 hôtes (liaisons point-à-point)
  /32 → adresse hôte unique (loopback, routes statiques)
```

## NAT — Network Address Translation

```
Problème   : épuisement des adresses IPv4 publiques (~4 milliards)
Solution   : partager une seule IP publique entre plusieurs hôtes privés

NAT statique  : 1 IP privée ↔ 1 IP publique (serveurs exposés)
NAT dynamique : pool d'IPs publiques pour les connexions sortantes
PAT / NAPT    : 1 IP publique, ports différents (masquerading) — le plus courant
  192.168.1.10:12345 → 203.0.113.1:54321 (sortant)
  203.0.113.1:54321  → 192.168.1.10:12345 (retour)

Inconvénients NAT :
  - Casse le modèle end-to-end d'Internet
  - Complique les protocoles qui embarquent des IPs (FTP actif, SIP, IPsec)
  - NAT traversal requis pour P2P (STUN, TURN, ICE)
```

## ICMP — Internet Control Message Protocol

```
Rôle : messages de contrôle et d'erreur de la couche réseau

Types importants :
  0  Echo Reply            ← réponse à ping
  3  Destination Unreachable (code 0–15 selon la raison)
     code 0: Network Unreachable
     code 1: Host Unreachable
     code 3: Port Unreachable (UDP port fermé)
     code 4: Fragmentation Needed (PMTUD)
  8  Echo Request          → ping
  11 Time Exceeded         ← TTL=0 → traceroute
  12 Parameter Problem
  13 Timestamp Request / Reply

Blocage ICMP : mauvaise pratique — PMTUD et diagnostic en souffrent
```

## Liens

- [RFC 791 — IPv4](https://www.rfc-editor.org/rfc/rfc791)
- [RFC 792 — ICMP](https://www.rfc-editor.org/rfc/rfc792)
- [RFC 4632 — CIDR](https://www.rfc-editor.org/rfc/rfc4632)
- [Subnet Calculator](https://www.subnet-calculator.com/)
