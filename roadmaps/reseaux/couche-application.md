---
id: couche-application
parent: root
label: Couche Application
explored: false
order: 5
---

# Couche Application

La couche application (couche 7 OSI) est celle que les développeurs touchent directement. Elle définit comment les programmes communiquent sur le réseau : format des messages, protocoles d'échange, sécurité de bout en bout.

## Catégories de protocoles applicatifs

```
Infrastructure réseau :
  DNS     : résolution noms → IP
  DHCP    : configuration automatique des hôtes
  NTP     : synchronisation d'horloge

Web :
  HTTP/1.1, HTTP/2, HTTP/3
  WebSocket, WebRTC

Sécurité transport :
  TLS/SSL : chiffrement de la couche transport
  DTLS    : TLS pour UDP

Messagerie asynchrone :
  MQTT, AMQP, NATS, Kafka (protocole propriétaire)

Accès distant :
  SSH, Telnet (obsolète), RDP, VNC

Transfert de fichiers :
  FTP/FTPS, SFTP (sur SSH), SCP, rsync

Email :
  SMTP (envoi), IMAP/POP3 (réception)

Monitoring :
  SNMP, syslog (RFC 5424)
```

## Ports bien connus

```
7      Echo
20/21  FTP (data/control)
22     SSH / SFTP / SCP
23     Telnet (non chiffré — obsolète)
25     SMTP
53     DNS (UDP + TCP)
67/68  DHCP (server/client)
80     HTTP
110    POP3
123    NTP
143    IMAP
161    SNMP (UDP)
389    LDAP
443    HTTPS
465    SMTPS
587    SMTP (submission)
636    LDAPS
993    IMAPS
995    POP3S
3306   MySQL
5432   PostgreSQL
6379   Redis
8080   HTTP alternatif (dev/proxy)
8443   HTTPS alternatif
```

## Liens

- [RFC 1122 — Requirements for Internet Hosts](https://www.rfc-editor.org/rfc/rfc1122)
- [IANA Port Numbers](https://www.iana.org/assignments/service-names-port-numbers/)
