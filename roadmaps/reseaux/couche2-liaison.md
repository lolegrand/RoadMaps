---
id: couche2-liaison
parent: root
label: Couche 2 — Liaison
explored: true
order: 3
---

# Couche 2 — Liaison de données

La couche liaison est responsable de la transmission **fiable entre deux nœuds directement connectés**. Elle gère l'adressage physique (MAC), la détection d'erreurs, et le contrôle d'accès au medium (MAC = Media Access Control).

## Trame Ethernet (IEEE 802.3)

```
 7 octets  1 octet  6 octets  6 octets  2 octets  46–1500 octets  4 octets
┌─────────┬────────┬──────────┬──────────┬─────────┬──────────────┬────────┐
│Préambule│  SFD   │ MAC Dest │  MAC Src │EtherType│   Payload    │  FCS   │
│10101010…│10101011│00:1A:2B…  │00:3C:4D… │0x0800   │  (données)   │CRC-32  │
└─────────┴────────┴──────────┴──────────┴─────────┴──────────────┴────────┘
                                           IPv4=0x0800
                                           IPv6=0x86DD
                                           ARP =0x0806
                                           VLAN=0x8100
```

## Adresses MAC

```
Structure : 6 octets = 48 bits
Format    : 00:1A:2B:3C:4D:5E  (hexadécimal séparé par : ou -)

Bits spéciaux du premier octet :
  bit 0 (I/G) : 0 = adresse individuelle, 1 = multicast/broadcast
  bit 1 (U/L) : 0 = attribuée par le fabricant (OUI), 1 = locale

Adresse broadcast  : FF:FF:FF:FF:FF:FF  (toutes les interfaces du LAN)
Multicast IPv4     : 01:00:5E:xx:xx:xx
Multicast IPv6     : 33:33:xx:xx:xx:xx

OUI (Organisationally Unique Identifier) :
  Les 3 premiers octets identifient le fabricant
  00:1A:2B → Cisco | 00:50:56 → VMware | B8:27:EB → Raspberry Pi
  lookup : macvendors.com
```

## ARP — Address Resolution Protocol

```
Problème : je connais l'IP de destination, mais pas son MAC pour construire la trame Ethernet

ARP Request  (broadcast FF:FF:FF:FF:FF:FF) :
  "Qui a l'IP 192.168.1.1 ? Répondez à 00:AA:BB:CC:DD:EE"

ARP Reply    (unicast vers le demandeur) :
  "L'IP 192.168.1.1 est à 00:11:22:33:44:55"

Cache ARP (Linux/Mac) :
  arp -n          # afficher le cache
  ip neigh show   # alternative moderne (iproute2)

ARP Spoofing : une attaque MITM où un attaquant répond faussement aux ARP Request
  → Détection : arpwatch, inspection ARP dynamique (DAI) sur les switches
```

## Switch — commutation Ethernet

```
Apprentissage (flooding → learning) :
1. Switch reçoit une trame de PC-A (port 1, MAC AA:BB:CC)
2. Enregistre MAC AA:BB:CC ↔ port 1 dans sa MAC address table (CAM table)
3. Si MAC destination inconnue → flood sur tous les ports sauf source
4. Progressivement, la CAM table se remplit → trafic unicast ciblé

CAM table :
  MAC              Port    VLAN    Age
  AA:BB:CC:DD:EE:FF  Gi0/1   10     120s
  11:22:33:44:55:66  Gi0/2   10     45s

show mac address-table           # Cisco IOS
bridge fdb show dev eth0         # Linux

Collision domain : un switch crée un domaine de collision par port (full-duplex)
Broadcast domain : un switch = un domaine de broadcast (limité par les VLANs)
```

## Liens

- [RFC 826 — ARP](https://www.rfc-editor.org/rfc/rfc826)
- [IEEE 802.3 — Ethernet](https://standards.ieee.org/ieee/802.3/)
- [Wireshark — Ethernet analysis](https://wiki.wireshark.org/Ethernet)
