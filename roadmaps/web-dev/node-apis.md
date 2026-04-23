---
id: node-apis
parent: nodejs
label: APIs intégrées Node.js
explored: false
order: 2
---

# APIs intégrées Node.js

Node.js expose un ensemble riche d'APIs sans dépendances tierces : système de fichiers, réseau, cryptographie, processus, workers…

## Système de fichiers — `node:fs`

```javascript
import { readFile, writeFile, mkdir, readdir,
         watch, stat, copyFile, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { join, resolve, extname, basename, dirname } from 'node:path';

// Lecture / Écriture asynchrones
const content = await readFile('./config.json', 'utf8');
const config  = JSON.parse(content);

await writeFile('./output.json', JSON.stringify(config, null, 2), 'utf8');

// Créer un répertoire récursivement
await mkdir('./dist/assets', { recursive: true });

// Lister des fichiers
const entries = await readdir('./src', { withFileTypes: true, recursive: true });
const tsFiles = entries
  .filter(e => e.isFile() && extname(e.name) === '.ts')
  .map(e => join(e.parentPath, e.name));

// Surveiller les changements (hot reload, build watchers)
const watcher = watch('./src', { recursive: true });
for await (const { eventType, filename } of watcher) {
  console.log(`[${eventType}] ${filename}`);
}

// Streams — pour les gros fichiers (pas charger en RAM)
const readStream  = createReadStream('./large-file.csv', { encoding: 'utf8' });
const writeStream = createWriteStream('./output.csv');
readStream.pipe(writeStream);
```

## HTTP — `node:http` & `node:https`

```javascript
import { createServer } from 'node:http';

const server = createServer(async (req, res) => {
  const url  = new URL(req.url, `http://${req.headers.host}`);
  const body = await collectBody(req);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ path: url.pathname, body }));
});

server.listen(3000, () => console.log('http://localhost:3000'));

// Requête HTTP sortante (Node 18+ : fetch() natif recommandé)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

## Cryptographie — `node:crypto`

```javascript
import {
  randomBytes, randomUUID,
  createHash, createHmac,
  scrypt, timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

// Générer des valeurs aléatoires sécurisées
const token    = randomBytes(32).toString('hex');  // 64 caractères hex
const uuid     = randomUUID();                      // UUID v4

// Hachage
const sha256 = createHash('sha256').update('hello').digest('hex');

// HMAC — vérifier l'intégrité (webhooks, tokens)
const hmac = createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');

// Hachage de mots de passe — scrypt (recommandé)
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashVerify = await scryptAsync(password, salt, 64);
  // timingSafeEqual — évite les timing attacks
  return timingSafeEqual(Buffer.from(hash, 'hex'), hashVerify);
}
```

## Process & Environnement

```javascript
import { env, argv, exit, pid, platform, version } from 'node:process';

// Variables d'environnement
const port    = Number(env.PORT ?? 3000);
const nodeEnv = env.NODE_ENV ?? 'development';
const isProd  = nodeEnv === 'production';

// Arguments CLI
// node script.js --port 4000 --verbose
const args = Object.fromEntries(
  argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
);

// Signaux — arrêt propre
process.on('SIGTERM', async () => {
  console.log('SIGTERM reçu — arrêt propre');
  await server.close();
  await db.disconnect();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
```

## Worker Threads — CPU-bound sans bloquer

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { cpus } from 'node:os';

if (isMainThread) {
  // Thread principal — crée les workers
  const worker = new Worker(import.meta.url, {
    workerData: { input: largeArray, chunkSize: 1000 }
  });

  worker.on('message', result => console.log('Résultat:', result));
  worker.on('error', err => console.error(err));
} else {
  // Worker — exécution dans un thread séparé
  const { input, chunkSize } = workerData;
  const result = heavyComputation(input, chunkSize);
  parentPort.postMessage(result);
}
```

## Liens

- [Node.js — API docs](https://nodejs.org/api/)
- [Node.js — Best practices](https://github.com/goldbergyoni/nodebestpractices)
