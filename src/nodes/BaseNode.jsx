import { Handle, Position } from '@xyflow/react';
import { NODE_TYPES_CONFIG, RANKING_CONFIG, CONTROL_STATUS_CONFIG } from './nodeConfig';
import useStore from '../store/useStore';

export default function BaseNode({ id, data, type, selected }) {
  const config = NODE_TYPES_CONFIG[type];
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const nodes = useStore((s) => s.nodes);

  const handleClick = () => {
    const node = nodes.find((n) => n.id === id);
    setSelectedNode(node || null);
  };

  const rankingCfg = data.ranking ? RANKING_CONFIG[data.ranking] : null;
  const controlStatusCfg = data.status ? CONTROL_STATUS_CONFIG[data.status] : null;

  return (
    <div
      onClick={handleClick}
      className={`
        relative min-w-[160px] max-w-[220px] rounded-xl border-2 shadow-lg cursor-pointer
        transition-all duration-150
        ${config.border}
        ${selected ? 'ring-2 ring-white ring-offset-1 scale-105' : 'hover:scale-102'}
        ${config.color}
      `}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-white !border-gray-400 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-white !border-gray-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-white !border-gray-400 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-white !border-gray-400 !w-3 !h-3" />

      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl ${config.badge}`}>
        <span className="text-lg leading-none">{config.icon}</span>
        <div className="flex flex-col min-w-0">
          <span className={`text-[10px] font-bold uppercase tracking-widest opacity-70 ${config.text}`}>
            {config.label}
          </span>
        </div>
        {/* VICAR letter badge */}
        <span className={`ml-auto text-xs font-black opacity-50 ${config.text}`}>
          {config.letter}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <p className={`text-sm font-semibold truncate ${config.text}`}>
          {data.title || config.label}
        </p>
        {data.description && (
          <p className={`text-xs mt-1 opacity-70 line-clamp-2 ${config.text}`}>
            {data.description}
          </p>
        )}

        {/* Control status badge */}
        {type === 'control' && controlStatusCfg && (
          <span className={`text-xs font-semibold mt-1 block ${controlStatusCfg.color}`}>
            {controlStatusCfg.label}
          </span>
        )}

        {/* Threat ranking badge */}
        {type === 'threat' && rankingCfg && (
          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${rankingCfg.color} ${rankingCfg.text}`}>
            {rankingCfg.label}
          </span>
        )}
      </div>
    </div>
  );
}
