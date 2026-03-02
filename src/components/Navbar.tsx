
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, BookOpen, Settings } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
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
  const location = useLocation();
  const { cart } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const adminRoutes = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'Admin Courses', icon: BookOpen },
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-sm border-b-2 border-foreground py-3'
        : 'bg-background/90 border-b-2 border-foreground py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 cubist-link">
            <span className="text-xl md:text-2xl font-bold text-accent-foreground bg-accent border-2 border-foreground px-3 py-1 tracking-[0.12em]">
              MICHAEL ZICK
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-5">
            <Link to="/courses" className="cubist-link text-foreground hover:text-primary transition-colors font-bold uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-foreground pb-1">
              Programs
            </Link>
            <Link to="/about" className="cubist-link text-foreground hover:text-primary transition-colors font-bold uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-foreground pb-1">
              About
            </Link>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground hover:text-primary font-bold">
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-2 border-foreground bg-card">
                  {adminRoutes.map(({ to, label, icon: Icon }) => (
                    <DropdownMenuItem asChild key={to}>
                      <Link to={to} className="flex items-center cursor-pointer uppercase tracking-[0.05em] font-semibold">
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Book a Free Session
              </Button>
            </a>

            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="text-foreground hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold h-6 min-w-6 px-1 flex items-center justify-center border-2 border-foreground">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="text-foreground hover:text-primary">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-2 border-foreground bg-card">
                  <div className="px-2 py-1.5 text-sm font-bold uppercase tracking-[0.06em]">
                    {profile?.firstName} {profile?.lastName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-programs" className="flex items-center cursor-pointer uppercase tracking-[0.05em] font-semibold">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Programs
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      {adminRoutes.map(({ to, label, icon: Icon }) => (
                        <DropdownMenuItem asChild key={to}>
                          <Link to={to} className="flex items-center cursor-pointer uppercase tracking-[0.05em] font-semibold">
                            <Icon className="mr-2 h-4 w-4" />
                            {label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer uppercase tracking-[0.05em] font-semibold">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary font-bold">
                  Sign In
                </Button>
              </Link>
            )}

            <ThemeToggle />
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold h-6 min-w-6 px-1 flex items-center justify-center border-2 border-foreground">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t-2 border-foreground py-4 px-4 absolute w-full fade-in">
          <nav className="flex flex-col space-y-3">
            <Link to="/courses" className="cubist-link text-foreground hover:text-primary font-bold uppercase tracking-[0.08em] py-2 border-2 border-foreground px-3">
              Programs
            </Link>
            <Link to="/about" className="cubist-link text-foreground hover:text-primary font-bold uppercase tracking-[0.08em] py-2 border-2 border-foreground px-3">
              About
            </Link>
            {user ? (
              <>
                <Link to="/my-programs" className="cubist-link text-foreground hover:text-primary font-bold uppercase tracking-[0.08em] py-2 border-2 border-foreground px-3">
                  My Programs
                </Link>
                {isAdmin && (
                  <>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground pt-2 font-bold">
                      Admin
                    </p>
                    {adminRoutes.map(({ to, label }) => (
                      <Link key={to} to={to} className="cubist-link text-foreground hover:text-primary font-bold uppercase tracking-[0.08em] py-2 border-2 border-foreground px-3">
                        {label}
                      </Link>
                    ))}
                  </>
                )}
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-primary font-bold"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" className="cubist-link text-foreground hover:text-primary font-bold uppercase tracking-[0.08em] py-2 border-2 border-foreground px-3">
                Sign In
              </Link>
            )}
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="pt-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Book a Free Session
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
