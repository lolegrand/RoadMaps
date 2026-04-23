---
id: couche3-alternatives
parent: couche3-reseau
label: Alternatives couche 3
explored: false
order: 3
---

# Alternatives couche 3 — Au-delà d'IP

IP a remporté la guerre des protocoles réseau dans les années 90, mais ses concurrents ont des concepts toujours pertinents, et de nouvelles approches émergent.

## IPX/SPX — Novell NetWare (†)

```
Développé par Novell dans les années 80, dominant avant IP dans les LAN
IPX (Internetwork Packet eXchange) : couche réseau
SPX (Sequenced Packet eXchange)     : couche transport

Adressage : adresse réseau (32 bits) + adresse nœud (48 bits = MAC)
→ Pas de configuration manuelle (numéro de réseau = numéro de câble)

Protocoles associés :
  SAP (Service Advertising Protocol) : broadcast de services disponibles
  NCP (NetWare Core Protocol)        : accès aux fichiers Novell

Déclin : supplanté par TCP/IP dans les années 2000
         Microsoft Active Directory + SMB ont remplacé NetWare
Héritage: GNS (Get Nearest Server) a influencé le concept de anycast
```

## CLNP — OSI Connectionless Network Protocol (ISO 8473)

```
Le protocole réseau défini par l'ISO (par opposition à l'IP de l'IETF)
Adressage NSAP : adresses variables (8–20 octets), extrêmement flexibles

PDU CLNP : similaire à IP mais avec des champs différents
  CLNP n'a jamais réussi à s'imposer malgré le soutien des gouvernements

IS-IS (Intermediate System to Intermediate System) :
  Protocole de routage CLNP, adopté par Internet (avec extensions IP)
  Toujours très utilisé par les FAI et les grandes entreprises

DECnet Phase IV / Phase V :
  Stack réseau de Digital Equipment Corporation
  Phase V utilisait CLNP/OSI
  Adresses DEC : aa:00:04:xx:yy:zz (adresses MAC DEC reconnaissables)
```

## LISP — Locator/ID Separation Protocol (RFC 6830)

```
Problème fondamental d'IP : une adresse IP joue deux rôles simultanément
  1. Identité (qui es-tu ?)
  2. Localisation (où es-tu ?)
  → Impossible d'être mobile sans changer d'adresse

LISP sépare ces deux rôles :
  EID (Endpoint Identifier)    : identité de l'hôte (immuable)
  RLOC (Routing LOCator)       : localisation sur le réseau (change si mobilité)

Fonctionnement :
  xTR (tunnel router) encapsule les paquets EID dans RLOC
  Map Server / Map Resolver : base de données EID → RLOC

Usage actuel :
  Cisco SD-WAN (vManage) utilise LISP comme plan de contrôle
  AWS VPN Gateway utilise des concepts LISP
  Mobilité IPv6 (RFC 5944) partage la même philosophie
```

## Segment Routing (SR)

```
Développé par Cisco, standardisé IETF (RFC 8402)
Principe : encoder le chemin complet dans l'en-tête du paquet lui-même
           → pas de signalisation per-flow dans les routeurs intermédiaires

SR-MPLS : utilise la pile MPLS pour encoder les segments
SR-v6   : utilise un en-tête IPv6 d'extension (SRH — Segment Routing Header)

Segment : identifiant d'une instruction de forwarding
  Adj segment   : forwarder vers un voisin spécifique
  Node segment  : forwarder vers un nœud (chemin optimal)
  Service segment : appliquer une fonction (firewall, VPN...)

Avantages vs MPLS classique :
  - Pas de LDP/RSVP-TE pour distribuer les labels → moins de protocoles
  - Traffic engineering simplifié (TI-LFA — Topology-Independent Loop-Free Alternates)
  - SRv6 : interopérabilité native avec IPv6

Usage : backbone des grands FAI, 5G mobile backhaul, SD-WAN entreprise
```

## Named Data Networking (NDN) — architecture future

```
Projet académique (USC/ISI, 2010) — remplacer IP par une approche data-centric

Au lieu d'adresser les machines (Where ?), adresser les données (What ?)

Interest Packet : "/example.com/news/latest" (je veux ces données)
Data Packet     : retourne les données signées cryptographiquement

Avantages théoriques :
  - Cache distribué natif (chaque routeur peut mettre en cache)
  - Sécurité au niveau des données (pas besoin de canal sécurisé)
  - Multicast natif (plusieurs consommateurs = une seule requête)
  - Mobilité naturelle

Réalité : pas déployé sur Internet public, recherche académique
```

## Liens

- [RFC 6830 — LISP](https://www.rfc-editor.org/rfc/rfc6830)
- [RFC 8402 — Segment Routing](https://www.rfc-editor.org/rfc/rfc8402)
- [Named Data Networking](https://named-data.net/)
