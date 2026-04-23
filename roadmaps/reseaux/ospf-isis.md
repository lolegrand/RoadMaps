---
id: ospf-isis
parent: routage-avance
label: OSPF et IS-IS
explored: false
order: 2
---

# OSPF et IS-IS — Protocoles de routage internes

OSPF et IS-IS sont les deux protocoles IGP dominants. Tous deux utilisent l'algorithme de Dijkstra (Shortest Path First). OSPF est le plus répandu dans les entreprises, IS-IS est préféré par les FAI et les grands datacenters.

## OSPF — Open Shortest Path First (RFC 2328 / RFC 5340)

```
Protocole à état des liens (Link State) :
  Chaque routeur connaît la TOPOLOGIE COMPLÈTE de sa zone
  Chaque routeur calcule INDÉPENDAMMENT les meilleurs chemins (Dijkstra)

Versions :
  OSPFv2 (RFC 2328) : IPv4
  OSPFv3 (RFC 5340) : IPv6 et IPv4 (address-family)

Concept de zones (Areas) :
  Area 0 (backbone)  : tous les autres areas doivent y être connectés
  Area N             : regroupe des routeurs (réduit la taille de la LSDB)

Types de routeurs :
  IR (Internal Router)    : routes uniquement à l'intérieur d'une zone
  ABR (Area Border Router): connecté à l'Area 0 ET une autre zone
  ASBR (AS Boundary Router): redistribue des routes externes (BGP→OSPF)
  DR/BDR (Designated/Backup Designated Router) : sur les réseaux broadcast
```

## OSPF — processus de routage

```
1. Découverte des voisins (Hello packets)
   Multicast 224.0.0.5 (tous les routeurs OSPF) toutes les 10s
   224.0.0.6 (DR/BDR uniquement)

2. Élection DR/BDR (sur réseaux broadcast comme Ethernet)
   DR  : reçoit LSA de tous les routeurs, les redistribue
   BDR : backup du DR
   DROTHER : envoie uniquement au DR/BDR

3. Échange de la LSDB (Link State Database)
   DBD (Database Description) : résumé de la LSDB locale
   LSR (Link State Request)   : demande des LSA manquants
   LSU (Link State Update)    : envoi des LSA demandés
   LSAck                      : accusé de réception

4. Calcul SPF (Dijkstra) → table de routage

Types de LSA importants :
  Type 1 (Router LSA)   : liens d'un routeur dans une zone
  Type 2 (Network LSA)  : généré par le DR pour un réseau broadcast
  Type 3 (Summary LSA)  : résumé de route inter-zone (généré par ABR)
  Type 5 (AS External)  : routes redistribuées de l'extérieur (ASBR)
```

## OSPF — métriques et coût

```
Coût OSPF = 10^8 / bande_passante (en bps)
  FastEthernet (100 Mbps)  → coût 1
  GigabitEthernet (1 Gbps) → coût 1 (problème si auto-cost non modifié)
  Serial (1.544 Mbps T1)   → coût 64

Bonne pratique : modifier le coût de référence pour différencier le Gbps et le 10Gbps
  auto-cost reference-bandwidth 10000  ← 10 Gbps comme référence

# Cisco IOS
show ip ospf interface brief    # cost, state, DR/BDR
show ip ospf database           # LSDB
show ip ospf neighbor           # état des voisins
debug ip ospf events            # (à éviter en prod)
```

## IS-IS — Intermediate System to Intermediate System

```
Protocole ISO, conçu pour CLNP (couche réseau OSI) — non IP !
Mais il transporte des infos IP via TLV (Type-Length-Value) extensibles
→ c'est pourquoi IS-IS supporte facilement IPv6, MPLS, Segment Routing

Architecture à deux niveaux :
  Level 1 (L1)  : routage intra-area (équivalent OSPF intra-zone)
  Level 2 (L2)  : routage inter-area (équivalent OSPF backbone Area 0)
  L1/L2         : routeurs aux frontières (équivalent ABR)

IS-IS vs OSPF :
  IS-IS : adresses NET (NSAP) au lieu d'IP pour les routeurs eux-mêmes
  IS-IS : moins de types de paquets (3 : Hello, LSP, CSNP/PSNP)
  IS-IS : plus extensible (TLV) → carrier pour tout nouveau protocole
  IS-IS : plus scalable (LSDB dans un seul level 2)
  IS-IS : pas de DR/BDR sur Ethernet (DIS — Designated IS)

Pourquoi les FAI préfèrent IS-IS :
  Plus stable historiquement (moins de bugs LSDB que OSPF)
  Converge plus vite dans les très grands réseaux
  Extension naturelle pour MPLS (Traffic Engineering avec ISIS-TE)
  Support natif de Segment Routing (ISIS-SR)
```

## EIGRP — Enhanced Interior Gateway Routing Protocol (Cisco)

```
Protocole hybride (distance vector + certaines propriétés link state)
Propriétaire Cisco (partiellement ouvert en 2016, RFC 7868)

Algorithme DUAL (Diffusing Update Algorithm) :
  Garantit que les routes sans boucle sont toujours disponibles
  Convergence très rapide (routes de secours précalculées : Feasible Successor)

Métrique composite :
  K1×bandwidth + K2×bandwidth/(256-load) + K3×delay + K4×reliability
  Par défaut : K1=1, K3=1, K2=K4=K5=0 → bande passante + délai

Avantage vs OSPF : aucune notion de zone, configuration simple
Inconvénient : propriétaire, limité aux équipements Cisco/compatible
Usage : réseaux d'entreprise Cisco
```

## Liens

- [RFC 2328 — OSPFv2](https://www.rfc-editor.org/rfc/rfc2328)
- [RFC 5340 — OSPFv3](https://www.rfc-editor.org/rfc/rfc5340)
- [RFC 1195 — IS-IS for IP](https://www.rfc-editor.org/rfc/rfc1195)
- [Cisco — OSPF Design Guide](https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/7039-1.html)
