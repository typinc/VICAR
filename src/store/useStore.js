import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, type: 'vicarEdge', animated: false }, get().edges) }),

  addNode: (node) =>
    set({ nodes: [...get().nodes, node] }),

  updateNode: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }),

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
    }),

  setSelectedNode: (node) => set({ selectedNode: node }),

  loadModel: (nodes, edges) => set({ nodes, edges, selectedNode: null }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNode: null }),
}));

export default useStore;
