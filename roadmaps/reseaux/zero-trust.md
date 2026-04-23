---
id: zero-trust
parent: securite-reseau
label: Zero Trust
explored: false
order: 3
---

# Zero Trust Network Access (ZTNA)

Zero Trust remet en cause le modèle "château fort" (tout ce qui est dans le LAN est de confiance). Dans un monde cloud et remote-work, l'intérieur du réseau n'est plus sûr. Zero Trust part du principe : "ne jamais faire confiance, toujours vérifier".

## Principes fondamentaux

```
Modèle traditionnel :
  Firewall périmétrique → tout ce qui est dedans est "safe"
  Latéral : une fois à l'intérieur, mouvement libre entre serveurs
  VPN : donner un accès réseau complet = blast radius énorme

Zero Trust (NIST SP 800-207) :
  1. Vérifier explicitement
     Toujours authentifier et autoriser, quelle que soit la localisation
     Utiliser tous les signaux disponibles : identité, appareil, localisation, comportement

  2. Moindre privilège (Least Privilege Access)
     Accès minimal nécessaire, Just-In-Time (JIT), Just-Enough-Access (JEA)
     Limiter l'exposition des données et services

  3. Présupposer la violation (Assume Breach)
     Segmenter les accès, minimiser le blast radius
     Chiffrement de bout en bout, analytics, détection d'anomalies
```

## Architecture Zero Trust

```
Policy Engine (PE) :
  Évalue les requêtes d'accès — cerveau du système
  Inputs : identité, état de l'appareil, contexte, politiques

Policy Administrator (PA) :
  Configure les canaux de communication (PEP) selon la décision du PE

Policy Enforcement Point (PEP) :
  Applique la décision — proxy, gateway, ou agent sur l'appareil

Flux d'accès :
  Utilisateur → PEP (non chiffré) → PE décide (OUI/NON) → PEP autorise
  → Connexion chiffrée vers la ressource (micro-tunnel)

Signaux d'évaluation :
  Identité         : SSO (SAML/OIDC), MFA, certificat
  Appareil         : MDM, OS à jour, disque chiffré, antivirus
  Comportement     : heure habituelle, géolocalisation, UAL
  Réseau           : IP de réputation connue, ASN, VPN
```

## BeyondCorp — implémentation Google (2014)

```
Google a supprimé son réseau interne après l'attaque Aurora (2010)
Tout le trafic, même interne, passe par Internet avec vérification d'identité

Composants BeyondCorp :
  Device Inventory DB  : liste des appareils connus et conformes
  Access Proxy         : proxy terminant les connexions (reverse proxy)
  SSO                  : authentification unique avec MFA
  Trust Inferer        : niveau de confiance calculé en temps réel

Résultat : 50k+ employés Google sans VPN traditionnel
Publication des whitepaper BeyondCorp a lancé le mouvement Zero Trust industrie
```

## SASE — Secure Access Service Edge (Gartner, 2019)

```
Convergence réseau + sécurité délivrée depuis le cloud

Composants SASE :
  SD-WAN          : connectivité optimisée (voir MPLS/SD-WAN)
  ZTNA            : accès Zero Trust aux applications
  CASB            : Cloud Access Security Broker (shadow IT, DLP cloud)
  SWG             : Secure Web Gateway (proxy web, URL filtering)
  FWaaS           : Firewall as a Service (NGFW dans le cloud)

Architecture SSE (Security Service Edge) = SASE sans le SD-WAN :
  Cloudflare Access / Gateway
  Zscaler Private Access (ZPA) / Internet Access (ZIA)
  Palo Alto Prisma Access
  Netskope
```

## Implémentation pratique

```
1. Inventaire et classification
   - Lister tous les assets (apps, APIs, data stores)
   - Classer par sensibilité (public, interne, confidentiel, secret)

2. Micro-segmentation réseau
   - Remplacer les VLAN plats par des micro-segments
   - Kubernetes : NetworkPolicy, Istio mTLS (service mesh)
   - VMware NSX / Illumio pour datacenter

3. Identity as the new perimeter
   - MFA obligatoire (FIDO2/WebAuthn de préférence)
   - Certificats machine (MTLS) pour les services
   - RBAC + ABAC granulaires

4. Chiffrement omniprésent
   - mTLS entre microservices (Istio, Linkerd)
   - Chiffrement at-rest + in-transit
   - Secrets management : Vault, AWS Secrets Manager

5. Monitoring continu
   - SIEM : collecter et corréler tous les logs
   - User Entity Behavior Analytics (UEBA)
   - Détection d'anomalies ML

Outils open-source :
  Pomerium     : ZTNA proxy open-source
  Teleport     : accès SSH/Kubernetes/databases avec audit trail
  BounCA       : PKI interne pour certificats machines
  Authelia     : SSO + 2FA pour auto-hébergement
```

## Liens

- [NIST SP 800-207 — Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture)
- [Google BeyondCorp](https://cloud.google.com/beyondcorp)
- [Cloudflare Zero Trust](https://www.cloudflare.com/zero-trust/)
- [CISA — Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model)
