import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, HardDrive, Cpu } from 'lucide-react';
import { useGraph } from '../../hooks/useGraph';
import { useAppStore } from '../../store/useAppStore';
import type { ServiceNodeData, NodeType } from '../../types';
import { CustomNode } from './CustomNode';

// Register custom node types
const nodeTypes = {
  default: CustomNode,
};

// ReactFlow canvas component
export function FlowCanvas() {
  // Zustand state
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);

  // Fetch graph data (with refetch for retry)
  const { data: graphData, isLoading, error, refetch } = useGraph(selectedAppId);

  // ReactFlow hooks
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ServiceNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Add new node function (bonus feature)
  const addNode = useCallback(
    (nodeType: NodeType) => {
      const newId = `${selectedAppId}-node-${Date.now()}`;
      const newNode: Node<ServiceNodeData> = {
        id: newId,
        type: 'default',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
        draggable: true,
        data: {
          id: newId,
          name: nodeType === 'database' ? 'New Database' : 'New Service',
          nodeType,
          status: 'healthy',
          description: '',
          sliderValue: 50,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newId);
      setIsMobilePanelOpen(true);
    },
    [selectedAppId, setNodes, setSelectedNodeId, setIsMobilePanelOpen]
  );

  // Load graph data when it changes
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes as Node<ServiceNodeData>[]);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Handle new edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Handle node click - select node and open mobile panel
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<ServiceNodeData>) => {
      setSelectedNodeId(node.id);
      setIsMobilePanelOpen(true);
    },
    [setSelectedNodeId, setIsMobilePanelOpen]
  );

  // Handle pane click - deselect node
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Keyboard shortcuts: Delete, Fit view (f), Toggle panel (p)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in a form field
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isInputField) return;

      // Delete selected node (Delete/Backspace)
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
        event.preventDefault();
        setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
        setEdges((eds) =>
          eds.filter(
            (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
          )
        );
        setSelectedNodeId(null);
      }

      // Fit view (f key)
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        fitView({ padding: 0.2 });
      }

      // Toggle panel (p key)
      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        setIsMobilePanelOpen(!isMobilePanelOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId, fitView, isMobilePanelOpen, setIsMobilePanelOpen]);

  // Sync selection state with nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      }))
    );
  }, [selectedNodeId, setNodes]);

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="text-muted-foreground">Loading graph...</div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="text-destructive">Error loading graph</div>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // No app selected
  if (!selectedAppId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">Select an app to view its graph</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Add Node Buttons (bonus feature) */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => addNode('service')}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors shadow-lg font-medium"
          title="Add Service Node"
        >
          <Plus className="h-4 w-4" />
          <Cpu className="h-4 w-4" />
          <span className="text-sm">Service</span>
        </button>
        <button
          onClick={() => addNode('database')}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg font-medium"
          title="Add Database Node"
        >
          <Plus className="h-4 w-4" />
          <HardDrive className="h-4 w-4" />
          <span className="text-sm">Database</span>
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded hidden md:block">
        <kbd className="px-1 bg-muted rounded">F</kbd> Fit view &nbsp;
        <kbd className="px-1 bg-muted rounded">P</kbd> Toggle panel &nbsp;
        <kbd className="px-1 bg-muted rounded">Del</kbd> Delete node
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-background dark"
        // Touch and interaction settings
        panOnDrag={[0, 1, 2]} // Enable pan on all mouse buttons and touch
        panOnScroll={false}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        selectNodesOnDrag={false}
        nodeDragThreshold={1}
        preventScrolling={true}
      >
        <Background gap={20} size={1} color="#374151" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
