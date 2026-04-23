---
id: outils-diagnostic
parent: root
label: Outils de diagnostic
explored: false
order: 8
---

# Outils de diagnostic réseau

Le diagnostic réseau est une compétence fondamentale. Ces outils permettent de localiser les problèmes couche par couche : connectivité, routage, DNS, performance, trafic réel.

## Méthodologie de diagnostic

```
1. Définir le symptôme précis
   "Je ne peux pas accéder à example.com depuis la machine X"

2. Isoler la couche défectueuse (approche bottom-up)
   L1 Physique  : LED, câble, débit interface
   L2 Liaison   : ARP, MAC, VLAN
   L3 Réseau    : ping, traceroute, routes
   L4 Transport : nc, ss, telnet sur port
   L7 Application: curl, dig, browser

3. Comparer avec un cas qui fonctionne
   "Depuis la machine Y, ça marche → problème sur la machine X"

4. Documenter et changer UNE chose à la fois
```

## Sous-sections

| Nœud | Sujet |
|------|-------|
| commandes-reseau | ping, traceroute, ss, ip, netstat |
| wireshark-tcpdump | Capture et analyse de trafic |
| nmap-scanning | Découverte réseau et scanning de ports |

## Liens

- [Linux Network Admin Guide](https://tldp.org/LDP/nag2/index.html)
- [Brendan Gregg — Linux Performance](https://www.brendangregg.com/linuxperf.html)
