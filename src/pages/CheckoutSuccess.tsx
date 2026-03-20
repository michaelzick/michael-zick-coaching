import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { getInvokeErrorMessage } from '@/lib/stripe';

type CheckoutStatus = 'loading' | 'success' | 'error';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CheckoutStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const clearCartOnceRef = useRef(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    let isCurrent = true;

    async function finalizeCheckout() {
      if (isLoading) return;

      if (!sessionId) {
        if (isCurrent) {
          setStatus('error');
          setErrorMessage('Missing checkout session. Return to the cart and try the payment again.');
        }
        return;
      }

      if (!user) {
        if (isCurrent) {
          setStatus('error');
          setErrorMessage('Sign in again to finish granting access to your purchased courses.');
        }
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      const { data, error } = await supabase.functions.invoke('finalize-checkout-session', {
        body: { sessionId },
      });

      if (!isCurrent) return;

      if (error) {
        setStatus('error');
        setErrorMessage(await getInvokeErrorMessage(error));
        return;
      }

      if (!data?.orderId) {
        setStatus('error');
        setErrorMessage('Stripe returned successfully, but the order could not be finalized.');
        return;
      }

      if (!clearCartOnceRef.current) {
        clearCart();
        clearCartOnceRef.current = true;
      }

      setStatus('success');
    }

    void finalizeCheckout();

    return () => {
      isCurrent = false;
    };
  }, [clearCart, isLoading, sessionId, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Checkout Success" description="Your purchase was successful" noIndex />
      <Navbar />
      <main className="mobile-shell flex-grow pt-32 pb-16">
        <div className="container mx-auto max-w-lg content-stack text-center">
          {status === 'loading' ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted mb-6">
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Finalizing Your Purchase</h1>
              <p className="text-muted-foreground">
                Confirming your Stripe sandbox checkout and unlocking your courses.
              </p>
            </>
          ) : status === 'error' ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Checkout Needs Attention</h1>
              <p className="text-muted-foreground mb-8">
                {errorMessage}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link to="/cart" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Return to Cart
                  </Button>
                </Link>
                <Link to="/my-courses" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Check My Courses</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-foreground/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. You now have access to your courses. Start learning right away!
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link to="/my-courses" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Go to My Courses
                  </Button>
                </Link>
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Browse More Courses</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
