
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <span className="text-xl font-bold text-secondary-foreground tracking-tight">
                MICHAEL ZICK
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Nice Guy Recovery Coach. Helping men break the addiction to approval and build authentic, fulfilling lives.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6">Programs</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  All Programs
                </Link>
              </li>
              <li>
                <Link to="/course/complete-nice-guy-recovery-system" className="text-muted-foreground hover:text-primary transition-colors">
                  Nice Guy Recovery
                </Link>
              </li>
              <li>
                <Link to="/course/boundaries-communication-masterclass" className="text-muted-foreground hover:text-primary transition-colors">
                  Boundaries & Communication
                </Link>
              </li>
              <li>
                <Link to="/course/relationship-frame-workshop" className="text-muted-foreground hover:text-primary transition-colors">
                  Relationship Skills
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Michael
                </Link>
              </li>
              <li>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Book a Free Session
                </a>
              </li>
              <li>
                <a href="https://www.michaelzick.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Main Website
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-6">Contact</h3>
            <p className="text-muted-foreground mb-4">Ready to start your recovery? Reach out.</p>
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">coach@michaelzick.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8">
          <p className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} Michael Zick Coaching. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
