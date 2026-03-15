
import SearchBar from './SearchBar';
import SortSelector from './SortSelector';
import MobileFilterButton from './MobileFilterButton';
import ActiveFilters from './ActiveFilters';
import { FilterState } from './types';

interface CoursesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilterOpen: (open: boolean) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  filterState: FilterState;
  toggleLevel: (level: string) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  clearFilters: () => void;
  hasFilters: () => boolean;
}

export default function CoursesHeader({
  searchQuery,
  setSearchQuery,
  setFilterOpen,
  sortOption,
  setSortOption,
  filterState,
  toggleLevel,
  toggleCategory,
  setPriceRange,
  clearFilters,
  hasFilters
}: CoursesHeaderProps) {
  return (
    <div className="bg-card p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="flex items-center gap-3">
          <MobileFilterButton onClick={() => setFilterOpen(true)} />
          <SortSelector sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>
      
      <ActiveFilters 
        filterState={filterState}
        toggleLevel={toggleLevel}
        toggleCategory={toggleCategory}
        setPriceRange={setPriceRange}
        setSearchQuery={setSearchQuery}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
      />
    </div>
  );
}
