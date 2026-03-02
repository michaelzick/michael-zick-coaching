
import { Link } from 'react-router-dom';
import { Mail } from '@/lib/icons';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-12 border-t-2 border-foreground relative overflow-hidden">
      <div className="absolute -left-8 top-0 h-28 w-28 bg-accent opacity-90" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className="absolute -right-10 bottom-0 h-36 w-36 bg-primary/80" style={{ clipPath: 'polygon(0 22%, 100% 0, 82% 100%, 12% 80%)' }} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <span className="text-lg font-bold text-secondary-foreground tracking-[0.12em] uppercase bg-accent text-accent-foreground border-2 border-foreground px-3 py-1 inline-block">
                MICHAEL ZICK
              </span>
            </Link>
            <p className="text-secondary-foreground/85 mb-6 font-medium">
              Nice Guy Recovery Coach. Helping men break the addiction to approval and build authentic, fulfilling lives.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6 tracking-[0.08em]">Programs</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  All Programs
                </Link>
              </li>
              <li>
                <Link to="/course/complete-nice-guy-recovery-system" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  Nice Guy Recovery
                </Link>
              </li>
              <li>
                <Link to="/course/boundaries-communication-masterclass" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  Boundaries & Communication
                </Link>
              </li>
              <li>
                <Link to="/course/relationship-frame-workshop" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  Relationship Skills
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6 tracking-[0.08em]">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  About Michael
                </Link>
              </li>
              <li>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  Book a Free Session
                </a>
              </li>
              <li>
                <a href="https://www.michaelzick.com" target="_blank" rel="noopener noreferrer" className="cubist-link text-secondary-foreground/85 hover:text-accent transition-colors uppercase font-semibold tracking-[0.05em]">
                  Main Website
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6 tracking-[0.08em]">Contact</h3>
            <p className="text-secondary-foreground/85 mb-4 font-medium">Ready to start your recovery? Reach out.</p>
            <div className="flex items-center space-x-3 mb-4 border-2 border-foreground bg-background text-foreground px-3 py-2 w-fit">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-semibold">coach@michaelzick.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-foreground mt-12 pt-8">
          <p className="text-secondary-foreground/85 text-center text-sm font-semibold uppercase tracking-[0.06em]">
            © {new Date().getFullYear()} Michael Zick Coaching. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
