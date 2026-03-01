
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  BookOpen, 
  User, 
  BarChart, 
  Globe, 
  Calendar, 
  Award, 
  PlayCircle,
  ShoppingCart,
  Share2,
  Heart,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useCart } from '@/hooks/use-cart';
import { getCourseBySlug, getRelatedCourses } from '@/data/courses';

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  
  useEffect(() => {
    const fetchCourse = () => {
      const foundCourse = getCourseBySlug(slug);
      setCourse(foundCourse);
      
      if (foundCourse) {
        const related = getRelatedCourses(foundCourse.id, foundCourse.category);
        setRelatedCourses(related);
      }
      
      setIsLoading(false);
    };
    
    // Simulate API call with a timeout
    setTimeout(fetchCourse, 500);
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-96 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              We couldn't find the course you're looking for.
            </p>
            <Link to="/courses">
              <Button className="bg-learnify-600 hover:bg-learnify-700 text-white">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Course Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 fade-in">
                <div className="flex items-center text-sm mb-4">
                  <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                  <span className="mx-2">›</span>
                  <Link to="/courses" className="text-gray-400 hover:text-white">Courses</Link>
                  <span className="mx-2">›</span>
                  <Link to={`/category/${course.category}`} className="text-gray-400 hover:text-white">
                    {course.category.replace("-", " ")}
                  </Link>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                
                <p className="text-xl text-gray-300 mb-6">{course.shortDescription}</p>
                
                <div className="flex items-center flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating}</span>
                    <span className="ml-1 text-gray-400">({course.ratingCount} ratings)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.studentsCount.toLocaleString()} students</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Last updated {course.lastUpdated}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>{course.language}</span>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  {course.instructorAvatar ? (
                    <img 
                      src={course.instructorAvatar} 
                      alt={course.instructor} 
                      className="w-10 h-10 rounded-full mr-3 border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <h3 className="font-medium">{course.instructor}</h3>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1 fade-in-delay-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img 
                      src={`${course.thumbnailUrl}?auto=format&fit=crop&w=800&q=80`}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all duration-300">
                        <PlayCircle className="w-10 h-10 text-learnify-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {course.salePrice ? (
                        <div className="flex items-center">
                          <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(course.salePrice)}
                          </span>
                          <span className="text-xl text-gray-500 line-through ml-3">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">
                          {formatPrice(course.price)}
                        </span>
                      )}
                    </div>
                    
                    {isInCart(course.id) ? (
                      <Link to="/cart" className="w-full">
                        <Button 
                          variant="outline" 
                          className="w-full mb-3 border-learnify-600 text-learnify-600 hover:bg-learnify-50 py-6"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Go to Cart
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full mb-3 bg-learnify-600 hover:bg-learnify-700 text-white py-6"
                        onClick={() => addToCart(course.id)}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full py-6 mb-6">
                      Buy Now
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500 mb-6">
                      30-Day Money-Back Guarantee
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.duration} of on-demand video</span>
                        </li>
                        <li className="flex items-start">
                          <BookOpen className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.lectureCount} lectures</span>
                        </li>
                        <li className="flex items-start">
                          <BarChart className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{course.level} level</span>
                        </li>
                        <li className="flex items-start">
                          <Award className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>Certificate of completion</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="py-12 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                <TabsTrigger value="curriculum" className="rounded-md">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor" className="rounded-md">Instructor</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-md">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="fade-in">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Course</h2>
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-learnify-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Course Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic, index) => (
                          <div key={index} className="bg-gray-100 text-gray-700 rounded-full py-1 px-4 text-sm">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Course Details</h3>
                      <ul className="space-y-4">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Level</span>
                          <span className="font-medium text-gray-900">{course.level}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Category</span>
                          <Link to={`/category/${course.category}`} className="font-medium text-learnify-600 hover:underline">
                            {course.category.replace("-", " ")}
                          </Link>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Language</span>
                          <span className="font-medium text-gray-900">{course.language}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium text-gray-900">{course.lastUpdated}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Total Enrolled</span>
                          <span className="font-medium text-gray-900">{course.studentsCount.toLocaleString()}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
                  <div className="flex items-center text-gray-600 mb-6">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>{course.lectureCount} lectures</span>
                    <span className="mx-3">•</span>
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{course.duration} total length</span>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="section-1" className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center w-full text-left">
                          <div>
                            <h3 className="font-bold text-gray-900">Getting Started</h3>
                            <div className="text-sm text-gray-500">5 lectures • 45 minutes</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-4">
                          <ul className="divide-y divide-gray-100">
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Introduction to the Course</span>
                              </div>
                              <div className="text-sm text-gray-500">10:23</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Course Overview</span>
                              </div>
                              <div className="text-sm text-gray-500">08:15</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Setting Up Your Environment</span>
                              </div>
                              <div className="text-sm text-gray-500">12:44</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Essential Tools and Resources</span>
                              </div>
                              <div className="text-sm text-gray-500">07:32</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>First Steps and Project Setup</span>
                              </div>
                              <div className="text-sm text-gray-500">06:18</div>
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="section-2" className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center w-full text-left">
                          <div>
                            <h3 className="font-bold text-gray-900">Fundamentals</h3>
                            <div className="text-sm text-gray-500">8 lectures • 1h 15m</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-4">
                          <ul className="divide-y divide-gray-100">
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Core Concepts</span>
                              </div>
                              <div className="text-sm text-gray-500">14:23</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Building Blocks</span>
                              </div>
                              <div className="text-sm text-gray-500">11:45</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Essential Techniques</span>
                              </div>
                              <div className="text-sm text-gray-500">09:36</div>
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="section-3" className="border border-gray-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center w-full text-left">
                          <div>
                            <h3 className="font-bold text-gray-900">Advanced Topics</h3>
                            <div className="text-sm text-gray-500">12 lectures • 2h 30m</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-4">
                          <ul className="divide-y divide-gray-100">
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Advanced Strategies</span>
                              </div>
                              <div className="text-sm text-gray-500">18:12</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Best Practices</span>
                              </div>
                              <div className="text-sm text-gray-500">15:45</div>
                            </li>
                            <li className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                <span>Real-world Applications</span>
                              </div>
                              <div className="text-sm text-gray-500">22:18</div>
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="fade-in">
                <div className="flex items-start mb-8">
                  {course.instructorAvatar ? (
                    <img 
                      src={course.instructorAvatar} 
                      alt={course.instructor} 
                      className="w-20 h-20 rounded-full mr-6"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 mr-6" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor}</h2>
                    <p className="text-gray-600 mb-4">Professional Instructor & Course Creator</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-gray-700">4.8 Instructor Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-700">24,583 Reviews</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-700">58,421 Students</span>
                      </div>
                      <div className="flex items-center">
                        <PlayCircle className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-700">12 Courses</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h3>
                  <p className="text-gray-700 mb-4">
                    With over 10 years of industry experience, {course.instructor} has helped thousands of students master complex topics through clear explanations and practical examples. Their courses are known for being comprehensive yet accessible, with a focus on real-world applications and job-ready skills.
                  </p>
                  <p className="text-gray-700">
                    Before becoming a full-time instructor, they worked as a senior professional in the field and brought that practical knowledge to their teaching methodology. They're passionate about helping students achieve their career goals and regularly update course content to reflect industry changes.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Reviews</h2>
                  <div className="flex items-center mb-6">
                    <div className="flex items-center mr-4">
                      <span className="text-3xl font-bold text-gray-900 mr-2">{course.rating}</span>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.round(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-600">Course Rating • {course.ratingCount.toLocaleString()} ratings</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <img 
                          src="https://randomuser.me/api/portraits/men/32.jpg" 
                          alt="John D." 
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">John D.</h4>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand, and the practical exercises helped reinforce what I learned. I've already started applying these skills in my current job.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <img 
                          src="https://randomuser.me/api/portraits/women/44.jpg" 
                          alt="Emily R." 
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">Emily R.</h4>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">1 month ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Great course with lots of valuable information. The only reason I'm giving 4 stars instead of 5 is that some sections could use more in-depth examples. Otherwise, the instructor is knowledgeable and presents the material well.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <img 
                          src="https://randomuser.me/api/portraits/men/62.jpg" 
                          alt="Michael T." 
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">Michael T.</h4>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">2 months ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        I've taken many online courses, and this is definitely one of the best. The curriculum is well-structured, and the projects are challenging but achievable. The instructor responds quickly to questions in the discussion forum, which is a huge plus.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="text-learnify-600 border-learnify-600 hover:bg-learnify-50">
                      Load More Reviews
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Courses</h2>
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
