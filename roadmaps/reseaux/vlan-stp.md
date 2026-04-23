---
id: vlan-stp
parent: couche2-liaison
label: VLAN & STP
explored: false
order: 1
---

# VLAN & STP

Les VLANs segmentent logiquement le réseau. STP (Spanning Tree Protocol) prévient les boucles dans les réseaux Ethernet redondants.

## VLAN — Virtual Local Area Network

```
Sans VLAN : tous les hôtes d'un switch partagent le même domaine de broadcast
Avec VLAN  : segmentation logique indépendante du câblage

Avantages :
  - Isolation de sécurité (comptabilité, R&D, invités)
  - Réduction du domaine de broadcast → moins de trafic parasite
  - Organisation logique indépendante du câblage physique

VLAN 1    : VLAN natif par défaut (Cisco) — à éviter en production
VLAN 10   : exemple Serveurs
VLAN 20   : exemple Utilisateurs
VLAN 99   : exemple Management
VLAN 4094 : maximum (12 bits dans le tag 802.1Q)
```

## 802.1Q — Tag VLAN dans la trame Ethernet

```
Trame standard Ethernet :
[Dest MAC | Src MAC | EtherType | Données | FCS]

Trame tagged 802.1Q (ajout de 4 octets) :
[Dest MAC | Src MAC | 0x8100 | TCI | EtherType | Données | FCS]
                              └──┬──┘
                      TCI (Tag Control Information) :
                      ┌──────┬─────┬─────────────────┐
                      │ PCP  │ DEI │    VID (12 bits)  │
                      │ 3b   │ 1b  │    0–4094         │
                      └──────┴─────┴─────────────────┘
                      PCP = Priority Code Point (QoS 0-7)
                      DEI = Drop Eligible Indicator
                      VID = VLAN Identifier
```

## Ports Access vs Trunk

```
Port ACCESS  : appartient à un seul VLAN, trame non taguée vers le poste final
  PC ──── Access port (VLAN 10) ──── Switch

Port TRUNK   : transporte plusieurs VLANs avec tags 802.1Q (inter-switches, vers routeur)
  Switch ──── Trunk port ──── Switch / Routeur

Cisco IOS :
  switchport mode access
  switchport access vlan 10

  switchport mode trunk
  switchport trunk allowed vlan 10,20,99
  switchport trunk native vlan 99   ← VLAN natif (non tagué sur trunk)
```

## STP — Spanning Tree Protocol (IEEE 802.1D)

```
Problème : la redondance physique crée des boucles Ethernet
           → tempête de broadcast, duplication de trames, instabilité

Solution STP : élire un arbre couvrant sans boucle

Étapes STP :
  1. Election du Root Bridge (switch avec le Bridge ID le plus faible)
     Bridge ID = Priorité (32768 défaut) + MAC address
  2. Chaque switch non-root élit un Root Port (port le plus proche du root)
  3. Chaque segment élit un Designated Port
  4. Tous les autres ports → Blocking (bloqués mais écoutent les BPDUs)

États des ports :
  Blocking     → Listening → Learning → Forwarding  (→ Disabled)
  0 trafic       BPDUs ok    apprend MAC  trafic ok

Convergence STP  : 30–50 secondes (trop lent pour les réseaux modernes)
```

## RSTP & MSTP — évolutions modernes

```
RSTP (Rapid STP — IEEE 802.1w) :
  Convergence en 1–2 secondes
  Nouveaux états : Discarding, Learning, Forwarding
  Edge ports (PortFast) → Forwarding immédiat pour les postes
  Rétrocompatible avec 802.1D

MSTP (Multiple STP — IEEE 802.1s) :
  Une instance STP par groupe de VLANs
  Évite que tous les VLANs aient le même arbre
  → Permet de répartir le trafic sur des chemins différents

Cisco PVST+ : une instance STP par VLAN (propriétaire Cisco)
```

## Liens

- [RFC 7348 — VXLAN](https://www.rfc-editor.org/rfc/rfc7348)
- [IEEE 802.1Q — VLAN](https://standards.ieee.org/ieee/802.1Q/)
- [IEEE 802.1w — RSTP](https://standards.ieee.org/ieee/802.1w/)
