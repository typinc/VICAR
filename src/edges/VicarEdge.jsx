import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

export default function VicarEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data,
  markerEnd,
  style,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const label = data?.label || '';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#818cf8' : '#6b7280',
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
