
import { Moon, Sun } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => theme !== 'light' && toggleTheme()}>
            <Sun className="h-4 w-4 mr-2 text-foreground" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => theme !== 'dark' && toggleTheme()}>
            <Moon className="h-4 w-4 mr-2 text-foreground" />
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ThemeToggleSimple() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1rem] w-[1rem] text-foreground" />
      <Switch 
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-[1rem] w-[1rem] text-foreground" />
    </div>
  );
}
