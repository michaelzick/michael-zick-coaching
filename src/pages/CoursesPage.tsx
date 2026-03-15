
import { useState } from 'react';
import { X } from '@/lib/icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import JsonLd from '@/components/JsonLd';
import { buildItemListSchema } from '@/lib/seo/schemas';
import { useCourses } from '@/hooks/use-courses';
import { FilterState } from '@/components/courses/types';
import FilterSidebar from '@/components/courses/FilterSidebar';
import CoursesHeader from '@/components/courses/CoursesHeader';
import CourseGrid from '@/components/courses/CourseGrid';
import useCoursesFilter from '@/components/courses/useCoursesFilter';

export default function CoursesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses();

  const {
    filteredCourses,
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
      <SEOHead
        title="Nice Guy Recovery Programs & Courses"
        description="Online coaching programs for men ready to stop people-pleasing, break approval addiction, set boundaries, and build authentic relationships. Self-paced with lifetime access."
        canonicalPath="/courses"
      />
      {courses.length > 0 && (
        <JsonLd data={buildItemListSchema(courses.map(c => ({ title: c.title, slug: c.slug })))} />
      )}
      <Navbar />

      <main className="flex-grow mobile-shell pb-16 pt-32">
        <div className="container mx-auto content-stack">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Programs</h1>
            <p className="text-muted-foreground">Coaching programs designed to help you break free and build an authentic life.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <FilterSidebar
              filterState={filterState}
              toggleLevel={toggleLevel}
              toggleCategory={toggleCategory}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
              isDesktop={true}
            />

            <div className="flex-1 fade-in">
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

              {filterOpen && (
                <div className="md:hidden bg-card overflow-hidden mb-6 fade-in">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-card-foreground tracking-[0.02em]">Filters</h2>
                      <button
                        className="text-muted-foreground hover:text-destructive"
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

              <CourseGrid
                isLoading={isLoadingCourses}
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
