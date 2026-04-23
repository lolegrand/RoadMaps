const http = require('http');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chokidar = require('chokidar');

const PORT = process.env.PORT || 3000;
const ROADMAPS_DIR = path.join(__dirname, 'roadmaps');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

const sseClients = new Set();
function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => { try { res.write(msg); } catch {} });
}

if (!fs.existsSync(ROADMAPS_DIR)) fs.mkdirSync(ROADMAPS_DIR, { recursive: true });

// ===== ROADMAP LOADING =====

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content.trim() };
  try {
    return { meta: yaml.load(match[1]) || {}, body: match[2].trim() };
  } catch {
    return { meta: {}, body: content.trim() };
  }
}

function buildTree(nodes) {
  const byId = {};
  nodes.forEach(n => { byId[n.id] = { ...n, children: [] }; });

  let root = null;
  nodes.forEach(n => {
    if (!n.parent) {
      root = byId[n.id];
    } else {
      const parent = byId[n.parent];
      if (parent) parent.children.push(byId[n.id]);
    }
  });

  function clean(node) {
    node.children.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    node.children.forEach(clean);
    if (node.children.length === 0) delete node.children;
    delete node.id;
    delete node.parent;
    delete node.order;
  }

  if (root) clean(root);
  return root;
}

function loadRoadmap(name) {
  const dirPath = path.join(ROADMAPS_DIR, name);
  const meta = yaml.load(fs.readFileSync(path.join(dirPath, '_meta.yaml'), 'utf8'));

  const nodes = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dirPath, f), 'utf8');
      const { meta: fm, body } = parseFrontmatter(raw);
      return { ...fm, summary: body || null };
    });

  return { ...meta, root: buildTree(nodes) };
}

function listRoadmaps() {
  return fs.readdirSync(ROADMAPS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && fs.existsSync(path.join(ROADMAPS_DIR, e.name, '_meta.yaml')))
    .map(e => {
      try {
        const meta = yaml.load(fs.readFileSync(path.join(ROADMAPS_DIR, e.name, '_meta.yaml'), 'utf8'));
        return { name: e.name, title: meta.title || e.name, description: meta.description || '', color: meta.color || null };
      } catch {
        return { name: e.name, title: e.name, description: '', color: null };
      }
    });
}

// ===== HTTP SERVER =====

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname === '/api/roadmaps') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(listRoadmaps()));
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (pathname.startsWith('/api/roadmap/')) {
    const name = decodeURIComponent(pathname.slice('/api/roadmap/'.length));
    if (name.includes('/') || name.includes('..')) { res.writeHead(400); return res.end('Invalid'); }
    const dirPath = path.join(ROADMAPS_DIR, name);
    if (!fs.existsSync(dirPath)) { res.writeHead(404); return res.end(JSON.stringify({ error: 'Not found' })); }
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(loadRoadmap(name)));
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (pathname === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    res.write('data: {"type":"connected"}\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

// Watch all roadmap directories for changes
chokidar.watch(ROADMAPS_DIR, { ignoreInitial: true, depth: 2 }).on('all', (event, filePath) => {
  const rel = path.relative(ROADMAPS_DIR, filePath);
  const name = rel.split(path.sep)[0];
  if (name) broadcast({ type: 'change', name, event });
});

server.listen(PORT, () => {
  console.log(`\n  Roadmap Explorer → http://localhost:${PORT}\n`);
});
