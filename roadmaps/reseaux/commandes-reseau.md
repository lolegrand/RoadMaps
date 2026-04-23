---
id: commandes-reseau
parent: outils-diagnostic
label: Commandes réseau
explored: false
order: 1
---

# Commandes réseau — Boîte à outils

Un catalogue des commandes indispensables pour diagnostiquer les problèmes réseau, de la connectivité de base à l'analyse avancée des sockets et du routage.

## ping — test de connectivité ICMP

```bash
ping 8.8.8.8                  # ping continu (Ctrl+C pour arrêter)
ping -c 4 8.8.8.8             # 4 paquets seulement
ping -i 0.2 8.8.8.8           # intervalle 0.2s (flood test)
ping -s 1400 8.8.8.8          # taille de paquet personnalisée (test MTU)
ping -M do -s 1472 8.8.8.8   # PMTUD — ne pas fragmenter (Linux)

# ping6 / ping -6 pour IPv6
ping6 ::1
ping6 fe80::1%eth0            # lien local = interface obligatoire

# Interpréter les résultats
64 bytes from 8.8.8.8: icmp_seq=1 ttl=115 time=12.3 ms
  ttl=115  → chemin court (128 - 13 sauts)
  time=    → RTT (Round Trip Time)
  Request timeout → ICMP bloqué par un firewall (≠ hôte down)
```

## traceroute / tracepath — chemin réseau

```bash
traceroute 8.8.8.8            # UDP par défaut (Linux)
traceroute -I 8.8.8.8         # ICMP (passe mieux les firewalls)
traceroute -T -p 443 8.8.8.8  # TCP SYN sur port 443 (bypass ACL UDP)
traceroute6 2001:4860:4860::8888

tracepath 8.8.8.8             # traceroute + détection MTU (sans root)

# Windows
tracert 8.8.8.8               # ICMP uniquement

# Interpréter
 1  192.168.1.1      1.2 ms    ← gateway locale
 2  10.x.x.1        5.4 ms    ← routeur FAI
 3  * * *                      ← ICMP TTL exceeded bloqué (pas mort)
 4  72.14.218.x     10.2 ms   ← Google backbone

MTR (My TraceRoute) — combine ping + traceroute :
  mtr 8.8.8.8                 # interactif, rafraîchissement continu
  mtr --report 8.8.8.8        # rapport unique (non interactif)
  mtr -T -P 443 8.8.8.8       # TCP SYN mode
```

## ip — configuration réseau Linux (remplace ifconfig)

```bash
# Interfaces
ip link show                    # liste les interfaces
ip link show eth0               # détails interface spécifique
ip link set eth0 up/down        # activer/désactiver
ip link set eth0 mtu 9000       # changer le MTU

# Adresses IP
ip addr show                    # toutes les IP
ip addr show eth0               # IP d'une interface
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0

# Routes
ip route show                   # table de routage principale
ip route show table all         # toutes les tables (policy routing)
ip route get 8.8.8.8            # quel chemin pour une IP ?
ip route add default via 192.168.1.1
ip route add 10.0.0.0/8 via 192.168.1.254 dev eth0
ip route del 10.0.0.0/8

# Voisins (cache ARP/NDP)
ip neigh show                   # table ARP/NDP
ip neigh flush dev eth0         # vider le cache ARP

# Règles policy routing
ip rule show
ip rule add from 192.168.2.0/24 lookup 200   # table 200 pour ce subnet
```

## ss — sockets statistics (remplace netstat)

```bash
ss -tlnp                    # TCP, listening, no-resolve, with process
ss -u -a                    # toutes les sockets UDP
ss -tn state established    # connexions TCP établies
ss -s                       # résumé statistique
ss -i                       # détails internes (cwnd, rtt, ...)
ss -tp src :443             # connexions vers le port 443
ss -tp dst 8.8.8.8          # connexions vers 8.8.8.8

# Filtres avancés
ss -tn '( dport = :443 or sport = :443 )'
ss -tp state time-wait      # sockets en TIME_WAIT

# Équivalent netstat classique
netstat -tlnp                # TCP listening (legacy)
netstat -an | grep LISTEN   # macOS compatible
```

## dig — requêtes DNS

```bash
dig example.com               # requête A (IPv4)
dig AAAA example.com          # requête IPv6
dig MX example.com            # enregistrements mail
dig NS example.com            # serveurs de noms
dig TXT example.com           # SPF, DKIM, vérification
dig @8.8.8.8 example.com      # utiliser un resolver spécifique
dig +short example.com        # réponse courte (IP seule)
dig +trace example.com        # trace la résolution complète
dig -x 93.184.216.34          # reverse DNS (PTR)
dig +nocmd +noall +answer example.com   # minimal

# Tester DNSSEC
dig +dnssec cloudflare.com
  # AD flag = Authentic Data (validé)

# DNS over HTTPS
curl -H "accept: application/dns-json" \
  "https://dns.google/resolve?name=example.com&type=A"
```

## curl — test HTTP/HTTPS

```bash
curl -v https://example.com             # verbose (headers, TLS)
curl -I https://example.com             # headers seuls (HEAD)
curl -o /dev/null -w "%{time_total}\n" https://example.com   # temps de réponse
curl -w "@curl-format.txt" -o /dev/null -s https://example.com  # métriques détaillées

# curl-format.txt
  time_namelookup:  %{time_namelookup}s\n
  time_connect:     %{time_connect}s\n
  time_appconnect:  %{time_appconnect}s\n
  time_starttransfer: %{time_starttransfer}s\n
  time_total:       %{time_total}s\n

curl -k https://...             # ignorer les erreurs TLS (test seulement)
curl --resolve example.com:443:93.184.216.34 https://example.com  # forcer une IP
curl --http2 https://example.com        # forcer HTTP/2
curl --http3 https://example.com        # HTTP/3 (si compilé avec QUIC)
```

## Autres outils utiles

```bash
# Tester un port TCP
nc -vz 192.168.1.1 22          # TCP connect test (netcat)
nc -u -vz 8.8.8.8 53           # UDP
telnet 192.168.1.1 80           # test HTTP basique (legacy)

# Bande passante
iperf3 -s                       # serveur
iperf3 -c 192.168.1.1           # test TCP
iperf3 -c 192.168.1.1 -u -b 100M  # test UDP 100Mbps
iperf3 -c 192.168.1.1 -R        # test inversé (download)

# ARP
arp -n                          # table ARP (legacy)
arping 192.168.1.1              # ARP ping (L2)

# DHCP
dhclient -v eth0                # forcer renouvellement DHCP (Linux)
ipconfig /renew                 # Windows

# MTU
ip link show eth0 | grep mtu    # voir le MTU courant
ping -M do -s 1472 8.8.8.8      # tester si MTU 1500 OK (1472 + 28 headers = 1500)

# Ports ouverts sur la machine locale
ss -tlnp | grep LISTEN
lsof -i :80                     # quel process écoute sur 80
```

## Liens

- [iproute2 — man pages](https://man7.org/linux/man-pages/man8/ip.8.html)
- [ss — man page](https://man7.org/linux/man-pages/man8/ss.8.html)
- [dig — man page](https://linux.die.net/man/1/dig)
- [MTR — My TraceRoute](https://github.com/traviscross/mtr)
