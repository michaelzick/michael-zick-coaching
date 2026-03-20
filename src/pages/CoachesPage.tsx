import { Link } from 'react-router-dom';
import { Loader2, User } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import SEOHead from '@/components/SEOHead';
import { useCoaches } from '@/hooks/use-coaches';
import { buildOrganizationSchema } from '@/lib/seo/schemas';

export default function CoachesPage() {
  const { data: coaches = [], isLoading } = useCoaches();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Our Coaches"
        description="Meet the Nice Guy University coaches and find the right fit for the work you need to do next."
        canonicalPath="/coaches"
      />
      <JsonLd data={buildOrganizationSchema()} />
      <Navbar />

      <main className="flex-grow mobile-shell pb-16 pt-32">
        <div className="container mx-auto content-stack">
          <div className="max-w-5xl mb-12">
            <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Coaches</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Meet the men behind the work.</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Each coach brings a distinct style, but the same mission: helping men break shame-driven patterns and build grounded standards.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : coaches.length === 0 ? (
            <div className="content-stack max-w-4xl bg-card p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-card-foreground mb-3">Coach profiles are coming online.</h2>
              <p className="text-muted-foreground mb-6">
                The platform is being expanded for multiple coaches. Check back soon or browse courses in the meantime.
              </p>
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {coaches.map((coach) => (
                <article key={coach.id} className="bg-card overflow-hidden elevated-on-hover">
                  <div className="aspect-square bg-muted overflow-hidden">
                    {coach.imageUrl ? (
                      <img
                        src={coach.imageUrl}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-1">{coach.name}</h2>
                    <p className="text-foreground font-semibold uppercase tracking-[0.04em] text-sm mb-4">{coach.title}</p>
                    <p className="text-muted-foreground mb-6">{coach.shortBio}</p>
                    <Link to={`/coaches/${coach.slug}`}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
