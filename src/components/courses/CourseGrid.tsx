
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/types/course';

interface CourseGridProps {
  isLoading: boolean;
  courses: Course[];
  clearFilters: () => void;
}

export default function CourseGrid({ isLoading, courses, clearFilters }: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-5 bg-white">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find any courses that match your current filters. Try adjusting your search criteria.
        </p>
        <Button 
          variant="outline" 
          className="border-learnify-600 text-learnify-600 hover:bg-learnify-50"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <CourseCard 
            key={course.id} 
            course={course}
            className={`fade-in-delay-${index % 3 + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
