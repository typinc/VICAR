import { NODE_TYPES_CONFIG } from '../nodes/nodeConfig';

export default function NodePalette() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-52 bg-gray-900 border-r border-gray-700 flex flex-col p-3 gap-2 overflow-y-auto shrink-0">
      <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 px-1">
        VICAR Nodes
      </div>
      <p className="text-gray-500 text-[10px] px-1 mb-2">
        Drag a node onto the canvas to get started.
      </p>

      {Object.entries(NODE_TYPES_CONFIG).map(([type, config]) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing
            transition-transform hover:scale-105 hover:shadow-lg
            ${config.color} ${config.border}
          `}
        >
          <span className="text-xl">{config.icon}</span>
          <div className="min-w-0">
            <div className={`text-xs font-bold ${config.text}`}>{config.label}</div>
            <div className={`text-[10px] opacity-60 ${config.text} truncate`}>{config.description}</div>
          </div>
          <span className={`ml-auto text-xs font-black opacity-40 ${config.text}`}>
            {config.letter}
          </span>
        </div>
      ))}

      {/* VICAR Legend */}
      <div className="mt-4 border-t border-gray-700 pt-3">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          VICAR
        </div>
        {[
          { l: 'V', t: 'Vector' },
          { l: 'I', t: 'Impact' },
          { l: 'C', t: 'Control' },
          { l: 'A', t: 'Actor' },
          { l: 'R', t: 'Ranking' },
        ].map(({ l, t }) => (
          <div key={l} className="flex items-center gap-2 px-1 py-0.5">
            <span className="text-xs font-black text-gray-300 w-4">{l}</span>
            <span className="text-xs text-gray-500">{t}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
