
import { Link } from "react-router-dom";
import { ChevronRight } from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { buildWebSiteSchema, buildOrganizationSchema, buildFAQSchema } from "@/lib/seo/schemas";
import { useFeaturedCourses } from "@/hooks/use-courses";

export default function Index() {
  const { data: featuredCourses = [] } = useFeaturedCourses();

  const framework = [
    {
      step: "01",
      title: "Confront Your Toxic Shame",
      description: "Face the core wound driving your people-pleasing so you can stop organizing your life around being acceptable.",
    },
    {
      step: "02",
      title: "Release the Victim Identity",
      description: "Drop the story that your life changes when everyone else finally gets it and start owning your decisions now.",
    },
    {
      step: "03",
      title: "Build Masculine Boundaries",
      description: "Set limits that protect your energy, standards, and relationships without collapsing into guilt or performance.",
    },
  ];

  const homeFAQs = [
    {
      question: "What is Nice Guy Syndrome?",
      answer: "Nice Guy Syndrome is a set of behavioral patterns where men suppress their own needs, avoid conflict, and seek approval from others in an attempt to be liked. It often stems from childhood conditioning and leads to resentment, passive-aggressive behavior, and unfulfilling relationships.",
    },
    {
      question: "How do I know if I'm a Nice Guy?",
      answer: "Common signs include people-pleasing, difficulty saying no, avoiding conflict at all costs, building covert contracts (doing things expecting something in return without saying so), suppressing anger, and feeling resentful when your efforts aren't reciprocated.",
    },
    {
      question: "What is approval addiction?",
      answer: "Approval addiction is the compulsive need to seek validation and approval from others. It drives people-pleasing behavior, fear of rejection, and the inability to make decisions based on your own values rather than what others might think of you.",
    },
    {
      question: "Can Nice Guy patterns actually change?",
      answer: "Yes. Nice Guy patterns are learned behaviors, not personality traits. With the right framework and consistent practice, men can break the cycle of approval-seeking, build authentic boundaries, and develop genuine confidence. Most clients see significant changes within 90 days.",
    },
    {
      question: "What makes this different from reading self-help books?",
      answer: "Books provide information but not transformation. Most men read No More Mr Nice Guy and understand the concepts, but nothing changes because reading alone doesn't rewire deeply ingrained patterns. These programs provide structured exercises, accountability, and a proven framework that creates lasting behavioral change.",
    },
    {
      question: "How long does Nice Guy recovery take?",
      answer: "Most men start seeing meaningful shifts within 4-8 weeks of consistent work. Full recovery from deeply ingrained patterns typically takes 3-6 months. The programs are self-paced with lifetime access, so you can work at whatever speed suits you.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Recovery Programs for Men"
        description="Nice Guy University is a multi-coach platform for men ready to break approval addiction, build boundaries, and do real recovery work through structured programs."
        canonicalPath="/"
      />
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildFAQSchema(homeFAQs)} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[72vh] items-center overflow-hidden mobile-shell pb-24 pt-32 sm:min-h-[36rem]">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt="Mountain landscape representing the journey of personal growth and Nice Guy recovery"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-mz-slate/80" />
        <div className="container mx-auto relative z-10 content-stack">
          <div className="max-w-4xl space-y-6">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm">
              Multi-Coach Recovery Platform
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Stop performing.<br />Start doing the work.
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Nice Guy University connects you with coaches and programs designed to break shame, approval addiction, weak boundaries, and the patterns keeping you stuck.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/courses" className="w-full sm:w-auto">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                  Browse Programs
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/coaches" className="w-full sm:w-auto">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  Meet Our Coaches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Recovery Framework */}
      <section className="bg-background py-20 mobile-shell">
        <div className="container mx-auto content-stack">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              The Framework
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three pillars that change how you live
            </h2>
            <p className="text-muted-foreground text-lg">
              Every coach on the platform teaches toward the same outcome: more honesty, more ownership, more standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {framework.map((item) => (
              <div key={item.step} className="group elevated-on-hover relative bg-card p-4 transition-all duration-300 hover:border-primary sm:p-6 lg:p-8">
                <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{item.step}</span>
                <h3 className="text-xl font-bold text-card-foreground mt-4 mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="bg-muted mobile-shell pb-14 pt-20 md:pb-20">
        <div className="container mx-auto content-stack">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">Programs</p>
              <h2 className="text-3xl font-bold text-foreground">Featured Programs</h2>
            </div>
            <Link to="/courses" className="text-primary hover:text-primary/80 font-medium flex items-center">
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

      {/* FAQ Section */}
      <section className="bg-muted py-20 mobile-shell">
        <div className="container mx-auto max-w-4xl content-stack">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {homeFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="mb-4 overflow-hidden bg-card">
                <AccordionTrigger className="px-4 py-4 text-left hover:bg-muted sm:px-6">
                  <span className="font-bold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 sm:px-6">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden mobile-shell pb-20 pt-14 md:pt-20">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
          alt="Forest landscape symbolizing clarity and new beginnings after breaking free from people-pleasing patterns"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-mz-slate/85" />
        <div className="container mx-auto relative z-10 content-stack">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find the coach and program that matches your next step.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Start with the pain point that is costing you the most. Then do the work until your behavior changes, not just your vocabulary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/coaches" className="w-full sm:w-auto">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  Meet Our Coaches
                </Button>
              </Link>
              <Link to="/courses" className="w-full sm:w-auto">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                  Browse Programs
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
