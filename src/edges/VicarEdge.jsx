import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

// direction values:
//   'forward'       → arrow at target end only  (default)
//   'backward'      → arrow at source end only
//   'bidirectional' → arrows at both ends
//   'none'          → no arrows (undirected)

export default function VicarEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data,
  style,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const direction   = data?.direction ?? 'forward';
  const label       = data?.label || '';
  const strokeColor = selected ? '#818cf8' : '#6b7280';

  // Unique marker IDs per edge so colour updates on selection don't bleed across edges
  const endId   = `vicar-arrow-end-${id}`;
  const startId = `vicar-arrow-start-${id}`;

  const showEnd   = direction === 'forward'  || direction === 'bidirectional';
  const showStart = direction === 'backward' || direction === 'bidirectional';

  return (
    <>
      {/* Per-edge arrowhead markers — colour follows selection state */}
      <defs>
        <marker
          id={endId}
          markerWidth="10" markerHeight="7"
          refX="9" refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
        <marker
          id={startId}
          markerWidth="10" markerHeight="7"
          refX="1" refY="3.5"
          orient="auto-start-reverse"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={showEnd   ? `url(#${endId})`   : undefined}
        markerStart={showStart ? `url(#${startId})` : undefined}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 2.5 : 2,
          ...style,
        }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shadow nodrag nopan ${
              selected
                ? 'bg-indigo-900 text-indigo-100 border-indigo-500'
                : 'bg-gray-800 text-gray-100 border-gray-600'
            }`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
