
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  X,
  ChevronLeft,
  CreditCard,
  LockIcon,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useCoursesByIds } from '@/hooks/use-courses';
import { redirectToCheckout } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const courseIds = cart.map(item => item.courseId);
  const { data: cartItems = [], isLoading } = useCoursesByIds(courseIds);

  const formatPrice = (price: number) => {
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

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsCheckingOut(true);
    try {
      await redirectToCheckout(courseIds);
    } catch {
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    setIsCheckingOut(false);
  };

  if (isLoading && cart.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Programs</h1>
            <p className="text-muted-foreground">{cartItems.length} {cartItems.length === 1 ? 'program' : 'programs'} selected</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No programs selected</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse our coaching programs and start your recovery journey.
              </p>
              <Link to="/courses">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse Programs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 fade-in">
                <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                  <div className="p-6 pb-3">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-card-foreground">Selected Programs</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={clearCart}
                      >
                        Remove All
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="divide-y divide-border">
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
                              <Link to={`/course/${item.slug}`} className="font-medium text-card-foreground hover:text-primary">
                                {item.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                By {item.instructor}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{item.duration}</span>
                                <span className="mx-2">&bull;</span>
                                <span>{item.level}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="flex items-center mb-2">
                                {item.salePrice ? (
                                  <>
                                    <span className="font-bold text-card-foreground mr-2">
                                      {formatPrice(item.salePrice)}
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(item.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-bold text-card-foreground">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive -mr-2"
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

                  <div className="p-6 bg-muted">
                    <Link to="/courses" className="inline-flex items-center text-primary font-medium hover:text-primary/80">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Continue Browsing
                    </Link>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 fade-in-delay-1">
                <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-card-foreground mb-4">Summary</h2>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-card-foreground">{formatPrice(calculateSubtotal())}</span>
                      </div>

                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-medium text-green-500">-{formatPrice(calculateDiscount())}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between mb-6">
                      <span className="font-bold text-card-foreground">Total</span>
                      <span className="font-bold text-card-foreground">{formatPrice(calculateSubtotal())}</span>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-4"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      {isCheckingOut ? 'Processing...' : 'Checkout'}
                    </Button>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <LockIcon className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium text-card-foreground">Secure Checkout</span>
                      </div>
                      <div className="flex items-start">
                        <Shield className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          30-day money-back guarantee. If you're not satisfied, we'll issue a full refund.
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
