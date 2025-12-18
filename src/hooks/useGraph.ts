import { useQuery } from '@tanstack/react-query';
import type { GraphData } from '../types';

interface GraphResponse {
  code: number;
  data: GraphData;
  error?: string;
}

// Fetch graph data for a specific app
const fetchGraph = async (appId: string): Promise<GraphData> => {
  const response = await fetch(`/api/apps/${appId}/graph`);
  const data: GraphResponse = await response.json();
  
  if (data.code !== 0) {
    throw new Error(data.error || 'Failed to fetch graph');
  }
  
  return data.data;
};

// TanStack Query hook for fetching graph data
export const useGraph = (appId: string | null) => {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: () => fetchGraph(appId!),
    enabled: !!appId, // Only fetch when appId is available
  });
};
