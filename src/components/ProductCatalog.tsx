// src/components/ProductCatalog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductDialog from "./ProductDialog";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  badge?: "Best Seller" | "Popular" | "Few stocks left";
  description?: string;
  variants?: Array<{
    id: string;
    name: string;
    priceModifier: number;
  }>;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Chargement des produits depuis le backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://koussaybackend.onrender.com/api/products?category=${category}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error("Erreur chargement des produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const addToCart = (product: Product, variantId: string | null, quantity: number) => {
    const variant = product.variants?.find((v) => v.id === variantId);
    const finalPrice = product.price + (variant?.priceModifier || 0);

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product._id && i.variantId === variantId
      );

      if (existing) {
        return prev.map((i) =>
          i.id === product._id && i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: finalPrice,
          quantity,
          variantId: variantId || undefined,
          variantName: variant?.name,
        },
      ];
    });

    toast.success("Ajouté au panier !");
    setDialogOpen(false);
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

  const getTotalPrice = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getTotalItems = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  const badgeVariants: Record<string, string> = {
    "Best Seller": "bg-accent text-accent-foreground",
    Popular: "bg-secondary text-secondary-foreground",
    "Few stocks left": "bg-warning text-foreground",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header fixe */}
      <div className="sticky top-0 bg-background z-10 shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Que voulez-vous acheter ?
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Grille produits */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const cartItems = cart.filter((i) => i.id === product._id);
            const totalQuantity = cartItems.reduce((s, i) => s + i.quantity, 0);

            return (
              <Card key={product._id} className="overflow-hidden hover:shadow-xl transition-all">
                <div
                  className="relative h-56 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className={`absolute top-3 right-3 ${badgeVariants[product.badge] || "bg-accent"}`}>
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
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.variantId}`} className="flex items-center justify-between bg-muted rounded-lg p-2">
                          <div className="flex-1">
                            {item.variantName && (
                              <p className="text-xs text-muted-foreground truncate">{item.variantName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, item.variantId, -1); }}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, item.variantId, 1); }}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full" variant="outline" onClick={() => handleProductClick(product)}>
                        Ajouter encore
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleProductClick(product)}>
                      Ajouter au panier
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog produit */}
      <ProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddToCart={addToCart}
      />

      {/* Panier fixe en bas */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-2xl z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {getTotalItems()}
              </div>
              <div>
                <p className="text-sm opacity-90">Panier</p>
                <p className="text-xl font-bold">{getTotalPrice()} DT</p>
              </div>
            </div>
            <Button size="lg" variant="secondary" onClick={() => onContinue(cart)} className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Continuer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;