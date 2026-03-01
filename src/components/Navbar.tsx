
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';
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
      isScrolled ? 'bg-secondary shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-foreground tracking-tight">
              MICHAEL ZICK
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium">
              Programs
            </Link>
            <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium">
              About
            </Link>
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Book a Free Session
              </Button>
            </a>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-primary">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {profile?.firstName} {profile?.lastName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-programs" className="flex items-center cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Programs
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-secondary-foreground/80 hover:text-primary font-medium">
                  Sign In
                </Button>
              </Link>
            )}

            <ThemeToggle />
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Cart Icon */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-secondary-foreground">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-secondary-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-border shadow-lg py-4 px-4 absolute w-full fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/courses" className="text-secondary-foreground/80 hover:text-primary font-medium py-2">
              Programs
            </Link>
            <Link to="/about" className="text-secondary-foreground/80 hover:text-primary font-medium py-2">
              About
            </Link>
            {user ? (
              <>
                <Link to="/my-programs" className="text-secondary-foreground/80 hover:text-primary font-medium py-2">
                  My Programs
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-secondary-foreground/80 hover:text-primary font-medium py-2">
                    Admin Dashboard
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="justify-start text-secondary-foreground/80 hover:text-primary font-medium px-0"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" className="text-secondary-foreground/80 hover:text-primary font-medium py-2">
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
