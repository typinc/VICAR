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

// Use crypto.randomUUID() — no module-level counter that resets on HMR.
const getId = () => crypto.randomUUID();

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
    pushSnapshot,
  } = useStore();

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  // Stores a deep clone of state just before a drag begins.
  // Pushed to history only if the node actually moved (drag-stop comparison).
  const preDragRef = useRef(null);

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

  // Capture a snapshot of the entire graph before the drag begins.
  // We use useStore.getState() (not the hook) to read current values
  // from inside a callback without stale-closure issues.
  const onNodeDragStart = useCallback(() => {
    const { nodes: n, edges: e } = useStore.getState();
    preDragRef.current = structuredClone({ nodes: n, edges: e });
  }, []);

  // After drag ends, push the pre-drag snapshot to history only if the
  // node's position actually changed. This avoids polluting history with
  // no-op drags (click-without-move).
  const onNodeDragStop = useCallback(
    (_evt, node) => {
      const pre = preDragRef.current;
      preDragRef.current = null;
      if (!pre) return;

      const preNode = pre.nodes.find((n) => n.id === node.id);
      const moved =
        preNode &&
        (Math.round(preNode.position.x) !== Math.round(node.position.x) ||
          Math.round(preNode.position.y) !== Math.round(node.position.y));

      if (moved) pushSnapshot(pre);
    },
    [pushSnapshot]
  );

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
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'vicarEdge',
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
