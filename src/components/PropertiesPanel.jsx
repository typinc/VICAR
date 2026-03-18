import { Trash2, X } from 'lucide-react';
import useStore from '../store/useStore';
import { NODE_TYPES_CONFIG, RANKING_CONFIG, CONTROL_STATUS_CONFIG } from '../nodes/nodeConfig';

export default function PropertiesPanel() {
  const selectedNode = useStore((s) => s.selectedNode);
  const updateNode = useStore((s) => s.updateNode);
  const deleteNode = useStore((s) => s.deleteNode);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  // Keep panel in sync with live node data
  const nodes = useStore((s) => s.nodes);
  const liveNode = nodes.find((n) => n.id === selectedNode?.id);

  if (!liveNode) {
    return (
      <aside className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col items-center justify-center p-6 shrink-0">
        <div className="text-gray-600 text-center">
          <div className="text-4xl mb-3">🖱️</div>
          <p className="text-sm text-gray-500">Click a node to edit its properties</p>
        </div>
      </aside>
    );
  }

  const { type, data } = liveNode;
  const config = NODE_TYPES_CONFIG[type];

  const handleChange = (field, value) => {
    updateNode(liveNode.id, { [field]: value });
  };

  return (
    <aside className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className={`flex items-center gap-2 px-4 py-3 ${config.color} ${config.badge}`}>
        <span className="text-xl">{config.icon}</span>
        <div className="flex flex-col min-w-0">
          <span className={`text-[10px] font-bold uppercase tracking-widest opacity-70 ${config.text}`}>
            {config.label}
          </span>
          <span className={`text-xs font-semibold truncate ${config.text}`}>
            {data.title || config.label}
          </span>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="ml-auto text-white opacity-50 hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* Title */}
        <Field label="Title">
          <input
            className="input"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={`${config.label} name...`}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            className="input resize-none h-20"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe this element..."
          />
        </Field>

        {/* Type-specific fields */}
        {type === 'threatActor' && (
          <>
            <Field label="Actor Type">
              <select className="input" value={data.actorType || ''} onChange={(e) => handleChange('actorType', e.target.value)}>
                <option value="">Select...</option>
                <option value="external">External Adversary</option>
                <option value="insider">Insider Threat</option>
                <option value="nation-state">Nation-State</option>
                <option value="hacktivist">Hacktivist</option>
                <option value="script-kiddie">Script Kiddie</option>
                <option value="competitor">Competitor</option>
                <option value="custom">Custom</option>
              </select>
            </Field>
            <Field label="Motivation">
              <input className="input" value={data.motivation || ''} onChange={(e) => handleChange('motivation', e.target.value)} placeholder="e.g. Financial gain..." />
            </Field>
          </>
        )}

        {type === 'attackVector' && (
          <>
            <Field label="Technique">
              <input className="input" value={data.technique || ''} onChange={(e) => handleChange('technique', e.target.value)} placeholder="e.g. Phishing, SQLi..." />
            </Field>
            <Field label="Reference (ATT&CK / OWASP)">
              <input className="input" value={data.reference || ''} onChange={(e) => handleChange('reference', e.target.value)} placeholder="e.g. T1566, A03:2021" />
            </Field>
          </>
        )}

        {type === 'attackSurface' && (
          <>
            <Field label="Asset Type">
              <select className="input" value={data.assetType || ''} onChange={(e) => handleChange('assetType', e.target.value)}>
                <option value="">Select...</option>
                <option value="api">API / Endpoint</option>
                <option value="database">Database</option>
                <option value="service">Microservice</option>
                <option value="user">User / Identity</option>
                <option value="network">Network / Segment</option>
                <option value="file">File / Storage</option>
                <option value="custom">Custom</option>
              </select>
            </Field>
            <Field label="Owner / Team">
              <input className="input" value={data.owner || ''} onChange={(e) => handleChange('owner', e.target.value)} placeholder="e.g. Platform Team" />
            </Field>
          </>
        )}

        {type === 'control' && (
          <>
            <Field label="Control Status">
              <div className="flex gap-2">
                {Object.entries(CONTROL_STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handleChange('status', key)}
                    className={`flex-1 text-xs py-1.5 rounded border transition-all ${
                      data.status === key
                        ? 'bg-gray-600 border-gray-400 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Control Type">
              <select className="input" value={data.controlType || ''} onChange={(e) => handleChange('controlType', e.target.value)}>
                <option value="">Select...</option>
                <option value="preventive">Preventive</option>
                <option value="detective">Detective</option>
                <option value="corrective">Corrective</option>
                <option value="deterrent">Deterrent</option>
                <option value="compensating">Compensating</option>
              </select>
            </Field>
          </>
        )}

        {type === 'impact' && (
          <>
            <Field label="Impact Type">
              <select className="input" value={data.impactType || ''} onChange={(e) => handleChange('impactType', e.target.value)}>
                <option value="">Select...</option>
                <option value="confidentiality">Confidentiality</option>
                <option value="integrity">Integrity</option>
                <option value="availability">Availability</option>
                <option value="financial">Financial</option>
                <option value="reputational">Reputational</option>
                <option value="legal">Legal / Compliance</option>
                <option value="operational">Operational</option>
              </select>
            </Field>
            <Field label="Severity">
              <select className="input" value={data.severity || ''} onChange={(e) => handleChange('severity', e.target.value)}>
                <option value="">Select...</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>
          </>
        )}

        {type === 'threat' && (
          <>
            <Field label="Ranking (R)">
              <div className="flex gap-2">
                {Object.entries(RANKING_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handleChange('ranking', key)}
                    className={`flex-1 text-xs py-1.5 rounded font-bold transition-all border ${
                      data.ranking === key
                        ? `${cfg.color} ${cfg.text} border-transparent`
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Notes">
              <textarea
                className="input resize-none h-24"
                value={data.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Remediation notes, ticket refs..."
              />
            </Field>
          </>
        )}
      </div>

      {/* Delete */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => deleteNode(liveNode.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-900 hover:bg-red-700 text-red-200 text-sm font-semibold transition-colors"
        >
          <Trash2 size={14} />
          Delete Node
        </button>
      </div>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
