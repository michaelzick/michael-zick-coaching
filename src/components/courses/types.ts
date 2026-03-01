
export type PriceRangeType = [number, number];

export interface FilterState {
  selectedLevels: string[];
  selectedCategories: string[];
  priceRange: PriceRangeType;
  searchQuery: string;
}

export interface FilterProps {
  filterState: FilterState;
  toggleLevel: (level: string) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: PriceRangeType) => void;
  clearFilters: () => void;
  hasFilters: () => boolean;
}
