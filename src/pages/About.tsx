import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Users, Award, Target } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Students Enrolled", value: "50,000+", icon: Users },
    { label: "Expert Instructors", value: "200+", icon: Award },
    { label: "Course Completion Rate", value: "94%", icon: CheckCircle2 },
    { label: "Average Rating", value: "4.8/5", icon: Target },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Former tech executive with 15 years in education technology."
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "Product strategist focused on creating exceptional learning experiences."
    },
    {
      name: "Dr. Emily Williams",
      role: "Chief Learning Officer",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Educational psychologist and curriculum design expert."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-background to-muted/50">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-none">
              About Learnify
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Empowering learners to achieve their <span className="text-transparent bg-clip-text bg-gradient-to-r from-learnify-600 to-learnify-800">full potential</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We believe that quality education should be accessible to everyone, everywhere. 
              Our mission is to democratize learning and help millions of people build the skills they need to succeed.
            </p>
            <Link to="/courses">
              <Button className="bg-learnify-600 hover:bg-learnify-700 text-white px-8 py-6 text-lg">
                Explore Our Courses
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16 bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              To create a world where anyone can learn anything, anywhere, anytime. We're committed to 
              providing high-quality, practical education that directly translates to career success and personal growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="bg-learnify-100 dark:bg-learnify-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-learnify-600 dark:text-learnify-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Quality First</h3>
                <p className="text-muted-foreground">Expert-curated content that meets industry standards and real-world demands.</p>
              </div>
              <div className="p-6">
                <div className="bg-learnify-100 dark:bg-learnify-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-learnify-600 dark:text-learnify-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Community Driven</h3>
                <p className="text-muted-foreground">Learn alongside thousands of motivated students from around the world.</p>
              </div>
              <div className="p-6">
                <div className="bg-learnify-100 dark:bg-learnify-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-learnify-600 dark:text-learnify-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Career Focused</h3>
                <p className="text-muted-foreground">Practical skills and projects that directly advance your career goals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 py-16 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                Passionate educators and industry experts dedicated to your success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-card-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 bg-gradient-to-r from-learnify-600 to-learnify-800">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join our community of learners and start building the skills you need for tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-white text-learnify-600 hover:bg-gray-100 px-8 py-6 text-lg">
                  Browse Courses
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Sign Up Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}