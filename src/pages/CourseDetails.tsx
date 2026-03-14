
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
  const { addToCart, isInCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
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
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Program Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">We couldn't find the program you're looking for.</p>
            <Link to="/courses">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Programs</Button>
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

  return (
    <div className="min-h-screen flex flex-col">
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
        thumbnailUrl: course.thumbnailUrl,
        duration: course.duration,
        lectureCount: course.lectureCount,
        language: course.language,
        category: course.category,
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Programs", url: "/courses" },
        { name: course.title, url: `/course/${slug}` },
      ])} />
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="bg-secondary text-secondary-foreground py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 fade-in">
                <div className="flex items-center text-sm mb-4">
                  <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
                  <span className="mx-2">&rsaquo;</span>
                  <Link to="/courses" className="text-muted-foreground hover:text-primary">Programs</Link>
                  <span className="mx-2">&rsaquo;</span>
                  <span className="text-muted-foreground">{course.category.replace(/-/g, " ")}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-foreground">{course.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{course.shortDescription}</p>

                <div className="flex items-center flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(course.rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
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
                  <div className="w-10 h-10 bg-primary/20 border-2 border-foreground mr-3 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <h3 className="font-medium text-secondary-foreground">{course.instructor}</h3>
                  </div>
                </div>

                <div className="mt-8 bg-background text-foreground border-2 border-foreground p-6 cubist-frame">
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-8 bg-muted p-1">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                      <TabsTrigger value="instructor">About Coach</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="fade-in">
                      <h2 className="text-2xl font-bold text-foreground mb-6">About This Program</h2>
                      <p className="text-muted-foreground mb-8 leading-relaxed">{course.description}</p>

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-foreground mb-4">What You'll Learn</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Topics Covered</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.topics.map((topic, index) => (
                            <div key={index} className="bg-muted text-muted-foreground border-2 border-foreground py-1 px-4 text-sm font-semibold uppercase tracking-[0.05em]">
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="curriculum" className="fade-in">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Program Curriculum</h2>
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
                                <AccordionItem key={chapter.id} value={chapter.id} className="border-2 border-foreground mb-4 overflow-hidden">
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
                                          <li key={lesson.id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                              <PlayCircle className="h-5 w-5 text-muted-foreground mr-3" />
                                              <span className="text-foreground">{lesson.title}</span>
                                              {lesson.isPreview && (
                                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 border-2 border-primary uppercase tracking-[0.05em]">Preview</span>
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
                      <div className="flex items-start mb-8">
                        <div className="w-20 h-20 bg-primary/20 border-2 border-foreground mr-6 flex items-center justify-center">
                          <User className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Michael Zick</h2>
                          <p className="text-muted-foreground mb-4">Nice Guy Recovery Coach</p>
                          <div className="flex items-center flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-muted-foreground">
                              <Star className="w-4 h-4 text-accent fill-accent mr-1" />
                              <span>4.8 Rating</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <User className="w-4 h-4 mr-1" />
                              <span>5,000+ Clients</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-6 border-2 border-foreground mb-8 cubist-frame">
                        <h3 className="text-xl font-bold text-foreground mb-4">About Michael</h3>
                        <p className="text-muted-foreground mb-4">
                          Michael Zick is a Nice Guy Recovery Coach who helps men break free from approval addiction and build authentic, fulfilling lives. After his own recovery journey, he developed a structured framework that has helped thousands of men transform their relationships, careers, and self-identity.
                        </p>
                        <p className="text-muted-foreground">
                          His coaching approach is direct, no-nonsense, and results-focused. He doesn't deal in vague platitudes — every program includes specific tools, exercises, and frameworks you can apply immediately.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="md:col-span-1 fade-in-delay-1 space-y-6">
                <div className="bg-card overflow-hidden border-2 border-foreground cubist-frame">
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img
                      src={`${course.thumbnailUrl}?auto=format&fit=crop&w=800&q=80`}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
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
                      <Link to="/cart" className="w-full">
                        <Button variant="outline" className="w-full mb-3 border-primary text-primary hover:bg-primary/10 py-6">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Go to Cart
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full mb-3 bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                        onClick={() => addToCart(course.id)}
                      >
                        Enroll Now
                      </Button>
                    )}

                    <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full py-6 mb-6">
                        Book a Free Session First
                      </Button>
                    </a>

                    <div className="text-center text-sm text-muted-foreground mb-6">
                      30-Day Money-Back Guarantee
                    </div>

                    <div className="border-t-2 border-border pt-6">
                      <h3 className="font-bold text-card-foreground mb-4">This program includes:</h3>
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
                <div className="bg-card border-2 border-foreground p-6 cubist-frame">
                  <h3 className="text-lg font-bold text-card-foreground mb-4">Program Details</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium text-foreground">{course.level}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-primary">{course.category.replace(/-/g, " ")}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium text-foreground">{course.language}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium text-foreground">{course.lastUpdated}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="font-medium text-foreground">{course.studentsCount.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Programs */}
        {relatedCourses.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Footer />
    </div>
  );
}
