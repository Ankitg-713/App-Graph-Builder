import { useState, useEffect, useRef } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { CheckCircle2, AlertTriangle, XCircle, HardDrive, Cpu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ServiceNodeData, NodeStatus } from '../../types';

// Status configuration for badges
const statusConfig: Record<NodeStatus, {
  label: string;
  variant: 'success' | 'warning' | 'destructive';
  icon: React.ComponentType<{ className?: string }>;
}> = {
  healthy: { label: 'Healthy', variant: 'success', icon: CheckCircle2 },
  degraded: { label: 'Degraded', variant: 'warning', icon: AlertTriangle },
  down: { label: 'Down', variant: 'destructive', icon: XCircle },
};

// Node inspector panel - shows when a node is selected
export function NodeInspector() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const activeTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveTab = useAppStore((state) => state.setActiveInspectorTab);
  const { getNode, setNodes } = useReactFlow<Node<ServiceNodeData>>();

  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  const nodeData = node?.data as ServiceNodeData | undefined;

  // Track previous node to detect selection changes
  const prevNodeIdRef = useRef<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [inputValue, setInputValue] = useState('50');
  const [showWarning, setShowWarning] = useState(false);

  // Sync form state when a different node is selected
  // This is a legitimate pattern for syncing local state with external data
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (selectedNodeId && selectedNodeId !== prevNodeIdRef.current && nodeData) {
      setName(nodeData.name ?? '');
      setDescription(nodeData.description ?? '');
      setSliderValue(nodeData.sliderValue ?? 50);
      setInputValue(String(nodeData.sliderValue ?? 50));
      prevNodeIdRef.current = selectedNodeId;
    } else if (!selectedNodeId) {
      prevNodeIdRef.current = null;
    }
  }, [selectedNodeId, nodeData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Show placeholder if no node selected
  if (!node || !nodeData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a node to inspect
      </div>
    );
  }

  const status = nodeData.status || 'healthy';
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  // Update node data in ReactFlow
  const updateNodeData = (updates: Partial<ServiceNodeData>) => {
    if (!selectedNodeId) return;
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...(n.data as ServiceNodeData), ...updates } }
          : n
      )
    );
  };

  // Form handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    updateNodeData({ name: value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    updateNodeData({ description: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    setSliderValue(value);
    setInputValue(String(value));
    updateNodeData({ sliderValue: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setShowWarning(false);

    // Allow empty for deletion
    if (rawValue === '') {
      setInputValue('');
      return;
    }

    const value = Number.parseInt(rawValue, 10);

    // Validate input
    if (Number.isNaN(value) || value < 0) return;

    if (value > 100) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    // Update all values
    setInputValue(rawValue);
    setSliderValue(value);
    updateNodeData({ sliderValue: value });
  };

  const handleInputBlur = () => {
    if (inputValue === '') {
      setInputValue(String(sliderValue));
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'config' || value === 'runtime') {
      setActiveTab(value);
    }
  };

  const isDatabase = nodeData.nodeType === 'database';
  const NodeTypeIcon = isDatabase ? HardDrive : Cpu;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header with node type and status badge */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NodeTypeIcon className={`h-5 w-5 ${isDatabase ? 'text-blue-400' : 'text-green-400'}`} />
            <h3 className="font-semibold text-lg">
              {isDatabase ? 'Database' : 'Service'} Node
            </h3>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="runtime">Runtime</TabsTrigger>
          </TabsList>

          {/* Config Tab - Name and Description */}
          <TabsContent value="config" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Node Name</label>
              <Input
                value={name}
                onChange={handleNameChange}
                placeholder="Enter node name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
                placeholder="Enter description..."
              />
            </div>
          </TabsContent>

          {/* Runtime Tab - Synced Slider and Input */}
          <TabsContent value="runtime" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Value: {sliderValue}
              </label>
              <div className="space-y-3">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={sliderValue}
                  onChange={handleSliderChange}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                {showWarning && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Value more than 100 not allowed
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Slider and input are synced. Changes persist to node data.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
