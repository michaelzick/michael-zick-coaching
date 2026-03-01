
import { Link } from 'react-router-dom';
import { Star, Clock, Bookmark, BookOpen, ShoppingCart } from 'lucide-react';
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

  return (
    <div className={cn("course-card group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300", className)}>
      <Link to={`/course/${course.slug}`} className="block relative pb-[56.25%] overflow-hidden">
        <img 
          src={`${course.thumbnailUrl}?auto=format&fit=crop&w=800&q=80`}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {course.bestseller && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white">
            Bestseller
          </Badge>
        )}
        {course.salePrice && course.salePrice < course.price && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white">
            Sale
          </Badge>
        )}
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link 
            to={`/category/${course.category}`}
            className="text-xs font-medium text-learnify-600 hover:text-learnify-700 uppercase tracking-wider"
          >
            {course.category.replace("-", " ")}
          </Link>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-700 ml-1">{course.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({course.ratingCount})</span>
          </div>
        </div>
        
        <Link to={`/course/${course.slug}`} className="block">
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-learnify-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.shortDescription}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          <span className="mr-3">{course.duration}</span>
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{course.lectureCount} lectures</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {course.instructorAvatar ? (
              <img 
                src={course.instructorAvatar} 
                alt={course.instructor} 
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2" />
            )}
            <span className="text-sm text-gray-700">{course.instructor}</span>
          </div>
          
          <div className="flex items-center">
            {course.salePrice ? (
              <>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(course.salePrice)}
                </span>
                <span className="text-xs text-gray-500 line-through ml-2">
                  {formatPrice(course.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          {isInCart(course.id) ? (
            <Link to="/cart" className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-learnify-600 text-learnify-600 hover:bg-learnify-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View in Cart
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full bg-learnify-600 hover:bg-learnify-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                addToCart(course.id);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
          <Button 
            variant="outline"
            size="icon"
            className="border-gray-200 text-gray-500 hover:text-learnify-600 hover:border-learnify-600"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
