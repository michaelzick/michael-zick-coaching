
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { ThemeToggle, ThemeToggleSimple } from '@/components/ThemeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const totalItems = cart.reduce((acc, item) => acc + 1, 0);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white dark:bg-gray-900 shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-learnify-600 dark:text-learnify-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-learnify-600 to-learnify-800 dark:from-learnify-400 dark:to-learnify-600 bg-clip-text text-transparent">
              Learnify
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium">
              Courses
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/category/development" className="w-full">Development</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/business" className="w-full">Business</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/design" className="w-full">Design</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/marketing" className="w-full">Marketing</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium">
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {searchOpen ? (
              <div className="relative animation-fadeIn">
                <Input 
                  type="search" 
                  placeholder="Search for courses..."
                  className="w-[250px] pr-8"
                  autoFocus
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
                <X 
                  className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 cursor-pointer" 
                  onClick={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <ThemeToggle />
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-learnify-600 dark:bg-learnify-500">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link to="/login" className="hidden md:block">
              <Button variant="outline" className="border-learnify-600 text-learnify-600 dark:border-learnify-400 dark:text-learnify-400 hover:bg-learnify-50 dark:hover:bg-learnify-900/20">
                Log in
              </Button>
            </Link>
            
            <Link to="/register" className="hidden md:block">
              <Button className="bg-learnify-600 hover:bg-learnify-700 dark:bg-learnify-500 dark:hover:bg-learnify-600 text-white">
                Sign up
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-lg py-4 px-4 absolute w-full fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium py-2">
              Courses
            </Link>
            <details className="group [&[open]>summary]:mb-2">
              <summary className="list-none flex justify-between items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium py-2">
                Categories
                <span className="transition group-open:rotate-180">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </summary>
              <div className="pl-4 flex flex-col space-y-2">
                <Link to="/category/development" className="text-gray-600 dark:text-gray-400 hover:text-learnify-600 dark:hover:text-learnify-400">Development</Link>
                <Link to="/category/business" className="text-gray-600 dark:text-gray-400 hover:text-learnify-600 dark:hover:text-learnify-400">Business</Link>
                <Link to="/category/design" className="text-gray-600 dark:text-gray-400 hover:text-learnify-600 dark:hover:text-learnify-400">Design</Link>
                <Link to="/category/marketing" className="text-gray-600 dark:text-gray-400 hover:text-learnify-600 dark:hover:text-learnify-400">Marketing</Link>
              </div>
            </details>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-learnify-600 dark:hover:text-learnify-400 font-medium py-2">
              About
            </Link>
            <div className="flex items-center space-x-4 pt-2">
              <ThemeToggleSimple />
            </div>
            <div className="flex space-x-4 pt-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full border-learnify-600 text-learnify-600 dark:border-learnify-400 dark:text-learnify-400 hover:bg-learnify-50 dark:hover:bg-learnify-900/20">
                  Log in
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full bg-learnify-600 hover:bg-learnify-700 dark:bg-learnify-500 dark:hover:bg-learnify-600 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
