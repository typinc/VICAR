import { BaseEdge, EdgeLabelRenderer, getStraightPath, getBezierPath } from '@xyflow/react';

const RELATIONSHIP_LABELS = {
  default: 'relates to',
};

export default function VicarEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data,
  markerEnd,
  style,
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
        style={{ stroke: '#6b7280', strokeWidth: 2, ...style }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-gray-800 text-gray-100 text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-600 shadow nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
