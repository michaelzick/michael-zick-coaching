import { Link } from 'react-router-dom';
import { XCircle } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Checkout Cancelled" description="Checkout was cancelled" noIndex />
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted mb-6">
            <XCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Checkout Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was cancelled. Your cart items are still saved if you'd like to try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cart">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Return to Cart
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline">Continue Browsing</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
