import type { Node, Edge } from '@xyflow/react';

// Application type
export interface App {
  id: string;
  name: string;
  icon?: string;
}

// Graph data returned from API
export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// Node status options
export type NodeStatus = 'healthy' | 'degraded' | 'down';

// Node type options (bonus feature)
export type NodeType = 'service' | 'database';

// Service node data structure
export interface ServiceNodeData {
  id: string;
  name: string;
  status: NodeStatus;
  nodeType: NodeType;
  description?: string;
  sliderValue: number;
  [key: string]: unknown;
}
