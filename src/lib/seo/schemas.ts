const SITE_URL = import.meta.env.VITE_SITE_URL || "";
const SITE_NAME = "Michael Zick Coaching";

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL || "https://michaelzick.com",
    description: "Nice Guy Recovery Coaching for Men",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/courses?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationSchema(socialLinks: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL || "https://michaelzick.com",
    logo: `${SITE_URL}/og-image.jpg`,
    description:
      "Coaching programs for men recovering from Nice Guy Syndrome, approval addiction, and people-pleasing patterns.",
    founder: {
      "@type": "Person",
      name: "Michael Zick",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://calendly.com",
    },
    sameAs: [
      "https://www.michaelzick.com",
      ...socialLinks,
    ],
  };
}

export function buildPersonSchema(socialLinks: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael Zick",
    jobTitle: "Nice Guy Recovery Coach",
    description:
      "Nice Guy Recovery Coach helping men break free from approval addiction, people-pleasing, codependency, and anxious attachment through structured coaching programs.",
    url: `${SITE_URL}/about`,
    sameAs: [
      "https://www.michaelzick.com",
      ...socialLinks,
    ],
    knowsAbout: [
      "Nice Guy Syndrome",
      "Nice Guy Recovery",
      "Approval Addiction",
      "People-Pleasing",
      "Codependency",
      "Anxious Attachment",
      "Avoidant Attachment",
      "Boundaries",
      "Self-Esteem",
      "Men's Coaching",
      "Covert Contracts",
      "Displeasure Tolerance",
    ],
  };
}

interface CourseSchemaInput {
  title: string;
  description: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  rating: number;
  ratingCount: number;
  thumbnailUrl: string;
  duration: string;
  lectureCount: number;
  language: string;
  category: string;
}

export function buildCourseSchema(course: CourseSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${SITE_URL}/course/${course.slug}`,
    image: course.thumbnailUrl,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL || "https://michaelzick.com",
    },
    instructor: {
      "@type": "Person",
      name: "Michael Zick",
      jobTitle: "Nice Guy Recovery Coach",
    },
    offers: {
      "@type": "Offer",
      price: course.salePrice ?? course.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/course/${course.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      ratingCount: course.ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
    inLanguage: course.language || "en",
    courseMode: "online",
    isAccessibleForFree: false,
    numberOfCredits: course.lectureCount,
    about: course.category.replace(/-/g, " "),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

interface CourseListItem {
  title: string;
  slug: string;
}

export function buildItemListSchema(courses: CourseListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: `${SITE_URL}/course/${course.slug}`,
    })),
  };
}
