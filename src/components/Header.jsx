import { useRef } from 'react';
import { Download, Upload, Trash2, FileJson, FileText } from 'lucide-react';
import useStore from '../store/useStore';
import { exportJSON, exportYAML, importModel } from '../utils/exportImport';

export default function Header() {
  const { nodes, edges, loadModel, clearCanvas } = useStore();
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { nodes: n, edges: ed } = await importModel(file);
      loadModel(n, ed);
    } catch (err) {
      alert('Failed to import model: ' + err.message);
    }
    e.target.value = '';
  };

  return (
    <header className="h-12 bg-gray-950 border-b border-gray-700 flex items-center px-4 gap-4 shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-xl">☠️</span>
        <div className="flex flex-col leading-none">
          <span className="text-white font-black text-sm tracking-tight">VICAR</span>
          <span className="text-gray-500 text-[9px] uppercase tracking-widest">Threat Modeler</span>
        </div>
      </div>

      <div className="h-6 w-px bg-gray-700" />

      {/* Node count */}
      <div className="text-xs text-gray-500">
        <span className="text-gray-300 font-semibold">{nodes.length}</span> nodes ·{' '}
        <span className="text-gray-300 font-semibold">{edges.length}</span> edges
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => exportJSON(nodes, edges)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold border border-gray-700 transition-colors"
        >
          <FileJson size={13} />
          Export JSON
        </button>
        <button
          onClick={() => exportYAML(nodes, edges)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold border border-gray-700 transition-colors"
        >
          <FileText size={13} />
          Export YAML
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs font-semibold border border-blue-600 transition-colors"
        >
          <Upload size={13} />
          Import
        </button>
        <input ref={fileRef} type="file" accept=".json,.yaml,.yml" className="hidden" onChange={handleImport} />

        <div className="h-5 w-px bg-gray-700 mx-1" />

        <button
          onClick={() => {
            if (confirm('Clear the canvas? This cannot be undone.')) clearCanvas();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-red-200 text-xs font-semibold border border-red-700 transition-colors"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>
    </header>
  );
}
