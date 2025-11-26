import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductDialog from "./ProductDialog";

interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: "Best Seller" | "Popular" | "Few stocks left";
  description?: string;
  variants?: ProductVariant[];
}

interface CartItem extends Product {
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface ProductCatalogProps {
  category: string;
  onContinue: (cart: CartItem[]) => void;
}

const ProductCatalog = ({ category, onContinue }: ProductCatalogProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Biscoff Knafeh Cookie",
      price: 200,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
      badge: "Few stocks left",
      description: "Perfect for sharing or just for you.",
      variants: [
        { id: "16oz", name: "16oz Biscoff Knafeh Cookie (16pcs)", priceModifier: 85 },
        { id: "8oz", name: "8oz Biscoff Knafeh Cookie (8pcs)", priceModifier: 0 },
      ],
    },
    {
      id: "2",
      name: "Pistachio Knafeh Cookie",
      price: 200,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
      badge: "Best Seller",
      description: "Delicious pistachio flavor with crispy knafeh.",
      variants: [
        { id: "16oz", name: "16oz Pistachio Cookie (16pcs)", priceModifier: 85 },
        { id: "8oz", name: "8oz Pistachio Cookie (8pcs)", priceModifier: 0 },
      ],
    },
    {
      id: "3",
      name: "Box of 6 | CHOOSE YOUR ASSORTED COOKIES",
      price: 750,
      image: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&h=400&fit=crop",
      badge: "Popular",
      description: "Mix and match your favorite flavors.",
    },
    {
      id: "4",
      name: "Chocolate Chip Cookie",
      price: 180,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
      badge: "Popular",
      description: "Classic chocolate chip goodness.",
      variants: [
        { id: "large", name: "Large (12pcs)", priceModifier: 50 },
        { id: "regular", name: "Regular (8pcs)", priceModifier: 0 },
      ],
    },
    {
      id: "5",
      name: "Double Chocolate Cookie",
      price: 190,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop",
      badge: "Best Seller",
      description: "Rich chocolate lover's dream.",
      variants: [
        { id: "large", name: "Large (12pcs)", priceModifier: 50 },
        { id: "regular", name: "Regular (8pcs)", priceModifier: 0 },
      ],
    },
    {
      id: "6",
      name: "Oatmeal Raisin Cookie",
      price: 170,
      image: "https://images.unsplash.com/photo-1590080876238-38c3cd763212?w=400&h=400&fit=crop",
      description: "Healthy and delicious oatmeal treat.",
      variants: [
        { id: "large", name: "Large (12pcs)", priceModifier: 50 },
        { id: "regular", name: "Regular (8pcs)", priceModifier: 0 },
      ],
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const addToCart = (product: Product, variantId: string | null, quantity: number) => {
    const variant = product.variants?.find(v => v.id === variantId);
    const finalPrice = product.price + (variant?.priceModifier || 0);
    const cartItemKey = `${product.id}-${variantId || 'default'}`;
    
    const existingItem = cart.find(
      (item) => item.id === product.id && item.variantId === variantId
    );
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          price: finalPrice,
          quantity,
          variantId: variantId || undefined,
          variantName: variant?.name,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, variantId: string | undefined, change: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId && item.variantId === variantId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const badgeVariants: Record<string, string> = {
    "Best Seller": "bg-accent text-accent-foreground",
    Popular: "bg-secondary text-secondary-foreground",
    "Few stocks left": "bg-warning text-foreground",
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 bg-background z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            What would you like to buy?
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const cartItems = cart.filter((item) => item.id === product.id);
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all">
                <div 
                  className="relative h-56 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className={`absolute top-3 right-3 ${badgeVariants[product.badge]}`}>
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-foreground min-h-[3rem]">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">{product.price} DT</p>
                  {totalQuantity > 0 ? (
                    <div className="space-y-2">
                      {cartItems.map((cartItem) => (
                        <div 
                          key={`${cartItem.id}-${cartItem.variantId}`}
                          className="flex items-center justify-between bg-muted rounded-lg p-2"
                        >
                          <div className="flex-1">
                            {cartItem.variantName && (
                              <p className="text-xs text-muted-foreground truncate">
                                {cartItem.variantName}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, cartItem.variantId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-sm w-6 text-center">
                              {cartItem.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, cartItem.variantId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleProductClick(product)}
                      >
                        Add More
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleProductClick(product)}>
                      Add to Cart
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <ProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddToCart={addToCart}
      />

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-2xl z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {getTotalItems()}
              </div>
              <div>
                <p className="text-sm opacity-90">Preview cart</p>
                <p className="text-xl font-bold">{getTotalPrice()} DT</p>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onContinue(cart)}
              className="gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
