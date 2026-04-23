---
id: couche1-physique
parent: root
label: Couche 1 — Physique
explored: true
order: 2
---

# Couche 1 — Physique

La couche physique transmet des **bits bruts** sur un medium de transmission. Elle définit les caractéristiques électriques, optiques ou radio : tensions, fréquences, débits, connecteurs, codage du signal.

## Supports de transmission

### Cuivre (paires torsadées)

```
Catégorie    Débit max     Fréquence   Distance    Usage
Cat 5e       1 Gbps        100 MHz     100 m       Réseau bureautique
Cat 6        10 Gbps*      250 MHz     55 m*       Data center, poste
Cat 6a       10 Gbps       500 MHz     100 m       Data center standard
Cat 7        10 Gbps       600 MHz     100 m       Data center haut de gamme
Cat 8        25–40 Gbps    2000 MHz    30 m        Top-of-rack data center
(*10 Gbps limité à 55 m sur Cat 6 sans blindage)

Connecteur : RJ-45 (8P8C)
Câblage : T568A ou T568B (droit), croisé (crossover, obsolète avec Auto-MDIX)
```

### Fibre optique

```
                  Monomode (SMF)              Multimode (MMF)
Noyau             8–10 µm                     50–62.5 µm
Distance          Jusqu'à 80 km (DWDM: 1000+km) 300 m – 2 km
Débit             100 Gbps+                   10–100 Gbps
Source lumineuse  Laser (1310/1550 nm)        LED / VCSEL (850 nm)
Connecteurs       LC, SC, MTP/MPO             LC, SC, ST
Usage             WAN, backbone, datacenter   Intra-datacenter
Couleur gaine     Jaune (OS1/OS2)             Orange (OM1/2) Aqua (OM3/4/5)
```

### Wireless — IEEE 802.11 (Wi-Fi)

```
Standard     Bande      Débit théo.  Portée   Alias
802.11b      2.4 GHz    11 Mbps      35 m     Wi-Fi 1
802.11g      2.4 GHz    54 Mbps      35 m     Wi-Fi 3
802.11n      2.4/5 GHz  600 Mbps     70 m     Wi-Fi 4
802.11ac     5 GHz      6.9 Gbps     35 m     Wi-Fi 5
802.11ax     2.4/5/6GHz 9.6 Gbps    ~30 m    Wi-Fi 6/6E  ← standard actuel
802.11be     2.4/5/6GHz 46 Gbps     ~30 m    Wi-Fi 7     ← 2024+
```

## Concepts clés de la couche physique

```
Codage du signal :
  NRZ (Non-Return to Zero)  — 0V = 0, +5V = 1
  Manchester               — transition montante = 1, descendante = 0
  4B/5B + NRZI            — utilisé en Fast Ethernet (100BASE-TX)
  PAM4 (4-level Amplitude) — 25G/100G Ethernet, encode 2 bits par symbole

Bande passante vs Débit :
  Bande passante = capacité du medium (Hz)
  Débit          = bits par seconde effectifs
  Débit ≤ Bande passante × log2(N) — Théorème de Nyquist

Duplexité :
  Simplex      : un seul sens (télévision)
  Half-duplex  : alterné (talkie-walkie, ancien Wi-Fi)
  Full-duplex  : simultané (Ethernet moderne, câble)
```

## Liens

- [IEEE 802.3 — Ethernet standards](https://standards.ieee.org/ieee/802.3/)
- [IEEE 802.11 — Wi-Fi standards](https://standards.ieee.org/ieee/802.11/)
- [Fluke Networks — Cabling reference](https://www.flukenetworks.com/)
