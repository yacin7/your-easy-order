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
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
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

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant || null, quantity);
    setQuantity(1);
    setSelectedVariant("");
    onClose();
  };

  const getSelectedVariantPrice = () => {
    if (!selectedVariant || !product.variants) return product.price;
    const variant = product.variants.find(v => v.id === selectedVariant);
    return product.price + (variant?.priceModifier || 0);
  };

  const getTotalPrice = () => {
    return getSelectedVariantPrice() * quantity;
  };

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground pr-8">
            {product.name}
          </DialogTitle>
          <p className="text-3xl font-bold text-primary mt-2">
            {product.price} ₱
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {hasVariants && (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">Choose your size</h3>
                <p className="text-sm text-muted-foreground">Choose 1</p>
              </div>
              
              <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
                {product.variants?.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={variant.id} id={variant.id} />
                      <Label
                        htmlFor={variant.id}
                        className="font-medium cursor-pointer"
                      >
                        {variant.name}
                      </Label>
                    </div>
                    {variant.priceModifier !== 0 && (
                      <span className="text-muted-foreground">
                        +{variant.priceModifier} ₱
                      </span>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 bg-muted rounded-lg p-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-xl w-8 text-center">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">{getTotalPrice()} ₱</p>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={hasVariants && !selectedVariant}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
