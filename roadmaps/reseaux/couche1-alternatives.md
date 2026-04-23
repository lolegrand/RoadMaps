---
id: couche1-alternatives
parent: couche1-physique
label: Alternatives couche 1
explored: false
order: 1
---

# Alternatives couche 1 — Au-delà de l'Ethernet et du Wi-Fi

La couche physique est bien plus riche que le câble Ethernet ou le Wi-Fi. Des technologies spécialisées couvrent des cas où ces standards échouent : longue portée, faible consommation, infrastructure existante, ou lumière visible.

## CPL / PLC — Courant Porteur en Ligne (Powerline)

```
Principe : transmet des données sur le câblage électrique existant
Standard : HomePlug AV2, IEEE 1901, G.hn
Débit    : jusqu'à 2 Gbps théoriques (200–500 Mbps réels)
Portée   : 300 m sur le réseau électrique d'un bâtiment
Usage    : IPTV, extension réseau sans câble supplémentaire
Limite   : perturbations électriques, isolation de phase

Variante G.hn : utilise aussi les paires téléphoniques et le coax
```

## Li-Fi — Light Fidelity

```
Principe : modulation de la lumière visible (LED) pour transmettre des données
Débit    : jusqu'à 224 Gbps en laboratoire, 1 Gbps en produit commercial
Portée   : quelques mètres (ligne de vue obligatoire)
Standard : IEEE 802.11bb (2023)
Avantages:
  - Impossible d'intercepter à travers les murs (sécurité physique)
  - Pas d'interférence RF (hôpitaux, avions, usines)
  - Spectre quasi illimité (lumière visible = 430–770 THz vs RF = quelques GHz)
Limites  :
  - Ligne de vue obligatoire
  - Perturbé par la lumière ambiante forte
  - Infrastructure LED spéciale requise
Usage    : salles de chirurgie, cockpits, zones RF-free
```

## LoRa / LoRaWAN — Long Range Low Power

```
Principe : modulation CSS (Chirp Spread Spectrum), très basse consommation
Fréquences: 868 MHz (EU), 915 MHz (US), 433 MHz (Asie)
Débit    : 0.3 – 50 kbps (très faible — données courtes uniquement)
Portée   :
  - Urbain  : 2–5 km
  - Rural   : 15–20 km
  - Record  : 832 km (ballon + atmosphère)
Conso.   : quelques µA en veille → batterie AA pendant 10 ans
Architecture: LoRaWAN = MAC layer + réseau étoile vers gateway → Network Server
Usage    : compteurs IoT, capteurs agricoles, tracking d'actifs
Réseau   : The Things Network (TTN) — réseau mondial communautaire
Opérateurs: Orange, Bouygues (réseau LoRa national en France)
```

## Sigfox

```
Principe : ultra-narrow band (UNB) — bande de 100 Hz
Débit    : 100 bps uplink, 600 bps downlink
Portée   : 30–50 km rural, 3–10 km urbain
Messages : 140 msgs/jour max, 12 octets max par message
Avantage : couverture nationale clé-en-main, consommation ultra-faible
Limite   : opérateur centralisé (Sigfox SA), faible débit
Usage    : tracking, alarmes, relevés ponctuels
```

## NB-IoT / LTE-M — IoT cellulaire

```
NB-IoT (Narrowband IoT)
  Débit    : 250 kbps DL / 20 kbps UL
  Portée   : couverture 4G/5G existante
  Latence  : tolère des latences élevées (LPWAN)
  Conso.   : mode PSM (Power Saving Mode) → années de batterie
  Usage    : compteurs eau/gaz, capteurs sol, tracking faible mobilité

LTE-M (Cat-M1)
  Débit    : 1 Mbps DL / 1 Mbps UL
  Latence  : ~10–15 ms
  Mobilité : roaming, handover — idéal pour objets mobiles
  Usage    : trackers GPS, wearables, appareils médicaux
```

## 5G NR — New Radio

```
Bandes de fréquences :
  FR1 (sub-6 GHz)  : 450 MHz – 6 GHz → couverture large, pénétration
  FR2 (mmWave)     : 24–52 GHz       → ultra-débit, courte portée

Cas d'usage :
  eMBB (enhanced Mobile Broadband) : haut débit mobile → 10–20 Gbps théoriques
  uRLLC (Ultra-Reliable Low Latency): latence < 1 ms  → industrie, véhicules autonomes
  mMTC (massive Machine-Type Comm.) : 1M appareils/km² → IoT massif

Network Slicing : plusieurs réseaux virtuels indépendants sur la même infrastructure
Private 5G      : réseau 5G d'entreprise (usines, ports, stades)
```

## Starlink / LEO Satellite

```
Constellation: SpaceX Starlink (~6000 satellites en orbite basse à 550 km)
Débit        : 25–200 Mbps DL, 5–20 Mbps UL
Latence      : 20–60 ms (contre 600+ ms pour les satellites GEO)
Couverture   : mondiale (zones blanches, maritime, aviation)
Usage        : zones rurales sans fibre, zones de catastrophe, bateaux/avions
Alternatives : Amazon Kuiper (en déploiement), OneWeb, Telesat Lightspeed
```

## Liens

- [LoRa Alliance](https://lora-alliance.org/)
- [IEEE 802.11bb — Li-Fi standard](https://standards.ieee.org/ieee/802.11bb/)
- [The Things Network](https://www.thethingsnetwork.org/)
- [3GPP — NB-IoT & LTE-M](https://www.3gpp.org/technologies/nb-iot-lte-m)
