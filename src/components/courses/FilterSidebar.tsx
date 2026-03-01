
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Filters</h2>
            {hasFilters() && (
              <button 
                className="text-gray-500 hover:text-learnify-600 text-sm"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>
          
          <Accordion type="multiple" defaultValue={['levels', 'categories', 'price']} className="w-full">
            <AccordionItem value="levels" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-medium text-gray-900">Level</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {levels.map(level => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}level-${level}`} 
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                        className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                      />
                      <label htmlFor={`${idPrefix}level-${level}`} className="text-sm text-gray-700 cursor-pointer">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-medium text-gray-900">Category</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`${idPrefix}category-${category.id}`} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                      />
                      <label htmlFor={`${idPrefix}category-${category.id}`} className="text-sm text-gray-700 cursor-pointer">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="font-medium text-gray-900">Price</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-all`} 
                      checked={priceRange[0] === 0 && priceRange[1] === 200}
                      onCheckedChange={() => setPriceRange([0, 200])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-all`} className="text-sm text-gray-700 cursor-pointer">
                      All Prices
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-free`} 
                      checked={priceRange[0] === 0 && priceRange[1] === 0}
                      onCheckedChange={() => setPriceRange([0, 0])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-free`} className="text-sm text-gray-700 cursor-pointer">
                      Free
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-paid`} 
                      checked={priceRange[0] > 0}
                      onCheckedChange={() => setPriceRange(priceRange[0] > 0 ? [0, 200] : [0.01, 200])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-paid`} className="text-sm text-gray-700 cursor-pointer">
                      Paid
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-under-50`} 
                      checked={priceRange[0] === 0 && priceRange[1] === 50}
                      onCheckedChange={() => setPriceRange([0, 50])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-under-50`} className="text-sm text-gray-700 cursor-pointer">
                      Under $50
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-50-100`} 
                      checked={priceRange[0] === 50 && priceRange[1] === 100}
                      onCheckedChange={() => setPriceRange([50, 100])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-50-100`} className="text-sm text-gray-700 cursor-pointer">
                      $50 - $100
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${idPrefix}price-100-plus`} 
                      checked={priceRange[0] === 100 && priceRange[1] === 200}
                      onCheckedChange={() => setPriceRange([100, 200])}
                      className="mr-2 data-[state=checked]:bg-learnify-600 data-[state=checked]:border-learnify-600"
                    />
                    <label htmlFor={`${idPrefix}price-100-plus`} className="text-sm text-gray-700 cursor-pointer">
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
                className="flex-1 mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button 
                className="flex-1 ml-2 px-4 py-2 bg-learnify-600 hover:bg-learnify-700 text-white rounded-md"
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
