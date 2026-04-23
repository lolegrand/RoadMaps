---
id: couche2-alternatives
parent: couche2-liaison
label: Alternatives couche 2
explored: false
order: 2
---

# Alternatives couche 2 — Au-delà d'Ethernet

Ethernet domine les LANs filaires, mais des technologies de liaison alternatives existent pour des usages industriels, sans-fil basse consommation, ou datacenter.

## VXLAN — Virtual Extensible LAN

```
Problème : 4094 VLANs insuffisants pour les datacenters modernes (cloud multi-tenant)
Solution : VXLAN encapsule les trames Ethernet dans des paquets UDP/IP

VXLAN ID (VNI) : 24 bits → 16 millions de segments logiques
Encapsulation  :
  [Outer Ethernet | Outer IP | UDP (port 4789) | VXLAN Header (VNI) | Inner Ethernet | Données]

Avantages :
  - Overlay L2 sur un réseau IP L3 (traverse les routeurs)
  - Scalabilité datacenter (SDN, VMware NSX, OpenStack Neutron)
  - Mobilité des VMs entre hyperviseurs

EVPN (Ethernet VPN) + VXLAN : plan de contrôle BGP pour distribuer les infos MAC/IP
Usage : AWS VPC, Azure VNET, Kubernetes CNI (Flannel, Calico)
```

## ZigBee (IEEE 802.15.4)

```
Fréquences : 2.4 GHz (mondial), 868 MHz (EU), 915 MHz (US)
Débit      : 250 kbps (2.4 GHz), 20/40 kbps (bandes sub-GHz)
Portée     : 10–100 m
Conso.     : ultra-faible → piles AA pour 2+ ans
Topologie  : mesh, étoile, cluster-tree

Usage domotique : Philips Hue, IKEA Tradfri, Xiaomi Smart Home
Zigbee Alliance → CSA (Connectivity Standards Alliance)
Thread/Matter    : successeur de ZigBee pour la domotique moderne (Apple, Google, Amazon)
```

## Z-Wave

```
Fréquences : 868.42 MHz (EU), 908.42 MHz (US) — sub-GHz sans interférence Wi-Fi
Débit      : 9.6–100 kbps
Portée     : 30 m (100 m avec amplificateur)
Topologie  : mesh (chaque nœud peut relayer)
Avantage   : interférence inexistante avec Wi-Fi (bande différente), certifié interopérabilité
Usage      : serrures connectées, prises, détecteurs (plus sécurisé que ZigBee)
```

## CAN Bus — Controller Area Network

```
Développé par Bosch (1986) pour l'automobile
Débit     : 125 kbps – 1 Mbps (CAN FD jusqu'à 8 Mbps)
Câble     : paire différentielle (CAN-H / CAN-L) sur bus partagé
Topologie : bus linéaire (toutes les ECUs sur le même fil)
Adressage : basé sur les messages (identifiant 11 ou 29 bits), pas sur les nœuds
Fiabilité : CRC, ACK, détection d'erreurs intégrée, redondance

Trouver un CAN bus dans :
  - Toute voiture moderne (ABS, moteur, airbag, climatisation)
  - Avions (ARINC 825)
  - Machinerie industrielle (CANopen)
  - Robotique (CiA DS402)

CAN FD (Flexible Data Rate) : jusqu'à 64 octets par trame, 5 Mbps
```

## Modbus

```
Protocole série industriel créé par Modicon (1979)
Toujours très utilisé en 2024 dans l'industrie

Variantes :
  Modbus RTU  : série RS-232 / RS-485 (binaire compact)
  Modbus TCP  : encapsulé dans TCP/IP (port 502)
  Modbus ASCII: série en ASCII (obsolète)

Architecture : maître/esclave → un maître interroge jusqu'à 247 esclaves
Registres    : Coils (0/1), Discrete Inputs, Input Registers, Holding Registers
Usage        : automates, capteurs industriels, compteurs d'énergie, SCADA
```

## Token Ring (IEEE 802.5) — historique

```
Développé par IBM (1984), concurrent malheureux d'Ethernet
Mécanisme  : un "jeton" circule sur l'anneau, seul le détenteur peut émettre
Débit      : 4 ou 16 Mbps
Avantage   : pas de collision (déterministe), latence prévisible
Défaut     : si un nœud tombe, l'anneau entier tombe
Fin de vie : abandonné dans les années 2000 face à Ethernet commuté

Héritage   : FDDI (Fiber Distributed Data Interface) — Token Ring sur fibre, 100 Mbps
             Encore utilisé dans certains systèmes temps réel industriels
```

## Liens

- [RFC 7348 — VXLAN](https://www.rfc-editor.org/rfc/rfc7348)
- [ZigBee / Matter — CSA](https://csa-iot.org/)
- [CAN in Automation (CiA)](https://www.can-cia.org/)
- [Modbus Organization](https://modbus.org/)
