
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, ShoppingCart } from '@/lib/icons';
import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export default function CourseCard({ course, className }: CourseCardProps) {
  const { addToCart, isInCart } = useCart();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const categoryLabel = course.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className={cn("course-card group bg-card overflow-hidden border-2 border-foreground transition-all duration-300 cubist-frame", className)}>
      <Link to={`/course/${course.slug}`} className="block relative pb-[56.25%] overflow-hidden">
        <img 
          src={`${course.thumbnailUrl}?auto=format&fit=crop&w=800&q=80`}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {course.bestseller && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Popular
          </Badge>
        )}
        {course.salePrice && course.salePrice < course.price && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
            Sale
          </Badge>
        )}
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.08em]">
            {categoryLabel}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-card-foreground ml-1">{course.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({course.ratingCount})</span>
          </div>
        </div>
        
        <Link to={`/course/${course.slug}`} className="block">
          <h3 className="font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-[0.03em]">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {course.shortDescription}
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4 mr-1" />
          <span className="mr-3">{course.duration}</span>
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{course.lectureCount} lessons</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">By {course.instructor}</span>
          <div className="flex items-center">
            {course.salePrice ? (
              <>
                <span className="text-sm font-bold text-card-foreground">
                  {formatPrice(course.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formatPrice(course.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-card-foreground">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          {isInCart(course.id) ? (
            <Link to="/cart" className="w-full">
              <Button variant="outline" className="w-full border-foreground text-foreground hover:bg-accent">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View in Cart
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                addToCart(course.id);
              }}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
