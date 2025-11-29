// src/components/CheckoutForm.tsx
"use client";

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
  const [isLoading, setIsLoading] = useState(false);

  const DELIVERY_FEE = 7;

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return deliveryMethod === "delivery" ? subtotal + DELIVERY_FEE : subtotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (deliveryMethod === "delivery" && !formData.address) {
      toast.error("Veuillez entrer votre adresse de livraison");
      return;
    }

    setIsLoading(true);

    const orderData = {
      customerName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      deliveryMethod: deliveryMethod === "delivery" ? "Livraison" : "Ramassage",
      deliveryAddress: deliveryMethod === "delivery" ? formData.address.trim() : null,
      deliveryDate: deliveryDate.toISOString().split("T")[0],
      deliveryTime,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: getTotalPrice(),
      status: "En attente",
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur serveur");
      }

      toast.success("Commande envoyée avec succès ! Nous vous contacterons très vite");
      onSuccess(); // Redirige vers merci ou vide le panier
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Finaliser votre commande
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* === Formulaire === */}
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Vos informations</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
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
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+216 12 345 678"
                  required
                />
              </div>

              <div>
                <Label>Méthode de livraison *</Label>
                <RadioGroup value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="font-normal cursor-pointer">
                      Livraison (+7 DT)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="font-normal cursor-pointer">
                      Ramassage en boutique
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {deliveryMethod === "delivery" && (
                <div>
                  <Label htmlFor="address">Adresse complète *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rue, immeuble, ville..."
                    rows={3}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : `Commander – ${getTotalPrice()} DT`}
              </Button>
            </form>
          </Card>

          {/* === Résumé & Détails === */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Récapitulatif</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.price * item.quantity} DT
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">{getSubtotal()} DT</span>
                </div>
                {deliveryMethod === "delivery" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-foreground">{DELIVERY_FEE} DT</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{getTotalPrice()} DT</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Date & Heure</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">
                    {deliveryDate.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Heure</span>
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