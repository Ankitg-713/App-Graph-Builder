import { useQuery } from '@tanstack/react-query';
import type { App } from '../types';

interface AppsResponse {
  code: number;
  data: App[];
  error?: string;
}

// Fetch all applications from API
const fetchApps = async (): Promise<App[]> => {
  const response = await fetch('/api/apps');
  const data: AppsResponse = await response.json();
  
  if (data.code !== 0) {
    throw new Error(data.error || 'Failed to fetch apps');
  }
  
  return data.data;
};

// TanStack Query hook for fetching apps
export const useApps = () => {
  return useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
  });
};
