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

  const renderSidebar = (className = '', isDesktop = false) => (
    <div className={`flex flex-col bg-card ${isDesktop ? 'h-screen overflow-hidden' : 'h-full'} ${className}`.trim()}>
      <div className="shrink-0 border-b border-border p-4 sm:p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">NICE GUY UNIVERSITY</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">Admin Dashboard</p>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary active:bg-primary/10'
                    : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-border p-3 sm:p-4">
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
    <div className="min-h-screen bg-muted site-nav:flex">
      <aside className="hidden w-64 shrink-0 self-start border-r border-border site-nav:sticky site-nav:top-0 site-nav:flex site-nav:h-screen">
        {renderSidebar('w-full', true)}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="mobile-shell sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 py-3 backdrop-blur site-nav:hidden">
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

        <main className="mobile-shell min-w-0 flex-1 overflow-auto py-4 sm:py-6 site-nav:py-8">
          <div className="mx-auto max-w-7xl content-stack">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
