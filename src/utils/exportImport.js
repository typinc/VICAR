import yaml from 'js-yaml';

// ── JSON export ───────────────────────────────────────────────────────────────
export function exportJSON(nodes, edges) {
  const model = buildModel(nodes, edges);
  const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'threat-model.json');
}

// ── YAML export ───────────────────────────────────────────────────────────────
export function exportYAML(nodes, edges) {
  const model = buildModel(nodes, edges);
  // Only export user-defined fields (strip React Flow internal fields)
  const clean = {
    ...model,
    nodes: model.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
    edges: model.edges.map(({ id, source, target, type, data }) => ({ id, source, target, type, data })),
  };
  const blob = new Blob([yaml.dump(clean)], { type: 'text/yaml' });
  downloadBlob(blob, 'threat-model.yaml');
}

// ── CSV report export ─────────────────────────────────────────────────────────
export function exportCSV(nodes, edges) {
  const rows = [];

  // Build an edge-lookup map: nodeId → connected node IDs
  const connectionMap = {};
  edges.forEach(({ source, target }) => {
    if (!connectionMap[source]) connectionMap[source] = [];
    if (!connectionMap[target]) connectionMap[target] = [];
    connectionMap[source].push(target);
    connectionMap[target].push(source);
  });

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  // Header
  rows.push([
    'Type',
    'VICAR Letter',
    'Title',
    'Description',
    // Threat Actor
    'Actor Type',
    'Motivation',
    // Attack Vector
    'Technique',
    'ATT&CK / OWASP Ref',
    // Attack Surface
    'Asset Type',
    'Owner',
    // Control
    'Control Status',
    'Control Type',
    // Impact
    'Impact Type',
    'Severity',
    // Threat
    'Ranking',
    'Notes',
    // Graph
    'Connected To (titles)',
  ]);

  const TYPE_LABELS = {
    threatActor:   'Threat Actor',
    attackVector:  'Attack Vector',
    attackSurface: 'Attack Surface',
    control:       'Control',
    impact:        'Impact',
    threat:        'Threat',
  };

  const LETTER = {
    threatActor: 'A', attackVector: 'V', attackSurface: 'S',
    control: 'C', impact: 'I', threat: 'T',
  };

  nodes.forEach(({ id, type, data }) => {
    const connected = (connectionMap[id] || [])
      .map((cid) => nodeById[cid]?.data?.title || cid)
      .join('; ');

    rows.push([
      TYPE_LABELS[type] || type,
      LETTER[type] || '',
      data.title || '',
      data.description || '',
      data.actorType || '',
      data.motivation || '',
      data.technique || '',
      data.reference || '',
      data.assetType || '',
      data.owner || '',
      data.status || '',
      data.controlType || '',
      data.impactType || '',
      data.severity || '',
      data.ranking || '',
      data.notes || '',
      connected,
    ]);
  });

  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'threat-model-report.csv');
}

// ── Import ────────────────────────────────────────────────────────────────────
export function importModel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let model;
        if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          model = yaml.load(e.target.result);
        } else {
          model = JSON.parse(e.target.result);
        }
        if (!model.nodes || !model.edges) throw new Error('Invalid VICAR model file.');
        resolve({ nodes: model.nodes, edges: model.edges });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildModel(nodes, edges) {
  return { vicar: '1.0', exportedAt: new Date().toISOString(), nodes, edges };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
