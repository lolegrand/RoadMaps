'use strict';

// ===== THEME =====

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  document.getElementById('hljs-theme').href = theme === 'dark'
    ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
    : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  document.body.classList.add('theme-transitioning');
  applyTheme(isDark() ? 'light' : 'dark');
  // Re-render mindmap with correct halo color
  if (state.current) renderMindmap();
  setTimeout(() => document.body.classList.remove('theme-transitioning'), 400);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);
}

function themeToggleHTML() {
  return `<button class="theme-toggle" id="theme-toggle" title="Changer de thème" onclick="toggleTheme()">
    <span class="icon-moon">🌙</span>
    <span class="icon-sun">☀️</span>
  </button>`;
}

// ===== STATE =====

const state = {
  current: null,       // { name, title, description, color, root }
  selectedPath: null,
};

// ===== UTILS =====

function assignPaths(node, parent) {
  node._path = parent ? `${parent}\x00${node.label}` : node.label;
  if (node.children?.length) node.children.forEach(c => assignPaths(c, node._path));
}

function findNode(root, path) {
  if (root._path === path) return root;
  if (root.children) {
    for (const c of root.children) {
      const f = findNode(c, path);
      if (f) return f;
    }
  }
  return null;
}

function countNodes(node) {
  let total = 1, explored = getExplored(node) ? 1 : 0;
  if (node.children) {
    for (const c of node.children) {
      const r = countNodes(c);
      total += r.total; explored += r.explored;
    }
  }
  return { total, explored };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Polar → Cartesian, angle 0 = top
function polar(angle, r) {
  return [r * Math.cos(angle - Math.PI / 2), r * Math.sin(angle - Math.PI / 2)];
}

// Link path: straight from root, gentle bezier for deeper levels
function linkPath(d) {
  const [sx, sy] = polar(d.source.x, d.source.y);
  const [tx, ty] = polar(d.target.x, d.target.y);
  if (d.source.depth === 0) {
    return `M0,0 L${tx},${ty}`;
  }
  // Control point at average angle, interpolated radius (creates gentle arc)
  const midAngle = (d.source.x + d.target.x) / 2;
  const midR = d.source.y + (d.target.y - d.source.y) * 0.5;
  const [cpx, cpy] = polar(midAngle, midR);
  return `M${sx},${sy} Q${cpx},${cpy} ${tx},${ty}`;
}

// ===== EXPLORED STATE (localStorage) =====

const storageKey = name => `roadmap_explored::${name}`;

function loadExplored(name) {
  try { return JSON.parse(localStorage.getItem(storageKey(name)) || '{}'); }
  catch { return {}; }
}

function saveExplored(name, map) {
  localStorage.setItem(storageKey(name), JSON.stringify(map));
}

function getExplored(node) {
  if (!state.current) return node.explored || false;
  const map = loadExplored(state.current.name);
  return map.hasOwnProperty(node._path) ? map[node._path] : (node.explored || false);
}

function setExplored(node, value) {
  if (!state.current) return;
  const map = loadExplored(state.current.name);
  map[node._path] = value;
  saveExplored(state.current.name, map);
}

// ===== API =====

async function fetchRoadmapList() {
  const res = await fetch('/api/roadmaps');
  if (!res.ok) throw new Error('Impossible de charger les roadmaps');
  return res.json();
}

async function fetchRoadmap(name) {
  const res = await fetch(`/api/roadmap/${encodeURIComponent(name)}`);
  if (!res.ok) {
    const e = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(e.error || 'Erreur serveur');
  }
  return res.json();
}

// ===== MARKDOWN =====

function renderMarkdown(text) {
  if (!text) return '<p style="color:var(--text-faint);font-style:italic">Aucun contenu pour ce nœud.</p>';
  const div = document.createElement('div');
  div.innerHTML = marked.parse(text);
  div.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  return div.innerHTML;
}

// ===== HOME VIEW =====

async function showHome() {
  state.current = null;
  state.selectedPath = null;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="home-view">
      <div class="home-header">
        <div style="position:absolute;top:16px;right:20px">${themeToggleHTML()}</div>
        <div class="home-logo">🗺</div>
        <h1>Roadmap <span>Explorer</span></h1>
        <p>Visualise tes explorations technologiques</p>
      </div>
      <div class="roadmap-grid" id="roadmap-grid">
        <div class="state-msg">
          <span class="icon">⏳</span>
          <span>Chargement...</span>
        </div>
      </div>
    </div>
  `;

  const grid = document.getElementById('roadmap-grid');
  grid.addEventListener('click', e => {
    const card = e.target.closest('.roadmap-card');
    if (card) showMap(card.dataset.name);
  });

  try {
    const list = await fetchRoadmapList();
    if (!list.length) {
      grid.innerHTML = `
        <div class="state-msg">
          <span class="icon">📂</span>
          <span>Aucun fichier trouvé dans <code>roadmaps/</code></span>
          <span style="color:var(--text-faint);font-size:0.8rem">Crée un fichier <code>.yaml</code> pour commencer</span>
        </div>`;
      return;
    }
    grid.innerHTML = list.map((rm, i) => {
      const color = rm.color || '#4f46e5';
      const textColor = rm.color || '#4f46e5';
      const bgColor = rm.color ? rm.color + '18' : 'var(--accent-light)';
      return `
        <div class="roadmap-card" data-name="${escapeHtml(rm.name)}" style="--delay:${i * 70}ms">
          <div class="card-header">
            <div class="card-icon" style="background:${bgColor}; color:${textColor}">
              ${getTechIcon(rm.name)}
            </div>
            <h2>${escapeHtml(rm.title)}</h2>
            <span class="card-arrow">→</span>
          </div>
          ${rm.description ? `<p>${escapeHtml(rm.description)}</p>` : ''}
        </div>`;
    }).join('');
  } catch (e) {
    grid.innerHTML = `<div class="state-msg state-error"><span class="icon">⚠️</span><span>${escapeHtml(e.message)}</span></div>`;
  }
}

function getTechIcon(name) {
  const icons = {
    rust: '🦀', javascript: 'JS', typescript: 'TS', python: '🐍',
    go: '🐹', java: '☕', kotlin: '🎯', swift: '🐦',
    react: '⚛', vue: 'V', angular: 'Δ', node: '🟢',
    docker: '🐳', kubernetes: 'K8s', aws: '☁', git: '🌿',
    css: '🎨', html: 'H', sql: '🗄', linux: '🐧',
  };
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  return icons[key] || name.slice(0, 2).toUpperCase();
}

// ===== MAP VIEW =====

async function showMap(name) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="map-view">
      <nav class="topbar">
        <button class="back-btn" id="back-btn">← Retour</button>
        <div class="topbar-divider"></div>
        <span class="topbar-title" id="topbar-title">Chargement…</span>
        <div id="topbar-stats"></div>
        ${themeToggleHTML()}
      </nav>
      <div class="map-body">
        <div id="mindmap-container">
          <svg id="mindmap"></svg>
        </div>
        <div class="side-panel" id="side-panel">
          <div class="panel-header">
            <h3 class="panel-title" id="panel-title"></h3>
            <div class="panel-actions">
              <button class="explored-toggle" id="explored-btn"></button>
              <button class="close-btn" id="close-btn" title="Fermer">✕</button>
            </div>
          </div>
          <div class="panel-content" id="panel-content"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', showHome);
  document.getElementById('close-btn').addEventListener('click', closePanel);
  document.getElementById('explored-btn').addEventListener('click', toggleExplored);

  try {
    const data = await fetchRoadmap(name);
    state.current = { name, ...data };
    assignPaths(state.current.root);
    document.getElementById('topbar-title').textContent = data.title || name;
    renderMindmap();
    updateStats();
  } catch (e) {
    app.innerHTML = `
      <div style="height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--red)">
        <span style="font-size:2rem">⚠️</span>
        <span>${escapeHtml(e.message)}</span>
        <button onclick="showHome()" style="margin-top:8px;padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:white;cursor:pointer">← Retour</button>
      </div>`;
  }
}

// ===== MINDMAP =====

function renderMindmap() {
  if (!state.current?.root) return;

  const container = document.getElementById('mindmap-container');
  if (!container) return;

  const W = container.clientWidth;
  const H = container.clientHeight;

  const hierarchy = d3.hierarchy(
    state.current.root,
    d => d.children?.length ? d.children : null
  );

  const nodeCount = hierarchy.descendants().length;
  const scale = nodeCount > 50 ? 0.88 : nodeCount > 25 ? 0.80 : nodeCount > 12 ? 0.72 : 0.62;
  const radius = Math.min(W, H) / 2 * scale;

  d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)
    (hierarchy);

  const svgEl = document.getElementById('mindmap');
  d3.select(svgEl).selectAll('*').remove();

  const svg = d3.select(svgEl).attr('width', W).attr('height', H);

  // Filters
  const defs = svg.append('defs');

  // Halo around text labels (color matches canvas background)
  const haloBg = isDark() ? '#0d1b2a' : '#f8faff';
  const haloFilter = defs.append('filter').attr('id', 'halo').attr('x', '-20%').attr('y', '-40%').attr('width', '140%').attr('height', '180%');
  haloFilter.append('feMorphology').attr('operator', 'dilate').attr('radius', '2.5').attr('in', 'SourceAlpha').attr('result', 'expanded');
  haloFilter.append('feFlood').attr('flood-color', haloBg).attr('flood-opacity', '1').attr('result', 'color');
  haloFilter.append('feComposite').attr('in', 'color').attr('in2', 'expanded').attr('operator', 'in').attr('result', 'halo');
  const merge = haloFilter.append('feMerge');
  merge.append('feMergeNode').attr('in', 'halo');
  merge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Accent glow for root
  const glowFilter = defs.append('filter').attr('id', 'root-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  glowFilter.append('feDropShadow').attr('dx', '0').attr('dy', '0').attr('stdDeviation', '6').attr('flood-color', '#4f46e5').attr('flood-opacity', '0.35');

  // Drop shadow for nodes
  const nodeGlow = defs.append('filter').attr('id', 'node-glow').attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%');
  nodeGlow.append('feDropShadow').attr('dx', '0').attr('dy', '2').attr('stdDeviation', '3').attr('flood-color', '#22c55e').attr('flood-opacity', '0.3');

  const g = svg.append('g');

  // Zoom & pan
  const zoom = d3.zoom()
    .scaleExtent([0.15, 5])
    .on('zoom', e => g.attr('transform', e.transform));

  svg.call(zoom);
  svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2));

  svg.on('click', () => closePanel());

  // === Links ===
  g.append('g')
    .attr('class', 'links')
    .selectAll('path')
    .data(hierarchy.links())
    .join('path')
    .attr('class', 'link')
    .attr('d', linkPath)
    .style('opacity', 0)
    .transition().duration(600).delay((_, i) => i * 12)
    .style('opacity', 1);

  // === Nodes ===
  const R = {
    root: 13,
    branch: 8,
    leaf: 5,
  };

  const nodeR = d => d.depth === 0 ? R.root : (d.children ? R.branch : R.leaf);
  const dark = isDark();
  const nodeFill   = d => d.depth === 0 ? (dark ? '#6366f1' : '#4f46e5') : (getExplored(d.data) ? (dark ? '#22c55e' : '#16a34a') : (dark ? '#1e2d3d' : '#ffffff'));
  const nodeStroke = d => d.depth === 0 ? (dark ? '#818cf8' : '#4338ca') : (getExplored(d.data) ? (dark ? '#4ade80' : '#86efac') : (dark ? '#334155' : '#cbd5e1'));

  const nodes = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(hierarchy.descendants())
    .join('g')
    .attr('class', d => `node${d.data._path === state.selectedPath ? ' selected' : ''}`)
    .attr('transform', d => {
      const [x, y] = polar(d.x, d.y);
      return `translate(${x},${y})`;
    })
    .on('click', (event, d) => {
      event.stopPropagation();
      openPanel(d.data._path);
    })
    .on('mouseenter', function(_, d) {
      d3.select(this).select('circle')
        .transition().duration(180).ease(d3.easeCubicOut)
        .attr('r', nodeR(d) * 1.38);
    })
    .on('mouseleave', function(_, d) {
      d3.select(this).select('circle')
        .transition().duration(200).ease(d3.easeCubicOut)
        .attr('r', nodeR(d));
    });

  // Circle
  nodes.append('circle')
    .attr('r', 0)
    .attr('fill', nodeFill)
    .attr('stroke', nodeStroke)
    .attr('stroke-width', d => d.depth === 0 ? 2.5 : 2)
    .attr('filter', d => d.depth === 0 ? 'url(#root-glow)' : (getExplored(d.data) ? 'url(#node-glow)' : null))
    .transition().duration(500).ease(d3.easeBackOut.overshoot(1.4))
    .delay((_, i) => 80 + i * 18)
    .attr('r', nodeR);

  // Label text
  nodes.append('text')
    .attr('dy', d => d.depth === 0 ? '0.35em' : '0.31em')
    .attr('x', d => {
      if (d.depth === 0) return 0;
      return d.x < Math.PI ? nodeR(d) + 7 : -(nodeR(d) + 7);
    })
    .attr('y', d => d.depth === 0 ? 0 : 0)
    .attr('text-anchor', d => {
      if (d.depth === 0) return 'middle';
      return d.x < Math.PI ? 'start' : 'end';
    })
    .style('font-size', d => d.depth === 0 ? '12px' : (d.depth === 1 ? '12px' : '11px'))
    .style('font-weight', d => d.depth <= 1 ? '600' : '400')
    .style('fill', d => d.depth === 0 ? '#ffffff' : 'var(--text-2)')
    .attr('filter', d => d.depth === 0 ? null : 'url(#halo)')
    .style('opacity', 0)
    .text(d => d.data.label)
    .transition().duration(400).delay((_, i) => 150 + i * 18)
    .style('opacity', 1);
}

function updateNodeColors() {
  const dark = isDark();
  d3.selectAll('.node').each(function(d) {
    const isSelected = d.data._path === state.selectedPath;
    const isExplored = getExplored(d.data);
    const isRoot = d.depth === 0;

    d3.select(this).classed('selected', isSelected);

    d3.select(this).select('circle')
      .transition().duration(250).ease(d3.easeCubicOut)
      .attr('fill',   isRoot ? (dark ? '#6366f1' : '#4f46e5') : (isExplored ? (dark ? '#22c55e' : '#16a34a') : (dark ? '#1e2d3d' : '#ffffff')))
      .attr('stroke', isSelected ? (dark ? '#818cf8' : '#4f46e5') : (isRoot ? (dark ? '#818cf8' : '#4338ca') : (isExplored ? (dark ? '#4ade80' : '#86efac') : (dark ? '#334155' : '#cbd5e1'))))
      .attr('stroke-width', isSelected ? 3 : (isRoot ? 2.5 : 2))
      .attr('filter', isRoot ? 'url(#root-glow)' : (isExplored ? 'url(#node-glow)' : null));
  });
}

// ===== SIDE PANEL =====

function openPanel(nodePath) {
  if (!state.current) return;
  state.selectedPath = nodePath;

  const node = findNode(state.current.root, nodePath);
  if (!node) return;

  const panel = document.getElementById('side-panel');
  if (!panel) return;

  document.getElementById('panel-title').textContent = node.label;
  refreshExploredBtn(node);

  // Fade content
  const content = document.getElementById('panel-content');
  content.classList.add('fading');
  setTimeout(() => {
    content.innerHTML = renderMarkdown(node.summary);
    content.classList.remove('fading');
    content.scrollTop = 0;
  }, 180);

  panel.classList.add('open');
  updateNodeColors();
}

function closePanel() {
  state.selectedPath = null;
  const panel = document.getElementById('side-panel');
  if (panel) panel.classList.remove('open');
  updateNodeColors();
}

function toggleExplored() {
  if (!state.selectedPath || !state.current) return;
  const node = findNode(state.current.root, state.selectedPath);
  if (!node) return;
  setExplored(node, !getExplored(node));
  refreshExploredBtn(node);
  updateNodeColors();
  updateStats();
}

function refreshExploredBtn(node) {
  const btn = document.getElementById('explored-btn');
  if (!btn) return;
  const explored = getExplored(node);
  btn.innerHTML = explored ? '✓ Exploré' : '○ À explorer';
  btn.classList.toggle('active', explored);
}

function updateStats() {
  const el = document.getElementById('topbar-stats');
  if (!el || !state.current) return;
  const { total, explored } = countNodes(state.current.root);
  const pct = total ? Math.round(explored / total * 100) : 0;
  el.innerHTML = `
    <div class="stat-pill">
      <span class="stat-pill-dot"></span>
      ${explored}/${total} — ${pct}%
    </div>`;
}

// ===== LIVE RELOAD (SSE) =====

function setupSSE() {
  const connect = () => {
    const es = new EventSource('/api/events');
    es.onmessage = e => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'change' && state.current?.name === msg.name) {
          fetchRoadmap(msg.name).then(data => {
            const name = state.current.name;
            state.current = { name, ...data };
            assignPaths(state.current.root);
            const t = document.getElementById('topbar-title');
            if (t) t.textContent = data.title || name;
            renderMindmap();
            updateStats();
            if (state.selectedPath) {
              const node = findNode(state.current.root, state.selectedPath);
              node ? openPanel(state.selectedPath) : closePanel();
            }
          }).catch(() => {});
        }
      } catch {}
    };
    es.onerror = () => { es.close(); setTimeout(connect, 3000); };
  };
  connect();
}

// ===== INIT =====

initTheme();
setupSSE();
showHome();
