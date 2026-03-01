import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import VideoPlayer from '@/components/player/VideoPlayer';
import { useCourseBySlug, useCourseChapters } from '@/hooks/use-courses';
import { LessonItem } from '@/lib/api/courses';

export default function CoursePlayer() {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useCourseBySlug(courseSlug);
  const { data: chapters = [], isLoading: chaptersLoading } = useCourseChapters(course?.id);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);

  // Flatten all lessons for navigation
  const allLessons = chapters.flatMap(ch => ch.lessons);

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
  }, [allLessons.length, lessonId]);

  const currentIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const navigateToLesson = (lesson: LessonItem) => {
    navigate(`/learn/${courseSlug}/${lesson.id}`, { replace: true });
    setCurrentLesson(lesson);
  };

  if (courseLoading || chaptersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
          <Link to="/courses">
            <Button>Browse Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-secondary border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to={`/course/${courseSlug}`}>
              <Button variant="ghost" size="sm" className="text-secondary-foreground/80">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-sm font-medium text-secondary-foreground truncate max-w-md">
              {course.title}
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {allLessons.length} lessons
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex-grow p-4 lg:p-8">
          {currentLesson ? (
            <>
              <VideoPlayer lesson={currentLesson} />
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-muted-foreground">{currentLesson.description}</p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-4 border-t border-border">
                {prevLesson ? (
                  <Button variant="outline" onClick={() => navigateToLesson(prevLesson)}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : <div />}
                {nextLesson ? (
                  <Button onClick={() => navigateToLesson(nextLesson)}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : <div />}
              </div>
            </>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No lessons available yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-card-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Content
            </h3>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Accordion type="multiple" defaultValue={chapters.map(ch => ch.id)} className="w-full">
              {chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id} className="border-b border-border">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted text-sm">
                    <span className="font-semibold text-left">{chapter.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {chapter.lessons.map((lesson) => {
                        const isActive = currentLesson?.id === lesson.id;
                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => navigateToLesson(lesson)}
                              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                                isActive ? 'bg-primary/5 border-l-2 border-primary' : ''
                              }`}
                            >
                              <PlayCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                isActive ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                              <div className="flex-grow min-w-0">
                                <p className={`text-sm truncate ${
                                  isActive ? 'font-medium text-primary' : 'text-card-foreground'
                                }`}>
                                  {lesson.title}
                                </p>
                                {lesson.durationSeconds > 0 && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {Math.floor(lesson.durationSeconds / 60)}m
                                  </p>
                                )}
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
