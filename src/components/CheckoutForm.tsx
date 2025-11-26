import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  cart: CartItem[];
  deliveryDate: Date;
  deliveryTime: string;
  onSuccess: () => void;
}

const CheckoutForm = ({ cart, deliveryDate, deliveryTime, onSuccess }: CheckoutFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const DELIVERY_FEE = 7;

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return deliveryMethod === "delivery" ? subtotal + DELIVERY_FEE : subtotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (deliveryMethod === "delivery" && !formData.address) {
      toast.error("Please enter your delivery address");
      return;
    }

    // Ici vous pouvez envoyer les données à votre backend
    console.log({
      customer: formData,
      cart,
      deliveryDate,
      deliveryTime,
      deliveryMethod,
      total: getTotalPrice(),
    });

    toast.success("Order placed successfully! We'll contact you soon.");
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Complete Your Order
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>

              <div>
                <Label>Delivery Method *</Label>
                <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "delivery" | "pickup")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="font-normal cursor-pointer">
                      Livraison (+7 ₱)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="font-normal cursor-pointer">
                      Ramassage (Pickup)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {deliveryMethod === "delivery" && (
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your complete address"
                    rows={3}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Place Order - {getTotalPrice()} ₱
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">{item.price * item.quantity} ₱</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{getSubtotal()} ₱</span>
                </div>
                {deliveryMethod === "delivery" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-foreground">{DELIVERY_FEE} ₱</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{getTotalPrice()} ₱</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">
                    {deliveryDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-foreground">{deliveryTime}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
