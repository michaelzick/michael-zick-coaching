import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen, Loader2, Menu, CheckCircle2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/player/VideoPlayer';
import MarkdownContent from '@/components/MarkdownContent';
import JournalPrompts from '@/components/player/JournalPrompts';
import { useCourseBySlug, useCourseChapters } from '@/hooks/use-courses';
import { LessonItem } from '@/lib/api/courses';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/components/ui/use-toast';
import { markCourseCompleted } from '@/lib/api/progress';

export default function CoursePlayer() {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: course, isLoading: courseLoading } = useCourseBySlug(courseSlug);
  const { data: chapters = [], isLoading: chaptersLoading } = useCourseChapters(course?.id);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [mobileCourseMenuOpen, setMobileCourseMenuOpen] = useState(false);
  const [openChapters, setOpenChapters] = useState<string[]>([]);
  const [isCompletingCourse, setIsCompletingCourse] = useState(false);

  // Flatten all lessons for navigation
  const allLessons = chapters.flatMap(ch => ch.lessons);
  const activeChapterId = chapters.find((chapter) =>
    chapter.lessons.some((lesson) => lesson.id === currentLesson?.id)
  )?.id;

  useEffect(() => {
    if (allLessons.length === 0) return;

    if (lessonId) {
      const found = allLessons.find(l => l.id === lessonId);
      if (found) {
        setCurrentLesson(found);
        return;
      }
    }
    // Default to first lesson
    setCurrentLesson(allLessons[0]);
  }, [allLessons, lessonId]);

  useEffect(() => {
    if (chapters.length === 0) return;

    setOpenChapters((current) => {
      const chapterIds = chapters.map((chapter) => chapter.id);
      const nextOpenChapters = current.filter((chapterId) => chapterIds.includes(chapterId));

      if (nextOpenChapters.length === 0) {
        return chapterIds;
      }

      if (activeChapterId && !nextOpenChapters.includes(activeChapterId)) {
        return [...nextOpenChapters, activeChapterId];
      }

      return nextOpenChapters;
    });
  }, [chapters, activeChapterId]);

  const currentIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const lessonProgressLabel = allLessons.length > 0
    ? `Lesson ${Math.max(currentIndex + 1, 1)} of ${allLessons.length}`
    : 'Lesson player';

  const navigateToLesson = (lesson: LessonItem) => {
    navigate(`/learn/${courseSlug}/${lesson.id}`, { replace: true });
    setCurrentLesson(lesson);
    setMobileCourseMenuOpen(false);
  };

  const handleCompleteCourse = async () => {
    if (!course) return;

    setIsCompletingCourse(true);

    try {
      await markCourseCompleted(course.id);
      await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast({
        title: 'Course completed',
        description: `${course.title} has been marked complete.`,
      });
      navigate('/my-courses');
    } catch (error) {
      toast({
        title: 'Unable to complete course',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCompletingCourse(false);
    }
  };

  const renderCourseContent = (variant: 'desktop' | 'mobile') => (
    <Accordion
      type="multiple"
      value={openChapters}
      onValueChange={setOpenChapters}
      className="w-full"
    >
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={chapter.id} className="border-b border-border">
          <AccordionTrigger
            className={`px-4 py-4 text-left hover:bg-muted/70 hover:no-underline ${
              variant === 'mobile' ? 'text-base' : 'text-sm'
            }`}
          >
            <div className="flex min-w-0 flex-col items-start gap-1 pr-4">
              <span className="font-semibold text-card-foreground">{chapter.title}</span>
              <span className="text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
                {chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <ul className="border-t border-border/70 bg-background/20">
              {chapter.lessons.map((lesson) => {
                const isActive = currentLesson?.id === lesson.id;

                return (
                  <li key={lesson.id}>
                    <button
                      onClick={() => navigateToLesson(lesson)}
                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 ${
                        isActive ? 'border-l-2 border-primary bg-primary/10' : ''
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <PlayCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className="min-w-0 flex-grow">
                          <p className={`text-sm ${
                            isActive ? 'font-medium text-primary' : 'text-card-foreground'
                          }`}>
                            {lesson.title}
                          </p>
                          {lesson.durationSeconds > 0 && (
                            <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                              {Math.floor(lesson.durationSeconds / 60)} min
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (courseLoading || chaptersLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="mobile-shell flex flex-1 items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="mobile-shell flex flex-1 items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <Link to="/courses">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={course?.title || "Course Player"} description="Course player" noIndex />
      <Navbar />

      <main className="flex min-w-0 flex-1 flex-col pt-20">
        {/* Top bar */}
        <div className="mobile-shell border-b border-border bg-secondary py-3">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <Link to={`/course/${courseSlug}`} className="shrink-0">
                <Button variant="ghost" size="sm" className="shrink-0 px-2 text-xs text-secondary-foreground/80 sm:px-3 sm:text-sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:hidden">
                  {lessonProgressLabel}
                </p>
                <h1 className="truncate text-sm font-medium text-secondary-foreground">
                  {course.title}
                </h1>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <div className="hidden text-sm text-muted-foreground sm:block">
                {lessonProgressLabel}
              </div>
              <Sheet open={mobileCourseMenuOpen} onOpenChange={setMobileCourseMenuOpen}>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Open course content"
                  className="w-full justify-center border-border bg-background px-3 text-xs text-foreground hover:border-primary/50 hover:bg-secondary hover:text-foreground active:bg-muted sm:min-w-[10rem] sm:w-auto sm:text-sm lg:hidden"
                  onClick={() => setMobileCourseMenuOpen(true)}
                >
                  <Menu className="h-4 w-4 mr-2" />
                  <span className="truncate">Course&nbsp;Content</span>
                </Button>
                <SheetContent
                  side="right"
                  className="flex h-full w-full max-w-sm flex-col border-l border-border bg-card p-0 text-card-foreground sm:max-w-md"
                >
                  <SheetHeader className="shrink-0 border-b border-border bg-secondary px-5 py-4 text-left">
                    <SheetTitle className="flex items-center gap-2 text-card-foreground">
                      <BookOpen className="h-4 w-4" />
                      Course Content
                    </SheetTitle>
                    <SheetDescription>
                      {lessonProgressLabel}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
                    {renderCourseContent('mobile')}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Video area */}
          <div className="min-w-0 flex-grow p-2 sm:p-4 lg:p-8">
            {currentLesson ? (
              <>
                <VideoPlayer lesson={currentLesson} />
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                    {lessonProgressLabel}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{currentLesson.title}</h2>
                  {currentLesson.description && (
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                  )}
                </div>

                {currentLesson.content && (
                  <div className="mt-8">
                    <MarkdownContent content={currentLesson.content} />
                  </div>
                )}

                <JournalPrompts prompts={currentLesson.journalPrompts} />

                {/* Navigation */}
                <div className="mt-8 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  {prevLesson ? (
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigateToLesson(prevLesson)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  ) : <div />}
                  {nextLesson ? (
                    <Button className="w-full sm:w-auto" onClick={() => navigateToLesson(nextLesson)}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="w-full sm:w-auto" onClick={() => void handleCompleteCourse()} disabled={isCompletingCourse}>
                      {isCompletingCourse ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Complete Course
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No lessons available yet.</p>
              </div>
            )}
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden border-l border-border bg-card lg:sticky lg:top-20 lg:block lg:w-96 lg:flex-shrink-0 lg:self-start">
            <div className="border-b border-border p-4">
              <h3 className="font-bold text-card-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Content
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                {allLessons.length} lessons across {chapters.length} chapters
              </p>
            </div>
            <div>{renderCourseContent('desktop')}</div>
          </aside>
        </div>
      </main>
    </div>
  );
}
