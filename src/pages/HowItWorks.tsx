import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Shield, Target, Users } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import SEOHead from '@/components/SEOHead';
import { buildFAQSchema, buildOrganizationSchema } from '@/lib/seo/schemas';

const steps = [
  {
    title: 'Browse Coaches',
    description: 'Explore different coaching styles, philosophies, and specialties so you can start with the person who fits your current season.',
    icon: Users,
  },
  {
    title: 'Pick a Course',
    description: 'Choose the course that matches the pattern you need to break now, whether that is shame, approval addiction, dating, or boundaries.',
    icon: BookOpen,
  },
  {
    title: 'Do the Work',
    description: 'Move through self-paced lessons, journal prompts, and applied exercises that turn insight into repeatable behavioral change.',
    icon: Target,
  },
];

const pillars = [
  {
    title: 'Confront Your Toxic Shame',
    description: 'Face the core wound driving your people-pleasing so you stop building a life around managing everyone else.',
    icon: Target,
  },
  {
    title: 'Release the Victim Identity',
    description: 'Stop waiting for other people to change first and start owning the choices that shape your life.',
    icon: Shield,
  },
  {
    title: 'Build Masculine Boundaries',
    description: 'Set limits that protect your time, energy, standards, and relationships without collapsing into guilt.',
    icon: BookOpen,
  },
];

const faqs = [
  {
    question: 'Who is Nice Guy University for?',
    answer: 'Nice Guy University is for men who are tired of living through approval, conflict avoidance, covert contracts, and low self-respect. Some start with dating problems, some with marriage, and some with identity. The common thread is that they are done performing.',
  },
  {
    question: 'Are the courses live or self-paced?',
    answer: 'The platform is built around self-paced courses you can start immediately. Each coach can also include booking links for men who want direct support after they understand the framework.',
  },
  {
    question: 'How do I choose the right course?',
    answer: 'Start with the pattern causing the most pain right now. If you are stuck people-pleasing, begin there. If your issue is dating, standards, or communication, choose the coach and course that address that problem directly.',
  },
  {
    question: 'Do I need one-on-one coaching first?',
    answer: 'No. Most men should start by doing the work inside a course. Coach booking is there when you want higher-touch support, not as a gate before you can begin.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="How It Works"
        description="Learn how Nice Guy University works: browse coaches, pick the right course, and do the work that breaks shame, approval addiction, and weak boundaries."
        canonicalPath="/how-it-works"
      />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildFAQSchema(faqs)} />
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        <section className="bg-muted py-16 mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="max-w-5xl">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">How It Works</p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                A platform for men who are ready to stop performing.
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mb-8">
                Nice Guy University brings together coaches and courses built around the same outcome: less shame, fewer covert contracts, stronger standards, and more honest action in your real life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/coaches" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    Meet Our Coaches
                  </Button>
                </Link>
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    Browse Courses
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="max-w-4xl mb-12">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">The Process</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Three steps. No fluff.</h2>
              <p className="text-lg text-muted-foreground">
                The platform is built to make starting simple and staying consistent realistic.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map(({ title, description, icon: Icon }, index) => (
                <div key={title} className="bg-card p-4 elevated-on-hover sm:p-6 lg:p-8">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-foreground mb-4">
                    Step {index + 1}
                  </p>
                  <div className="w-12 h-12 bg-muted flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-20 mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="max-w-4xl mb-12">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Core Work</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The three pillars of transformation</h2>
              <p className="text-lg text-muted-foreground">
                Different coaches teach with different voices, but the work keeps returning to the same foundations.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {pillars.map(({ title, description, icon: Icon }) => (
                <div key={title} className="bg-card p-4 sm:p-6 lg:p-8">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 mobile-shell">
          <div className="container mx-auto max-w-4xl content-stack">
            <div className="text-center mb-12">
              <p className="text-foreground font-semibold uppercase tracking-widest text-sm mb-4">Platform FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Common Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="mb-4 overflow-hidden bg-card">
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

        <section className="bg-secondary py-20 text-secondary-foreground mobile-shell">
          <div className="container mx-auto content-stack">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start where the pain is loudest.</h2>
              <p className="text-secondary-foreground/80 text-lg mb-8 max-w-2xl">
                You do not need another round of passive insight. Pick the coach, choose the course, and start acting differently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/coaches" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    Meet Our Coaches
                  </Button>
                </Link>
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
