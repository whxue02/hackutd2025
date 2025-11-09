import { Badge } from "./ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`cursor-pointer px-5 py-2.5 transition-all hover:scale-105 italic ${
            selectedCategory === category 
              ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary/50 shadow-md shadow-primary/30" 
              : "border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-300 hover:border-primary/50 hover:text-white hover:shadow-primary/20"
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}