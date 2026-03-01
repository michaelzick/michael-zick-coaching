
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  X, 
  ChevronLeft, 
  CreditCard, 
  LockIcon,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/use-cart';
import { getCourseById } from '@/data/courses';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCartItems = () => {
      const items = cart.map(item => {
        const course = getCourseById(item.courseId);
        return course ? { ...course, cartItemId: item.courseId } : null;
      }).filter(Boolean);
      
      setCartItems(items);
      setIsLoading(false);
    };
    
    setTimeout(loadCartItems, 500);
  }, [cart]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.salePrice || item.price);
    }, 0);
  };
  
  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      return item.salePrice ? total + (item.price - item.salePrice) : total;
    }, 0);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-32 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center">
              <div className="w-full max-w-3xl animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-64 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in cart</p>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <ShoppingCart className="h-10 w-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any courses to your cart yet.
              </p>
              <Link to="/courses">
                <Button className="bg-learnify-600 hover:bg-learnify-700 text-white">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 fade-in">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 pb-3">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Course in Cart</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-red-600"
                        onClick={clearCart}
                      >
                        Remove All
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 flex fade-in">
                        <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          <img 
                            src={`${item.thumbnailUrl}?auto=format&fit=crop&w=240&q=80`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <Link to={`/course/${item.slug}`} className="font-medium text-gray-900 hover:text-learnify-600">
                                {item.title}
                              </Link>
                              <p className="text-sm text-gray-500">
                                By {item.instructor}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{item.duration}</span>
                                <span className="mx-2">•</span>
                                <span>{item.level}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <div className="flex items-center mb-2">
                                {item.salePrice ? (
                                  <>
                                    <span className="font-bold text-gray-900 mr-2">
                                      {formatPrice(item.salePrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatPrice(item.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-bold text-gray-900">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-500 hover:text-red-600 -mr-2"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <Link to="/courses" className="inline-flex items-center text-learnify-600 font-medium hover:text-learnify-700">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1 fade-in-delay-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                      </div>
                      
                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-medium text-green-600">-{formatPrice(calculateDiscount())}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between mb-6">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-gray-900">{formatPrice(calculateTotal())}</span>
                    </div>
                    
                    <Button className="w-full bg-learnify-600 hover:bg-learnify-700 text-white mb-4">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Checkout
                    </Button>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <LockIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
                      </div>
                      <div className="flex items-start">
                        <Shield className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          30-day money-back guarantee. If you're not satisfied with your purchase, we'll issue a full refund.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
