import { http, HttpResponse } from 'msw';
import type { App, GraphData, ServiceNodeData } from '../types';
import type { Node, Edge } from '@xyflow/react';

// Error simulation: Set to true to enable random failures for testing error states
const SIMULATE_RANDOM_ERRORS = false; // Disabled for normal development
const ERROR_PROBABILITY = 0.1; // 10% chance of failure when enabled

// Mock data: List of applications
const apps: App[] = [
  { id: '1', name: 'supertokens-golang', icon: 'lightbulb' },
  { id: '2', name: 'supertokens-java', icon: 'gear' },
  { id: '3', name: 'supertokens-python', icon: 'rocket' },
  { id: '4', name: 'supertokens-ruby', icon: 'box' },
  { id: '5', name: 'supertokens-go', icon: 'star' },
];

// Generate graph data for a given app
const generateGraphData = (appId: string): GraphData => {
  const nodes: Node<ServiceNodeData>[] = [
    {
      id: `${appId}-node-1`,
      type: 'default',
      position: { x: 250, y: 100 },
      draggable: true,
      data: {
        id: `${appId}-node-1`,
        name: 'API Gateway',
        nodeType: 'service',
        status: 'healthy',
        description: 'Main API gateway service',
        sliderValue: 50,
      },
    },
    {
      id: `${appId}-node-2`,
      type: 'default',
      position: { x: 100, y: 300 },
      draggable: true,
      data: {
        id: `${appId}-node-2`,
        name: 'PostgreSQL',
        nodeType: 'database',
        status: 'degraded',
        description: 'Primary PostgreSQL database',
        sliderValue: 30,
      },
    },
    {
      id: `${appId}-node-3`,
      type: 'default',
      position: { x: 400, y: 300 },
      draggable: true,
      data: {
        id: `${appId}-node-3`,
        name: 'Redis',
        nodeType: 'database',
        status: 'down',
        description: 'Redis cache layer',
        sliderValue: 75,
      },
    },
  ];

  const edges: Edge[] = [
    { id: `${appId}-edge-1`, source: `${appId}-node-1`, target: `${appId}-node-2` },
    { id: `${appId}-edge-2`, source: `${appId}-node-1`, target: `${appId}-node-3` },
  ];

  return { nodes, edges };
};

// MSW handlers for mock API endpoints
export const handlers = [
  // GET /api/apps - Returns list of applications
  http.get('/api/apps', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate latency
    return HttpResponse.json({ code: 0, data: apps });
  }),

  // GET /api/apps/:appId/graph - Returns graph data for an app
  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate latency
    const { appId } = params;

    if (typeof appId !== 'string') {
      return HttpResponse.json({ code: 1, error: 'Invalid app ID' }, { status: 400 });
    }

    // Random error simulation
    if (SIMULATE_RANDOM_ERRORS && Math.random() < ERROR_PROBABILITY) {
      return HttpResponse.json(
        { code: 1, error: 'Simulated server error' },
        { status: 500 }
      );
    }

    const graphData = generateGraphData(appId);
    return HttpResponse.json({ code: 0, data: graphData });
  }),
];
