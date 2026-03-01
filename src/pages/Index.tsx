
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";

export default function Index() {
  const featuredCourses = courses.slice(0, 3);
  const topCategories = [
    { name: "Development", count: 432, image: "programming.jpg" },
    { name: "Business", count: 195, image: "business.jpg" },
    { name: "Design", count: 210, image: "design.jpg" },
    { name: "Marketing", count: 174, image: "marketing.jpg" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      text: "The courses on Learnify have been instrumental in advancing my career. The quality of instruction and the depth of material covered is exceptional.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "UX Designer",
      text: "I've taken design courses on many platforms, but Learnify's courses are by far the most comprehensive and practical. The projects helped me build an impressive portfolio.",
      rating: 5,
    },
    {
      name: "David Rodriguez",
      role: "Marketing Manager",
      text: "The marketing analytics courses helped me stay ahead of industry trends. I'm now able to make data-driven decisions that have measurably improved our campaign performance.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 space-y-6">
              <Badge className="px-3 py-1 bg-primary/10 text-primary border-none">
                Transform your career
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Learn the skills you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-learnify-600 to-learnify-800">succeed</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Access over 1,000 expert-led courses in programming, design, business, and more to take your skills to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/courses">
                  <Button className="bg-learnify-600 hover:bg-learnify-700 dark:bg-learnify-500 dark:hover:bg-learnify-600 text-white px-6 py-6 text-lg w-full sm:w-auto">
                    Explore Courses
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-learnify-600 text-learnify-600 hover:bg-learnify-50 dark:border-learnify-400 dark:text-learnify-400 dark:hover:bg-learnify-900/20 px-6 py-6 text-lg w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">10,000+</span> students already enrolled
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 max-w-lg mx-auto">
                <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-700"></div>
                <div className="p-4">
                  <h3 className="font-bold text-xl">Web Development Bootcamp</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Learn HTML, CSS, JavaScript, React and more</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs ml-1 text-gray-600 dark:text-gray-300">4.9 (2.5k+)</span>
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-none">Bestseller</Badge>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                <div className="bg-learnify-50 dark:bg-learnify-900/30 w-10 h-10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-learnify-600 dark:text-learnify-400 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Lifetime Access</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Learn at your own pace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
            <Link to="/courses" className="text-learnify-600 dark:text-learnify-400 hover:text-learnify-700 dark:hover:text-learnify-300 font-medium flex items-center">
              View All
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 px-3 py-1 bg-learnify-50 dark:bg-learnify-900/30 text-learnify-600 dark:text-learnify-400 border-none">
              Why Choose Learnify
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Perfect Platform for Your Learning Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We've created a learning experience that's designed to help you succeed. Here's what makes Learnify different.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Instructors",
                description: "Learn from industry experts who have hands-on experience in their fields",
                icon: "👨‍🏫",
              },
              {
                title: "Flexible Learning",
                description: "Study at your own pace, with lifetime access to course materials",
                icon: "⏰",
              },
              {
                title: "Practical Projects",
                description: "Apply what you learn with real-world projects that build your portfolio",
                icon: "💼",
              },
              {
                title: "Career Support",
                description: "Get guidance on career paths and job opportunities in your field",
                icon: "🚀",
              },
              {
                title: "Community",
                description: "Join a community of learners and instructors for support and networking",
                icon: "👥",
              },
              {
                title: "Certificates",
                description: "Earn verifiable certificates that showcase your new skills to employers",
                icon: "🏆",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 px-3 py-1 bg-learnify-50 dark:bg-learnify-900/30 text-learnify-600 dark:text-learnify-400 border-none">
              Browse by Category
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Top Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find the perfect course for you, with topics ranging from programming to business to design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCategories.map((category) => (
              <Link to={`/category/${category.name.toLowerCase()}`} key={category.name}>
                <div className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-full transition-transform duration-500 group-hover:scale-110"></div>
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} courses</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 px-3 py-1 bg-learnify-50 dark:bg-learnify-900/30 text-learnify-600 dark:text-learnify-400 border-none">
              Student Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Thousands of students have transformed their careers with Learnify. Here are some of their stories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-learnify-600 to-learnify-800 dark:from-learnify-800 dark:to-learnify-900">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-white/80 mb-8">
              Join thousands of students who are already learning and growing with Learnify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-white text-learnify-600 hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 px-6 py-6 text-lg w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-6 text-lg w-full sm:w-auto">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
