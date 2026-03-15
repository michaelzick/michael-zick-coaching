
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import {
  ShoppingCart,
  X,
  ChevronLeft,
  CreditCard,
  LockIcon,
  Shield,
  Clock,
  Loader2
} from '@/lib/icons';
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

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();

  const renderPriceBlock = (price: number, salePrice: number | null) => (
    salePrice ? (
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-lg font-bold text-card-foreground">
          {formatPrice(salePrice)}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(price)}
        </span>
      </div>
    ) : (
      <span className="text-lg font-bold text-card-foreground">
        {formatPrice(price)}
      </span>
    )
  );

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
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading && cart.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="mobile-shell flex-grow pt-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Cart" description="Your selected programs" noIndex />
      <Navbar />

      <main className={`flex-grow mobile-shell pt-32 ${cartItems.length > 0 ? 'pb-32 md:pb-16' : 'pb-16'}`}>
        <div className="container mx-auto content-stack">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Programs</h1>
            <p className="text-muted-foreground">{cartItems.length} {cartItems.length === 1 ? 'program' : 'programs'} selected</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted mb-6">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Programs Selected</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse our coaching programs and start your recovery journey.
              </p>
              <Link to="/courses" className="inline-flex w-full justify-center sm:w-auto">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground sm:w-auto">
                  Browse Programs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 fade-in">
                <div className="hidden overflow-hidden bg-card md:block">
                  <div className="p-6 pb-3">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h2 className="text-xl font-bold text-card-foreground tracking-[0.01em]">Selected Programs</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={clearCart}
                      >
                        Remove All
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-6 fade-in">
                        <div className="h-16 w-24 flex-shrink-0 overflow-hidden">
                          <img
                            src={`${item.thumbnailUrl}?auto=format&fit=crop&w=240&q=80`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 items-start justify-between gap-6">
                          <div className="min-w-0">
                            <Link
                              to={`/course/${item.slug}`}
                              className="block break-words font-medium text-card-foreground hover:text-primary"
                            >
                              {item.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              By {item.instructor}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                              <span className="inline-flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                {item.duration}
                              </span>
                              <span>&bull;</span>
                              <span>{item.level}</span>
                            </div>
                          </div>

                          <div className="flex flex-shrink-0 flex-col items-end gap-2">
                            {renderPriceBlock(item.price, item.salePrice)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border bg-muted p-6">
                    <Link to="/courses" className="inline-flex items-center font-medium text-primary hover:text-primary/80">
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Continue Browsing
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 md:hidden">
                  <div className="bg-card p-4">
                    <h2 className="text-xl font-bold tracking-[0.01em] text-card-foreground">Selected Programs</h2>
                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={clearCart}
                    >
                      Remove All
                    </Button>
                  </div>

                  {cartItems.map((item) => (
                    <article key={item.id} className="space-y-4 bg-card p-4 fade-in">
                      <div className="flex min-w-0 gap-3">
                        <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-muted">
                          <img
                            src={`${item.thumbnailUrl}?auto=format&fit=crop&w=320&q=80`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/course/${item.slug}`}
                            className="block break-words text-lg font-medium text-card-foreground hover:text-primary"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">
                            By {item.instructor}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {item.duration}
                        </span>
                        <span>&bull;</span>
                        <span>{item.level}</span>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                            Price
                          </p>
                          {renderPriceBlock(item.price, item.salePrice)}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex-shrink-0 justify-center text-muted-foreground hover:text-destructive sm:w-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </article>
                  ))}

                  <div className="px-1">
                    <Link to="/courses" className="inline-flex items-center font-medium text-primary hover:text-primary/80">
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Continue Browsing
                    </Link>
                  </div>

                  <div className="bg-card p-4">
                    <h2 className="mb-4 text-xl font-bold text-card-foreground">Order Details</h2>

                    <div className="mb-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-right font-medium text-card-foreground">{formatPrice(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="text-right font-medium text-green-500">-{formatPrice(discount)}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="font-bold text-card-foreground">Total</span>
                      <span className="text-right text-lg font-bold text-card-foreground">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="bg-muted p-4">
                      <div className="mb-3 flex items-center">
                        <LockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-card-foreground">Secure Checkout</span>
                      </div>
                      <div className="flex items-start">
                        <Shield className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          30-day money-back guarantee. If you're not satisfied, we'll issue a full refund.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block md:col-span-1 fade-in-delay-1">
                <div className="sticky top-24 overflow-hidden bg-card">
                  <div className="p-6">
                    <h2 className="mb-4 text-xl font-bold text-card-foreground">Summary</h2>

                    <div className="mb-4 space-y-3">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-right font-medium text-card-foreground">{formatPrice(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="text-right font-medium text-green-500">-{formatPrice(discount)}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6 flex justify-between gap-4">
                      <span className="font-bold text-card-foreground">Total</span>
                      <span className="text-right font-bold text-card-foreground">{formatPrice(subtotal)}</span>
                    </div>

                    <Button
                      className="mb-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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

                    <div className="bg-muted p-4">
                      <div className="mb-3 flex items-center">
                        <LockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-card-foreground">Secure Checkout</span>
                      </div>
                      <div className="flex items-start">
                        <Shield className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
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

      {cartItems.length > 0 && (
        <div className="mobile-shell fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Total</p>
              <p className="truncate text-xl font-bold text-card-foreground">{formatPrice(subtotal)}</p>
            </div>
            <Button
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </Button>
          </div>
        </div>
      )}

      <div className={cartItems.length > 0 ? 'pb-24 md:pb-0' : ''}>
        <Footer />
      </div>
    </div>
  );
}
