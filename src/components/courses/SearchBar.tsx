
import { Search } from '@/lib/icons';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input 
        type="text"
        placeholder="Search programs..." 
        className="pl-10 font-semibold uppercase tracking-[0.04em]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
