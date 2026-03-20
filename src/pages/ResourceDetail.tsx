import { useParams, Link } from 'react-router-dom';
import { Loader2, ChevronRight } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo/schemas';
import MarkdownContent from '@/components/MarkdownContent';
import { useResourceBySlug } from '@/hooks/use-resources';

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: resource, isLoading } = useResourceBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="mobile-shell flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="mobile-shell flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Resource Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">We couldn't find the article you're looking for.</p>
            <Link to="/resources">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Resources</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || "";
  const authorUrl = resource.author === 'Michael Zick'
    ? `${siteUrl}/coaches/michael-zick`
    : `${siteUrl}/coaches`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.metaDescription || resource.title,
    author: {
      "@type": "Person",
      name: resource.author,
      jobTitle: "Coach",
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Nice Guy University",
      url: siteUrl || "https://michaelzick.com",
    },
    datePublished: resource.createdAt,
    dateModified: resource.updatedAt,
    url: `${siteUrl}/resources/${slug}`,
    mainEntityOfPage: `${siteUrl}/resources/${slug}`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={resource.metaTitle || resource.title}
        description={resource.metaDescription || resource.title}
        canonicalPath={`/resources/${slug}`}
      />
      <JsonLd data={articleSchema} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Resources", url: "/resources" },
        { name: resource.title, url: `/resources/${slug}` },
      ])} />
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        <article className="mobile-shell">
          <div className="container mx-auto max-w-4xl content-stack">
            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-y-1 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground/70">Home</Link>
              <span className="mx-2 text-muted-foreground">&rsaquo;</span>
              <Link to="/resources" className="text-muted-foreground hover:text-foreground/70">Resources</Link>
              <span className="mx-2 text-muted-foreground">&rsaquo;</span>
              <span className="text-muted-foreground truncate">{resource.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-12">
              {resource.category && (
                <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">
                  {resource.category}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {resource.title}
              </h1>
              <div className="flex flex-wrap items-center text-muted-foreground">
                <span>By {resource.author}</span>
                <span className="mx-3">&bull;</span>
                <span>Nice Guy Recovery Coach</span>
              </div>
            </header>

            {/* Content */}
            <div className="mb-16">
              <MarkdownContent content={resource.content} />
            </div>

            {/* CTA */}
            <div className="mb-12 bg-card p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                Ready to Put This Into Practice?
              </h2>
              <p className="text-muted-foreground mb-6">
                Reading is a good start, but lasting change requires structured work. Explore the coaching courses designed to break these patterns for good.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {resource.relatedCourseSlug ? (
                  <Link to={`/course/${resource.relatedCourseSlug}`} className="w-full sm:w-auto">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      View Recommended Course
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Explore Courses
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )} 
                <Link to="/coaches" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    Meet Our Coaches
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
