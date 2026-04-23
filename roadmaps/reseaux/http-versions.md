---
id: http-versions
parent: couche-application
label: HTTP 1/2/3
explored: false
order: 2
---

# HTTP — Évolution des versions

HTTP (HyperText Transfer Protocol) est le protocole du Web. Chaque version a résolu les limitations de la précédente. HTTP/3 avec QUIC est la version actuelle, rompant même avec TCP.

## HTTP/1.1 (RFC 2616 → 7230, 1997/2014)

```
Modèle requête/réponse : une requête → une réponse, texte ASCII
Connexions persistantes : Keep-Alive (réutilise la connexion TCP)

Problème fondamental : Head-of-Line Blocking
  Sur une connexion TCP, les requêtes sont traitées en ordre (pipeline)
  Si la requête 1 est lente → les requêtes 2,3,4 attendent

Workarounds adoptés par les navigateurs :
  6 connexions TCP parallèles par domaine
  Domain sharding (répartir assets sur plusieurs sous-domaines)
  Sprites CSS, concaténation JS/CSS → réduire le nombre de requêtes

En-têtes en ASCII non compressés :
  GET /index.html HTTP/1.1
  Host: example.com
  User-Agent: Mozilla/5.0...
  Cookie: session=abc123...    ← répété dans CHAQUE requête
```

## HTTP/2 (RFC 7540, 2015)

```
Révolution binaire : plus de texte ASCII, tout est binaire (frames)

Multiplexing :
  N streams sur 1 seule connexion TCP
  Streams identifiés par un Stream ID (entier impair = client, pair = serveur)
  Frames intercalées librement → plus de pipelining bloquant

HPACK : compression des en-têtes
  Table statique (62 en-têtes courants prédéfinis)
  Table dynamique (mémorise les en-têtes de la session)
  Cookie: session=abc123 → index 1 octet après la première fois

Server Push :
  Le serveur peut "pousser" des ressources sans que le client demande
  Exemple : envoyer style.css + app.js quand / est demandé
  Réalité : peu efficace, souvent désactivé, supprimé dans Chrome 106

Limitation héritée de TCP :
  1 connexion TCP → HOL blocking TCP persist
  Paquet perdu = tous les streams bloqués (même indépendants)
```

## HTTP/2 vs HTTP/1.1 — comparaison protocole

```
                    HTTP/1.1            HTTP/2
Format              Texte ASCII         Binaire (frames)
Connexions TCP      6 par domaine       1 (multiplex)
HOL Blocking        Oui                 Oui (TCP) / Non (streams)
Compression headers Non                 HPACK
Server Push         Non                 Oui (déprécié en pratique)
Chiffrement         Optionnel (HTTPS)   Obligatoire en pratique (browsers)
Priorisation        Non                 Oui (poids + dépendances streams)
```

## HTTP/3 (RFC 9114, 2022)

```
Rupture fondamentale : passe de TCP à QUIC (UDP)

Résout le HOL TCP :
  Chaque stream QUIC est indépendant au niveau transport
  Perte d'un paquet → seul le stream concerné est retardé

0-RTT sur les connexions répétées :
  Première connexion : 1 RTT (QUIC handshake + TLS 1.3 intégrés)
  Connexions suivantes : 0-RTT → données dans le premier paquet

QPACK (compression headers) :
  Évolution de HPACK adaptée à QUIC
  Évite le HOL de HPACK (qui dépend de l'ordre des streams)

Chiffrement obligatoire (TLS 1.3 intégré à QUIC)

Adoption (2024) :
  ~28% du trafic HTTP mondial
  Tous les grands navigateurs supportent HTTP/3
  Cloudflare, Google, Meta : HTTP/3 en production
```

## HTTP/3 vs HTTP/2 — comparaison

```
                    HTTP/2              HTTP/3
Transport           TCP                 QUIC (UDP)
HOL Blocking        Partiel (stream)    Non
Handshake           1 RTT TCP + 1 TLS  1 RTT (ou 0-RTT)
Chiffrement         TLS séparé          TLS 1.3 intégré
Migration réseau    Non                 Oui (Connection ID)
Headers compress.   HPACK               QPACK
Header             Binaire (frames)    Binaire (QUIC frames)
```

## Méthodes HTTP

```
GET      : lecture (idempotent, sans corps)
POST     : création, action (non idempotent)
PUT      : remplacement complet (idempotent)
PATCH    : modification partielle
DELETE   : suppression (idempotent)
HEAD     : comme GET mais sans le corps (métadonnées)
OPTIONS  : capacités du serveur (CORS preflight)
CONNECT  : tunnel TCP (pour proxies HTTPS)
TRACE    : diagnostic (souvent désactivé)
```

## Status codes importants

```
1xx Informatif
  100 Continue
  101 Switching Protocols (WebSocket upgrade)

2xx Succès
  200 OK
  201 Created
  204 No Content
  206 Partial Content (téléchargement par morceaux)

3xx Redirection
  301 Moved Permanently
  302 Found (temporaire)
  304 Not Modified (cache)
  307 Temporary Redirect (préserve la méthode)
  308 Permanent Redirect (préserve la méthode)

4xx Erreur client
  400 Bad Request
  401 Unauthorized (non authentifié)
  403 Forbidden (authentifié mais sans droit)
  404 Not Found
  405 Method Not Allowed
  409 Conflict
  422 Unprocessable Entity (validation)
  429 Too Many Requests (rate limiting)

5xx Erreur serveur
  500 Internal Server Error
  502 Bad Gateway
  503 Service Unavailable
  504 Gateway Timeout
```

## Liens

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9113 — HTTP/2](https://www.rfc-editor.org/rfc/rfc9113)
- [RFC 9114 — HTTP/3](https://www.rfc-editor.org/rfc/rfc9114)
- [HTTP/3 — Cloudflare blog](https://blog.cloudflare.com/http3-the-past-present-and-future/)
