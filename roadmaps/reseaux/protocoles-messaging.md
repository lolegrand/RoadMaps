---
id: protocoles-messaging
parent: couche-application
label: Protocoles Messaging
explored: false
order: 4
---

# Protocoles de Messagerie — MQTT, AMQP, CoAP, WebSocket

Au-delà de HTTP, des protocoles spécialisés répondent à des besoins spécifiques : IoT à faible consommation, messagerie d'entreprise, temps réel bidirectionnel, ou communication dans des réseaux contraints.

## MQTT — Message Queuing Telemetry Transport (RFC 9431)

```
Conçu en 1999 par IBM pour le monitoring de pipelines pétroliers via satellite
Modèle publish/subscribe, léger, conçu pour les réseaux à faible bande passante

Architecture :
  Publisher → Broker → Subscriber
  Broker central : Mosquitto, EMQX, HiveMQ, AWS IoT Core

Topics (hiérarchiques, séparés par "/") :
  maison/salon/temperature
  maison/+/humidity        ← wildcard single-level
  maison/#                 ← wildcard multi-level

QoS (Quality of Service) :
  QoS 0 : At most once    — fire and forget, peut être perdu
  QoS 1 : At least once   — garanti livré, peut être dupliqué
  QoS 2 : Exactly once    — 4-way handshake, garanti une seule fois

Retain : le broker conserve le dernier message par topic
         → un nouveau subscriber reçoit immédiatement la dernière valeur

Will (testament) : message envoyé si le client se déconnecte brutalement
  Utile pour détecter les devices offline

En-tête minimal : 2 octets fixes !
Transport : TCP port 1883 (ou 8883 TLS, 9001 WebSocket)

Usage : IoT, domotique (Home Assistant), télémétrie industrielle, capteurs
```

## AMQP — Advanced Message Queuing Protocol (RFC 4534 / AMQP 0-9-1)

```
Standard ouvert pour la messagerie d'entreprise (2003, JP Morgan)
Modèle plus riche que MQTT : exchanges, queues, bindings, routing

Concepts AMQP 0-9-1 (RabbitMQ) :
  Producer   → Exchange → Queue → Consumer
  Exchange   : reçoit les messages et les route selon des règles
  Queue      : tampon stockant les messages jusqu'à consommation
  Binding    : règle reliant un exchange à une queue (routing key)

Types d'exchanges :
  Direct   : routing key exacte → queue spécifique
  Topic    : routing key avec wildcards (* = 1 mot, # = plusieurs)
  Fanout   : diffuse à toutes les queues liées
  Headers  : routage par en-têtes (complexe, rare)

Propriétés :
  Durabilité  : messages persistants sur disque (survivent au redémarrage)
  Acknowledgment : consumer ACK après traitement (message retiré de la queue)
  Dead Letter Exchange : queue pour les messages refusés ou expirés

AMQP 1.0 (ISO 19464) :
  Modèle différent (compatible Apache Qpid, Azure Service Bus, ActiveMQ)
  RabbitMQ supporte les deux avec plugin

Transport : TCP port 5672 (5671 TLS)
Usage : paiements, orchestration de microservices, tâches asynchrones
```

## CoAP — Constrained Application Protocol (RFC 7252)

```
HTTP pour les appareils contraints (microcontrôleurs, réseaux 6LoWPAN)
UDP au lieu de TCP → ultra-léger

Méthodes : GET, POST, PUT, DELETE (comme HTTP)
Codes de réponse : 2.05 Content, 4.04 Not Found... (format x.yy)
En-tête : 4 octets fixes !

Modes de transmission :
  Confirmable (CON)  : ACK attendu (fiabilité applicative sur UDP)
  Non-Confirmable    : fire and forget
  Acknowledge (ACK)
  Reset (RST)

Observe (RFC 7641) : équivalent de subscribe pour CoAP
  GET /temperature avec Option Observe=0
  → Le serveur envoie des updates automatiques quand la valeur change

DTLS : version sécurisée (CoAP + DTLS sur UDP port 5684)

URI : coap://sensor.example.com:5683/temperature

Usage : capteurs 6LoWPAN, LPWAN, Zigbee IP, Thread (Matter d'Apple/Google)
```

## WebSocket (RFC 6455)

```
Connexion TCP bidirectionnelle et persistante initiée via HTTP

Upgrade HTTP → WebSocket :
  GET /chat HTTP/1.1
  Host: server.example.com
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
  Sec-WebSocket-Version: 13

  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

Après le handshake : canal TCP brut, frames bidirectionnelles
Frames : Text, Binary, Ping, Pong, Close

Avantages vs polling HTTP :
  Pas de headers HTTP répétés à chaque message
  Latence : immédiate (pas d'attente de requête)
  Bidirectionnel : serveur peut pousser sans demande client

Usage : chat en temps réel, jeux, trading, dashboards live, notifications

ws:// (port 80) / wss:// (port 443, TLS)
```

## NATS — Neural Autonomic Transport System

```
Messagerie ultra-légère et haute performance (Go, CNCF project)

Modèles supportés :
  Pub/Sub       : publish/subscribe simple
  Request/Reply : pub/sub avec réponse (pattern RPC)
  Queue Groups  : load balancing entre subscribers
  JetStream     : persistance, at-least-once, replay, streams (NATS 2.2+)

Sujet (subject) :
  "sensors.temperature.paris"
  Wildcards : * (un token) et > (tout ce qui suit)

En-tête : texte ASCII minimaliste (inspiré HTTP)
Performance : ~40M msgs/sec sur un seul nœud
Topologie   : cluster, leaf nodes, gateways pour multi-cloud

Usage : microservices, edge computing, IoT, remplacement léger de Kafka

Vs Kafka :
  NATS JetStream : plus simple, mémoire / faible charge, latence sub-ms
  Kafka          : replay à long terme, ordering strict par partition, big data
```

## Liens

- [RFC 9431 — MQTT 5.0](https://www.rfc-editor.org/rfc/rfc9431)
- [RFC 7252 — CoAP](https://www.rfc-editor.org/rfc/rfc7252)
- [RFC 6455 — WebSocket](https://www.rfc-editor.org/rfc/rfc6455)
- [NATS.io Documentation](https://docs.nats.io/)
- [RabbitMQ — AMQP](https://www.rabbitmq.com/tutorials/amqp-concepts.html)
