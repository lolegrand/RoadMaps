---
id: evenements-streams
parent: nodejs
label: Événements & Streams
explored: false
order: 3
---

# Événements & Streams

`EventEmitter` est la base de l'architecture Node.js. Les Streams permettent de traiter des données en flux — sans charger l'intégralité en mémoire.

## EventEmitter

```javascript
import { EventEmitter } from 'node:events';

class OrderProcessor extends EventEmitter {
  async process(order) {
    this.emit('processing', order);
    try {
      await chargePayment(order);
      this.emit('payment:success', order);
      await updateInventory(order);
      this.emit('complete', order);
    } catch (err) {
      this.emit('error', err, order);    // 'error' sans listener → crash
    }
  }
}

const processor = new OrderProcessor();
processor.setMaxListeners(20);           // éviter le warning "memory leak"

processor.on('processing',       order => console.log('Processing:', order.id));
processor.on('payment:success',  order => sendConfirmationEmail(order));
processor.on('complete',         order => analytics.track('order.complete', order));
processor.once('error',          (err, order) => rollback(order)); // once = une seule fois

// Attendre un événement comme une Promise
const [result] = await EventEmitter.once(processor, 'complete');
```

## Streams — les 4 types

```javascript
import { Readable, Writable, Transform, pipeline } from 'node:stream';
import { pipeline as pipelineAsync } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';

// Readable — source de données
const readable = Readable.from(async function* () {
  for (const item of largeDataset) {
    yield JSON.stringify(item) + '\n';
    // Ne charge qu'un item à la fois en mémoire
  }
});

// Transform — transforme les données à la volée
class CSVParser extends Transform {
  constructor() { super({ readableObjectMode: true }); }
  _transform(chunk, _, callback) {
    const lines = chunk.toString().split('\n').filter(Boolean);
    lines.forEach(line => this.push(Object.fromEntries(
      line.split(',').map((v, i) => [headers[i], v.trim()])
    )));
    callback();
  }
}

// Pipeline — connecte des streams avec gestion d'erreurs
await pipelineAsync(
  createReadStream('./data.csv'),
  new CSVParser(),
  async function* (source) {
    for await (const record of source) {
      yield await enrichRecord(record);  // traitement async par item
    }
  },
  createGzip(),                           // compression à la volée
  createWriteStream('./output.csv.gz')
);
// Mémoire utilisée : constante quelle que soit la taille du fichier
```

## Web Streams API (Node 18+ & navigateurs)

```javascript
// API unifiée navigateur ↔ Node.js
const response = await fetch('https://api.example.com/large-dataset');
const reader   = response.body.getReader();

// Lire chunk par chunk
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  processChunk(value);  // Uint8Array
}

// TransformStream — compatible Web Streams
const { readable, writable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  }
});
```

## Liens

- [Node.js — Events](https://nodejs.org/api/events.html)
- [Node.js — Streams](https://nodejs.org/api/stream.html)
- [Node.js — Web Streams](https://nodejs.org/api/webstreams.html)
