---
id: securite-reseau
parent: root
label: Sécurité réseau
explored: false
order: 7
---

# Sécurité réseau

La sécurité réseau protège les données en transit et contrôle qui peut communiquer avec quoi. Elle va du filtrage de paquets au niveau des firewalls jusqu'aux architectures Zero Trust modernes.

## Menaces réseau principales

```
Attaques sur la couche réseau :
  IP Spoofing        : forger une adresse IP source
  BGP Hijacking      : annoncer frauduleusement des préfixes IP
  ARP Poisoning      : corrompre le cache ARP (Man-in-the-Middle L2)
  ICMP Smurf         : amplification DDoS via broadcast ICMP

Attaques sur la couche transport :
  SYN Flood          : épuiser les connexions TCP (DDoS)
  Port Scanning      : découverte de services ouverts (Nmap)
  Session Hijacking  : détournement de session TCP

Attaques applicatives :
  DNS Spoofing/Cache Poisoning
  SSL Stripping      : downgrade HTTPS → HTTP
  Man-in-the-Middle  : interception de trafic non chiffré

Attaques par déni de service :
  DDoS volumétrique  : saturation de bande passante
  Amplification DNS/NTP : envoyer des petites requêtes, forcer de grandes réponses
```

## Sous-sections

| Nœud | Sujet |
|------|-------|
| firewall-acl | Firewalls et ACL |
| vpn | VPN : WireGuard, IPsec, OpenVPN |
| zero-trust | Zero Trust Network Access |

## Liens

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP — Network Security](https://owasp.org/)
