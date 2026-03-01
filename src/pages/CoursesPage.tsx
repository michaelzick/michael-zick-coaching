
import { useState } from 'react';
import { X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { courses } from '@/data/courses';
import { FilterState } from '@/components/courses/types';
import FilterSidebar from '@/components/courses/FilterSidebar';
import CoursesHeader from '@/components/courses/CoursesHeader';
import CourseGrid from '@/components/courses/CourseGrid';
import useCoursesFilter from '@/components/courses/useCoursesFilter';

export default function CoursesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  
  const {
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
  } = useCoursesFilter(courses);
  
  const filterState: FilterState = {
    selectedLevels,
    selectedCategories,
    priceRange,
    searchQuery
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
            <p className="text-gray-600">Discover courses to boost your skills and advance your career</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar 
              filterState={filterState}
              toggleLevel={toggleLevel}
              toggleCategory={toggleCategory}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
              isDesktop={true}
            />
            
            {/* Main Content */}
            <div className="flex-1 fade-in">
              {/* Search and Filter Controls */}
              <CoursesHeader 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setFilterOpen={setFilterOpen}
                sortOption={sortOption}
                setSortOption={setSortOption}
                filterState={filterState}
                toggleLevel={toggleLevel}
                toggleCategory={toggleCategory}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
              
              {/* Mobile Filters */}
              {filterOpen && (
                <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 fade-in">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-gray-900">Filters</h2>
                      <button 
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => setFilterOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <FilterSidebar 
                      filterState={filterState}
                      toggleLevel={toggleLevel}
                      toggleCategory={toggleCategory}
                      setPriceRange={setPriceRange}
                      clearFilters={clearFilters}
                      hasFilters={hasFilters}
                      isDesktop={false}
                      onFilterClose={() => setFilterOpen(false)}
                    />
                  </div>
                </div>
              )}
              
              {/* Courses Grid */}
              <CourseGrid 
                isLoading={isLoading}
                courses={filteredCourses}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
