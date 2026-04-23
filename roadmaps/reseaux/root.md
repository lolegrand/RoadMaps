---
id: root
label: Réseaux
explored: true
order: 0
---

# Réseaux

Un réseau informatique est un ensemble de dispositifs interconnectés qui échangent des données selon des protocoles standardisés. Comprendre les réseaux, c'est comprendre comment chaque bit voyage du clavier de l'émetteur à l'écran du destinataire — à travers des câbles, des ondes, des routeurs et des protocoles empilés les uns sur les autres.

## L'empilement protocolaire — une poupée russe

```
Émetteur (navigateur)           Récepteur (serveur)
┌────────────────────┐          ┌────────────────────┐
│  HTTP GET /index   │          │  HTTP GET /index   │
├────────────────────┤          ├────────────────────┤
│  TLS chiffrement   │          │  TLS déchiffrement │
├────────────────────┤          ├────────────────────┤
│  TCP segment       │          │  TCP segment       │
├────────────────────┤          ├────────────────────┤
│  IP paquet         │◀────────▶│  IP paquet         │
├────────────────────┤  Routeur ├────────────────────┤
│  Ethernet frame    │  ──────  │  Ethernet frame    │
├────────────────────┤          ├────────────────────┤
│  Signal électrique │          │  Signal électrique │
└────────────────────┘          └────────────────────┘
   Chaque couche ajoute un en-tête (encapsulation)
   Chaque couche retire l'en-tête correspondant (décapsulation)
```

## Deux modèles de référence

| | OSI (7 couches) | TCP/IP (4 couches) |
|---|---|---|
| Rôle | Modèle conceptuel universel | Modèle pratique d'Internet |
| Utilité | Comprendre, enseigner, déboguer | Implémenter |
| Couche 7-5 | Application + Présentation + Session | Application |
| Couche 4 | Transport | Transport |
| Couche 3 | Réseau | Internet |
| Couches 2-1 | Liaison + Physique | Accès réseau |

## Encapsulation — comment les données voyagent

```
Application  "GET /index HTTP/1.1\r\nHost: example.com\r\n\r\n"
Transport    [TCP Header | données HTTP          ]
Réseau       [IP Header | TCP Header | données   ]
Liaison      [ETH Header | IP+TCP+données | FCS  ]
Physique     10101010110101001...  (bits sur le câble)
```

## Liens

- [Cisco — Networking Basics](https://www.netacad.com/)
- [RFC Editor — tous les RFCs](https://www.rfc-editor.org/)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
- [Julia Evans — Networking Zine](https://wizardzines.com/zines/networking/)
