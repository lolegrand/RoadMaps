---
id: tcp
parent: couche4-transport
label: TCP
explored: false
order: 1
---

# TCP — Transmission Control Protocol

TCP est le protocole de transport **fiable** d'Internet. Il garantit que tous les octets arrivent, dans l'ordre, exactement une fois. Cette fiabilité a un coût : latence et overhead de connexion.

## En-tête TCP (20 octets minimum)

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |       |U|A|P|R|S|F|                                   |
| Offset|  Rés. |R|C|S|S|Y|I|            Window                |
|       |       |G|K|H|T|N|N|                                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Sequence Number   : position du premier octet de ce segment dans le flux
Acknowledgment    : prochain octet attendu (= ACK)
Flags             : SYN, ACK, FIN, RST, PSH, URG
Window            : fenêtre de réception (contrôle de flux)
```

## 3-Way Handshake — établissement de connexion

```
Client                          Serveur
  |                               |
  |  SYN (seq=x)                  |   → "je veux me connecter, mon seq initial = x"
  |----------------------------→  |
  |                               |
  |  SYN-ACK (seq=y, ack=x+1)    |   → "ok, mon seq = y, j'attends x+1"
  |  ←----------------------------  |
  |                               |
  |  ACK (ack=y+1)                |   → "reçu, j'attends y+1"
  |----------------------------→  |
  |                               |
  |     Connexion établie         |

Durée : 1 RTT (Round Trip Time)
TCP Fast Open (TFO) : permet d'envoyer des données dans le SYN (cookie)
```

## 4-Way Handshake — fermeture de connexion

```
Client                          Serveur
  |  FIN                          |   → "je n'ai plus rien à envoyer"
  |----------------------------→  |
  |  ACK                          |   → "ok, reçu"
  |  ←----------------------------  |
  |                               |
  |  FIN                          |   → "moi non plus"
  |  ←----------------------------  |
  |  ACK                          |
  |----------------------------→  |

État TIME_WAIT : le client attend 2×MSL (Maximum Segment Lifetime ≈ 2min)
avant de libérer le port — évite les ACK perdus et les connexions fantômes
```

## Contrôle de flux — Fenêtre glissante

```
Sender ne peut pas envoyer plus que min(cwnd, rwnd) octets sans ACK

rwnd (receive window)   : annoncé par le récepteur (champ Window)
cwnd (congestion window): calculé par le sender

Cas normal :
  Sender  [1][2][3][4][5][6][7][8]...
                  ↑           ↑
              ACK reçu    Limite fenêtre (ne pas dépasser)
```

## Contrôle de congestion

```
Slow Start :
  cwnd = 1 MSS (Maximum Segment Size, ≈1460 octets sur Ethernet)
  À chaque ACK : cwnd += 1 MSS
  Croissance exponentielle jusqu'au ssthresh

Congestion Avoidance (après ssthresh) :
  cwnd += MSS²/cwnd par RTT  → croissance linéaire

Détection de congestion :
  Timeout → ssthresh = cwnd/2, cwnd = 1, retour Slow Start
  3 ACK dupliqués → Fast Retransmit + Fast Recovery (TCP Reno/CUBIC)

Algorithmes modernes :
  CUBIC    : Linux par défaut, optimisé haut débit
  BBR (v3) : Google, basé sur la bande passante réelle (pas les pertes)
```

## États TCP

```
LISTEN       : serveur attend une connexion
SYN_SENT     : client a envoyé SYN, attend SYN-ACK
SYN_RECEIVED : serveur a reçu SYN, envoyé SYN-ACK
ESTABLISHED  : connexion active (transfert de données)
FIN_WAIT_1   : FIN envoyé, attend ACK
FIN_WAIT_2   : ACK reçu, attend FIN du pair
CLOSE_WAIT   : FIN reçu, attend que l'appli ferme
CLOSING      : les deux ont envoyé FIN simultanément
LAST_ACK     : attend le dernier ACK
TIME_WAIT    : attend 2×MSL avant de libérer le port

ss -tn state established   # Linux — affiche les connexions établies
netstat -an | grep LISTEN  # macOS/Linux — ports en écoute
```

## Options TCP importantes

```
MSS (Maximum Segment Size)     : taille max d'un segment (MTU - 40)
Window Scale (RFC 7323)        : multiplie la fenêtre × 2^n (> 64KB)
SACK (Selective ACK)           : accuse réception de blocs non contigus
Timestamps                     : mesure du RTT, protection PAWS
TCP Keep-Alive                 : détecte les connexions mortes

# Linux — voir/modifier les paramètres TCP
ss -i    # détails de chaque socket
sysctl net.ipv4.tcp_congestion_control   # cubic par défaut
sysctl net.core.rmem_max                 # buffer de réception max
```

## Liens

- [RFC 793 — TCP](https://www.rfc-editor.org/rfc/rfc793)
- [RFC 5681 — Contrôle de congestion TCP](https://www.rfc-editor.org/rfc/rfc5681)
- [RFC 9293 — TCP (mise à jour 2022)](https://www.rfc-editor.org/rfc/rfc9293)
- [Cloudflare — BBR](https://blog.cloudflare.com/pac-improved-tcp-bbr-congestion-control/)
