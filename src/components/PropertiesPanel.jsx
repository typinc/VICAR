import { Trash2, X } from 'lucide-react';
import useStore from '../store/useStore';
import { NODE_TYPES_CONFIG, RANKING_CONFIG, CONTROL_STATUS_CONFIG, ZONE_STYLES } from '../nodes/nodeConfig';

export default function PropertiesPanel() {
  const selectedNode = useStore((s) => s.selectedNode);
  const selectedEdge = useStore((s) => s.selectedEdge);
  const updateNode   = useStore((s) => s.updateNode);
  const deleteNode   = useStore((s) => s.deleteNode);
  const updateEdge   = useStore((s) => s.updateEdge);
  const deleteEdge   = useStore((s) => s.deleteEdge);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const setSelectedEdge = useStore((s) => s.setSelectedEdge);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  // Always read live data from the store
  const liveNode = nodes.find((n) => n.id === selectedNode?.id);
  const liveEdge = edges.find((e) => e.id === selectedEdge?.id);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!liveNode && !liveEdge) {
    return (
      <aside className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col items-center justify-center p-6 shrink-0">
        <div className="text-gray-600 text-center">
          <div className="text-4xl mb-3">🖱️</div>
          <p className="text-sm text-gray-500">Click a node or edge to edit its properties</p>
        </div>
      </aside>
    );
  }

  // ── Edge panel ──────────────────────────────────────────────────────────────
  if (liveEdge) {
    const sourceNode = nodes.find((n) => n.id === liveEdge.source);
    const targetNode = nodes.find((n) => n.id === liveEdge.target);
    const sourceConfig = sourceNode ? NODE_TYPES_CONFIG[sourceNode.type] : null;
    const targetConfig = targetNode ? NODE_TYPES_CONFIG[targetNode.type] : null;

    const currentLabel = liveEdge.data?.label || '';

    return (
      <aside className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
          <span className="text-lg">🔗</span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Edge</span>
            <span className="text-xs font-semibold text-gray-200 truncate">Connection</span>
          </div>
          <button
            onClick={() => setSelectedEdge(null)}
            className="ml-auto text-white opacity-50 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 p-4 flex-1">
          {/* Source → Target */}
          <Field label="Connection">
            <div className="flex flex-col gap-1">
              <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${sourceConfig?.color || 'bg-gray-700'}`}>
                <span>{sourceConfig?.icon || '?'}</span>
                <span className={`font-semibold truncate ${sourceConfig?.text || 'text-white'}`}>
                  {sourceNode?.data?.title || sourceConfig?.label || 'Unknown'}
                </span>
              </div>
              <div className="text-center text-gray-500 text-[10px] py-0.5">↓</div>
              <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${targetConfig?.color || 'bg-gray-700'}`}>
                <span>{targetConfig?.icon || '?'}</span>
                <span className={`font-semibold truncate ${targetConfig?.text || 'text-white'}`}>
                  {targetNode?.data?.title || targetConfig?.label || 'Unknown'}
                </span>
              </div>
            </div>
          </Field>

          {/* Direction */}
          <Field label="Direction">
            <div className="grid grid-cols-2 gap-1">
              {[
                { value: 'forward',       icon: '→', label: 'Forward' },
                { value: 'backward',      icon: '←', label: 'Backward' },
                { value: 'bidirectional', icon: '↔', label: 'Both' },
                { value: 'none',          icon: '—', label: 'None' },
              ].map(({ value, icon, label }) => {
                const active = (liveEdge.data?.direction ?? 'forward') === value;
                return (
                  <button
                    key={value}
                    onClick={() => updateEdge(liveEdge.id, { direction: value })}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-indigo-700 border-indigo-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Label */}
          <Field label="Relationship Label">
            <input
              className="input"
              value={currentLabel}
              onChange={(e) => updateEdge(liveEdge.id, { label: e.target.value })}
              placeholder="e.g. uses, exploits..."
            />
          </Field>
        </div>

        {/* Delete */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => deleteEdge(liveEdge.id)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-900 hover:bg-red-700 text-red-200 text-sm font-semibold transition-colors"
          >
            <Trash2 size={14} />
            Delete Edge
          </button>
        </div>
      </aside>
    );
  }

  // ── Node panel ──────────────────────────────────────────────────────────────
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

        {type === 'trustBoundary' && (
          <Field label="Zone Type">
            <div className="flex flex-col gap-1.5">
              {Object.entries(ZONE_STYLES).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => handleChange('zoneType', key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    data.zoneType === key
                      ? 'border-gray-400 bg-gray-700 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: s.border }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </Field>
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
