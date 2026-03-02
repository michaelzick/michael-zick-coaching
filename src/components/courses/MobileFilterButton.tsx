
import { Filter } from '@/lib/icons';
import { Button } from '@/components/ui/button';

interface MobileFilterButtonProps {
  onClick: () => void;
}

export default function MobileFilterButton({ onClick }: MobileFilterButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="md:hidden uppercase tracking-[0.08em] font-bold"
      onClick={onClick}
    >
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
  );
}
