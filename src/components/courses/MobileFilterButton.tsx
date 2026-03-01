
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFilterButtonProps {
  onClick: () => void;
}

export default function MobileFilterButton({ onClick }: MobileFilterButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="md:hidden"
      onClick={onClick}
    >
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
  );
}
