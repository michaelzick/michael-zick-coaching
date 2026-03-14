
import { Link } from "react-router-dom";
import { ChevronRight, Quote } from '@/lib/icons';
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
    { step: "01", title: "Spot the Bid", description: "Recognize when you're seeking approval or performing for validation in real time." },
    { step: "02", title: "Cancel the Covert Contract", description: "Identify the hidden deals you're making and stop the manipulation cycle." },
    { step: "03", title: "Build Displeasure Tolerance", description: "Learn to sit with others' negative reactions without collapsing or caving." },
    { step: "04", title: "Choose from Standards", description: "Make decisions based on your values, not fear of rejection or abandonment." },
  ];

  const testimonials = [
    {
      name: "Ryan I.",
      text: "Working with Michael completely changed how I show up in my relationships. I stopped performing and started being real. My marriage has never been better.",
    },
    {
      name: "Doug S.",
      text: "I didn't even realize I was a Nice Guy until Michael broke it down. Now I have boundaries, I communicate directly, and I don't resent the people I love anymore.",
    },
    {
      name: "Greg C.",
      text: "The displeasure tolerance work was a game-changer. I used to bend over backwards to avoid conflict. Now I can hold my ground and still feel calm.",
    },
    {
      name: "Earl M.",
      text: "Michael's coaching gave me the tools to finally deal with the patterns I picked up from my childhood. I feel like I'm living my own life for the first time.",
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
        title="Nice Guy Recovery Coaching for Men"
        description="Break the addiction to approval. Coaching programs for men struggling with people-pleasing, codependency, boundaries, and Nice Guy patterns. Build confidence and live authentically."
        canonicalPath="/"
      />
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildFAQSchema(homeFAQs)} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt="Mountain landscape representing the journey of personal growth and Nice Guy recovery"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-mz-slate/80" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm">
              Nice Guy Recovery Coach
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Break the Addiction<br />to Approval
            </h1>
            <p className="text-lg text-white/70 max-w-xl">
              Stop people-pleasing. Set boundaries. Build an authentic life based on your values — not the fear of someone else's displeasure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg w-full sm:w-auto">
                  Explore Programs
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg w-full sm:w-auto">
                  Book a Free Session
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Recovery Framework */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              The Framework
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Approval Addiction Recovery Loop
            </h2>
            <p className="text-muted-foreground text-lg">
              Four steps to break the cycle. Each one builds on the last.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {framework.map((item) => (
              <div key={item.step} className="relative p-8 bg-card border-2 border-foreground hover:border-primary transition-all duration-300 group cubist-frame elevated-on-hover">
                <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{item.step}</span>
                <h3 className="text-xl font-bold text-card-foreground mt-4 mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
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

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Client Results
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Men. Real Recovery.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-card border-2 border-foreground p-8 hover:border-primary transition-colors cubist-frame elevated-on-hover">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-card-foreground mb-6 leading-relaxed">"{t.text}"</p>
                <p className="font-semibold text-primary">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-3xl">
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
              <AccordionItem key={index} value={`faq-${index}`} className="border-2 border-foreground mb-4 overflow-hidden bg-card cubist-frame">
                <AccordionTrigger className="px-6 py-4 hover:bg-muted text-left">
                  <span className="font-bold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
          alt="Forest landscape symbolizing clarity and new beginnings after breaking free from people-pleasing patterns"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-mz-slate/85" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Stop Being the Nice Guy?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Book a free session and find out exactly where you are in the recovery process — and what to do next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg w-full sm:w-auto">
                  Book a Free Session
                </Button>
              </a>
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg w-full sm:w-auto">
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
