
import { SortDesc, SortAsc } from '@/lib/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SortSelectorProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function SortSelector({ sortOption, setSortOption }: SortSelectorProps) {
  return (
    <Select
      value={sortOption}
      onValueChange={setSortOption}
    >
      <SelectTrigger className="w-[220px] font-semibold uppercase tracking-[0.05em]">
        <SelectValue placeholder="Sort By: Popular" />
      </SelectTrigger>
      <SelectContent className="border-2 border-foreground bg-card">
        <SelectItem value="popular">
          <div className="flex items-center">
            <SortDesc className="h-4 w-4 mr-2" />
            Most Popular
          </div>
        </SelectItem>
        <SelectItem value="rating">
          <div className="flex items-center">
            <SortDesc className="h-4 w-4 mr-2" />
            Highest Rated
          </div>
        </SelectItem>
        <SelectItem value="newest">
          <div className="flex items-center">
            <SortDesc className="h-4 w-4 mr-2" />
            Newest
          </div>
        </SelectItem>
        <SelectItem value="price-low">
          <div className="flex items-center">
            <SortAsc className="h-4 w-4 mr-2" />
            Price: Low to High
          </div>
        </SelectItem>
        <SelectItem value="price-high">
          <div className="flex items-center">
            <SortDesc className="h-4 w-4 mr-2" />
            Price: High to Low
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
