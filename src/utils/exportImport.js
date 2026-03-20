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

  // Sanitize: strip line-breaks (breaks CSV rows in Excel/Sheets) and escape quotes
  const sanitizeCell = (cell) =>
    String(cell)
      .replace(/\r?\n|\r/g, ' ')  // line-breaks → space
      .replace(/"/g, '""');        // escape double-quotes

  const csv = rows
    .map((r) => r.map((cell) => `"${sanitizeCell(cell)}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'threat-model-report.csv');
}

// ── Import ────────────────────────────────────────────────────────────────────
const ALLOWED_NODE_TYPES = new Set([
  'threatActor', 'attackVector', 'attackSurface',
  'control', 'impact', 'threat', 'trustBoundary',
]);

export function importModel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file.'));

    reader.onload = (e) => {
      try {
        let model;
        if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          // JSON_SCHEMA prevents unsafe YAML types (!!js/function, !!js/regexp, etc.)
          model = yaml.load(e.target.result, { schema: yaml.JSON_SCHEMA });
        } else {
          model = JSON.parse(e.target.result);
        }

        // ── Structural validation ──────────────────────────────────────────
        if (!model || typeof model !== 'object') {
          throw new Error('Invalid model: expected a JSON/YAML object.');
        }
        if (!Array.isArray(model.nodes)) {
          throw new Error('Invalid model: "nodes" must be an array.');
        }
        if (!Array.isArray(model.edges)) {
          throw new Error('Invalid model: "edges" must be an array.');
        }

        // ── Node validation ────────────────────────────────────────────────
        const nodeIds = new Set();
        for (const node of model.nodes) {
          if (typeof node.id !== 'string' || !node.id) {
            throw new Error('A node is missing a valid "id".');
          }
          if (nodeIds.has(node.id)) {
            throw new Error(`Duplicate node id: "${node.id}".`);
          }
          nodeIds.add(node.id);

          if (!ALLOWED_NODE_TYPES.has(node.type)) {
            throw new Error(`Unknown node type: "${node.type}".`);
          }
          if (!node.data || typeof node.data !== 'object') {
            throw new Error(`Node "${node.id}" is missing a "data" object.`);
          }
        }

        // ── Edge validation ────────────────────────────────────────────────
        for (const edge of model.edges) {
          if (typeof edge.source !== 'string' || !nodeIds.has(edge.source)) {
            throw new Error(`Edge "${edge.id ?? '?'}" references an unknown source node.`);
          }
          if (typeof edge.target !== 'string' || !nodeIds.has(edge.target)) {
            throw new Error(`Edge "${edge.id ?? '?'}" references an unknown target node.`);
          }
        }

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
