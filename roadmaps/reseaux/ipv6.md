---
id: ipv6
parent: couche3-reseau
label: IPv6
explored: false
order: 1
---

# IPv6

IPv6 est le successeur d'IPv4, conçu pour résoudre l'épuisement des adresses. Il apporte 340 undécillions d'adresses, un en-tête simplifié, l'autoconfiguration sans état (SLAAC), et IPsec natif.

## Format des adresses IPv6

```
128 bits = 8 groupes de 4 chiffres hexadécimaux séparés par ":"
2001:0db8:85a3:0000:0000:8a2e:0370:7334

Règles d'abréviation :
  1. Supprimer les zéros en tête de chaque groupe
     2001:db8:85a3:0:0:8a2e:370:7334
  2. Remplacer une séquence de groupes "0000" par "::" (une seule fois)
     2001:db8:85a3::8a2e:370:7334

Exemples :
  ::1              → loopback (équivalent 127.0.0.1)
  ::               → adresse non spécifiée (0.0.0.0)
  fe80::/10        → Link-local (autoconfigurée, non routable)
  fc00::/7         → Unique local (RFC 4193 — équivalent RFC 1918)
  2000::/3         → Global unicast (adresses routables sur Internet)
  ff00::/8         → Multicast (remplace le broadcast)
  2001:db8::/32    → Documentation / exemples (RFC 3849)
```

## Notation CIDR et sous-réseaux

```
Un /48  → attribué à un site (65 536 sous-réseaux /64)
Un /64  → un sous-réseau (18 quintillions d'adresses hôte !)
Un /128 → adresse hôte unique

Exemple d'allocation :
  ISP              → 2001:db8::/32  (ISP entier)
  Entreprise       → 2001:db8:cafe::/48
  VLAN Serveurs    → 2001:db8:cafe:10::/64
  VLAN Users       → 2001:db8:cafe:20::/64
```

## Autoconfiguration — SLAAC vs DHCPv6

```
SLAAC (Stateless Address Autoconfiguration — RFC 4862) :
  1. Interface génère une adresse link-local fe80::/64
  2. Envoie un RS (Router Solicitation) → ff02::2 (tous les routeurs)
  3. Routeur répond par un RA (Router Advertisement) avec le préfixe
  4. Interface construit son adresse = Préfixe + EUI-64 (ou random privacy)
  → Zéro serveur requis !

EUI-64 : adresse MAC étendue à 64 bits
  MAC   : 00:1A:2B:3C:4D:5E
  EUI-64: 02:1A:2B:FF:FE:3C:4D:5E  (FF:FE inséré, bit U/L inversé)
  SLAAC : 2001:db8:cafe:10:21a:2bff:fe3c:4d5e

Privacy extensions (RFC 4941) : adresse temporaire aléatoire — préférable à EUI-64
  (évite le tracking via l'adresse MAC dans l'adresse IPv6)

DHCPv6 stateful : attribut des adresses + options (DNS, NTP…)
DHCPv6 stateless: pas d'adresses — seulement les options (DNS, NTP…) + SLAAC
```

## En-tête IPv6 — simplifié vs IPv4

```
IPv4 header : 20–60 octets, champs variables, checksum, fragmentation
IPv6 header : 40 octets FIXES, pas de checksum, fragmentation par la source

Champs IPv6 :
  Version (4b)     : 6
  Traffic Class    : DSCP + ECN (QoS)
  Flow Label (20b) : identifie un flux → QoS stateless
  Payload Length   : taille des données après l'en-tête
  Next Header      : type de la suite (TCP=6, UDP=17, ICMPv6=58, Fragment=44)
  Hop Limit        : équivalent TTL
  Source / Dest    : 128 bits chacun
```

## NDP — Neighbor Discovery Protocol (remplace ARP)

```
ICMPv6 type 135 : Neighbor Solicitation  (équivalent ARP Request)
ICMPv6 type 136 : Neighbor Advertisement (équivalent ARP Reply)
ICMPv6 type 133 : Router Solicitation
ICMPv6 type 134 : Router Advertisement
ICMPv6 type 137 : Redirect

Avantages sur ARP :
  - Multicast ciblé (pas de broadcast)
  - Intégré à IPv6 (pas de protocole séparé)
  - SEND (Secure Neighbor Discovery) — protection cryptographique

ip -6 neigh show     # Linux — équivalent "arp -n" pour IPv6
```

## Transition IPv4 → IPv6

```
Dual-stack   : hôte avec IPv4 ET IPv6 → préfère IPv6 (Happy Eyeballs — RFC 8305)
Tunnels 6to4 : encapsule IPv6 dans IPv4 (6in4, ISATAP, Teredo)
NAT64/DNS64  : permet aux clients IPv6-only d'atteindre les serveurs IPv4-only
               → DNS64 retourne une adresse synthétique 64:ff9b::/96 + IPv4
```

## Liens

- [RFC 8200 — IPv6](https://www.rfc-editor.org/rfc/rfc8200)
- [RFC 4862 — SLAAC](https://www.rfc-editor.org/rfc/rfc4862)
- [RFC 8305 — Happy Eyeballs v2](https://www.rfc-editor.org/rfc/rfc8305)
- [IPv6 Adoption Stats](https://www.google.com/intl/en/ipv6/statistics.html)
