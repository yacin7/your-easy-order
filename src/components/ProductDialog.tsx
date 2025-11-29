// src/components/ProductDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Minus, X } from "lucide-react";

interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  badge?: string;
  variants?: ProductVariant[];
}

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variantId: string | null, quantity: number) => void;
}

const ProductDialog = ({ product, open, onClose, onAddToCart }: ProductDialogProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant || null, quantity);
    setQuantity(1);
    setSelectedVariant("");
    onClose();
  };

  const getPriceWithVariant = () => {
    if (!selectedVariant || !product.variants) return product.price;
    const v = product.variants.find(v => v.id === selectedVariant);
    return product.price + (v?.priceModifier || 0);
  };

  const totalPrice = getPriceWithVariant() * quantity;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <DialogHeader>
          <div className="relative h-64 -m-6 mb-6 overflow-hidden rounded-t-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <DialogTitle className="text-2xl font-bold pr-10">
            {product.name}
          </DialogTitle>

          <p className="text-3xl font-bold text-primary mt-3">
            {product.price} DT
          </p>
        </DialogHeader>

        {product.description && (
          <p className="text-muted-foreground mt-4">{product.description}</p>
        )}

        {/* Variantes */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Choisir la taille</h3>
            <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-4 border rounded-lg mb-2 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label htmlFor={variant.id} className="cursor-pointer font-medium">
                      {variant.name}
                    </Label>
                  </div>
                  {variant.priceModifier > 0 && (
                    <span className="text-sm text-muted-foreground">
                      +{variant.priceModifier} DT
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Quantité + Prix total */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <div className="flex items-center gap-4 bg-muted rounded-lg p-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg w-12 text-center">{quantity}</span>
            <Button size="icon" variant="ghost" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-primary">{totalPrice} DT</p>
          </div>
        </div>

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={handleAdd}
          disabled={product.variants && product.variants.length > 0 && !selectedVariant}
        >
          Ajouter au panier
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;