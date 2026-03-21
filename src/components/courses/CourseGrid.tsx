
import { Loader2, Search } from '@/lib/icons';
import { Button } from '@/components/ui/button';
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
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      </div>
    );
  }
  
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted mb-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">No courses found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find any courses that match your current filters. Try adjusting your search criteria.
        </p>
        <Button 
          variant="outline" 
          className="border-border text-foreground hover:bg-muted"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6 font-semibold tracking-normal">
        Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
      </p>
      
      <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2">
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
