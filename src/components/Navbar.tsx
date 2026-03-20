
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, BookOpen, Settings, Users } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const adminRoutes = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'Admin Courses', icon: BookOpen },
    { to: '/admin/coaches', label: 'Admin Coaches', icon: Users },
    { to: '/admin/orders', label: 'Admin Orders', icon: ShoppingCart },
    { to: '/admin/settings', label: 'Admin Settings', icon: Settings },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    await signOut();
    setMobileMenuOpen(false);
    navigate('/', { replace: true });
    setIsSigningOut(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-nav border-b border-border ${
      isScrolled ? 'py-3' : 'py-4'
    }`}>
      <div className="container mx-auto mobile-shell content-stack">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 cubist-link">
            <span className="cta-elevated-on-hover inline-block max-w-[calc(100vw-9rem)] truncate rounded-lg text-sm font-bold tracking-[0.03em] text-background bg-foreground px-3 py-1 sm:text-base site-nav:max-w-none site-nav:text-2xl">
              NICE GUY UNIVERSITY
            </span>
          </Link>

          <nav className="hidden items-center space-x-4 lg:space-x-5 site-nav:flex">
            <Link to="/courses" className="cubist-link text-foreground hover:text-foreground/70 transition-colors font-bold uppercase tracking-[0.03em] border-b-2 border-transparent hover:border-foreground pb-1">
              Courses
            </Link>
            <Link to="/coaches" className="cubist-link text-foreground hover:text-foreground/70 transition-colors font-bold uppercase tracking-[0.03em] border-b-2 border-transparent hover:border-foreground pb-1">
              Coaches
            </Link>
            <Link to="/how-it-works" className="cubist-link text-foreground hover:text-foreground/70 transition-colors font-bold uppercase tracking-[0.03em] border-b-2 border-transparent hover:border-foreground pb-1">
              How It Works
            </Link>
            <Link to="/resources" className="cubist-link text-foreground hover:text-foreground/70 transition-colors font-bold uppercase tracking-[0.03em] border-b-2 border-transparent hover:border-foreground pb-1">
              Resources
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="text-foreground hover:text-foreground/70" aria-label="View cart">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-accent text-accent-foreground text-xs font-bold h-6 min-w-6 px-1 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="text-foreground hover:text-foreground/70" aria-label="Open account menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card">
                  <div className="px-2 py-1.5 text-sm font-bold uppercase tracking-[0.04em]">
                    {profile?.firstName} {profile?.lastName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-courses" className="flex items-center cursor-pointer uppercase tracking-[0.03em] font-semibold">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      {adminRoutes.map(({ to, label, icon: Icon }) => (
                        <DropdownMenuItem asChild key={to}>
                          <Link to={to} className="flex items-center cursor-pointer uppercase tracking-[0.03em] font-semibold">
                            <Icon className="mr-2 h-4 w-4" />
                            {label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleSignOut();
                    }}
                    className="cursor-pointer uppercase tracking-[0.03em] font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="h-11 text-foreground hover:text-foreground/70 font-bold">
                  Sign In
                </Button>
              </Link>
            )}

          </nav>

          <div className="flex items-center space-x-2 site-nav:hidden">
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="text-foreground" aria-label="View cart">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-accent text-accent-foreground text-xs font-bold h-6 min-w-6 px-1 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="text-foreground"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full max-h-[calc(100dvh-5rem)] w-full overflow-y-auto overscroll-contain border-t border-border bg-secondary py-4 mobile-shell fade-in site-nav:hidden">
          <nav className="flex flex-col space-y-3">
            <Link to="/courses" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
              Courses
            </Link>
            <Link to="/my-courses" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
              My Courses
            </Link>
            <Link to="/coaches" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
              Coaches
            </Link>
            <Link to="/how-it-works" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
              How It Works
            </Link>
            <Link to="/resources" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
              Resources
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <p className="pt-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-secondary-foreground/80">
                      Admin
                    </p>
                    {adminRoutes.map(({ to, label }) => (
                      <Link key={to} to={to} className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
                        {label}
                      </Link>
                    ))}
                  </>
                )}
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-foreground/70 font-bold"
                  onClick={() => void handleSignOut()}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <Link to="/login" className="cubist-link text-foreground hover:text-foreground/70 font-bold uppercase tracking-[0.03em] py-2 px-3">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
