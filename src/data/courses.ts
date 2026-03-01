
import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "course-1",
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    category: "development",
    level: "All Levels",
    price: 129.99,
    salePrice: 94.99,
    rating: 4.8,
    ratingCount: 3245,
    studentsCount: 12436,
    duration: "63h 30m",
    lectureCount: 245,
    description: "Master HTML, CSS, JavaScript, React, Node.js and more. This comprehensive bootcamp takes you from beginner to advanced developer through hands-on projects and real-world applications. By the end of this course, you'll have the skills to build responsive websites and dynamic web applications that can serve as the foundation for your development career.",
    shortDescription: "Learn web development from scratch and build real-world projects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    featured: true,
    bestseller: true,
    lastUpdated: "April 2023",
    language: "English",
    topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Express", "API Integration"],
    whatYouWillLearn: [
      "Build responsive websites using HTML5, CSS3, and modern JavaScript",
      "Develop full-stack web applications with React and Node.js",
      "Create RESTful APIs and connect to databases",
      "Implement authentication and security best practices",
      "Deploy applications to production environments"
    ]
  },
  {
    id: "course-2",
    title: "Modern UI/UX Design Masterclass",
    slug: "modern-ui-ux-design-masterclass",
    instructor: "Alex Chen",
    instructorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    category: "design",
    level: "Intermediate",
    price: 89.99,
    salePrice: 69.99,
    rating: 4.7,
    ratingCount: 1879,
    studentsCount: 8932,
    duration: "42h 15m",
    lectureCount: 132,
    description: "Learn professional UI/UX design techniques for crafting beautiful and functional digital experiences. This masterclass covers everything from design principles to advanced prototyping in Figma. You'll develop a designer's eye and the technical skills to create interfaces that users love.",
    shortDescription: "Create stunning user interfaces and exceptional user experiences.",
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    featured: true,
    bestseller: false,
    lastUpdated: "May 2023",
    language: "English",
    topics: ["UI Design", "UX Design", "Figma", "Wireframing", "Prototyping", "Design Systems", "User Research"],
    whatYouWillLearn: [
      "Design beautiful and functional user interfaces",
      "Create wireframes and interactive prototypes in Figma",
      "Understand user-centered design principles",
      "Develop consistent design systems and style guides",
      "Conduct usability testing and iterate based on feedback"
    ]
  },
  {
    id: "course-3",
    title: "Digital Marketing Strategy & Analytics",
    slug: "digital-marketing-strategy-analytics",
    instructor: "Michael Rodriguez",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "marketing",
    level: "Intermediate",
    price: 99.99,
    rating: 4.6,
    ratingCount: 1425,
    studentsCount: 6731,
    duration: "38h 45m",
    lectureCount: 156,
    description: "Master digital marketing strategies to grow businesses and drive measurable results. This course combines theory with practical tools for SEO, social media marketing, email campaigns, and analytics. You'll learn to create data-driven marketing campaigns that convert.",
    shortDescription: "Learn effective digital marketing strategies and measure their impact.",
    thumbnailUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec",
    featured: false,
    bestseller: true,
    lastUpdated: "March 2023",
    language: "English",
    topics: ["SEO", "Social Media Marketing", "Email Marketing", "Content Marketing", "Google Analytics", "PPC", "Conversion Optimization"],
    whatYouWillLearn: [
      "Create comprehensive digital marketing strategies",
      "Optimize websites for better search engine rankings",
      "Build effective social media and email marketing campaigns",
      "Analyze marketing performance with analytics tools",
      "Calculate ROI and optimize marketing budget allocation"
    ]
  },
  {
    id: "course-4",
    title: "Business Leadership & Management",
    slug: "business-leadership-management",
    instructor: "Dr. Emily Williams",
    instructorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    category: "business",
    level: "Advanced",
    price: 119.99,
    salePrice: 89.99,
    rating: 4.9,
    ratingCount: 2156,
    studentsCount: 7432,
    duration: "45h 20m",
    lectureCount: 178,
    description: "Develop essential skills for effective leadership and management in today's complex business environment. From strategic thinking to team management, this course provides tools and frameworks to excel in leadership roles. Learn from real-world case studies and practical exercises.",
    shortDescription: "Develop leadership skills to successfully manage teams and drive business growth.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    featured: true,
    bestseller: false,
    lastUpdated: "June 2023",
    language: "English",
    topics: ["Leadership", "Management", "Team Building", "Strategic Planning", "Decision Making", "Change Management", "Emotional Intelligence"],
    whatYouWillLearn: [
      "Lead teams effectively using various leadership styles",
      "Develop strategic thinking and planning capabilities",
      "Manage organizational change and overcome resistance",
      "Build high-performing teams through motivation and feedback",
      "Make data-driven decisions aligned with business objectives"
    ]
  },
  {
    id: "course-5",
    title: "iOS App Development with Swift",
    slug: "ios-app-development-with-swift",
    instructor: "David Kim",
    instructorAvatar: "https://randomuser.me/api/portraits/men/11.jpg",
    category: "development",
    level: "Intermediate",
    price: 109.99,
    salePrice: 84.99,
    rating: 4.7,
    ratingCount: 1682,
    studentsCount: 5324,
    duration: "51h 45m",
    lectureCount: 192,
    description: "Build professional iOS applications using Swift and SwiftUI. From app architecture to publishing on the App Store, this comprehensive course covers all aspects of iOS development. You'll create multiple app projects that can be added to your portfolio.",
    shortDescription: "Create iOS apps using Swift and publish them on the App Store.",
    thumbnailUrl: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265",
    featured: false,
    bestseller: true,
    lastUpdated: "May 2023",
    language: "English",
    topics: ["Swift", "SwiftUI", "UIKit", "Xcode", "iOS SDK", "Core Data", "Firebase", "API Integration"],
    whatYouWillLearn: [
      "Write clean and efficient Swift code for iOS applications",
      "Design responsive interfaces with SwiftUI and UIKit",
      "Implement data persistence using Core Data and Firebase",
      "Integrate third-party APIs and services into your apps",
      "Prepare and publish apps to the Apple App Store"
    ]
  },
  {
    id: "course-6",
    title: "Data Science & Machine Learning Bootcamp",
    slug: "data-science-machine-learning-bootcamp",
    instructor: "Robert Patel",
    instructorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    category: "development",
    level: "Advanced",
    price: 139.99,
    rating: 4.8,
    ratingCount: 2478,
    studentsCount: 9873,
    duration: "68h 30m",
    lectureCount: 224,
    description: "Master data science, machine learning, and deep learning with Python. This comprehensive bootcamp covers statistical analysis, data visualization, machine learning algorithms, and deep learning with TensorFlow and PyTorch. By completing this course, you'll be able to build predictive models and AI systems.",
    shortDescription: "Learn to analyze data and build machine learning models with Python.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d",
    featured: true,
    bestseller: true,
    lastUpdated: "April 2023",
    language: "English",
    topics: ["Python", "Statistics", "Data Analysis", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Computer Vision"],
    whatYouWillLearn: [
      "Perform data cleaning, analysis, and visualization with Python",
      "Build and evaluate machine learning models for prediction",
      "Develop neural networks for image and text processing",
      "Implement natural language processing solutions",
      "Deploy machine learning models to production environments"
    ]
  },
  {
    id: "course-7",
    title: "Financial Planning & Investment Strategies",
    slug: "financial-planning-investment-strategies",
    instructor: "Lisa Thompson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/24.jpg",
    category: "business",
    level: "All Levels",
    price: 94.99,
    salePrice: 74.99,
    rating: 4.6,
    ratingCount: 1235,
    studentsCount: 4876,
    duration: "32h 15m",
    lectureCount: 124,
    description: "Learn practical approaches to financial planning, investment, and wealth building. This course provides in-depth knowledge of financial markets, investment vehicles, retirement planning, and risk management. You'll create your own financial plan and investment strategy aligned with your goals.",
    shortDescription: "Build financial literacy and develop effective investment strategies.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579621970795-87facc2f976d",
    featured: false,
    bestseller: false,
    lastUpdated: "February 2023",
    language: "English",
    topics: ["Personal Finance", "Investment", "Retirement Planning", "Stock Market", "Real Estate", "Tax Planning", "Risk Management"],
    whatYouWillLearn: [
      "Create a comprehensive personal financial plan",
      "Build and manage a diversified investment portfolio",
      "Understand different investment vehicles and markets",
      "Develop strategies for retirement and tax efficiency",
      "Protect assets through appropriate risk management"
    ]
  },
  {
    id: "course-8",
    title: "Graphic Design for Beginners to Pro",
    slug: "graphic-design-beginners-to-pro",
    instructor: "James Wilson",
    instructorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    category: "design",
    level: "Beginner",
    price: 84.99,
    salePrice: 64.99,
    rating: 4.7,
    ratingCount: 1892,
    studentsCount: 7632,
    duration: "46h 20m",
    lectureCount: 165,
    description: "Start with design fundamentals and progress to advanced techniques in Adobe Creative Suite. This comprehensive course covers typography, color theory, layout design, and branding. You'll complete practical projects that build your portfolio and prepare you for a career in graphic design.",
    shortDescription: "Master graphic design from fundamentals to advanced techniques.",
    thumbnailUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
    featured: false,
    bestseller: true,
    lastUpdated: "March 2023",
    language: "English",
    topics: ["Design Principles", "Typography", "Color Theory", "Adobe Photoshop", "Adobe Illustrator", "Logo Design", "Brand Identity"],
    whatYouWillLearn: [
      "Understand fundamental design principles and visual communication",
      "Create professional designs using Adobe Photoshop and Illustrator",
      "Develop brand identities including logos and style guides",
      "Design for print and digital media with proper specifications",
      "Build a professional portfolio showcasing various design projects"
    ]
  }
];

export const getFeaturedCourses = (): Course[] => {
  return courses.filter(course => course.featured);
};

export const getBestsellerCourses = (): Course[] => {
  return courses.filter(course => course.bestseller);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(course => course.slug === slug);
};

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getRelatedCourses = (currentCourseId: string, category: string, limit = 4): Course[] => {
  return courses
    .filter(course => course.id !== currentCourseId && course.category === category)
    .slice(0, limit);
};

export const searchCourses = (query: string): Course[] => {
  const lowercaseQuery = query.toLowerCase();
  return courses.filter(
    course => 
      course.title.toLowerCase().includes(lowercaseQuery) || 
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.topics.some(topic => topic.toLowerCase().includes(lowercaseQuery))
  );
};
