import { create } from 'zustand';

// Zustand store for UI state management
interface AppStore {
  // State
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: 'config' | 'runtime';
  
  // Actions
  setSelectedAppId: (appId: string | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setIsMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  
  // Actions
  setSelectedAppId: (appId) => set({ selectedAppId: appId }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setIsMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}));
