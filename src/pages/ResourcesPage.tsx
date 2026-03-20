import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Loader2 } from '@/lib/icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useResources } from '@/hooks/use-resources';

export default function ResourcesPage() {
  const { data: resources = [], isLoading } = useResources();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Nice Guy Recovery Resources & Guides"
        description="Free guides and articles from Nice Guy University on shame, approval addiction, people-pleasing, boundaries, and recovery work for men."
        canonicalPath="/resources"
      />
      <Navbar />

      <main className="flex-grow mobile-shell pb-16 pt-28 md:pt-32">
        <div className="container mx-auto max-w-5xl content-stack">
          <div className="mb-12 fade-in">
            <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-2">Resources</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nice Guy Recovery Guides
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              In-depth articles on the patterns, psychology, and practical steps behind Nice Guy recovery. Written for men who are done reading self-help books that don't change anything.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : resources.length === 0 ? (
            <div className="py-12 text-center md:py-20">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Resources Coming Soon</h2>
              <p className="text-muted-foreground">
                Check back soon for in-depth guides on Nice Guy recovery topics.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  to={`/resources/${resource.slug}`}
                  className="elevated-on-hover block bg-card p-4 transition-colors hover:border-foreground sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {resource.category && (
                        <p className="text-foreground font-semibold uppercase tracking-widest text-xs mb-2">
                          {resource.category}
                        </p>
                      )}
                      <h2 className="text-xl font-bold text-card-foreground mb-2">
                        {resource.title}
                      </h2>
                      {resource.metaDescription && (
                        <p className="text-muted-foreground line-clamp-2">
                          {resource.metaDescription}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-3">
                        By {resource.author}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 ml-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
