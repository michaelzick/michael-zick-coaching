import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Loader2, CheckCircle2, XCircle } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useMyEnrollments } from '@/hooks/use-enrollments';
import { markCourseCompleted, markCourseIncomplete } from '@/lib/api/progress';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function MyPrograms() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleCompletion = async (enrollment: any) => {
    const course = enrollment.courses;
    if (!course) return;

    setTogglingId(enrollment.id);
    try {
      if (enrollment.completed_at) {
        await markCourseIncomplete(course.id);
        toast({ title: 'Marked incomplete', description: `${course.title} has been marked as in progress.` });
      } else {
        await markCourseCompleted(course.id);
        toast({ title: 'Course completed', description: `${course.title} has been marked complete.` });
      }
      await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Courses" description="Your enrolled courses" noIndex />
      <Navbar />

      <main className="flex-grow mobile-shell pb-16 pt-32">
        <div className="container mx-auto content-stack">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
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
              <h2 className="text-2xl font-bold text-foreground mb-4">No Courses Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Browse our catalog to get started.
              </p>
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment: any) => {
                const course = enrollment.courses;
                if (!course) return null;
                const isCompleted = !!enrollment.completed_at;
                const isToggling = togglingId === enrollment.id;

                return (
                  <Card key={enrollment.id} className="overflow-hidden">
                    <div className="relative pb-[56.25%] overflow-hidden">
                      <img
                        src={`${course.thumbnail_url}?auto=format&fit=crop&w=600&q=80`}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {isCompleted && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background shadow-md">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-bold text-card-foreground mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.short_description}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Link to={`/learn/${course.slug}`}>
                          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {isCompleted ? 'Review Course' : 'Continue Learning'}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full text-xs ${isCompleted ? 'text-muted-foreground hover:text-foreground' : 'text-foreground hover:text-foreground/70'}`}
                          onClick={() => void handleToggleCompletion(enrollment)}
                          disabled={isToggling}
                        >
                          {isToggling ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : isCompleted ? (
                            <XCircle className="mr-2 h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                          )}
                          {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </Button>
                      </div>
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
