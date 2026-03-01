import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. You now have access to your programs. Start learning right away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-programs">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Go to My Programs
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline">Browse More Programs</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
