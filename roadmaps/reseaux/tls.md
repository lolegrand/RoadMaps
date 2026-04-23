---
id: tls
parent: couche-application
label: TLS / HTTPS
explored: false
order: 3
---

# TLS — Transport Layer Security

TLS est la couche de sécurité qui chiffre les communications sur Internet. Anciennement SSL, TLS 1.3 (2018) est la version actuelle, plus rapide et plus sûre que ses prédécesseurs. HTTPS = HTTP + TLS.

## Historique et versions

```
SSL 2.0 (1995) → cassé, ne pas utiliser
SSL 3.0 (1996) → POODLE (2014), cassé
TLS 1.0 (1999) → BEAST (2011), déprécié RFC 8996
TLS 1.1 (2006) → déprécié RFC 8996
TLS 1.2 (2008) → encore largement utilisé, sûr si bien configuré
TLS 1.3 (2018) → RFC 8446, actuel — plus simple, plus rapide, plus sûr
```

## Objectifs de TLS

```
Confidentialité    : chiffrement du trafic (personne ne peut lire)
Intégrité          : détection de toute modification en transit
Authentification   : vérification que le serveur est bien qui il prétend être
                     (via certificats X.509)
```

## TLS 1.3 Handshake (1 RTT)

```
Client                              Serveur
  |                                   |
  |  ClientHello                      |
  |  (TLS versions, cipher suites,    |
  |   key_share, SNI, ...)            |
  |─────────────────────────────────→ |
  |                                   |  Sélectionne cipher, génère clés
  |  ServerHello                      |
  |  (key_share, certificat,          |
  |   Finished — déjà chiffré)        |
  |← ─────────────────────────────── |
  |                                   |
  |  Finished (chiffré)               |  ← les deux ont dérivé les mêmes clés
  |─────────────────────────────────→ |  ← sans avoir échangé de secret en clair
  |                                   |
  |  Données applicatives (chiffrées) |
  |  ←──────────────────────────────→ |

Total : 1 RTT (vs 2 RTT pour TLS 1.2)
0-RTT : possible avec session resumption (ticket de session)
        Risque : replay attacks sur les données 0-RTT
```

## Échange de clés — ECDHE

```
TLS 1.3 impose Perfect Forward Secrecy (PFS) :
  Chaque session génère une paire de clés éphémère
  Même si la clé privée du serveur est compromise PLUS TARD,
  les sessions passées ne peuvent pas être déchiffrées

Algorithmes supportés en TLS 1.3 :
  X25519   : Diffie-Hellman sur courbe Curve25519 (rapide, sûr)
  X448     : Courbe 448 bits (plus lent, plus sûr)
  secp256r1 / secp384r1 : NIST P-256 / P-384

Cipher suites TLS 1.3 (seulement 5, vs des dizaines en TLS 1.2) :
  TLS_AES_128_GCM_SHA256
  TLS_AES_256_GCM_SHA384
  TLS_CHACHA20_POLY1305_SHA256
  TLS_AES_128_CCM_SHA256
  TLS_AES_128_CCM_8_SHA256
```

## Certificats X.509 et PKI

```
Chaîne de confiance :
  Root CA (Certificat Autorité Racine)     ← installée dans l'OS/navigateur
    └── Intermediate CA                    ← certificat intermédiaire
          └── End-entity certificate       ← le certificat de example.com

Champs importants :
  Subject               : pour qui est le cert (CN=example.com)
  Issuer                : qui a signé (Let's Encrypt Authority X3)
  Subject Alt Names     : domaines couverts (example.com, www.example.com)
  Not Before / After    : période de validité
  Public Key            : clé publique du serveur
  Signature             : signature numérique de l'Issuer

# Inspecter un certificat
openssl s_client -connect example.com:443 -servername example.com
openssl x509 -in cert.pem -text -noout
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -dates -noout
```

## Let's Encrypt et ACME (RFC 8555)

```
Let's Encrypt : autorité de certification gratuite et automatique (2015)
ACME (Automated Certificate Management Environment) : protocole d'automatisation

Validation du domaine (DV — Domain Validation) :
  HTTP-01  : Let's Encrypt dépose un fichier sur /.well-known/acme-challenge/
  DNS-01   : ajouter un enregistrement TXT dans le DNS (wildcard possible)
  TLS-ALPN : via TLS sur le port 443

# certbot — client ACME le plus courant
certbot certonly --webroot -w /var/www/html -d example.com
certbot renew    # renouvellement automatique (cron/systemd timer)

# acme.sh — alternative légère
acme.sh --issue -d example.com --webroot /var/www/html

Durée : 90 jours (renouvellement automatique recommandé)
```

## mTLS — Mutual TLS

```
TLS classique : seul le serveur présente un certificat
mTLS          : le CLIENT présente aussi un certificat (authentification mutuelle)

Usage :
  Communication service-à-service (microservices, Kubernetes)
  Zero Trust Networks (chaque service doit s'authentifier)
  API très sensibles (bancaires, IoT industriel)

# Générer une CA et des certificats client/serveur
openssl genrsa -out ca.key 4096
openssl req -new -x509 -key ca.key -out ca.crt -days 3650

openssl genrsa -out client.key 2048
openssl req -new -key client.key -out client.csr
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -out client.crt
```

## HSTS — HTTP Strict Transport Security

```
En-tête HTTP qui force le navigateur à utiliser HTTPS pour un domaine :

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

max-age         : durée en secondes (31536000 = 1 an)
includeSubDomains : applique aussi aux sous-domaines
preload         : inclusion dans la liste HSTS Preload (intégrée aux navigateurs)

Empêche les attaques SSL Stripping (downgrade HTTP → HTTPS)
```

## Certificate Transparency (CT)

```
Tous les certificats TLS publics doivent être enregistrés dans des logs publics
  → Détection rapide de certificats frauduleux (ex: DigiNotar 2011)

crt.sh : chercher tous les certificats émis pour un domaine
  https://crt.sh/?q=%.example.com

Champs TLS supplémentaires :
  SCT (Signed Certificate Timestamp) : preuve d'enregistrement dans un CT log
  OCSP Stapling : révocation de certificat intégrée dans le handshake TLS
```

## Liens

- [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446)
- [tls13.xargs.org — visualisation handshake](https://tls13.xargs.org/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs — test de configuration TLS](https://www.ssllabs.com/ssltest/)
