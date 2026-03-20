import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Globe, Loader2, Star, User } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import SEOHead from '@/components/SEOHead';
import { getCoachIcon } from '@/lib/coach-content';
import { useCoachBySlug, useCoachCourses } from '@/hooks/use-coaches';
import { buildBreadcrumbSchema, buildPersonSchema } from '@/lib/seo/schemas';

function splitParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function CoachProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: coach, isLoading } = useCoachBySlug(slug);
  const { data: courses = [], isLoading: coursesLoading } = useCoachCourses(coach?.id);

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

  if (!coach) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="mobile-shell flex-grow flex items-center justify-center">
          <div className="content-stack max-w-xl bg-card p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-card-foreground mb-4">Coach Not Found</h1>
            <p className="text-muted-foreground mb-6">We could not find the coach profile you were looking for.</p>
            <Link to="/coaches">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Coaches</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const socialLinks = Object.entries(coach.socialLinks).filter(([, value]) => value && value !== coach.websiteUrl);
  const bioParagraphs = splitParagraphs(coach.bio);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SEOHead
        title={coach.name}
        description={coach.shortBio}
        canonicalPath={`/coaches/${coach.slug}`}
        ogType="profile"
        ogImage={coach.imageUrl ?? undefined}
      />
      <JsonLd data={buildPersonSchema({
        name: coach.name,
        title: coach.title,
        description: coach.shortBio,
        url: `/coaches/${coach.slug}`,
        sameAs: socialLinks.map(([, value]) => value),
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Coaches', url: '/coaches' },
        { name: coach.name, url: `/coaches/${coach.slug}` },
      ])} />
      <Navbar />

      <main className="flex-grow pb-16 pt-28 md:pt-32">
        <section className="bg-muted py-12 mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-10">
              <div className="max-w-sm overflow-hidden bg-card lg:max-w-none">
                <div className="aspect-square bg-secondary">
                  {coach.imageUrl ? (
                    <img src={coach.imageUrl} alt={coach.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 max-w-4xl">
                <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Coach Profile</p>
                <h1 className="mb-3 break-words text-4xl font-bold text-foreground md:text-5xl">{coach.name}</h1>
                <p className="mb-6 break-words text-xl text-muted-foreground">{coach.title}</p>
                <p className="mb-8 max-w-3xl break-words text-lg text-muted-foreground">{coach.shortBio}</p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {coach.bookingUrl && (
                    <a href={coach.bookingUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                        Book with {coach.firstName}
                      </Button>
                    </a>
                  )}
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                      Browse Courses
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-3">
                  {coach.websiteUrl && (
                    <a href={coach.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-border">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </Button>
                    </a>
                  )}
                  {socialLinks.map(([label, value]) => (
                    <a key={label} href={value} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-border">
                        {label}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 mobile-shell">
          <div className="container mx-auto max-w-5xl content-stack">
            <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Bio</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">How {coach.firstName} works</h2>
            <div className="space-y-6">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="break-words text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {coach.philosophy.length > 0 && (
          <section className="bg-muted py-20 mobile-shell">
            <div className="container mx-auto content-stack">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Philosophy</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">The principles behind the work</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {coach.philosophy.map((item) => {
                  const Icon = getCoachIcon(item.icon);
                  return (
                    <div key={item.title} className="bg-card p-4 sm:p-6 lg:p-8">
                      <div className="w-12 h-12 bg-muted flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-card-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {coach.testimonials.length > 0 && (
          <section className="bg-background py-20 mobile-shell">
            <div className="container mx-auto content-stack">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Client Results</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">What men say after the work starts landing</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {coach.testimonials.map((testimonial) => (
                  <div key={`${testimonial.name}-${testimonial.text.slice(0, 20)}`} className="bg-card p-4 sm:p-6 lg:p-8">
                    <Star className="h-8 w-8 text-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">"{testimonial.text}"</p>
                    <p className="font-bold text-card-foreground">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-muted py-20 mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
              <div>
                <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Courses</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Courses from {coach.firstName}</h2>
              </div>
            </div>

            {coursesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : courses.length === 0 ? (
              <div className="content-stack max-w-3xl bg-card p-6 sm:p-8">
                <p className="text-muted-foreground">Courses from this coach are coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-secondary py-20 text-secondary-foreground mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">If this is your coach, start acting.</h2>
              <p className="text-secondary-foreground/80 text-lg mb-8 max-w-2xl">
                Pick a course or book the conversation. Either way, do not stay stuck in analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {coach.bookingUrl && (
                  <a href={coach.bookingUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                      Book with {coach.firstName}
                    </Button>
                  </a>
                )}
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
