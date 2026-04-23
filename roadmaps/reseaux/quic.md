---
id: quic
parent: couche4-transport
label: QUIC / HTTP3
explored: false
order: 3
---

# QUIC — Quick UDP Internet Connections

QUIC est un protocole de transport développé par Google (2012), standardisé par l'IETF en 2021 (RFC 9000). Il tourne sur UDP et combine les fonctionnalités de TCP + TLS + HTTP/2 en un seul protocole. C'est la base de HTTP/3.

## Pourquoi QUIC ?

```
Problèmes de TCP+TLS pour le web moderne :

1. Head-of-Line Blocking (HOL)
   HTTP/2 multiplex sur TCP : un paquet perdu bloque TOUS les streams
   → QUIC : chaque stream est indépendant, une perte ne bloque que ce stream

2. Latence de connexion
   TCP + TLS 1.3 : 1 RTT TCP + 1 RTT TLS = 2 RTT avant les données
   QUIC           : 1 RTT (ou 0-RTT si session précédente)

3. Ossification du réseau
   TCP est dans le kernel OS → difficile à modifier
   QUIC est en userspace → peut évoluer rapidement (Google déploie en semaines)

4. Mobilité
   TCP = identifié par (src IP, src port, dst IP, dst port)
   → Changer de Wi-Fi au 4G casse la connexion
   QUIC = identifié par Connection ID (64 bits)
   → Migration transparente sans rupture de session
```

## Architecture QUIC

```
Application (HTTP/3, DNS-over-QUIC…)
     ↓
QUIC (streams, fiabilité, contrôle de congestion)
     ↓
TLS 1.3 (intégré — chiffrement obligatoire)
     ↓
UDP
     ↓
IP
```

## Handshake — 1 RTT (ou 0-RTT)

```
Première connexion (1 RTT) :
  Client → Serveur : Initial (CRYPTO frame — TLS ClientHello)
  Serveur → Client : Initial + Handshake (TLS ServerHello + certificat)
  Client → Serveur : Handshake (TLS Finished) + données applicatives

  Total : 1 RTT avant de recevoir les premières données

0-RTT (connexion répétée) :
  Si le client a une session précédente (resumption ticket)
  Client envoie des données dans le premier paquet
  → latence quasi nulle
  Risque : replay attacks (données 0-RTT peuvent être rejouées)
```

## Streams QUIC

```
Un stream = flux de données bidirectionnel ou unidirectionnel

Types de streams (4 types) :
  0 : bidirectionnel, initié par le client
  1 : unidirectionnel, initié par le client
  2 : bidirectionnel, initié par le serveur
  3 : unidirectionnel, initié par le serveur

Avantage vs HTTP/2 sur TCP :
  HTTP/2  → 1 TCP connection, N streams, HOL si paquet perdu
  QUIC    → N streams indépendants, perte isolée par stream
```

## QUIC vs TCP — tableau

```
                    TCP + TLS 1.3           QUIC
Handshake           2 RTT (ou 1 RTT TLS)   1 RTT (0-RTT possible)
Chiffrement         Optionnel (TLS)         Obligatoire (TLS 1.3 intégré)
HOL Blocking        Oui                     Non (par stream)
Multiplexing        HTTP/2 applicatif       Natif dans QUIC
Migration réseau    Non (reset connexion)   Oui (Connection ID)
Protocole           Noyau OS               Userspace (évolution rapide)
Overhead header     20 octets              Variable (8+ octets)
Fragmentation IP    Gérée                  Évitée (DPLPMTUD)
```

## HTTP/3 sur QUIC

```
HTTP/3 = HTTP sémantique (méthodes, headers, status codes)
         transporté sur QUIC au lieu de TCP

QPACK : compression d'en-têtes HTTP/3 (≈ HPACK d'HTTP/2, adapté QUIC)
QPACK évite le HOL de HPACK qui dépendait de l'ordre TCP

curl --http3 https://cloudflare.com  # nécessite curl compilé avec QUIC
```

## Adoption et support

```
Serveurs :
  nginx (avec patch nginx-quic), Caddy, H2O, LiteSpeed
  Cloudflare, Google, Facebook : QUIC en production depuis 2020

Clients :
  Chrome/Chromium : QUIC activé par défaut
  Firefox : HTTP/3 activé par défaut
  curl : support --http3 (build avec quiche ou ngtcp2)

Statistiques (2024) :
  ~28% du trafic HTTP mondial passe sur HTTP/3
  Cloudflare : 30% de requêtes HTTP/3

Problème terrain : certains firewalls bloquent UDP/443
  → Fallback automatique TCP+TLS
```

## Liens

- [RFC 9000 — QUIC Transport](https://www.rfc-editor.org/rfc/rfc9000)
- [RFC 9114 — HTTP/3](https://www.rfc-editor.org/rfc/rfc9114)
- [Cloudflare — The QUIC Protocol](https://www.cloudflare.com/learning/performance/what-is-http3/)
- [quic.xargs.org — visualisation handshake](https://quic.xargs.org/)
