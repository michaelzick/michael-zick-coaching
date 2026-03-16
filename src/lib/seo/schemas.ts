const SITE_URL = import.meta.env.VITE_SITE_URL || "";
const SITE_NAME = "Nice Guy University";

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL || "https://michaelzick.com",
    description: "A multi-coach recovery platform for men.",
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
      "A multi-coach platform with courses for men recovering from Nice Guy Syndrome, approval addiction, and people-pleasing patterns.",
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

interface PersonSchemaInput {
  name: string;
  title: string;
  description: string;
  url: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

export function buildPersonSchema({
  name,
  title,
  description,
  url,
  sameAs = [],
  knowsAbout = [],
}: PersonSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: title,
    description,
    url: `${SITE_URL}${url}`,
    sameAs,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : [
      "Nice Guy Syndrome",
      "Nice Guy Recovery",
      "Approval Addiction",
      "People-Pleasing",
      "Boundaries",
      "Men's Coaching",
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
  instructorName?: string;
  instructorTitle?: string;
  instructorUrl?: string | null;
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
      name: course.instructorName ?? "Nice Guy University Coach",
      jobTitle: course.instructorTitle ?? "Coach",
      ...(course.instructorUrl ? { url: `${SITE_URL}${course.instructorUrl}` } : {}),
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
