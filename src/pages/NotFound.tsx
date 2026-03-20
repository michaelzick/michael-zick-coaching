import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist" noIndex />
      <Navbar />
      <main className="mobile-shell flex flex-1 items-center justify-center pb-16 pt-32">
        <div className="content-stack max-w-xl bg-card rounded-lg p-6 text-center sm:p-10">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-8 text-muted-foreground">
            The page at <span className="font-medium text-foreground">{location.pathname}</span> does not exist.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full">Return Home</Button>
            </Link>
            <Link to="/courses" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Browse Courses</Button>
            </Link>
            <Link to="/coaches" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Meet Our Coaches</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
