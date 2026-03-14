
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { buildPersonSchema, buildFAQSchema } from "@/lib/seo/schemas";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Shield, Heart, Mountain } from '@/lib/icons';

export default function About() {
  const pillars = [
    { title: "Radical Honesty", description: "Stop performing. Start telling the truth — to yourself and everyone around you.", icon: Target },
    { title: "Displeasure Tolerance", description: "Build the capacity to handle others' negative reactions without caving.", icon: Shield },
    { title: "Standards Over Scarcity", description: "Make choices from abundance and self-respect, not fear of being alone.", icon: Heart },
    { title: "Staying in the Discomfort", description: "Growth happens in the gap between your old patterns and new behavior.", icon: Mountain },
  ];

  const aboutFAQs = [
    {
      question: "What is a Nice Guy Recovery Coach?",
      answer: "A Nice Guy Recovery Coach specializes in helping men identify and break free from people-pleasing patterns, approval addiction, and codependent behaviors. Unlike general life coaching, this work focuses specifically on the patterns described in Nice Guy Syndrome — including covert contracts, conflict avoidance, and suppressed anger.",
    },
    {
      question: "How does your coaching work?",
      answer: "Michael's coaching is delivered through structured online programs with video lessons, exercises, and frameworks you can apply immediately. Each program targets a specific area of Nice Guy recovery — from boundaries and communication to dating and self-worth. Programs are self-paced with lifetime access.",
    },
    {
      question: "What results do clients typically see?",
      answer: "Clients typically report being able to set boundaries without guilt, communicate directly instead of hinting, stop building covert contracts, handle others' displeasure without caving, and build relationships based on authenticity rather than performance.",
    },
    {
      question: "Do you offer one-on-one coaching?",
      answer: "Yes. In addition to the self-paced programs, Michael offers one-on-one coaching sessions for men who want personalized guidance. You can book a free discovery session to discuss your situation and see which option is the best fit.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="About Michael Zick"
        description="Michael Zick is a Nice Guy Recovery Coach helping men break free from approval addiction, people-pleasing, codependency, and anxious attachment through structured coaching programs."
        canonicalPath="/about"
        ogType="profile"
      />
      <JsonLd data={buildPersonSchema()} />
      <JsonLd data={buildFAQSchema(aboutFAQs)} />
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 bg-muted">
          <div className="container mx-auto text-center max-w-4xl">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">About</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Nice Guy University
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nice Guy Recovery Coach helping men break free from approval addiction, build authentic relationships, and live from their own values.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-4 py-20 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6">The Story</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  For most of my life, I was a textbook Nice Guy. I said yes when I meant no. I performed for approval. I built covert contracts in every relationship — and then resented people when they didn't hold up their end of a deal they never agreed to.
                </p>
                <p>
                  The turning point came when I realized that my "niceness" wasn't generosity — it was a survival strategy I'd built as a kid to avoid conflict and earn love. Once I saw the pattern, I couldn't unsee it.
                </p>
                <p>
                  I spent years doing the deep work: examining my parental relationships, learning to tolerate displeasure, setting boundaries I'd never set before, and building an identity based on my actual values — not the ones I thought would make people like me.
                </p>
                <p>
                  Now I coach other men through the same process. Not with vague platitudes about "just be yourself," but with a structured framework that creates real, lasting change.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coaching Philosophy */}
        <section className="px-4 py-20 bg-muted">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Philosophy</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The Four Pillars</h2>
              <p className="text-muted-foreground text-lg">
                Every program is built on these core principles.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div key={index} className="bg-card border-2 border-foreground p-8 cubist-frame">
                    <div className="bg-primary/10 w-12 h-12 border-2 border-foreground flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-20 bg-background">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Questions</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {aboutFAQs.map((faq, index) => (
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

        {/* CTA */}
        <section className="relative px-4 py-20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80"
            alt="River valley representing the path from people-pleasing to authentic living"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-mz-slate/85" />
          <div className="container mx-auto text-center max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Book a free session and let's figure out where you are — and where you need to go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Book a Free Session
                </Button>
              </a>
              <Link to="/courses">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg">
                  Browse Programs
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
