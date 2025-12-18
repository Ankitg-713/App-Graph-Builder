import { Search, Plus, Lightbulb, Settings, Rocket, Box, Star, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useApps } from '../../hooks/useApps';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

// Icon mapping for app icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  lightbulb: Lightbulb,
  gear: Settings,
  rocket: Rocket,
  box: Box,
  star: Star,
};

// App selector panel - shows list of applications
export function AppSelector() {
  const { data: apps, isLoading } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-10 bg-muted animate-pulse rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Handle app selection
  const handleAppSelect = (appId: string) => {
    setSelectedAppId(appId);
    setIsMobilePanelOpen(false); // Close mobile drawer after selection
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with search and add button */}
      <div className="p-4 border-b border-border">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add App
        </Button>
      </div>

      {/* App list */}
      <div className="flex-1 overflow-y-auto p-2">
        {apps?.map((app) => {
          const Icon = iconMap[app.icon || 'box'] || Box;
          const isSelected = selectedAppId === app.id;
          
          return (
            <button
              key={app.id}
              onClick={() => handleAppSelect(app.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left',
                'hover:bg-accent',
                isSelected && 'bg-accent'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 truncate">{app.name}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
