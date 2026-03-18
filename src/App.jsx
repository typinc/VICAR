import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/Header';
import NodePalette from './components/NodePalette';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

export default function App() {
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
