---
id: mpls-sdwan
parent: routage-avance
label: MPLS et SD-WAN
explored: false
order: 3
---

# MPLS et SD-WAN

MPLS est la technologie de transport backbone des opérateurs depuis 25 ans. SD-WAN est son successeur "cloud-native" pour les entreprises multi-sites. Les deux coexistent et se complètent.

## MPLS — Multiprotocol Label Switching (RFC 3031)

```
Problème que MPLS résout :
  Le routage IP classique examine le header IP complet à chaque saut
  → Lent sur les vieux matériels, pas de TE (Traffic Engineering)

Principe MPLS :
  À l'entrée du réseau MPLS : push d'un label (32 bits) dans l'en-tête
  Dans le réseau MPLS       : forwarding basé sur le LABEL uniquement (rapide)
  À la sortie               : pop du label, retour au routage IP

Label MPLS (32 bits) :
  Label (20 bits) : identifiant de la FEC (Forwarding Equivalence Class)
  TC   (3 bits)  : Traffic Class (ex-EXP) — QoS
  S    (1 bit)   : Bottom of Stack (1 si dernier label)
  TTL  (8 bits)  : evite les boucles

Position dans la trame :
  [ Ethernet Header ][ MPLS Label(s) ][ IP Header ][ Data ]
  ← couche 2       →← couche 2.5   →← couche 3  →
  MPLS est souvent appelé "layer 2.5"
```

## LSP — Label Switched Path

```
LSP : chemin prédéfini à travers le réseau MPLS, identifié par des labels

LDP (Label Distribution Protocol) :
  Distribue automatiquement les labels en suivant les routes IGP
  Simple, déterministe

RSVP-TE (Resource Reservation Protocol - Traffic Engineering) :
  LSP explicites avec réservation de ressources (bande passante)
  Permet le traffic engineering : forcer un flux par un chemin non-optimal IGP

Terminologie :
  LER (Label Edge Router) : routeur d'entrée/sortie du réseau MPLS
  LSR (Label Switching Router) : routeur cœur MPLS (forward par label)
  FEC (Forwarding Equivalence Class) : groupe de paquets traités pareil
```

## MPLS VPN (L3VPN — RFC 4364)

```
L'usage le plus courant de MPLS : VPN d'opérateur pour entreprises multi-sites

Architecture :
  CE (Customer Edge)   : routeur du client
  PE (Provider Edge)   : routeur opérateur en bordure → parle BGP+MPLS
  P  (Provider)        : routeur cœur MPLS (ne connaît pas les VRF client)

VRF (Virtual Routing and Forwarding) :
  Table de routage virtuelle par client/site
  2 clients peuvent utiliser les mêmes adresses privées (RFC 1918) sans collision

Route Distinguisher (RD) :
  Préfixe 64 bits ajouté aux routes pour les rendre uniques dans BGP
  64512:1 + 192.168.1.0/24 → VPNv4 route

Route Target (RT) :
  Contrôle l'import/export entre VRF
  → Permet des topologies hub-spoke ou full-mesh entre sites

Double stack MPLS :
  MPLS IGP (LDP/RSVP-TE) : transport interne opérateur
  BGP VPNv4              : distribution des routes client
```

## SD-WAN — Software-Defined Wide Area Network

```
Problème de MPLS traditionnel :
  Cher (circuits dédiés opérateur)
  Rigide (semaines pour modifier)
  Pas cloud-native (trafic vers SaaS doit passer par DC central)

SD-WAN :
  Overlay sur des liens quelconques (MPLS, Internet, 4G/5G, satellite)
  Plan de contrôle centralisé (logiciel, cloud)
  Politique applicative intelligente (QoS, routage par app, sécurité)

Architecture typique :
  vManage (orchestrateur) : UI, politiques, monitoring
  vSmart Controller       : distribue les politiques aux routeurs
  vBond Orchestrator      : authentification initiale, NAT traversal
  vEdge / cEdge Routers   : routeurs SD-WAN aux sites

Fonctionnalités clés :
  Application-Aware Routing : router Teams sur MPLS, email sur Internet
  DPI (Deep Packet Inspection) : identifier les apps (sans proxy)
  Direct Cloud Access : sortie Internet locale au site (vs backhauling)
  Zero-Touch Provisioning (ZTP) : déploiement automatique

Principaux fournisseurs :
  Cisco SD-WAN (ex-Viptela)
  VMware VeloCloud
  Fortinet SD-WAN
  Palo Alto Prisma SD-WAN
  Cato Networks (SASE intégré)
```

## MPLS vs SD-WAN

```
                    MPLS                SD-WAN
Transport           Circuit dédié       N'importe quel lien
Coût                Élevé               Faible (Internet)
SLA (jitter/perte)  Garanti opérateur   Variable (peut être amélioré)
Sécurité            Isolé (L3VPN)       Tunnel chiffré (IPsec/WireGuard)
Flexibilité         Faible              Haute (logicielle)
Cloud              Inefficace           Natif (Direct Cloud Access)
QoS                DSCP end-to-end      Par application (DPI)
Déploiement         Semaines            Minutes (ZTP)

Réalité terrain : les deux coexistent
  MPLS conservé pour sites critiques (usines, hôpitaux) — garantie SLA
  SD-WAN pour sites secondaires et failover
  Tendance : migration progressive vers SD-WAN only + SASE
```

## Liens

- [RFC 3031 — MPLS Architecture](https://www.rfc-editor.org/rfc/rfc3031)
- [RFC 4364 — BGP/MPLS VPN (L3VPN)](https://www.rfc-editor.org/rfc/rfc4364)
- [Cisco SD-WAN](https://www.cisco.com/c/en/us/solutions/enterprise-networks/sd-wan/index.html)
