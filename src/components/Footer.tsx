
import { Link } from 'react-router-dom';
import { Mail } from '@/lib/icons';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary pb-10 pt-14 sm:pb-12 sm:pt-16">
      <div className="absolute -left-[1.4rem] top-0 h-[4.9rem] w-[4.9rem] bg-foreground" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className="absolute -right-10 bottom-0 z-10 hidden h-36 w-36 bg-foreground/20 md:block" style={{ clipPath: 'polygon(0 22%, 100% 0, 82% 100%, 12% 80%)' }} />
      <div className="container mx-auto mobile-shell content-stack">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link to="/" className="mb-4 flex items-center space-x-2 sm:mb-6">
              <span className="cta-elevated-on-hover whitespace-nowrap rounded-lg text-base lg:text-sm xl:text-base font-bold text-background tracking-[0.03em] uppercase bg-foreground px-3 py-1 inline-block">
                NICE GUY UNIVERSITY
              </span>
            </Link>
            <p className="mb-4 font-medium text-secondary-foreground/85 sm:mb-6">
              A multi-coach platform for men ready to confront shame, build boundaries, and stop living through approval.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-[0.03em] text-secondary-foreground sm:mb-6">Courses</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/courses" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/course/complete-nice-guy-recovery-system" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  Nice Guy Recovery
                </Link>
              </li>
              <li>
                <Link to="/course/boundaries-communication-masterclass" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  Boundaries & Communication
                </Link>
              </li>
              <li>
                <Link to="/course/relationship-frame-workshop" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  Relationship Skills
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-[0.03em] text-secondary-foreground sm:mb-6">Explore</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/resources" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  Guides & Articles
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="cubist-link text-secondary-foreground/85 hover:text-foreground/70 transition-colors uppercase font-semibold tracking-[0.03em]">
                  Our Coaches
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-[0.03em] text-secondary-foreground sm:mb-6">Contact</h3>
            <p className="mb-3 font-medium text-secondary-foreground/85 sm:mb-4">Questions about the platform or a course? Reach out.</p>
            <div className="mb-4 flex w-full max-w-full items-center space-x-3 bg-background px-3 py-2 text-foreground sm:w-fit">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="min-w-0 break-all font-semibold">coach@michaelzick.com</span>
            </div>
          </div>
        </div>
        
        <div className="relative mt-8 pt-6 sm:mt-12 sm:pt-8">
          <div className="absolute inset-x-0 top-0 z-0 border-t border-border" />
          <p className="relative z-20 text-secondary-foreground/85 text-center text-sm font-semibold uppercase tracking-[0.04em]">
            © {new Date().getFullYear()} Nice Guy University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
