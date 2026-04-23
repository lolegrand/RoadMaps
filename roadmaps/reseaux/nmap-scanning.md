---
id: nmap-scanning
parent: outils-diagnostic
label: Nmap et scanning
explored: false
order: 3
---

# Nmap — Découverte réseau et scan de ports

Nmap (Network Mapper) est l'outil de référence pour l'exploration de réseaux et l'audit de sécurité. Il détecte les hôtes actifs, les ports ouverts, les services, les versions, et les OS. À utiliser uniquement sur des réseaux dont vous avez l'autorisation.

## Concepts fondamentaux

```
Scan de ports : déterminer si un port est ouvert, fermé, ou filtré

État d'un port :
  open     : un service répond (SYN-ACK reçu)
  closed   : port inaccessible mais l'hôte répond (RST reçu)
  filtered : pas de réponse (firewall qui drop silencieusement)
  open|filtered : impossible de distinguer ouvert de filtré

Méthode de scan :
  SYN scan (-sS) : envoie SYN, analyse SYN-ACK/RST — le plus courant
  TCP connect (-sT) : connexion TCP complète (ne nécessite pas root)
  UDP scan (-sU) : ports UDP (plus lent, moins fiable)
  NULL/FIN/Xmas (-sN/-sF/-sX) : variantes pour détecter les firewalls stateless
```

## Syntaxe de base

```bash
nmap <cible>                          # scan basique (1000 ports courants)
nmap 192.168.1.1                      # IP unique
nmap 192.168.1.0/24                   # réseau entier /24
nmap 192.168.1.1-100                  # plage d'IP
nmap 192.168.1.1 192.168.1.2         # plusieurs IP

# Spécification de ports
nmap -p 22,80,443 192.168.1.1        # ports spécifiques
nmap -p 1-1000 192.168.1.1           # plage
nmap -p- 192.168.1.1                 # tous les 65535 ports
nmap --top-ports 100 192.168.1.1     # les 100 ports les plus courants

# Découverte d'hôtes (sans scan de ports)
nmap -sn 192.168.1.0/24              # ping sweep (hôtes actifs)
nmap -sn --send-ip 192.168.1.0/24   # ping IP (si ICMP bloqué)
```

## Types de scans

```bash
# Scans TCP
nmap -sS 192.168.1.1    # SYN scan (stealth, nécessite root) — DEFAULT avec root
nmap -sT 192.168.1.1    # TCP connect (sans root)
nmap -sA 192.168.1.1    # ACK scan (détecte les firewalls stateful)
nmap -sW 192.168.1.1    # Window scan

# Scans UDP
nmap -sU 192.168.1.1    # UDP scan (lent — attente timeout)
nmap -sU -p 53,67,123 192.168.1.1   # UDP sur ports spécifiques

# Combiner TCP + UDP
nmap -sS -sU -p T:80,443,U:53,161 192.168.1.1
```

## Détection de versions et OS

```bash
# Détection de services et versions
nmap -sV 192.168.1.1               # version des services
nmap -sV --version-intensity 5     # intensité 0-9 (0=léger, 9=exhaustif)

# Détection d'OS
nmap -O 192.168.1.1                # OS fingerprinting (nécessite root)
nmap -O --osscan-guess 192.168.1.1 # même si non certain

# Tout en un (scan complet)
nmap -A 192.168.1.1    # = -sV -O --traceroute + scripts par défaut

# Vitesse (-T0 à -T5)
nmap -T1 192.168.1.1   # paranoid (IDS evasion)
nmap -T3 192.168.1.1   # normal (défaut)
nmap -T4 192.168.1.1   # aggressive (réseau local rapide)
nmap -T5 192.168.1.1   # insane (peut rater des ports)
```

## NSE — Nmap Scripting Engine

```bash
# Scripts par défaut
nmap -sC 192.168.1.1              # scripts "default" category

# Scripts spécifiques
nmap --script http-title 192.168.1.1          # titre des pages web
nmap --script ssl-cert 192.168.1.1 -p 443     # info certificat TLS
nmap --script ssh-auth-methods 192.168.1.1    # méthodes SSH acceptées
nmap --script vuln 192.168.1.1                # check vulnérabilités connues
nmap --script smb-vuln-ms17-010 192.168.1.1  # EternalBlue (MS17-010)

# Catégories de scripts
nmap --script "discovery" 192.168.1.1         # découverte
nmap --script "safe and http-*" 192.168.1.1  # scripts HTTP non intrusifs

# Lister les scripts disponibles
ls /usr/share/nmap/scripts/*.nse
nmap --script-help http-title
```

## Sorties et formats

```bash
nmap -oN scan.txt 192.168.1.0/24   # format normal (lisible)
nmap -oX scan.xml 192.168.1.0/24   # XML (parseable)
nmap -oG scan.grep 192.168.1.0/24  # greppable
nmap -oA scan 192.168.1.0/24       # tous les formats simultanément

# Parser le XML
xsltproc scan.xml -o scan.html     # convertir en HTML
```

## Exemples de scans pratiques

```bash
# Audit d'un serveur web
nmap -sV -sC -p 80,443,8080,8443 --script http-title,ssl-cert example.com

# Découverte du réseau local
nmap -sn 192.168.1.0/24 -oG - | grep "Up" | awk '{print $2}'

# Trouver tous les SSH ouverts
nmap -p 22 --open 192.168.0.0/16

# Scan UDP des services réseau courants
nmap -sU -p 53,67,68,69,123,161,500 192.168.1.0/24

# Vérifier si un firewall est stateful
nmap -sA 192.168.1.1   # ACK scan : filtered = stateful, unfiltered = stateless

# Scan discret (lent + fragmentation)
nmap -T1 -f --data-length 24 192.168.1.1

# Détecter les serveurs SNMP
nmap -sU -p 161 --script snmp-info 192.168.1.0/24
```

## Autres outils de scanning

```bash
# masscan — ultra-rapide (Internet en <6 minutes)
masscan 192.168.1.0/24 -p80,443 --rate=1000

# netdiscover — ARP discovery (LAN uniquement)
netdiscover -r 192.168.1.0/24

# rustscan — Nmap wrapper en Rust, plus rapide
rustscan -a 192.168.1.1 -- -sV -sC

# zmap — scan IPv4 entier pour un port
zmap -p 443 0.0.0.0/0 --rate=10000
```

## Liens

- [Nmap — Documentation officielle](https://nmap.org/book/man.html)
- [NSE Scripts — Nmap](https://nmap.org/nsedoc/)
- [Nmap Network Scanning (livre)](https://nmap.org/book/toc.html)
