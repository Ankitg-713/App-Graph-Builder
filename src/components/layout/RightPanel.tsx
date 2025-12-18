import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { AppSelector } from './AppSelector';
import { NodeInspector } from './NodeInspector';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

// Right panel with app selector and node inspector
// Becomes a slide-over drawer on mobile
export function RightPanel() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);

  // Show NodeInspector when a node is selected, otherwise show AppSelector
  const PanelContent = selectedNodeId ? NodeInspector : AppSelector;

  return (
    <>
      {/* Desktop Panel - always visible on large screens */}
      <aside className="hidden lg:flex w-80 border-l border-border bg-card flex-col">
        <PanelContent />
      </aside>

      {/* Mobile Drawer - slides in from right */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border',
          'transform transition-transform duration-300 ease-in-out',
          isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Drawer header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">
              {selectedNodeId ? 'Node Inspector' : 'Applications'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobilePanelOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Drawer content */}
          <div className="flex-1 overflow-hidden">
            <PanelContent />
          </div>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {isMobilePanelOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobilePanelOpen(false)}
        />
      )}
    </>
  );
}
