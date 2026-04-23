---
id: udp
parent: couche4-transport
label: UDP
explored: false
order: 2
---

# UDP — User Datagram Protocol

UDP est le protocole de transport **sans connexion et sans garantie**. Il envoie des datagrammes sans handshake, sans acquittement, sans ordre. Sa simplicité en fait le choix optimal pour les applications qui gèrent elles-mêmes la fiabilité ou qui préfèrent la rapidité à la garantie.

## En-tête UDP (8 octets — fixe)

```
 0      7 8     15 16    23 24    31
+--------+--------+--------+--------+
|   Source Port   | Destination Port|
+--------+--------+--------+--------+
|    Length       |    Checksum     |
+--------+--------+--------+--------+

Length   : taille totale du datagramme (en-tête + données), min 8
Checksum : optionnel en IPv4, obligatoire en IPv6
```

## TCP vs UDP — comparaison directe

```
                    TCP                     UDP
Connexion       3-way handshake           Aucune
Fiabilité       Garantie (retransmission) Aucune (best-effort)
Ordre           Garanti                   Non garanti
Débit           Contrôlé (cwnd)           Illimité
Latence         +1 RTT (handshake)        0 overhead
En-tête         20+ octets                8 octets
Fragmentation   Non (PMTUD)               Oui (si > MTU)
Broadcast       Non                       Oui
Multicast       Non                       Oui
```

## Cas d'usage UDP

```
DNS (port 53)
  Requête/réponse courte — TCP overhead injustifié
  Retry géré par le resolver (timeout 5s, 3 tentatives)
  Passage à TCP si réponse > 512 octets (ex: DNSSEC)

Streaming vidéo / audio
  Mieux vaut perdre une image que mettre en pause
  RTP (Real-time Transport Protocol) fonctionne sur UDP
  RTSP, WebRTC, VoIP (SIP/RTP)

Jeux en ligne
  Latence < fiabilité (mieux vaut ignorer un paquet vieux)
  Jitter buffer côté client pour lisser les arrivées

NTP (port 123)
  Synchronisation d'horloge — UDP simple et léger

DHCP (ports 67/68)
  Bootstrap réseau — pas encore d'IP pour TCP

SNMP (port 161/162)
  Monitoring — perte acceptable
```

## UDP avec fiabilité applicative

```
QUIC (RFC 9000) : UDP + fiabilité + chiffrement + multiplexing
  → base de HTTP/3

DTLS (Datagram TLS) : TLS adapté pour UDP
  → WebRTC data channels, VPN

KCP : protocole open-source sur UDP (meilleure perf que TCP)
  → Jeux, tunnel P2P

ENet : bibliothèque réseau pour jeux (UDP + ACK sélectif)
  → Utilisé dans Minecraft Bedrock
```

## Performances UDP

```bash
# iperf3 — test de bande passante UDP
iperf3 -s                          # serveur
iperf3 -c 192.168.1.1 -u -b 100M  # client UDP, 100 Mbps

# Voir les erreurs UDP (overrun = paquets perdus côté OS)
netstat -su        # Linux — statistiques UDP
ss -u -a           # sockets UDP actives
cat /proc/net/udp  # table UDP brute
```

## Multicast UDP

```
Groupe multicast : adresse de classe D (224.0.0.0/4)
  224.0.0.1   : tous les hôtes du segment
  224.0.0.2   : tous les routeurs
  239.0.0.0/8 : multicast privé (admin-scoped)

Protocole IGMP : un hôte s'abonne à un groupe
  IGMPv3 : source-specific multicast (SSM)

Usage : IPTV, audio/vidéo broadcast, découverte de services (mDNS, SSDP)
```

## Liens

- [RFC 768 — UDP](https://www.rfc-editor.org/rfc/rfc768)
- [RFC 3550 — RTP](https://www.rfc-editor.org/rfc/rfc3550)
