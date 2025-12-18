import { Search, Share2, Moon, Sun, User, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAppStore } from '../../store/useAppStore';

// Top navigation bar component
export function TopBar() {
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left section: Logo and search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
          A
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10"
            defaultValue="supertokens-golang"
          />
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobilePanelOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5" />
        </Button>
        
        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
      </div>
    </header>
  );
}
