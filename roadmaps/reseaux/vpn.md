---
id: vpn
parent: securite-reseau
label: VPN
explored: false
order: 2
---

# VPN — Virtual Private Networks

Un VPN crée un tunnel chiffré entre deux points sur un réseau non fiable (Internet). Il existe trois familles : IPsec (standard enterprise), OpenVPN (flexible open-source), et WireGuard (moderne et performant).

## Typologies VPN

```
Site-to-Site :
  Connecte deux réseaux d'entreprise (siège ←→ succursale)
  Tunnel permanent entre deux routeurs/firewalls
  Utilisateurs n'ont pas besoin de logiciel VPN

Remote Access :
  Connecte un utilisateur individuel au réseau d'entreprise
  Client VPN sur le poste (OpenVPN client, WireGuard, Cisco AnyConnect)

Client-to-Site :
  VPN "grand public" : masquer l'IP, contourner la censure (NordVPN, Mullvad…)
```

## IPsec — Internet Protocol Security (RFC 4301)

```
Suite de protocoles pour sécuriser les communications IP
Fonctionne au niveau IP (couche 3) — transparent pour les applications

Deux modes :
  Transport mode : chiffre uniquement le payload IP (pas l'en-tête)
                   → pour hôte-à-hôte
  Tunnel mode    : encapsule l'IP dans un nouvel IP chiffré
                   → pour site-to-site (gateway-to-gateway)

Protocoles IPsec :
  AH (Authentication Header)  : intégrité + authentification, PAS de chiffrement
  ESP (Encapsulating Security Payload) : chiffrement + intégrité + authentification
  → En pratique, ESP seul est utilisé

IKE (Internet Key Exchange) — négociation des clés :
  IKEv1 : deux phases (Main Mode / Aggressive Mode)
  IKEv2 : plus simple, plus rapide, NAT-traversal natif (RFC 7296)

SA (Security Association) :
  Tunnel unidirectionnel avec paramètres (algorithme, clé, SPI)
  SPI (Security Parameter Index) : identifie la SA dans les paquets ESP

Algorithmes typiques (IKEv2 + ESP) :
  Chiffrement : AES-256-GCM
  Intégrité   : SHA-256 / SHA-384
  DH group    : 14 (2048-bit MODP) ou groupe 19 (ECDH P-256)
  PFS         : Perfect Forward Secrecy avec DH éphémère

Configuration Linux strongSwan :
  /etc/swanctl/conf.d/site-to-site.conf
  connections {
    site-b {
      remote_addrs = 203.0.113.2
      local { auth = psk; id = 203.0.113.1 }
      remote { auth = psk; id = 203.0.113.2 }
      children {
        lan-b {
          local_ts  = 192.168.1.0/24
          remote_ts = 10.0.0.0/24
          esp_proposals = aes256gcm128-sha256-modp2048
        }
      }
    }
  }
```

## OpenVPN

```
VPN open-source populaire, fonctionne en userspace (vs IPsec dans le kernel)
Transport : UDP port 1194 (ou TCP 443 pour bypass de certains firewalls)
Chiffrement : OpenSSL / mbedTLS (TLS pour le plan de contrôle)

Modes :
  TUN (couche 3) : routage IP → site-to-site et remote access
  TAP (couche 2) : bridge Ethernet → cas spéciaux (protocoles non-IP)

PKI intégrée :
  easy-rsa : génère CA + certificats serveur/client
  Chaque client a son propre certificat → révocation individuelle possible

Performance :
  Limitée par le userspace : ~500 Mbps sur un seul cœur
  Multi-threading limité

Configuration serveur (openvpn-server.conf) :
  port 1194
  proto udp
  dev tun
  ca ca.crt
  cert server.crt
  key server.key
  dh dh2048.pem
  tls-auth ta.key 0
  server 10.8.0.0 255.255.255.0
  push "route 192.168.1.0 255.255.255.0"
  push "dhcp-option DNS 8.8.8.8"
  cipher AES-256-GCM
  auth SHA256
  keepalive 10 120
  persist-key
  persist-tun
```

## WireGuard

```
Protocole VPN moderne (2015, Donenfeld), intégré au kernel Linux 5.6+
~4000 lignes de code (vs ~100k pour OpenVPN) → surface d'attaque réduite

Principes :
  Stateless : pas de mode connexion/déconnexion explicite
  CryptoKey Routing : chaque peer est identifié par sa clé publique
  Roaming natif : fonctionne si l'IP change (mobile)
  Silence radio : ne répond pas aux paquets invalides (pas de fingerprinting)

Cryptographie (moderne, non négociable) :
  Chiffrement      : ChaCha20-Poly1305
  Échange de clés  : Curve25519 (ECDH)
  Hachage          : BLAKE2s
  KDF              : HKDF
  Handshake        : Noise Protocol Framework

Performance :
  Kernel-native → 2-3x plus rapide qu'OpenVPN
  ~10 Gbps sur matériel standard (Linux kernel)

Configuration (wg0.conf) :
  [Interface]
  PrivateKey = <private_key>
  Address    = 10.0.0.1/24
  ListenPort = 51820

  [Peer]
  PublicKey  = <peer_public_key>
  AllowedIPs = 10.0.0.2/32, 192.168.2.0/24
  Endpoint   = peer.example.com:51820
  PersistentKeepalive = 25

Commandes :
  wg genkey | tee privatekey | wg pubkey > publickey
  wg-quick up wg0
  wg show
```

## Comparaison

```
                    IPsec       OpenVPN     WireGuard
Couche              IP (L3)     Userspace   Kernel (L3)
Protocol            IKEv2+ESP   TLS         Noise Protocol
Vitesse             Rapide      Moyen       Très rapide
Complexité config   Haute       Moyenne     Faible
NAT Traversal       IKEv2 OK    TCP 443 OK  UDP (STUN possible)
Compatibilité       Universelle Bonne       Croissante (Linux 5.6+)
Mobile (roaming)    Difficile   OK          Natif
Lignes de code      ~400k       ~100k       ~4k
PKI requise         Oui         Oui         Non (clés publiques seules)
```

## Liens

- [RFC 7296 — IKEv2](https://www.rfc-editor.org/rfc/rfc7296)
- [WireGuard.com](https://www.wireguard.com/)
- [strongSwan — IPsec pour Linux](https://www.strongswan.org/)
- [OpenVPN — Documentation](https://openvpn.net/community-resources/reference-manual-for-openvpn-2-4/)
