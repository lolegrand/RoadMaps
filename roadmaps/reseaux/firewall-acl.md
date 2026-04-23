---
id: firewall-acl
parent: securite-reseau
label: Firewall et ACL
explored: false
order: 1
---

# Firewalls et ACL

Un firewall filtre le trafic réseau selon des règles. Les ACL (Access Control Lists) sont la forme la plus simple. Les firewalls modernes (NGFW) inspectent jusqu'à la couche application.

## ACL — Access Control Lists

```
Filtre de paquets statique — inspecte l'en-tête IP/TCP/UDP sans état (stateless)
Règles : source IP, destination IP, protocole, port src/dst, action (permit/deny)

ACL Standard (Cisco) — filtre uniquement sur l'IP source :
  access-list 10 permit 192.168.1.0 0.0.0.255    ← wildcard mask (inverse du masque)
  access-list 10 deny any

ACL Étendue — IP src/dst + protocole + ports :
  access-list 100 permit tcp 10.0.0.0 0.0.0.255 any eq 80
  access-list 100 permit tcp 10.0.0.0 0.0.0.255 any eq 443
  access-list 100 deny ip any any log

  → Toujours un "deny all" implicite en fin d'ACL

Application sur une interface :
  interface GigabitEthernet0/0
    ip access-group 100 in     ← filtrage entrant
    ip access-group 200 out    ← filtrage sortant

Règles d'or :
  - Appliquer en entrée (in) de l'interface la plus proche de la source
  - Règles les plus spécifiques EN PREMIER (first match)
  - Le deny any implicite final est invisible dans la config
```

## Firewall Stateful

```
Contrairement aux ACL, un firewall stateful maintient une table d'état (state table)
Il "se souvient" des connexions établies

Exemple :
  Règle : permit TCP sortant vers port 80
  Client interne envoie SYN vers 203.0.113.1:80
  → Firewall ajoute à sa table : (src:192.168.1.10:52345, dst:203.0.113.1:80, ESTABLISHED)
  Réponse du serveur (SYN-ACK) arrive sur port 52345
  → Autorisée automatiquement (état ESTABLISHED dans la table)

Sans stateful tracking, il faudrait une règle pour CHAQUE retour (impossible)

État de connexion suivi :
  TCP  : NEW → ESTABLISHED → CLOSE_WAIT → TIME_WAIT
  UDP  : premier paquet → état temporaire
  ICMP : echo → echo-reply

iptables (Linux) — stateful avec conntrack :
  iptables -A INPUT  -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  iptables -A INPUT  -m conntrack --ctstate NEW -p tcp --dport 22 -j ACCEPT
  iptables -A INPUT  -j DROP

nftables (remplaçant d'iptables, Linux 3.13+) :
  table inet filter {
    chain input {
      type filter hook input priority 0; policy drop;
      ct state established,related accept
      tcp dport 22 ct state new accept
    }
  }
```

## Zones de sécurité — DMZ

```
Architecture classique à 3 zones :

Internet ─── [Firewall Externe] ─── DMZ ─── [Firewall Interne] ─── LAN interne

DMZ (DeMilitarized Zone) :
  Héberge les serveurs publics : web, mail, DNS autoritatif
  Accessible depuis Internet (avec règles)
  Isolée du LAN interne

Règles typiques :
  Internet → DMZ     : TCP 80, 443, 25 (SMTP)
  DMZ → Internet     : TCP established, ICMP
  DMZ → LAN         : INTERDIT (ou très restreint)
  LAN → DMZ         : TCP established + accès admin
  LAN → Internet     : HTTP/HTTPS via proxy (ou NAT)
  Internet → LAN     : INTERDIT
```

## NGFW — Next-Generation Firewall

```
Capacités supplémentaires vs firewall classique :

Application Awareness (L7 Inspection) :
  DPI (Deep Packet Inspection) : identifier l'application même sur port 443
  "Bloquer BitTorrent même sur port 443"
  Exemples : Palo Alto Networks, Fortinet, Cisco FTD

IPS (Intrusion Prevention System) :
  Détecter et bloquer les exploits, vulnérabilités (Snort/Suricata règles)
  Inspection SSL/TLS : déchiffrer, inspecter, rechiffrer (MITM légal)

URL Filtering :
  Base de réputation d'URLs (catégories : malware, gambling, adult...)

User Identity Awareness :
  Lier les règles à des utilisateurs AD/LDAP, pas juste des IP
  "John de RH peut accéder à LinkedIn, pas la DevTeam"

Threat Intelligence / Sandboxing :
  Analyser les fichiers suspects dans un environnement isolé
  Palo Alto WildFire, Fortinet FortiSandbox

Gestion typique :
  Palo Alto Panorama, Fortinet FortiManager, Cisco FMC
```

## UFW et firewalld — Linux simplifié

```
UFW (Uncomplicated Firewall) — wrapper iptables pour Ubuntu :
  ufw enable
  ufw allow 22/tcp
  ufw allow from 192.168.1.0/24 to any port 5432
  ufw deny 23
  ufw status verbose

firewalld — zones + services (RHEL/Fedora) :
  firewall-cmd --zone=public --add-service=http --permanent
  firewall-cmd --zone=public --add-port=8080/tcp --permanent
  firewall-cmd --reload
  firewall-cmd --list-all
```

## Liens

- [Cisco — ACL Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/configuration/xe-16/)
- [nftables — Documentation](https://wiki.nftables.org/)
- [Palo Alto — NGFW](https://www.paloaltonetworks.com/network-security/next-generation-firewall)
