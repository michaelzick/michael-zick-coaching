import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist" noIndex />
      <div className="text-center bg-card p-10">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-foreground underline font-semibold uppercase tracking-[0.03em]">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
