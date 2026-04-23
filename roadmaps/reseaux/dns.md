---
id: dns
parent: couche-application
label: DNS
explored: false
order: 1
---

# DNS — Domain Name System

Le DNS est l'annuaire d'Internet. Il traduit des noms de domaine lisibles (`example.com`) en adresses IP (`93.184.216.34`). Sans DNS, il faudrait mémoriser des IP pour chaque site. C'est un système **hiérarchique**, **décentralisé** et **mis en cache**.

## Hiérarchie DNS

```
.                          ← racine (root) — 13 clusters de root servers
└── com.                   ← TLD (Top Level Domain) — géré par Verisign
    └── example.com.       ← domaine — géré par le propriétaire
        ├── www.example.com
        └── mail.example.com

Résolution de "www.example.com." :
  1. Root servers  → "va voir les serveurs .com"
  2. TLD .com      → "va voir les serveurs d'example.com"
  3. Autoritatif   → "www.example.com = 93.184.216.34"
```

## Résolution récursive

```
Client (stub resolver)
    ↓ "qui est www.example.com ?"
Resolver récursif (ex: 8.8.8.8)
    ↓ "qui est .com ?"  → Root Server (a.root-servers.net)
    ↓ "qui est example.com ?" → TLD Server (.com)
    ↓ "www ?" → Serveur autoritatif d'example.com
    ↑ "93.184.216.34" (TTL: 3600)
    ↑ répond au client
    ↑ met en cache pour le TTL

Recursive resolver : 8.8.8.8 (Google), 1.1.1.1 (Cloudflare), 9.9.9.9 (Quad9)
Serveur autoritatif : connaît les vraies réponses pour une zone
```

## Types d'enregistrements DNS

```
A       : nom → IPv4
  example.com.    IN  A     93.184.216.34

AAAA    : nom → IPv6
  example.com.    IN  AAAA  2606:2800:220:1:248:1893:25c8:1946

CNAME   : alias → autre nom (pas de boucle, pas sur apex)
  www.example.com. IN CNAME  example.com.

MX      : serveurs de mail (avec priorité)
  example.com.    IN  MX    10 mail.example.com.

NS      : serveurs DNS autoritatifs d'une zone
  example.com.    IN  NS    ns1.example.com.

TXT     : texte libre (SPF, DKIM, vérification domaine…)
  example.com.    IN  TXT   "v=spf1 include:_spf.google.com ~all"

SRV     : localisation d'un service (port + priorité)
  _http._tcp.example.com.  IN  SRV  10 5 80 server.example.com.

PTR     : reverse DNS (IP → nom)
  34.216.184.93.in-addr.arpa. IN  PTR  example.com.

SOA     : Start of Authority — info sur la zone (TTL, serveur primaire…)

CAA     : Certificate Authority Authorization — qui peut émettre un cert TLS
  example.com.  IN  CAA  0 issue "letsencrypt.org"
```

## TTL et cache

```
TTL (Time To Live) : durée (secondes) pendant laquelle un enregistrement peut être mis en cache

  Longue (86400 = 24h) : domaines stables (CDN, sites statiques)
  Courte (60s)         : migrations, A/B traffic, canaries
  0                    : jamais mis en cache (rare, charge énorme)

dig example.com A     # interroger le DNS depuis la ligne de commande
dig +short example.com
dig @8.8.8.8 example.com ANY   # forcer le resolver 8.8.8.8
nslookup example.com           # Windows/Linux (moins de détails)
```

## DNSSEC — Sécurité du DNS

```
Problème : DNS non signé peut être falsifié (cache poisoning, Kaminsky attack 2008)

DNSSEC ajoute des signatures cryptographiques à chaque enregistrement :
  RRSIG  : signature de l'enregistrement
  DNSKEY : clé publique de la zone
  DS     : hash de la clé enfant (délégation)

Chaîne de confiance :
  Root → .com → example.com → www.example.com
  Chaque niveau signe les clés du niveau inférieur

Vérification :
  dig +dnssec example.com
  dig @8.8.8.8 +dnssec cloudflare.com  # AD flag = Authentic Data (validé)

Adoption : ~25% des TLD signés, mais validation encore inégale
```

## DNS over HTTPS (DoH) / DNS over TLS (DoT)

```
Problème classique : DNS en clair sur UDP port 53
  → FAI peut voir (et modifier) toutes vos requêtes
  → Surveillance, injection de publicité, censure

DoT (RFC 7858) :
  DNS dans TLS sur port 853
  Visible (le FAI voit le port 853) mais chiffré
  Facile à bloquer

DoH (RFC 8484) :
  DNS dans HTTPS sur port 443
  Indiscernable du trafic web normal
  Supporté par Firefox (Cloudflare DoH par défaut), Chrome
  URL : https://cloudflare-dns.com/dns-query
        https://dns.google/dns-query

DoQ (DNS over QUIC, RFC 9250) :
  DNS dans QUIC — moins de latence, plus moderne

# tester DoH
curl -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=example.com&type=A"
```

## Liens

- [RFC 1034/1035 — DNS](https://www.rfc-editor.org/rfc/rfc1034)
- [RFC 4033-4035 — DNSSEC](https://www.rfc-editor.org/rfc/rfc4033)
- [RFC 8484 — DoH](https://www.rfc-editor.org/rfc/rfc8484)
- [DNS Visualization](https://dnsviz.net/)
