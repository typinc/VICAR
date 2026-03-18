import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/Header';
import NodePalette from './components/NodePalette';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import useStore from './store/useStore';

export default function App() {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      // Don't intercept shortcuts when typing in inputs/textareas
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.shiftKey && e.key === 'z'))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col w-full h-full bg-gray-950">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <NodePalette />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
