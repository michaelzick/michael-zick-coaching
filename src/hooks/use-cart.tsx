
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/course';
import { useToast } from '@/components/ui/use-toast';

type CartContextType = {
  cart: CartItem[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('learnify-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
        localStorage.removeItem('learnify-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learnify-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (courseId: string) => {
    if (isInCart(courseId)) {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart",
      });
      return;
    }
    
    setCart(prev => [...prev, { courseId }]);
    toast({
      title: "Added to cart",
      description: "Course has been added to your cart",
    });
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(item => item.courseId !== courseId));
    toast({
      title: "Removed from cart",
      description: "Course has been removed from your cart",
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const isInCart = (courseId: string) => {
    return cart.some(item => item.courseId === courseId);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
