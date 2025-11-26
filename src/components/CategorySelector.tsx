import { Card } from "@/components/ui/card";

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
}

const CategorySelector = ({ onSelectCategory }: CategorySelectorProps) => {
  const categories = [
    {
      id: "christmas",
      name: "CHRISTMAS MENU",
      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=300&fit=crop",
    },
    {
      id: "mini-cookies",
      name: "Mini Cookies",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    },
    {
      id: "same-day",
      name: "SAME DAY DELIVERY!",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
    },
    {
      id: "gift-sets",
      name: "Gift Sets",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop",
    },
    {
      id: "brownies",
      name: "Brownies",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Which category would you like to see?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105 group"
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 bg-card">
                <h3 className="text-lg font-semibold text-center text-foreground">
                  {category.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
