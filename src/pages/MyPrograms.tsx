import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Loader2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useMyEnrollments } from '@/hooks/use-enrollments';

export default function MyPrograms() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Programs" description="Your enrolled programs" noIndex />
      <Navbar />

      <main className="flex-grow mobile-shell pb-16 pt-32">
        <div className="container mx-auto content-stack">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Programs</h1>
            <p className="text-muted-foreground">Continue your recovery journey.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted mb-6">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Programs Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't enrolled in any programs yet. Browse our catalog to get started.
              </p>
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Programs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment: any) => {
                const course = enrollment.courses;
                if (!course) return null;

                return (
                  <Card key={enrollment.id} className="overflow-hidden">
                    <div className="relative pb-[56.25%] overflow-hidden">
                      <img
                        src={`${course.thumbnail_url}?auto=format&fit=crop&w=600&q=80`}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-bold text-card-foreground mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.short_description}
                      </p>
                      <Link to={`/learn/${course.slug}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
