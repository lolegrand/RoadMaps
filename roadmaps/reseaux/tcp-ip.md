---
id: tcp-ip
parent: modeles
label: Modèle TCP/IP
explored: true
order: 2
---

# Modèle TCP/IP

Le modèle TCP/IP (aussi appelé modèle Internet) est le modèle pratique sur lequel est bâti Internet. Il comporte 4 couches (parfois décrit en 5 en séparant Liaison et Physique).

## Les 4 couches TCP/IP

```
┌─────────────────────────────────────────────────────────────┐
│  4 - Application                                             │
│  HTTP/2, HTTP/3, DNS, SMTP, IMAP, SSH, SNMP, DHCP, NTP     │
│  (regroupe OSI 5+6+7)                                        │
├─────────────────────────────────────────────────────────────┤
│  3 - Transport                                               │
│  TCP, UDP, SCTP, QUIC                                        │
│  → ports, fiabilité, contrôle de flux                        │
├─────────────────────────────────────────────────────────────┤
│  2 - Internet                                                │
│  IPv4, IPv6, ICMP, ICMPv6, ARP, OSPF, BGP                  │
│  → adressage logique, routage                                │
├─────────────────────────────────────────────────────────────┤
│  1 - Accès réseau (Network Access / Link)                    │
│  Ethernet, Wi-Fi 802.11, PPP, DOCSIS, DSL                   │
│  → transmission physique + adressage MAC                     │
└─────────────────────────────────────────────────────────────┘
```

## Suite de protocoles TCP/IP complète

```
Application     : HTTP HTTPS FTP SSH SMTP IMAP POP3 DNS DHCP
                  SNMP NTP TFTP SIP RTP RTSP LDAP MQTT CoAP
Transport       : TCP  UDP  SCTP  QUIC  DCCP  MPTCP
Internet        : IPv4  IPv6  ICMP  ICMPv6  ARP  NDP
                  OSPF  BGP  RIP  IS-IS  EIGRP  MPLS
Accès réseau    : Ethernet  802.11 (Wi-Fi)  PPP  ARP
                  DOCSIS (câble)  DSL  Frame Relay  ATM
```

## Adressage à chaque couche

```
Application     : URL / nom de domaine (example.com)
Transport       : Port (80, 443, 22, 25…)
Internet        : Adresse IP (192.168.1.1, 2001:db8::1)
Accès réseau    : Adresse MAC (00:1A:2B:3C:4D:5E)
```

## Correspondance OSI ↔ TCP/IP avec exemples

```
OSI 7 Application  ]                  HTTP, DNS, SMTP
OSI 6 Présentation ]→ TCP/IP App. →  TLS, MIME, JSON
OSI 5 Session      ]                  Cookies, WebSocket handshake

OSI 4 Transport    ]→ TCP/IP Transport → TCP, UDP, QUIC

OSI 3 Réseau       ]→ TCP/IP Internet → IPv4, IPv6, ICMP

OSI 2 Liaison      ]→ TCP/IP Link   → Ethernet, Wi-Fi, ARP
OSI 1 Physique     ]
```

## Liens

- [RFC 1180 — A TCP/IP Tutorial](https://www.rfc-editor.org/rfc/rfc1180)
- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/)
