import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import { TEMPLATES } from '../data/templates';
import { NODE_TYPES_CONFIG } from '../nodes/nodeConfig';
import ConfirmModal from './ConfirmModal';

// Count non-trustBoundary nodes by type for display chips
function getNodeTypeCounts(nodes) {
  const counts = {};
  nodes.forEach(({ type }) => {
    if (type === 'trustBoundary') return;
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
}

/**
 * Remap every node/edge ID to a fresh UUID before loading.
 * Prevents duplicate-ID collisions when the same template is loaded twice
 * or when the canvas already contains nodes with matching IDs.
 */
function hydrateTemplate(template) {
  const idMap = {};

  const nodes = template.nodes.map((node) => {
    const newId = crypto.randomUUID();
    idMap[node.id] = newId;
    return { ...node, id: newId };
  });

  const edges = template.edges.map((edge) => ({
    ...edge,
    id: crypto.randomUUID(),
    source: idMap[edge.source] ?? edge.source,
    target: idMap[edge.target] ?? edge.target,
  }));

  return { nodes, edges };
}

export default function TemplatesModal({ isOpen, onClose }) {
  const loadModel       = useStore((s) => s.loadModel);
  const nodes           = useStore((s) => s.nodes);
  const [pendingTemplate, setPendingTemplate] = useState(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const doLoad = (template) => {
    const { nodes: hydratedNodes, edges: hydratedEdges } = hydrateTemplate(template);
    loadModel(hydratedNodes, hydratedEdges);
    onClose();
  };

  const handleLoadRequest = (template) => {
    // If canvas is non-empty, ask for confirmation first
    if (nodes.length > 0) {
      setPendingTemplate(template);
    } else {
      doLoad(template);
    }
  };

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal panel */}
        <div className="relative w-full max-w-3xl mx-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800 shrink-0">
            <div>
              <h2 className="text-white font-bold text-base">📋 Templates</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Pre-built VICAR diagrams — load one to explore or use as a starting point
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 overflow-y-auto">
            {TEMPLATES.map((tpl) => {
              const counts    = getNodeTypeCounts(tpl.nodes);
              const zoneCount = tpl.nodes.filter((n) => n.type === 'trustBoundary').length;

              return (
                <div
                  key={tpl.id}
                  className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 transition-colors"
                >
                  {/* Card body */}
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">{tpl.name}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{tpl.description}</p>
                    </div>

                    {/* Node-type chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(counts).map(([type, count]) => {
                        const cfg = NODE_TYPES_CONFIG[type];
                        if (!cfg) return null;
                        return (
                          <span
                            key={type}
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.text}`}
                          >
                            {cfg.icon}{count > 1 ? ` ${count}×` : ''} {cfg.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Zone info */}
                    {zoneCount > 0 && (
                      <p className="text-gray-500 text-[10px]">
                        🔒 {zoneCount} trust zone{zoneCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Load button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleLoadRequest(tpl)}
                      className="w-full py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
                    >
                      Load Template →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-6 py-3 border-t border-gray-800 shrink-0 text-center text-gray-600 text-[10px]">
            Loading a template replaces the current canvas. Export your work first if you need to keep it.
          </div>
        </div>
      </div>

      {/* Confirm overwrite dialog */}
      <ConfirmModal
        isOpen={!!pendingTemplate}
        title="Replace current canvas?"
        message={`Loading "${pendingTemplate?.name}" will replace all current nodes and edges.`}
        confirmLabel="Load Template"
        onConfirm={() => { doLoad(pendingTemplate); setPendingTemplate(null); }}
        onCancel={() => setPendingTemplate(null)}
      />
    </>
  );
}
