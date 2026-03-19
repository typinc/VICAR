import React from 'react';
import BaseNode from './BaseNode';
import TrustBoundaryNode from './TrustBoundaryNode';

// All 6 VICAR node types share the same BaseNode component
// React Flow uses the `type` prop to distinguish them
export const nodeTypes = {
  threatActor:   (props) => <BaseNode {...props} />,
  attackVector:  (props) => <BaseNode {...props} />,
  attackSurface: (props) => <BaseNode {...props} />,
  control:       (props) => <BaseNode {...props} />,
  impact:        (props) => <BaseNode {...props} />,
  threat:        (props) => <BaseNode {...props} />,
  trustBoundary: (props) => <TrustBoundaryNode {...props} />,
};
