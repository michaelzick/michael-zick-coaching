
import { X } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categories } from './constants';
import { FilterState } from './types';

interface ActiveFiltersProps {
  filterState: FilterState;
  toggleLevel: (level: string) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  hasFilters: () => boolean;
}

export default function ActiveFilters({
  filterState,
  toggleLevel,
  toggleCategory,
  setPriceRange,
  setSearchQuery,
  clearFilters,
  hasFilters
}: ActiveFiltersProps) {
  const { selectedLevels, selectedCategories, priceRange, searchQuery } = filterState;
  
  if (!hasFilters()) return null;
  
  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground mr-2 font-bold uppercase tracking-[0.04em]">Active filters:</span>
      
      {selectedLevels.map(level => (
        <Badge 
          key={level} 
          variant="outline" 
          className="bg-muted text-foreground hover:bg-muted/80 font-semibold"
        >
          {level}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => toggleLevel(level)}
          />
        </Badge>
      ))}
      
      {selectedCategories.map(catId => {
        const category = categories.find(c => c.id === catId);
        return (
          <Badge 
            key={catId} 
            variant="outline" 
            className="bg-muted text-foreground hover:bg-muted/80 font-semibold"
          >
            {category?.label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => toggleCategory(catId)}
            />
          </Badge>
        );
      })}
      
      {!(priceRange[0] === 0 && priceRange[1] === 500) && (
        <Badge 
          variant="outline" 
          className="bg-muted text-foreground hover:bg-muted/80 font-semibold"
        >
          {priceRange[0] === 0 && priceRange[1] === 0 
            ? 'Free' 
            : `$${priceRange[0]} - $${priceRange[1]}`}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => setPriceRange([0, 500])}
          />
        </Badge>
      )}
      
      {searchQuery && (
        <Badge 
          variant="outline" 
          className="bg-muted text-foreground hover:bg-muted/80 font-semibold"
        >
          "{searchQuery}"
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => setSearchQuery('')}
          />
        </Badge>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-muted-foreground hover:text-foreground ml-auto"
        onClick={clearFilters}
      >
        Clear All
      </Button>
    </div>
  );
}
