---
id: routage-ip
parent: couche3-reseau
label: Routage IP
explored: false
order: 2
---

# Routage IP

Le routage est le processus par lequel les routeurs déterminent le **meilleur chemin** pour acheminer un paquet vers sa destination. Chaque routeur consulte sa table de routage et transmet le paquet au prochain saut (next-hop).

## Table de routage

```bash
# Linux
ip route show
# 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100
# 10.0.0.0/8 via 192.168.1.1 dev eth0 metric 100
# default via 192.168.1.1 dev eth0 proto dhcp metric 100

# Cisco IOS
show ip route
# C  192.168.1.0/24  is directly connected, GigabitEthernet0/0
# S  10.0.0.0/8      [1/0] via 192.168.1.1     ← statique
# O  172.16.0.0/16   [110/20] via 10.0.0.1     ← OSPF
# B  0.0.0.0/0       [20/0] via 203.0.113.1    ← BGP
```

## Algorithme de routage — Longest Prefix Match

```
Paquet à destination de 192.168.1.75
Table de routage :
  0.0.0.0/0        via 10.0.0.1   (route par défaut)
  192.168.0.0/16   via 10.0.0.2
  192.168.1.0/24   via 10.0.0.3   ← préfixe le plus long → choisi
  192.168.1.64/26  via 10.0.0.4   ← encore plus long → .75 est dans 64-127 → CHOISI

Règle : le préfixe le plus long (le plus spécifique) l'emporte toujours
```

## Routage statique vs dynamique

```
Statique :
  - Configuré manuellement par l'administrateur
  - Stable, prévisible, pas de CPU pour le calcul
  - Ne s'adapte pas aux pannes
  - Usage : petits réseaux, routes par défaut, stub networks

  ip route add 10.10.0.0/16 via 192.168.1.1

Dynamique :
  - Les routeurs échangent des informations et calculent les routes
  - S'adapte aux pannes (convergence)
  - Protocoles : RIP, OSPF, IS-IS (IGP — intra-AS), BGP (EGP — inter-AS)
```

## Distance administrative — arbitrage entre sources

```
Source             Distance administrative (Cisco)
Connected          0    (interface directement connectée)
Static             1    (route statique)
EIGRP Summary      5
External BGP       20
OSPF               110
IS-IS              115
RIP                120
EIGRP (external)   170
Internal BGP       200
Unknown            255  (jamais utilisé)

→ En cas de routes vers la même destination depuis plusieurs sources,
  la distance administrative la plus basse gagne
```

## ECMP — Equal Cost Multi-Path

```
Si plusieurs routes vers la même destination ont le même coût
→ Le trafic est réparti (load balancing) entre les chemins

Round-robin par flux (5-tuple hash : src/dst IP + ports + protocole)
→ Même flux toujours sur le même chemin (pas de réordonnancement TCP)

ip route add 10.0.0.0/8 nexthop via 192.168.1.1 nexthop via 192.168.2.1
```

## Liens

- [RFC 4271 — BGP-4](https://www.rfc-editor.org/rfc/rfc4271)
- [Cisco — IP Routing](https://www.cisco.com/c/en/us/tech/ip/ip-routing/index.html)
