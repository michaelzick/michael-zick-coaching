import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingCart, Settings, ChevronLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground tracking-tight">MICHAEL ZICK</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Site
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
