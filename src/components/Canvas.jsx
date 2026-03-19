import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from '../store/useStore';
import { nodeTypes } from '../nodes';
import VicarEdge from '../edges/VicarEdge';
import { NODE_TYPES_CONFIG } from '../nodes/nodeConfig';

const edgeTypes = { vicarEdge: VicarEdge };

let nodeIdCounter = 1;
const getId = () => `vicar_${Date.now()}_${nodeIdCounter++}`;

const MINIMAP_COLORS = {
  threatActor: '#dc2626',
  attackVector: '#f97316',
  attackSurface: '#eab308',
  control: '#2563eb',
  impact: '#9333ea',
  threat: '#374151',
};

export default function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    setSelectedEdge,
    saveHistoryForDrag,
  } = useStore();

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !NODE_TYPES_CONFIG[type]) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const config = NODE_TYPES_CONFIG[type];

      const isBoundary = type === 'trustBoundary';
      const newNode = {
        id: getId(),
        type,
        position,
        data: { ...config.defaultData },
        // zIndex: 0 keeps trust boundaries below VICAR nodes (zIndex: 1) at all times,
        // so VICAR nodes remain clickable when visually overlapping a zone.
        zIndex: isBoundary ? 0 : 1,
        ...(isBoundary && { style: { width: 360, height: 240 } }),
      };

      addNode(newNode);
      setSelectedNode(newNode);
    },
    [screenToFlowPosition, addNode, setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  const onEdgeClick = useCallback(
    (_, edge) => {
      setSelectedEdge(edge);
    },
    [setSelectedEdge]
  );

  // Save history snapshot before a drag so undo restores pre-drag positions
  const onNodeDragStart = useCallback(() => {
    saveHistoryForDrag();
  }, [saveHistoryForDrag]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
        onNodeDragStart={onNodeDragStart}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'vicarEdge',
          markerEnd: { type: 'arrowclosed', color: '#6b7280' },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        className="bg-gray-950"
      >
        <Background color="#374151" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !text-gray-300" />
        <MiniMap
          nodeColor={(node) => MINIMAP_COLORS[node.type] || '#6b7280'}
          maskColor="rgba(17, 24, 39, 0.8)"
          className="!bg-gray-900 !border-gray-700"
        />
      </ReactFlow>
    </div>
  );
}
