---
id: bgp
parent: routage-avance
label: BGP
explored: false
order: 1
---

# BGP — Border Gateway Protocol

BGP est "le protocole qui fait tourner Internet". C'est l'unique protocole de routage inter-AS (entre opérateurs). BGP-4 (RFC 4271) est en production depuis 1994. Il route les ~960 000 préfixes de la table de routage globale d'Internet.

## Concept fondamental — Path Vector

```
Contrairement à OSPF (état des liens), BGP est un protocole PATH VECTOR :
  Chaque annonce contient le CHEMIN COMPLET d'AS (AS_PATH) pour atteindre un préfixe

  AS 100 annonce 203.0.113.0/24 à AS 200
  AS 200 re-annonce à AS 300 : AS_PATH = "200 100"
  AS 300 re-annonce à AS 400 : AS_PATH = "300 200 100"

Avantage :
  Détection de boucles : si l'AS_PATH contient mon propre ASN → rejeter l'annonce
  Politique de routage : chaque AS peut choisir par où passer (vs coût dans OSPF)
```

## Sessions BGP — eBGP vs iBGP

```
eBGP (external BGP) :
  Entre deux routeurs de bord d'AS différents
  Généralement : voisins directs (TTL=1, multihop possible avec ebgp-multihop)
  AD=20 sur Cisco

iBGP (internal BGP) :
  Entre routeurs DANS le même AS
  Full-mesh requis (chaque routeur iBGP doit connaître tous les autres)
    → Problème à grande échelle → Route Reflector ou Confederation
  AD=200 sur Cisco

Route Reflector (RR) :
  Un ou plusieurs RR centraux reçoivent les routes iBGP et les redistribuent
  Évite le full-mesh O(n²)
  Attribut ORIGINATOR_ID + CLUSTER_LIST (prévention de boucles RR)
```

## Établissement d'une session BGP (FSM)

```
IDLE         → pas d'activité
CONNECT      → tentative TCP (port 179) vers le voisin
OPEN SENT    → message OPEN envoyé (ASN, BGP version, Router ID, capabilities)
OPEN CONFIRM → OPEN reçu, KEEPALIVE envoyé
ESTABLISHED  → session active, échange d'UPDATE

Messages BGP :
  OPEN      : ouverture de session (version=4, ASN, hold-time, router-id)
  UPDATE    : annonce / retrait de préfixes (avec attributs)
  KEEPALIVE : maintien de la session (toutes les ~30s)
  NOTIFICATION : signale une erreur → ferme la session
  ROUTE-REFRESH : demande de re-annonce des routes (RFC 2918)

Hold Timer : par défaut 90s — si pas de KEEPALIVE → session down
```

## Attributs BGP — sélection du chemin

```
Ordre de décision BGP (Cisco) :
  1. Weight           (local, propriétaire Cisco, plus grand = préféré)
  2. Local Preference (intra-AS, plus grand = préféré, défaut=100)
  3. Locally originated (routes injectées localement)
  4. AS_PATH length   (plus court = préféré)
  5. Origin           (IGP < EGP < incomplete)
  6. MED              (Multi-Exit Discriminator — plus petit = préféré)
  7. eBGP > iBGP
  8. IGP metric vers le next-hop
  9. Oldest eBGP route
  10. Router ID (plus petit = préféré)

Attributs principaux :
  NEXT_HOP         : adresse IP du prochain routeur pour ce préfixe
  AS_PATH          : liste d'AS traversés (loop detection)
  LOCAL_PREF       : préférence locale (annoncé uniquement en iBGP)
  MED              : suggestion au voisin eBGP (non-transitif)
  COMMUNITY        : tag libre (32 bits) pour politique inter-AS
                     65535:0 = NO_EXPORT, 65535:1 = NO_ADVERTISE
  ATOMIC_AGGREGATE + AGGREGATOR : agrégation de préfixes
```

## BGP et Internet public

```
Table de routage globale : ~960 000 préfixes IPv4 + ~200 000 IPv6 (2024)
  routeviews.org : dump de la table BGP (à des fins de recherche)

Route Leak :
  Un AS annonce par erreur des routes qui ne lui appartiennent pas
  ou des routes qu'il devrait garder privées
  → Redirect massif du trafic (Incident Pakistan Telecom 2008 — YouTube)

BGP Hijacking :
  Annonce malveillante d'un préfixe appartenant à quelqu'un d'autre
  → Interception du trafic (Man-in-the-Middle)

RPKI — Resource Public Key Infrastructure :
  Signatures cryptographiques liant un préfixe à son ASN d'origine
  ROA (Route Origin Authorization) : "AS12345 peut annoncer 203.0.113.0/24"
  Déploiement progressif depuis 2012 — force le rejet des annonces invalides

BGPsec (RFC 8205) :
  Signe le AS_PATH complet (pas seulement l'origine)
  Très peu déployé (overhead de signatures)
```

## Configuration Cisco IOS (exemple)

```
router bgp 65001
  bgp router-id 10.0.0.1
  neighbor 203.0.113.2 remote-as 65002
  neighbor 203.0.113.2 description "Peering ISP-X"
  neighbor 203.0.113.2 password cisco123
  !
  address-family ipv4 unicast
    network 192.0.2.0 mask 255.255.255.0
    neighbor 203.0.113.2 activate
    neighbor 203.0.113.2 soft-reconfiguration inbound
  exit-address-family

show bgp summary            # état des voisins + préfixes
show bgp 203.0.113.0/24    # chemin vers un préfixe
show bgp neighbors 203.0.113.2 routes
```

## Liens

- [RFC 4271 — BGP-4](https://www.rfc-editor.org/rfc/rfc4271)
- [RFC 6811 — RPKI Route Origin Validation](https://www.rfc-editor.org/rfc/rfc6811)
- [BGP.tools — exploration BGP public](https://bgp.tools/)
- [Cloudflare — BGP et le routage d'Internet](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/)
