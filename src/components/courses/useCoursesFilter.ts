
import { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import { PriceRangeType } from './types';

export default function useCoursesFilter(initialCourses: Course[]) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState<PriceRangeType>([0, 200]);
  
  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredCourses(initialCourses);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [initialCourses]);
  
  // Filter and sort effect
  useEffect(() => {
    let result = [...initialCourses];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(course => selectedCategories.includes(course.category));
    }
    
    // Apply price filter
    result = result.filter(course => {
      const coursePrice = course.salePrice !== undefined ? Number(course.salePrice) : Number(course.price);
      return coursePrice >= Number(priceRange[0]) && coursePrice <= Number(priceRange[1]);
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Using last updated as a proxy for newest
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [searchQuery, selectedLevels, selectedCategories, priceRange, sortOption, initialCourses]);
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSelectedLevels([]);
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSearchQuery('');
  };
  
  const hasFilters = () => {
    return selectedLevels.length > 0 || 
           selectedCategories.length > 0 || 
           priceRange[0] > 0 || 
           priceRange[1] < 200 ||
           searchQuery.trim().length > 0;
  };
  
  return {
    filteredCourses,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedLevels,
    selectedCategories,
    priceRange,
    setPriceRange,
    sortOption,
    setSortOption,
    toggleLevel,
    toggleCategory,
    clearFilters,
    hasFilters,
  };
}
