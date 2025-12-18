import { Github, Database, Box, Network } from 'lucide-react';
import { Button } from '../ui/button';

// Left sidebar with icon navigation
export function LeftRail() {
  const navItems = [
    { icon: Github, label: 'GitHub' },
    { icon: Database, label: 'Database' },
    { icon: Box, label: 'Services' },
    { icon: Box, label: 'Containers' },
    { icon: Box, label: 'Storage' },
    { icon: Box, label: 'Cache' },
    { icon: Network, label: 'Network' },
  ];

  return (
    <aside className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4">
      {navItems.map((item, index) => (
        <Button key={index} variant="ghost" size="icon" className="w-12 h-12">
          <item.icon className="h-6 w-6" />
        </Button>
      ))}
    </aside>
  );
}
