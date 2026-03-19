import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const MAX_HISTORY = 50;

const snapshot = (nodes, edges) => ({
  nodes: nodes.map((n) => ({ ...n, data: { ...n.data } })),
  edges: edges.map((e) => ({ ...e, data: { ...e.data } })),
});

const useStore = create((set, get) => {
  const saveHistory = () => {
    const { nodes, edges, history } = get();
    set({
      history: [...history.slice(-(MAX_HISTORY - 1)), snapshot(nodes, edges)],
      future: [],
    });
  };

  return {
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedEdge: null,
    history: [],
    future: [],

    // ── React Flow change handlers ────────────────────────────────────────────
    onNodesChange: (changes) =>
      set({ nodes: applyNodeChanges(changes, get().nodes) }),

    onEdgesChange: (changes) =>
      set({ edges: applyEdgeChanges(changes, get().edges) }),

    onConnect: (connection) => {
      saveHistory();
      set({
        edges: addEdge(
          { ...connection, type: 'vicarEdge', animated: false, data: { label: '' } },
          get().edges
        ),
      });
    },

    // ── Node actions ─────────────────────────────────────────────────────────
    addNode: (node) => {
      saveHistory();
      set({ nodes: [...get().nodes, node] });
    },

    updateNode: (id, data) =>
      set({
        nodes: get().nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        ),
      }),

    saveHistoryForDrag: () => saveHistory(),

    deleteNode: (id) => {
      saveHistory();
      set({
        nodes: get().nodes.filter((n) => n.id !== id),
        edges: get().edges.filter((e) => e.source !== id && e.target !== id),
        selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
      });
    },

    // ── Edge actions ─────────────────────────────────────────────────────────
    updateEdge: (id, data) =>
      set({
        edges: get().edges.map((e) =>
          e.id === id ? { ...e, data: { ...e.data, ...data } } : e
        ),
      }),

    deleteEdge: (id) => {
      saveHistory();
      set({
        edges: get().edges.filter((e) => e.id !== id),
        selectedEdge: get().selectedEdge?.id === id ? null : get().selectedEdge,
      });
    },

    // ── Selection ─────────────────────────────────────────────────────────────
    setSelectedNode: (node) => set({ selectedNode: node, selectedEdge: null }),
    setSelectedEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),

    // ── Undo / Redo ───────────────────────────────────────────────────────────
    undo: () => {
      const { history, future, nodes, edges } = get();
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      set({
        nodes: prev.nodes,
        edges: prev.edges,
        history: history.slice(0, -1),
        future: [snapshot(nodes, edges), ...future.slice(0, MAX_HISTORY - 1)],
        selectedNode: null,
        selectedEdge: null,
      });
    },

    redo: () => {
      const { history, future, nodes, edges } = get();
      if (future.length === 0) return;
      const next = future[0];
      set({
        nodes: next.nodes,
        edges: next.edges,
        history: [...history.slice(-(MAX_HISTORY - 1)), snapshot(nodes, edges)],
        future: future.slice(1),
        selectedNode: null,
        selectedEdge: null,
      });
    },

    // ── Canvas-level ──────────────────────────────────────────────────────────
    loadModel: (nodes, edges) => {
      saveHistory();
      set({ nodes, edges, selectedNode: null, selectedEdge: null });
    },

    clearCanvas: () => {
      saveHistory();
      set({ nodes: [], edges: [], selectedNode: null, selectedEdge: null });
    },
  };
});

export default useStore;
