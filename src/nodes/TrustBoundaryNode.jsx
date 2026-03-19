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
  const zoneStyle = ZONE_STYLES[zone] || ZONE_STYLES[DEFAULT_ZONE];
  const label = data?.title || zoneStyle.label;

  // No stopPropagation — React Flow needs the click to set `selected: true`
  // which activates the NodeResizer handles
  const handleClick = () => {
    const node = nodes.find((n) => n.id === id);
    setSelectedNode(node || null);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        background: zoneStyle.bg,
        border: `2px dashed ${selected ? '#ffffff99' : zoneStyle.border}`,
        borderRadius: '12px',
        boxShadow: selected ? `0 0 0 2px ${zoneStyle.border}` : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'grab',
        position: 'relative',
      }}
    >
      {/* Resize handles — visible only when selected */}
      <NodeResizer
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        isVisible={selected}
        lineStyle={{ border: `1.5px solid ${zoneStyle.border}` }}
        handleStyle={{
          background: zoneStyle.border,
          border: 'none',
          width: 10,
          height: 10,
          borderRadius: 3,
        }}
      />

      {/* Zone label badge */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(17,24,39,0.8)',
          border: `1px solid ${zoneStyle.border}`,
          borderRadius: 6,
          padding: '4px 10px',
          backdropFilter: 'blur(4px)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 13 }}>🔒</span>
        <span
          style={{
            color: zoneStyle.text,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>

      {/* Subtle resize hint when not selected */}
      {!selected && (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            right: 10,
            color: zoneStyle.text,
            fontSize: 9,
            opacity: 0.35,
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '0.05em',
          }}
        >
          click to resize
        </div>
      )}
    </div>
  );
}
