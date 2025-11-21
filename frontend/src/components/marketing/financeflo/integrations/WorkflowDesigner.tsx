import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Database, 
  Zap, 
  Filter, 
  ArrowRight, 
  Play, 
  Save,
  Plus,
  Settings
} from 'lucide-react';

// Custom Node Components
const TriggerNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-lg rounded-lg bg-blue-50 border-2 border-blue-200 min-w-[150px]">
    <div className="flex items-center gap-2">
      <Zap className="w-4 h-4 text-blue-600" />
      <div>
        <div className="text-sm font-semibold text-blue-900">{data.label}</div>
        <div className="text-xs text-blue-600">{data.type}</div>
      </div>
    </div>
  </div>
);

const TransformNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-lg rounded-lg bg-purple-50 border-2 border-purple-200 min-w-[150px]">
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-purple-600" />
      <div>
        <div className="text-sm font-semibold text-purple-900">{data.label}</div>
        <div className="text-xs text-purple-600">{data.operation}</div>
      </div>
    </div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-lg rounded-lg bg-green-50 border-2 border-green-200 min-w-[150px]">
    <div className="flex items-center gap-2">
      <Database className="w-4 h-4 text-green-600" />
      <div>
        <div className="text-sm font-semibold text-green-900">{data.label}</div>
        <div className="text-xs text-green-600">{data.system}</div>
      </div>
    </div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  transform: TransformNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { label: 'Salesforce Contact Created', type: 'Webhook' },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'transform',
    position: { x: 350, y: 100 },
    data: { label: 'Map Contact Fields', operation: 'Field Mapping' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    type: 'action',
    position: { x: 600, y: 100 },
    data: { label: 'Create Customer', system: 'QuickBooks' },
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#8b5cf6' },
  },
];

export const WorkflowDesigner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const runWorkflow = () => {
    setIsRunning(true);
    // Simulate workflow execution
    setTimeout(() => setIsRunning(false), 3000);
  };

  const saveWorkflow = () => {
    console.log('Saving workflow...', { nodes, edges });
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: `New ${type}`, 
        type: type === 'trigger' ? 'Event' : undefined,
        operation: type === 'transform' ? 'Transform' : undefined,
        system: type === 'action' ? 'System' : undefined
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visual Workflow Designer</h2>
          <p className="text-muted-foreground">Design your integration workflow with drag-and-drop simplicity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveWorkflow}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={runWorkflow} disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Test Run'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Node Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">TRIGGERS</h4>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('trigger')}
              >
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Webhook
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('trigger')}
              >
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Schedule
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">TRANSFORMS</h4>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('transform')}
              >
                <Filter className="w-4 h-4 mr-2 text-purple-600" />
                Map Fields
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('transform')}
              >
                <Filter className="w-4 h-4 mr-2 text-purple-600" />
                Filter Data
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">ACTIONS</h4>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('action')}
              >
                <Database className="w-4 h-4 mr-2 text-green-600" />
                Create Record
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('action')}
              >
                <Database className="w-4 h-4 mr-2 text-green-600" />
                Update Record
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="h-[600px] relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gray-50"
              >
                <Controls />
                <MiniMap />
                <Background color="#94a3b8" gap={16} />
              </ReactFlow>
              
              {isRunning && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Card className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <p className="font-semibold">Executing workflow...</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{nodes.filter(n => n.type === 'trigger').length}</p>
              <p className="text-sm text-muted-foreground">Triggers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{nodes.filter(n => n.type === 'transform').length}</p>
              <p className="text-sm text-muted-foreground">Transforms</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{nodes.filter(n => n.type === 'action').length}</p>
              <p className="text-sm text-muted-foreground">Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{edges.length}</p>
              <p className="text-sm text-muted-foreground">Connections</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};