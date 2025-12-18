import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { TopBar } from './components/layout/TopBar';
import { LeftRail } from './components/layout/LeftRail';
import { RightPanel } from './components/layout/RightPanel';
import { FlowCanvas } from './components/canvas/FlowCanvas';
import { useApps } from './hooks/useApps';
import { useAppStore } from './store/useAppStore';

// TanStack Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false, // Disable auto-retry to show error UI immediately
    },
  },
});

// Main app content with layout
function AppContent() {
  const { data: apps } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  // Auto-select first app on load
  useEffect(() => {
    if (apps && apps.length > 0 && !selectedAppId) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId, setSelectedAppId]);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Top navigation bar */}
        <TopBar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left icon rail */}
          <LeftRail />
          
          {/* Center canvas */}
          <div className="flex-1 relative">
            <FlowCanvas />
          </div>
          
          {/* Right panel (app selector / node inspector) */}
          <RightPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

// Root app component with providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
