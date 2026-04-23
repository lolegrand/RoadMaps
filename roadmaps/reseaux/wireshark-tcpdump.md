---
id: wireshark-tcpdump
parent: outils-diagnostic
label: Wireshark et tcpdump
explored: false
order: 2
---

# Wireshark et tcpdump — Capture de trafic réseau

Wireshark et tcpdump sont les outils de capture de paquets de référence. tcpdump est CLI (idéal sur serveur), Wireshark est GUI avec une analyse visuelle puissante. Les deux lisent le format pcap.

## tcpdump — capture en ligne de commande

```bash
# Syntaxe de base
tcpdump [options] [filtre BPF]

# Interfaces
tcpdump -D                      # lister les interfaces disponibles
tcpdump -i eth0                 # écouter sur eth0
tcpdump -i any                  # toutes les interfaces

# Options essentielles
tcpdump -n                      # ne pas résoudre les noms (plus rapide)
tcpdump -nn                     # ne pas résoudre noms NI services
tcpdump -v / -vv / -vvv         # verbosité croissante
tcpdump -X                      # hex + ASCII du payload
tcpdump -A                      # ASCII uniquement
tcpdump -c 100                  # capturer 100 paquets puis arrêter
tcpdump -s 0                    # capturer le paquet entier (défaut : 96 bytes)

# Sauvegarder et lire
tcpdump -w capture.pcap         # écrire dans un fichier pcap
tcpdump -r capture.pcap         # lire un fichier pcap
tcpdump -w - | gzip > capture.pcap.gz  # compresser à la volée
```

## tcpdump — filtres BPF (Berkeley Packet Filter)

```bash
# Filtres de base
tcpdump host 192.168.1.1        # tout le trafic vers/depuis cette IP
tcpdump src 192.168.1.1         # uniquement source
tcpdump dst 8.8.8.8             # uniquement destination
tcpdump net 192.168.1.0/24      # tout un réseau

tcpdump port 443                # port source OU destination = 443
tcpdump src port 80             # port source uniquement
tcpdump dst port 53             # port destination uniquement

tcpdump tcp                     # uniquement TCP
tcpdump udp                     # uniquement UDP
tcpdump icmp                    # uniquement ICMP

# Combinaisons (and, or, not)
tcpdump host 192.168.1.1 and port 443
tcpdump host 192.168.1.1 and not port 22
tcpdump 'tcp[tcpflags] & tcp-syn != 0'   # paquets SYN
tcpdump 'tcp[tcpflags] = tcp-syn'        # UNIQUEMENT SYN (pas SYN-ACK)
tcpdump 'tcp[13] == 0x02'               # même chose (flag SYN = bit 1 de l'octet 13)

# Exemples pratiques
tcpdump -nn -i eth0 port 53            # voir les requêtes DNS
tcpdump -nn -A port 80 and host 1.2.3.4  # HTTP en clair
tcpdump -nn -i eth0 'tcp[tcpflags] & (tcp-rst) != 0'  # paquets RST
tcpdump -nn icmp and host 8.8.8.8      # ping vers 8.8.8.8 uniquement
```

## Wireshark — analyse visuelle

```
Interface :
  Packet List     : liste des paquets capturés (filtrable)
  Packet Details  : décodage en arbre par couche
  Packet Bytes    : hex + ASCII brut

Capture live :
  Interface → Start capture
  Filter à la capture (BPF) → moins de trafic à traiter
  Filter à l'analyse → pour inspecter le pcap complet

Ouvrir un pcap tcpdump :
  File → Open → capture.pcap
  Wireshark décode automatiquement tous les protocoles connus
```

## Wireshark — Display Filters (langage propre)

```
# HTTP
http                            # tout le trafic HTTP
http.request.method == "POST"
http.response.code == 404
http contains "password"        # chercher dans le contenu

# DNS
dns                             # tout DNS
dns.qry.name == "example.com"
dns.flags.response == 0         # uniquement les requêtes
dns.a == 93.184.216.34          # réponses contenant cette IP

# TCP
tcp                             # tout TCP
tcp.port == 443
tcp.flags.syn == 1 and tcp.flags.ack == 0   # SYN purs
tcp.analysis.retransmission     # retransmissions
tcp.analysis.zero_window        # zero-window (congestion)

# TLS
tls.handshake.type == 1         # ClientHello
tls.handshake.type == 2         # ServerHello
ssl.record.version == 0x0304    # TLS 1.3

# ICMP
icmp.type == 8                  # echo request (ping)
icmp.type == 3                  # destination unreachable

# Filtres de sélection
ip.src == 192.168.1.1
ip.dst == 8.8.8.8
ip.addr == 192.168.1.1          # src OU dst
not arp and not dns             # exclure ARP et DNS (moins de bruit)
```

## Wireshark — fonctionnalités avancées

```
Follow Stream :
  Clic droit → Follow → TCP Stream
  Reconstitue la conversation complète (utile pour HTTP, SMTP...)

Statistics :
  Conversations   : qui parle à qui (IP, TCP, UDP) et volumes
  IO Graph        : débit dans le temps
  Protocol Hierarchy : répartition des protocoles
  Round Trip Time : latence par flux TCP

Coloring Rules :
  Colorier le trafic par protocole ou condition
  View → Coloring Rules (règles BPF)

Déchiffrement TLS :
  Si on a la clé privée du serveur (RSA key exchange uniquement)
  Edit → Preferences → Protocols → TLS → RSA keys list
  OU via SSLKEYLOGFILE (log des secrets TLS par le navigateur)

  export SSLKEYLOGFILE=~/sslkeys.log
  firefox / chrome (écrit automatiquement les secrets)
  Wireshark → Edit → Preferences → TLS → (Pre)-Master-Secret log filename
```

## Analyser un pcap depuis la CLI

```bash
# tshark — Wireshark en ligne de commande
tshark -r capture.pcap                           # lire un pcap
tshark -r capture.pcap -Y "http"                 # filtre display
tshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.dstport
tshark -r capture.pcap -qz io,stat,1             # stats par seconde

# Extraire des statistiques
capinfos capture.pcap              # info générale (durée, nb paquets, débit)

# Couper un gros pcap
editcap -i 60 big.pcap segment.pcap  # couper en tranches de 60 secondes
editcap -A "2024-01-15 10:00:00" -B "2024-01-15 10:05:00" big.pcap extract.pcap
```

## Liens

- [Wireshark — Documentation](https://www.wireshark.org/docs/)
- [Wireshark Display Filters cheatsheet](https://www.comparitech.com/net-admin/wireshark-cheat-sheet/)
- [tcpdump — man page](https://www.tcpdump.org/manpages/tcpdump.1.html)
- [BPF Filter Syntax](https://www.tcpdump.org/papers/bpf-usenix93.pdf)
