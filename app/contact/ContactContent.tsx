'use client';

import { useRef, useState, useEffect } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import ContactForm from '../../components/ContactForm';
import { FadeInSection } from '../../components/FadeInSection';
import Image from 'next/image';
import { TestimonialsCarouselSection } from '../../components/sections/TestimonialsCarouselSection';
import TrackedCtaLink from '../../components/TrackedCtaLink';

export default function ContactContent() {
  const bookingCtaLabel = 'Book a Strategy Call';
  const testimonialsSectionRef = useRef<HTMLElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialsSectionRef.current) {
      observer.observe(testimonialsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="page-top-offset bg-default-grey text-white px-6 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-10 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
              Contact Michael
            </h1>
          </FadeInSection>
          <FadeInSection className="grid grid-cols-1 min-[930px]:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Column 1: Image (Left) */}
            <div className="hidden min-[930px]:block min-[930px]:col-span-3 lg:col-span-3 order-1 h-full">
              <div className="relative h-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 min-h-[640px]">
                <Image
                  src="/img/gray-suit-hand-in-pocket-warm-2.webp"
                  alt="Michael Zick standing in a gray suit"
                  fill
                  className="object-cover"
                  sizes="(max-width: 929px) 100vw, 25vw"
                  priority
                />
              </div>
            </div>

            {/* Column 2: Contact Form (Middle) */}
            <div className="min-[930px]:col-span-6 lg:col-span-5 bg-light-grey text-black rounded-xl p-4 sm:p-10 lg:p-12 shadow-2xl ring-1 ring-black/5 order-2 min-[930px]:h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8 text-default-grey">Send Me a Message</h2>
              <ContactForm />
            </div>

            {/* Column 3: CTA (Right) */}
            <div className="min-[930px]:col-span-3 lg:col-span-4 flex flex-col justify-start gap-12 order-3">
              <div className="flex flex-col items-start gap-8">
                <p className="text-xl lg:text-2xl font-light leading-relaxed">
                  The best way to connect with Michael is to schedule a free 45-minute session,
                  where we&apos;ll discuss how to break your approval addiction and reclaim your internal authority.
                </p>
                <TrackedCtaLink
                  href="https://calendly.com/michaelzick/45min"
                  className="btn cta-unified !w-full text-center !px-6"
                  location="contact-sidebar"
                  label={bookingCtaLabel}
                  eventName="book_free_session_click"
                >
                  <span>{bookingCtaLabel}</span>
                  <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
                </TrackedCtaLink>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <TestimonialsCarouselSection
        sectionRef={testimonialsSectionRef}
        titleRef={testimonialsTitleRef}
        scrollMarginTop={0}
        isVisible={testimonialsVisible}
      />

      {/* Horizontal line between testimonials and footer */}
      <div className="w-full h-px bg-gray-300"></div>
    </div>
  );
}
