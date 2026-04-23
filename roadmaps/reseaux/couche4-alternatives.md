---
id: couche4-alternatives
parent: couche4-transport
label: Alternatives couche 4
explored: false
order: 4
---

# Alternatives couche 4 — Au-delà de TCP et UDP

TCP et UDP couvrent 99% des besoins, mais des cas spéciaux ont engendré des protocoles alternatifs pour des besoins spécifiques : multi-homing, streaming fiable, mobilité, congestion sans perte.

## SCTP — Stream Control Transmission Protocol (RFC 4960)

```
Développé pour la signalisation téléphonique (SS7 sur IP), standardisé 2000

Fonctionnalités uniques vs TCP :
  Multi-homing  : une connexion peut utiliser PLUSIEURS adresses IP
                  si un lien tombe, le trafic bascule sur l'autre (failover)
  Multi-stream  : plusieurs streams indépendants dans une association
                  → pas de HOL blocking entre streams
  Message-based : préserve les limites des messages (vs flux d'octets TCP)
  4-way handshake : avec COOKIE (protection DoS SYN flood)

Association (= connexion SCTP) :
  Client A [IP1, IP2] ←→ Serveur B [IP3, IP4]
  Si IP1 tombe → SCTP rebascule sur IP2 automatiquement

Usage :
  Télécoms 4G/5G : S1-AP, X2-AP, NGAP (signalisation entre eNodeB et cœur)
  SIGTRAN : SS7 over IP
  WebRTC data channels (via DTLS-SCTP)
  Diameter (AAA, facturation mobile)

Problème : NAT traverse mal SCTP → rare sur Internet public
```

## MPTCP — Multipath TCP (RFC 8684)

```
Extension de TCP pour utiliser PLUSIEURS chemins réseau simultanément

Principe :
  Une connexion applicative = plusieurs sous-flux TCP (subflows)
  Chaque subflow sur un chemin réseau différent

  Téléphone : Wi-Fi (192.168.1.x) + 4G (10.x.x.x)
  MPTCP envoie des données sur les deux simultanément
  → Bande passante agrégée OU failover transparent

Cas d'usage :
  iOS Apple : MPTCP actif pour Siri, AirDrop, et desde iOS 7
  Samsung DeX : agrégation Wi-Fi + LTE
  Opérateurs : agrégation de liens (bonding)
  DataCenters : paths multiples entre serveurs

Support kernel Linux : depuis 5.6 (Ubuntu 20.10+)
  ip mptcp endpoint add 192.168.2.1 dev eth1 subflow
  sysctl net.mptcp.enabled=1

Problème : middleboxes (load balancers) cassent MPTCP parfois
```

## DCCP — Datagram Congestion Control Protocol (RFC 4340)

```
Niche protocole : UDP avec contrôle de congestion mais sans fiabilité

Comble le vide entre TCP (fiable + CC) et UDP (ni fiable ni CC)

Mécanismes CCID (Congestion Control Identifier) :
  CCID 2 : similaire à TCP SACK (Additive Increase / Multiplicative Decrease)
  CCID 3 : TFRC (TCP-Friendly Rate Control) — débit lissé, convivial TCP

Usage prévu : streaming vidéo/audio temps réel (Skype, VoIP)
Réalité : QUIC a rendu DCCP obsolète avant même son adoption
Status : rarissime en production, support limité dans les OS
```

## RUDP — Reliable UDP (variantes)

```
Plusieurs implémentations ad-hoc de UDP fiable :

ENet (jeux)     : ACK sélectif, canaux ordonnés/non-ordonnés
RakNet          : moteur réseau Minecraft Bedrock, Unity
KCP             : protocole C open-source, 3x plus rapide que TCP
UDT             : transferts de fichiers haut débit (remplacé par QUIC)

Commun : implémentent fiabilité en userspace sur UDP
Avantage vs TCP : contrôle fin du trade-off latence/fiabilité
```

## RSVP — Resource reSerVation Protocol (RFC 2205)

```
Protocole de signalisation pour réserver de la bande passante sur un chemin

PATH message  : de la source vers la destination (découverte du chemin)
RESV message  : de la destination vers la source (réservation)

Soft state : les réservations doivent être régulièrement rafraîchies
Usage : QoS garantie dans les réseaux télécom, remplacé par DiffServ + MPLS
Status : quasi-obsolète sur Internet public, encore dans des réseaux privés
```

## Liens

- [RFC 4960 — SCTP](https://www.rfc-editor.org/rfc/rfc4960)
- [RFC 8684 — MPTCP](https://www.rfc-editor.org/rfc/rfc8684)
- [RFC 4340 — DCCP](https://www.rfc-editor.org/rfc/rfc4340)
- [KCP — Fast ARQ Protocol](https://github.com/skywind3000/kcp)
