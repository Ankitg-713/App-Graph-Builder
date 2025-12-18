import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { HardDrive, Cpu } from 'lucide-react';
import type { ServiceNodeData } from '../../types';

// Custom node component for ReactFlow with Service/Database styling
export function CustomNode({ data }: NodeProps<Node<ServiceNodeData>>) {
  const isDatabase = data.nodeType === 'database';

  return (
    <div
      className={`px-6 py-4 rounded-xl border-2 min-w-[150px] text-center ${
        isDatabase
          ? 'bg-blue-950 border-blue-500 text-blue-50'
          : 'bg-green-950 border-green-500 text-green-50'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-1">
        {isDatabase ? (
          <HardDrive className="h-5 w-5 text-blue-400" />
        ) : (
          <Cpu className="h-5 w-5 text-green-400" />
        )}
        <span className="font-bold text-base">{data.name}</span>
      </div>
      <div className={`text-sm font-medium ${isDatabase ? 'text-blue-400' : 'text-green-400'}`}>
        {isDatabase ? 'Database' : 'Service'}
      </div>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-2 !border-gray-500" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-2 !border-gray-500" />
    </div>
  );
}
