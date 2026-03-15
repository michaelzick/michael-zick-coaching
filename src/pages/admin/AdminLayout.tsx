import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingCart, Settings, ChevronLeft, Users, Menu } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/coaches', icon: Users, label: 'Coaches' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentNavItem = navItems.find((item) => (
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  ));

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const renderSidebar = (className = '') => (
    <div className={`flex h-full flex-col bg-card ${className}`.trim()}>
      <div className="border-b border-border p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">NICE GUY UNIVERSITY</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted lg:flex">
      <aside className="hidden w-64 border-r border-border lg:flex lg:min-h-screen">
        {renderSidebar('w-full')}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Admin</p>
            <h1 className="text-lg font-bold text-foreground">{currentNavItem?.label ?? 'Dashboard'}</h1>
          </div>
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <Button
              variant="outline"
              size="icon"
              aria-label={mobileNavOpen ? 'Close admin navigation' : 'Open admin navigation'}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent side="left" className="w-[18rem] border-r border-border bg-card p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Navigation</SheetTitle>
              </SheetHeader>
              {renderSidebar('w-full')}
            </SheetContent>
          </Sheet>
        </div>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
