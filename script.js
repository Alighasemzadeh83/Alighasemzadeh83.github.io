/* =========================================================
   Ali Ghasemzadeh — homepage interactions
   ========================================================= */

/* ---------- footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- theme toggle ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(mode) {
  root.setAttribute('data-theme', mode);
  themeBtn.textContent = mode === 'dark' ? '☀︎ Light mode' : '🌙 Dark mode';
  try { localStorage.setItem('theme', mode); } catch (e) {}
  if (window.__net) styleNetwork(mode);
}
(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(saved || 'dark');
})();
themeBtn.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- scrollspy for sidebar nav ---------- */
const navLinks = Array.from(document.querySelectorAll('.sidenav a'));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
sections.forEach(s => spy.observe(s));

/* =========================================================
   COLLABORATION NETWORK
   ========================================================= */
(function buildNetwork() {
  const container = document.getElementById('net-graph');
  if (!container) return;
  if (typeof vis === 'undefined') {
    container.innerHTML = '<div class="net-fallback">The collaboration network could not be loaded (offline). Everything else on this page works normally.</div>';
    return;
  }

  /* --- institution color groups (distinct, theme-friendly palette) --- */
  const GROUPS = {
    me:        { label: 'Ali Ghasemzadeh', color: '#f4c430' },
    sharif:    { label: 'Sharif Univ. of Technology', color: '#14b8a6' },
    toronto:   { label: 'University of Toronto', color: '#3b82f6' },
    hongkong:  { label: 'Hong Kong (HKU / CUHK)', color: '#a855f7' },
    australia: { label: 'Australia (Torrens / UTS)', color: '#fb923c' },
    europe:    { label: 'Europe', color: '#22c55e' },
    namerica:  { label: 'North America', color: '#f43f5e' },
    other:     { label: 'Other collaborators', color: '#94a3b8' }
  };

  /* --- people (id, name, group, affiliation, optional role/url) --- */
  const PEOPLE = [
    ['ali','Ali Ghasemzadeh','me','Sharif University of Technology',null,'https://github.com/Alighasemzadeh83'],
    ['kazerouni','Amirhossein Kazerouni','toronto','University of Toronto',null,'https://scholar.google.com/citations?user=aKDCc3MAAAAJ'],
    ['brudno','Michael Brudno','toronto','University of Toronto',null,'https://scholar.google.com/citations?user=xoNrEqUAAAAJ'],
    ['taati','Babak Taati','toronto','University of Toronto',null,'https://scholar.google.com/citations?user=7-X6qUUAAAAJ'],
    ['mohajerin','Peyman Mohajerin Esfahani','toronto','University of Toronto','Advisor · SDP structure','https://scholar.google.com/citations?user=ZTan-7YAAAAJ'],
    ['azad','Reza Azad','europe','RWTH Aachen University',null,'https://scholar.google.com/citations?user=Qb5ildMAAAAJ'],
    ['samek','Wojciech Samek','europe','Fraunhofer HHI / TU Berlin',null,'https://scholar.google.com/citations?user=7aQwO08AAAAJ'],
    ['merhof','Dorit Merhof','europe','University of Regensburg',null,'https://scholar.google.com/citations?user=0c0rMr0AAAAJ'],
    ['diba','Ali Diba','europe','KU Leuven',null,'https://scholar.google.com/citations?user=T9Kr7gEAAAAJ'],
    ['torr','Philip Torr','europe','University of Oxford',null,'https://scholar.google.com/citations?user=kPxa2w0AAAAJ'],
    ['barletta','Luca Barletta','europe','Politecnico di Milano','Advisor · Excess estimation error','https://scholar.google.com/citations?user=vu_mjR0AAAAJ'],
    ['kuo','Yong-Hong Kuo','hongkong','The University of Hong Kong','Internship supervisor','https://scholar.google.com/citations?user=9-ikdFAAAAAJ'],
    ['farnia','Farzan Farnia','hongkong','Chinese University of Hong Kong',null,'https://scholar.google.com/citations?user=GYPCqcYAAAAJ'],
    ['mirjalili','Seyedali Mirjalili','australia','Torrens University Australia','Advisor · Adaptive metaheuristics','https://scholar.google.com/citations?user=TJHmrREAAAAJ'],
    ['gandomi','Amir H. Gandomi','australia','University of Technology Sydney','Advisor','https://scholar.google.com/citations?user=VMf3wfMAAAAJ'],
    ['bijarchi','MohamadAli Bijarchi','sharif','Sharif University of Technology',null,'https://scholar.google.com/citations?user=0YjtrYIAAAAJ'],
    ['shafii','Mohammad Behshad Shafii','sharif','Sharif University of Technology',null,'https://scholar.google.com/citations?user=8wcCN4gAAAAJ'],
    ['khalaj','Babak Khalaj','sharif','Sharif University of Technology',null,'https://scholar.google.com/citations?user=8HsoXAUAAAAJ'],
    ['bagci','Ulas Bagci','namerica','Northwestern University',null,'https://scholar.google.com/citations?user=9LUdPM4AAAAJ'],
    ['kolouri','Soheil Kolouri','namerica','Vanderbilt University',null,'https://scholar.google.com/citations?user=yREBSy0AAAAJ'],
    ['fallah','Alireza Fallah','namerica','Rice University','Advisor · Market mechanism design','https://scholar.google.com/citations?user=2qkqvm4AAAAJ'],
    ['dytso','Alex Dytso','namerica','Qualcomm / Princeton University','Advisor · Estimation theory','https://scholar.google.com/citations?user=oVxK8g0AAAAJ'],
    ['esfandiari','Hossein Esfandiari','namerica','Google Research','Advisor · Batched bandits','https://scholar.google.com/citations?user=Rt8ppJsAAAAJ'],
    ['samira','Samira Hossein Ghorban','other','IPM','Advisor · Batched bandits','https://scholar.google.com/citations?user=XAta_TgAAAAJ'],
    ['armin','Armin Khosravi','other','Collaborator',null,null],
    ['babakhani','Erfan Babakhani','other','Collaborator',null,null],
    ['pariya','Pariya Ghasemzadeh','other','Collaborator',null,null],
    ['sanaz','Sanaz Karimi Jafarbigloo','other','Collaborator',null,'https://scholar.google.com/citations?user=yRCzzX0AAAAJ'],
    ['aghayari','Ali Aghayari','other','Collaborator',null,'https://scholar.google.com/citations?user=JSR6GGoAAAAJ'],
    ['akbaripour','Mohamadreza Akbari Pour','other','Collaborator',null,null],
    ['mirzadi','Mohamad Mirzadi','other','Collaborator',null,null],
    ['donya','Donya Jafari','other','Collaborator',null,null],
    ['sadeghian','Ali Sadeghian','other','Collaborator',null,null],
    ['tavakoli','Seyedreza Tavakoli','other','Collaborator',null,null],
    ['naghdi','Amir Naghdi','other','Collaborator',null,null],
    ['mokhtari','Aria Mokhtari','other','Collaborator',null,null],
    ['ghiyasi','Mahdi Ghiyasi','other','Collaborator',null,null]
  ];

  /* --- papers (id, short label, venue, author ids) --- */
  const PAPERS = [
    ['p_prilora','PriLoRA','Accepted · MICCAI 2026', ['kazerouni','sanaz','aghayari','ali','azad','samek','merhof','brudno','taati']],
    ['p_rul','Reinforced Graph PINN','Accepted · Adv. Eng. Informatics', ['akbaripour','ali','bijarchi','shafii']],
    ['p_reward','Reward Engineering Review','Minor revision · ACME', ['ali','armin','mirzadi','akbaripour','mirjalili']],
    ['p_spectral','Spectral Palette','Under review · AAAI', ['kazerouni','ali','armin','donya','babakhani','diba','kuo','brudno','taati']],
    ['p_gnbg','GNBG-C','Under review · EJOR', ['ali','armin','babakhani','pariya','kuo','mirjalili','gandomi']],
    ['p_domain','Joint Domain Evolution','Under review · AAAI', ['sadeghian','ali','tavakoli','naghdi','mokhtari','ghiyasi','khalaj','farnia','kolouri','diba']],
    ['p_diffusion','Diffusion for CO','Under review · ISWA', ['armin','ali','babakhani','kazerouni','kuo','torr','mirjalili']],
    ['p_manyminds','Multi-Rater Survey','Preprint', ['babakhani','armin','ali','pariya','sanaz','azad','bagci','merhof']],
    ['p_refseg','Reference-Based Seg. Survey','Preprint', ['babakhani','ali','armin','pariya','kazerouni','kuo','mirjalili']]
  ];

  /* --- ongoing projects (id, label, member ids) --- */
  const PROJECTS = [
    ['x_bandit','Adaptive Metaheuristics', ['ali','mirjalili','gandomi']],
    ['x_excess','Excess Estimation Error', ['ali','dytso','barletta']],
    ['x_invcdf','Inverse-CDF Differentiation', ['ali','dytso']],
    ['x_sdp','SDP Structure', ['ali','mohajerin']],
    ['x_batched','Batched Adversarial Bandit', ['ali','esfandiari','samira']],
    ['x_market','Market Mechanism Design', ['ali','fallah']]
  ];

  /* --- co-authorship: connect people who share a paper or project --- */
  const worklists = PAPERS.map(p => p[3]).concat(PROJECTS.map(p => p[2]));
  const edgeWeight = {};          // "a|b" -> number of shared works
  const collaborators = {};       // id -> Set of co-workers
  const linkUp = (a, b) => {
    (collaborators[a] = collaborators[a] || new Set()).add(b);
    (collaborators[b] = collaborators[b] || new Set()).add(a);
  };
  worklists.forEach(members => {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const a = members[i], b = members[j];
        const key = a < b ? a + '|' + b : b + '|' + a;
        edgeWeight[key] = (edgeWeight[key] || 0) + 1;
        linkUp(a, b);
      }
    }
  });
  const edges = Object.keys(edgeWeight).map(key => {
    const [a, b] = key.split('|');
    const w = edgeWeight[key];
    return { from: a, to: b, value: w, title: w + ' shared work' + (w > 1 ? 's' : '') };
  });

  /* --- person nodes only; size = number of collaborators --- */
  const nodes = [];
  PEOPLE.forEach(([id, name, group, aff, role, url]) => {
    const isMe = group === 'me';
    const deg = collaborators[id] ? collaborators[id].size : 1;
    const tip = `<b>${name}</b><br>${aff}` +
                (role ? `<br><i>${role}</i>` : '') +
                `<br>${deg} collaborator${deg === 1 ? '' : 's'}` +
                (url ? '<br>↗ Google Scholar' : '');
    nodes.push({
      id, label: name, group,
      value: isMe ? 46 : deg,
      shape: 'dot',
      color: { background: GROUPS[group].color, border: isMe ? '#ffffff' : GROUPS[group].color },
      borderWidth: role ? 3 : 2,     // advisors get a slightly thicker ring
      title: tip,
      url: url || null,
      font: { size: isMe ? 20 : 13 }
    });
  });

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    autoResize: true,
    nodes: {
      borderWidth: 2,
      scaling: { min: 11, max: 48, label: { enabled: true, min: 12, max: 22 } },
      shadow: { enabled: true, size: 6, x: 0, y: 2, color: 'rgba(0,0,0,0.25)' }
    },
    edges: {
      scaling: { min: 0.5, max: 3.6 },
      smooth: { type: 'continuous', roundness: 0.35 },
      color: { color: 'rgba(255,255,255,0.12)', highlight: '#4f8cff', hover: '#4f8cff' }
    },
    interaction: { hover: true, tooltipDelay: 90, navigationButtons: false, keyboard: false, hideEdgesOnDrag: true },
    physics: {
      solver: 'barnesHut',
      barnesHut: { gravitationalConstant: -20000, centralGravity: 0.16, springLength: 175, springConstant: 0.025, damping: 0.55, avoidOverlap: 0.85 },
      stabilization: { iterations: 700, updateInterval: 40 }
    }
  };

  container.innerHTML = '';
  const net = new vis.Network(container, data, options);
  window.__net = net;
  window.__netData = data;

  /* open scholar link on node click (people only) */
  net.on('click', (params) => {
    if (!params.nodes.length) return;
    const n = data.nodes.get(params.nodes[0]);
    if (n && n.url) window.open(n.url, '_blank', 'noopener');
  });
  net.on('hoverNode', () => { container.style.cursor = 'pointer'; });
  net.on('blurNode', () => { container.style.cursor = 'default'; });

  /* fit all nodes, then zoom out slightly so labels aren't clipped */
  function fitWithMargin() {
    net.fit({ animation: false });
    net.moveTo({ scale: net.getScale() * 0.8 });
  }
  /* freeze physics after initial layout and fit everything in view */
  net.once('stabilizationIterationsDone', () => {
    net.setOptions({ physics: false });
    fitWithMargin();
  });
  net.on('resize', fitWithMargin);

  /* --- legend --- */
  const legend = document.getElementById('net-legend');
  if (legend) {
    let html = '';
    Object.values(GROUPS).forEach(g => {
      html += `<span class="lg"><span class="swatch" style="background:${g.color}"></span>${g.label}</span>`;
    });
    html += `<span class="lg"><span class="swatch ring"></span>Advisor (thicker ring)</span>`;
    legend.innerHTML = html;
  }

  styleNetwork(root.getAttribute('data-theme'));
})();

/* re-color network fonts/edges for the active theme */
function styleNetwork(mode) {
  const net = window.__net;
  if (!net) return;
  const fontColor = mode === 'dark' ? '#dbe4ee' : '#1f2a37';
  const strokeColor = mode === 'dark' ? '#0d1117' : '#ffffff';
  const edgeColor = mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(30,45,70,0.18)';
  net.setOptions({
    nodes: { font: { color: fontColor, strokeWidth: 3, strokeColor: strokeColor } },
    edges: { color: { color: edgeColor, highlight: '#4f8cff', hover: '#4f8cff' } }
  });
}
