---
id: osi
parent: modeles
label: Modèle OSI — 7 couches
explored: true
order: 1
---

# Modèle OSI — 7 couches

Le modèle OSI (Open Systems Interconnection) a été développé par l'ISO en 1984. Il divise la communication en 7 couches, chacune ayant une responsabilité précise et échangeant uniquement avec ses voisines directes.

## Les 7 couches en détail

```
┌──────┬──────────────────┬────────────────────────────────────────────────────┐
│  N°  │ Nom              │ Rôle & Protocoles                                  │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  7   │ Application      │ Interface avec l'utilisateur                       │
│      │                  │ HTTP, HTTPS, FTP, SMTP, DNS, SSH, SNMP, LDAP       │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  6   │ Présentation     │ Format, encodage, chiffrement, compression         │
│      │                  │ TLS/SSL, MIME, ASCII, Unicode, JPEG, MPEG          │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  5   │ Session          │ Ouverture, gestion, fermeture des sessions         │
│      │                  │ NetBIOS, RPC, NFS, SMB, SQL sessions               │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  4   │ Transport        │ Fiabilité, contrôle de flux, multiplexage ports    │
│      │                  │ TCP, UDP, SCTP, QUIC, DCCP                         │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  3   │ Réseau           │ Adressage logique, routage inter-réseaux           │
│      │                  │ IP (v4/v6), ICMP, OSPF, BGP, RIP, MPLS            │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  2   │ Liaison données  │ Adressage physique (MAC), détection d'erreurs      │
│      │                  │ Ethernet, Wi-Fi (802.11), ARP, STP, VLAN (802.1Q) │
├──────┼──────────────────┼────────────────────────────────────────────────────┤
│  1   │ Physique         │ Transmission des bits bruts sur le medium          │
│      │                  │ Ethernet câblé, Fibre optique, Wi-Fi (RF), USB     │
└──────┴──────────────────┴────────────────────────────────────────────────────┘
```

## Moyen mnémotechnique

```
Anglais (haut → bas) : All People Seem To Need Data Processing
Français (bas → haut) : Pour Les Réseaux Techniques Posez Des Questions
                         1-Phy  2-Lia 3-Rés 4-Tra 5-Ses 6-Prés 7-App
```

## Où intervient chaque équipement réseau ?

```
Couche 7 — Firewall applicatif (WAF), Proxy, Load Balancer L7
Couche 4 — Firewall stateful, Load Balancer L4
Couche 3 — Routeur, Firewall L3
Couche 2 — Switch, Bridge, Access Point Wi-Fi
Couche 1 — Hub, Câble, Répéteur, Convertisseur fibre
```

## Avantages du modèle en couches

- **Interopérabilité** : chaque couche peut être remplacée indépendamment (ex : passer de IPv4 à IPv6 sans changer TCP)
- **Isolation** : une panne à la couche 3 ne concerne pas la couche 1
- **Débogage** : identifier à quelle couche se situe un problème (`ping` = couche 3, `telnet host port` = couche 4)

## Liens

- [RFC 1983 — Internet Users' Glossary](https://www.rfc-editor.org/rfc/rfc1983)
- [Cisco — OSI Model](https://learningnetwork.cisco.com/s/article/osi-model-reference-chart)
