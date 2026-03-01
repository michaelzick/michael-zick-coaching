
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle, ThemeToggleSimple } from '@/components/ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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
            <ThemeToggle />
          </nav>
          
          <div className="flex items-center space-x-4 md:hidden">
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
