
import { useParams, Link } from 'react-router-dom';
import {
  Star, Clock, BookOpen, User, BarChart, Calendar, Award, PlayCircle,
  ShoppingCart, Check, Loader2
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import JsonLd from '@/components/JsonLd';
import { buildCourseSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas';
import CourseCard from '@/components/CourseCard';
import { useCart } from '@/hooks/use-cart';
import { useCourseBySlug, useCourseChapters, useRelatedCourses } from '@/hooks/use-courses';
import { useCoachById } from '@/hooks/use-coaches';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourseBySlug(slug);
  const { data: chapters = [] } = useCourseChapters(course?.id);
  const { data: relatedCourses = [] } = useRelatedCourses(course?.id, course?.category);
  const { data: coach } = useCoachById(course?.coachId);
  const { addToCart, isInCart } = useCart();

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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="mobile-shell flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">We couldn't find the course you're looking for.</p>
            <Link to="/courses">
              <Button className="bg-electric hover:bg-electric/90 text-electric-foreground">Browse Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const coachProfileHref = coach ? `/coaches/${coach.slug}` : null;
  const coachBioParagraphs = coach?.bio
    ? coach.bio.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : [];
  const coachDisplayName = coach?.name ?? course.instructor;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SEOHead
        title={course.title}
        description={course.shortDescription}
        canonicalPath={`/course/${slug}`}
        ogImage={course.thumbnailUrl ? `${course.thumbnailUrl}?auto=format&fit=crop&w=1200&q=80` : undefined}
      />
      <JsonLd data={buildCourseSchema({
        title: course.title,
        description: course.description,
        slug: slug || '',
        price: course.price,
        salePrice: course.salePrice,
        rating: course.rating,
        ratingCount: course.ratingCount,
        instructorName: coachDisplayName,
        instructorTitle: coach?.title,
        instructorUrl: coachProfileHref,
        thumbnailUrl: course.thumbnailUrl,
        duration: course.duration,
        lectureCount: course.lectureCount,
        language: course.language,
        category: course.category,
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Courses", url: "/courses" },
        { name: course.title, url: `/course/${slug}` },
      ])} />
      <Navbar />

      <main className="mobile-bottom-bar-offset flex-grow overflow-x-hidden pt-20 lg:pb-0">
        <div className="bg-secondary py-12 text-secondary-foreground">
          <div className="container mx-auto mobile-shell content-stack">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="min-w-0 fade-in">
                <div className="mb-4 flex flex-wrap items-center text-sm">
                  <Link to="/" className="text-muted-foreground hover:text-foreground/70">Home</Link>
                  <span className="mx-2">&rsaquo;</span>
                  <Link to="/courses" className="text-muted-foreground hover:text-foreground/70">Courses</Link>
                  <span className="mx-2">&rsaquo;</span>
                  <span className="text-muted-foreground">{course.category.replace(/-/g, " ")}</span>
                </div>

                <h1 className="mb-4 break-words text-3xl font-bold text-secondary-foreground md:text-4xl">{course.title}</h1>
                <p className="mb-6 break-words text-xl text-muted-foreground">{course.shortDescription}</p>

                <div className="flex items-center flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(course.rating) ? 'text-foreground fill-foreground' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating}</span>
                    <span className="ml-1 text-muted-foreground">({course.ratingCount} ratings)</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.studentsCount.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Updated {course.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-muted mr-3 flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    {coachProfileHref ? (
                      <Link to={coachProfileHref} className="font-medium text-secondary-foreground hover:text-foreground/70 transition-colors">
                        {coachDisplayName}
                      </Link>
                    ) : (
                      <h3 className="font-medium text-secondary-foreground">{coachDisplayName}</h3>
                    )}
                  </div>
                </div>

                <div className="mt-8 bg-background p-4 text-foreground sm:p-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-8 grid h-auto w-full grid-cols-3 bg-muted p-1">
                      <TabsTrigger value="overview" className="min-w-0 whitespace-normal px-2 py-3 text-[11px] leading-tight sm:text-sm">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="curriculum" className="min-w-0 whitespace-normal px-2 py-3 text-[11px] leading-tight sm:text-sm">
                        Curriculum
                      </TabsTrigger>
                      <TabsTrigger value="instructor" className="min-w-0 whitespace-normal px-2 py-3 text-[11px] leading-tight sm:text-sm">
                        About Coach
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="fade-in">
                      <h2 className="text-2xl font-bold text-foreground mb-6">About This Course</h2>
                      <p className="mb-8 break-words leading-relaxed text-muted-foreground">{course.description}</p>

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-foreground mb-4">What You'll Learn</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex min-w-0 items-start">
                              <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
                              <span className="min-w-0 break-words text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Topics Covered</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.topics.map((topic, index) => (
                            <div key={index} className="max-w-full break-words bg-muted px-4 py-1 text-sm font-semibold uppercase tracking-[0.03em] text-muted-foreground">
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="curriculum" className="fade-in">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Course Curriculum</h2>
                        <div className="flex items-center text-muted-foreground mb-6">
                          <BookOpen className="h-5 w-5 mr-2" />
                          <span>{totalLessons > 0 ? totalLessons : course.lectureCount} lessons</span>
                          <span className="mx-3">&bull;</span>
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{course.duration} total</span>
                        </div>

                        {chapters.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {chapters.map((chapter) => {
                              const chapterDuration = chapter.lessons.reduce((s, l) => s + l.durationSeconds, 0);
                              return (
                                <AccordionItem key={chapter.id} value={chapter.id} className="mb-4 overflow-hidden bg-card rounded-lg">
                                  <AccordionTrigger className="px-6 py-4 hover:bg-muted">
                                    <div className="flex justify-between items-center w-full text-left">
                                      <div>
                                        <h3 className="font-bold text-foreground">{chapter.title}</h3>
                                        <div className="text-sm text-muted-foreground">
                                          {chapter.lessons.length} lessons {chapterDuration > 0 && `\u2022 ${formatDuration(chapterDuration)}`}
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="px-6 pb-4">
                                      <ul className="divide-y divide-border">
                                        {chapter.lessons.map((lesson) => (
                                          <li key={lesson.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 items-center">
                                              <PlayCircle className="h-5 w-5 text-muted-foreground mr-3" />
                                              <span className="min-w-0 break-words text-foreground">{lesson.title}</span>
                                              {lesson.isPreview && (
                                                <span className="ml-2 text-xs bg-foreground/10 text-foreground px-2 py-0.5 border border-foreground uppercase tracking-[0.03em]">Preview</span>
                                              )}
                                            </div>
                                            {lesson.durationSeconds > 0 && (
                                              <span className="text-sm text-muted-foreground">{formatDuration(lesson.durationSeconds)}</span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        ) : (
                          <p className="text-muted-foreground">Curriculum details coming soon.</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="instructor" className="fade-in">
                      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden bg-muted">
                          {coach?.imageUrl ? (
                            <img src={coach.imageUrl} alt={coachDisplayName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{coachDisplayName}</h2>
                          <p className="mb-4 break-words text-muted-foreground">{coach?.title ?? 'Coach profile coming soon'}</p>
                          {coachProfileHref && (
                            <Link to={coachProfileHref}>
                              <Button variant="outline" className="border-border">
                                View Full Profile
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="mb-8 bg-muted p-4 sm:p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                          About {coach?.firstName ?? coachDisplayName.split(' ')[0]}
                        </h3>
                        {coachBioParagraphs.length > 0 ? (
                          <div className="space-y-4">
                            {coachBioParagraphs.slice(0, 2).map((paragraph) => (
                              <p key={paragraph.slice(0, 40)} className="break-words text-muted-foreground">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            We are still syncing the full coach profile for this course. Check back soon for a deeper breakdown of the coach, philosophy, and recommended next steps.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-6 fade-in-delay-1 lg:sticky lg:top-24">
                <div className="bg-card rounded-lg overflow-hidden">
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img
                      src={`${course.thumbnailUrl}?auto=format&fit=crop&w=800&q=80`}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      {course.salePrice ? (
                        <div className="flex items-center">
                          <span className="text-3xl font-bold text-card-foreground">{formatPrice(course.salePrice)}</span>
                          <span className="text-xl text-muted-foreground line-through ml-3">{formatPrice(course.price)}</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-card-foreground">{formatPrice(course.price)}</span>
                      )}
                    </div>

                    {isInCart(course.id) ? (
                      <Link to="/cart" className="block w-full">
                        <Button variant="outline" className="mb-3 w-full border-foreground text-foreground hover:bg-foreground/10">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Go to Cart
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="mb-3 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => addToCart(course.id)}
                      >
                        Enroll Now
                      </Button>
                    )}

                    <div className="text-center text-sm text-muted-foreground mb-6">
                      30-Day Money-Back Guarantee
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-bold text-card-foreground mb-4">This course includes:</h3>
                      <ul className="space-y-3 text-card-foreground">
                        <li className="flex items-start">
                          <Clock className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.duration} of content</span>
                        </li>
                        <li className="flex items-start">
                          <BookOpen className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.lectureCount} lessons</span>
                        </li>
                        <li className="flex items-start">
                          <BarChart className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.level} level</span>
                        </li>
                        <li className="flex items-start">
                          <Award className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                          <span>Lifetime access</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-card-foreground mb-4">Course Details</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="break-words font-medium text-foreground sm:text-right">{course.level}</span>
                    </li>
                    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="break-words font-medium text-foreground sm:text-right">{course.category.replace(/-/g, " ")}</span>
                    </li>
                    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="break-words font-medium text-foreground sm:text-right">{course.language}</span>
                    </li>
                    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="break-words font-medium text-foreground sm:text-right">{course.lastUpdated}</span>
                    </li>
                    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="break-words font-medium text-foreground sm:text-right">{course.studentsCount.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto mobile-shell content-stack">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Courses</h2>
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                {relatedCourses.map((relatedCourse, index) => (
                  <CourseCard
                    key={relatedCourse.id}
                    course={relatedCourse}
                    className={`fade-in-delay-${index % 3 + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="mobile-shell fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Course Price</p>
            <div className="flex items-baseline gap-2">
              <span className="truncate text-xl font-bold text-card-foreground">
                {formatPrice(course.salePrice ?? course.price)}
              </span>
              {course.salePrice && (
                <span className="truncate text-sm text-muted-foreground line-through">
                  {formatPrice(course.price)}
                </span>
              )}
            </div>
          </div>
          {isInCart(course.id) ? (
            <Link to="/cart" className="shrink-0">
              <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground/10">
                Go to Cart
              </Button>
            </Link>
          ) : (
            <Button
              className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => addToCart(course.id)}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>

      <div className="mobile-bottom-bar-offset lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}
