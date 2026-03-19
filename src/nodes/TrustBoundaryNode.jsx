import { NodeResizer } from '@xyflow/react';
import useStore from '../store/useStore';
import { ZONE_STYLES } from './nodeConfig';

const DEFAULT_ZONE = 'internal';
const MIN_WIDTH = 200;
const MIN_HEIGHT = 140;

export default function TrustBoundaryNode({ id, data, selected }) {
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const nodes = useStore((s) => s.nodes);

  const zone = data?.zoneType || DEFAULT_ZONE;
  const style = ZONE_STYLES[zone] || ZONE_STYLES[DEFAULT_ZONE];
  const label = data?.title || style.label;

  const handleClick = (e) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    setSelectedNode(node || null);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        background: style.bg,
        border: `2px dashed ${selected ? '#fff' : style.border}`,
        borderRadius: '12px',
        boxShadow: selected ? `0 0 0 2px ${style.border}` : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Resize handles */}
      <NodeResizer
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        isVisible={selected}
        lineStyle={{ border: `1.5px solid ${style.border}` }}
        handleStyle={{ background: style.border, border: 'none', width: 8, height: 8, borderRadius: 2 }}
      />

      {/* Zone label badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(17,24,39,0.75)',
          border: `1px solid ${style.border}`,
          borderRadius: 6,
          padding: '3px 8px',
          backdropFilter: 'blur(4px)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 13 }}>🔒</span>
        <span
          style={{
            color: style.text,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
