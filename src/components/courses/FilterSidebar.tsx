
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { levels, categories } from './constants';
import { FilterProps } from './types';

interface FilterSidebarProps extends FilterProps {
  isDesktop?: boolean;
  onFilterClose?: () => void;
}

export default function FilterSidebar({ 
  filterState, 
  toggleLevel, 
  toggleCategory, 
  setPriceRange, 
  clearFilters,
  hasFilters,
  isDesktop = true,
  onFilterClose
}: FilterSidebarProps) {
  const { selectedLevels, selectedCategories, priceRange } = filterState;
  const idPrefix = isDesktop ? '' : 'mobile-';

  return (
    <div className={`${isDesktop ? 'hidden md:block w-1/4 fade-in' : 'md:hidden fade-in'}`}>
      <div className="bg-card overflow-hidden sticky top-24">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-foreground tracking-[0.02em]">Filters</h2>
            {hasFilters() && (
              <button 
                className="text-muted-foreground hover:text-primary text-sm font-bold tracking-normal"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>
          
          <Accordion type="multiple" defaultValue={['levels', 'categories', 'price']} className="w-full">
            <AccordionItem value="levels" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-bold uppercase tracking-[0.04em] text-foreground">Level</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {levels.map(level => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}level-${level}`} 
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}level-${level}`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-bold uppercase tracking-[0.04em] text-foreground">Category</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}category-${category.id}`} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}category-${category.id}`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-bold uppercase tracking-[0.04em] text-foreground">Price</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-all`} 
                        checked={priceRange[0] === 0 && priceRange[1] === 500}
                        onCheckedChange={() => setPriceRange([0, 500])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-all`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        All Prices
                      </label>
                    </div>
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-free`} 
                        checked={priceRange[0] === 0 && priceRange[1] === 0}
                        onCheckedChange={() => setPriceRange([0, 0])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-free`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        Free
                      </label>
                    </div>
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-paid`} 
                        checked={priceRange[0] > 0}
                        onCheckedChange={() => setPriceRange(priceRange[0] > 0 ? [0, 500] : [0.01, 500])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-paid`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        Paid
                      </label>
                    </div>
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-under-50`} 
                        checked={priceRange[0] === 0 && priceRange[1] === 50}
                        onCheckedChange={() => setPriceRange([0, 50])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-under-50`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        Under $50
                      </label>
                    </div>
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-50-100`} 
                        checked={priceRange[0] === 50 && priceRange[1] === 100}
                        onCheckedChange={() => setPriceRange([50, 100])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-50-100`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        $50 - $100
                      </label>
                    </div>
                  <div className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}price-100-plus`} 
                        checked={priceRange[0] === 100 && priceRange[1] === 500}
                        onCheckedChange={() => setPriceRange([100, 500])}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-foreground"
                      />
                      <label htmlFor={`${idPrefix}price-100-plus`} className="text-sm text-foreground/85 cursor-pointer font-medium tracking-normal">
                        $100+
                      </label>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {!isDesktop && (
            <div className="mt-4 flex justify-between">
              <button 
                className="flex-1 mr-2 px-4 py-2 text-foreground font-bold uppercase tracking-[0.04em] bg-muted"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button 
                className="flex-1 ml-2 px-4 py-2 bg-primary hover:bg-primary/85 text-primary-foreground font-bold tracking-normal"
                onClick={onFilterClose}
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
