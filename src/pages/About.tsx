
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Shield, Heart, Mountain } from '@/lib/icons';

export default function About() {
  const pillars = [
    { title: "Radical Honesty", description: "Stop performing. Start telling the truth — to yourself and everyone around you.", icon: Target },
    { title: "Displeasure Tolerance", description: "Build the capacity to handle others' negative reactions without caving.", icon: Shield },
    { title: "Standards Over Scarcity", description: "Make choices from abundance and self-respect, not fear of being alone.", icon: Heart },
    { title: "Staying in the Discomfort", description: "Growth happens in the gap between your old patterns and new behavior.", icon: Mountain },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 bg-muted">
          <div className="container mx-auto text-center max-w-4xl">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">About</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Michael Zick
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

        {/* CTA */}
        <section className="relative px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80')" }} />
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
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
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
