import yaml from 'js-yaml';

export function exportJSON(nodes, edges) {
  const model = { vicar: '1.0', exportedAt: new Date().toISOString(), nodes, edges };
  const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'threat-model.json');
}

export function exportYAML(nodes, edges) {
  const model = { vicar: '1.0', exportedAt: new Date().toISOString(), nodes, edges };
  const blob = new Blob([yaml.dump(model)], { type: 'text/yaml' });
  downloadBlob(blob, 'threat-model.yaml');
}

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

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
