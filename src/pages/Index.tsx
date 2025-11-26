import { useState } from "react";
import DeliverySelector from "@/components/DeliverySelector";
import CategorySelector from "@/components/CategorySelector";
import ProductCatalog from "@/components/ProductCatalog";
import CheckoutForm from "@/components/CheckoutForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Step = "delivery" | "category" | "products" | "checkout" | "success";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("delivery");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleDeliverySelect = (date: Date, time: string) => {
    setDeliveryDate(date);
    setDeliveryTime(time);
    setCurrentStep("category");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentStep("products");
  };

  const handleContinueToCheckout = (cartItems: CartItem[]) => {
    setCart(cartItems);
    setCurrentStep("checkout");
  };

  const handleOrderSuccess = () => {
    setCurrentStep("success");
  };

  const handleGoBack = () => {
    if (currentStep === "category") setCurrentStep("delivery");
    else if (currentStep === "products") setCurrentStep("category");
    else if (currentStep === "checkout") setCurrentStep("products");
  };

  const handleStartOver = () => {
    setCurrentStep("delivery");
    setDeliveryDate(null);
    setDeliveryTime("");
    setSelectedCategory("");
    setCart([]);
  };

  return (
    <>
      {currentStep !== "delivery" && currentStep !== "success" && (
        <div className="fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      {currentStep === "delivery" && <DeliverySelector onContinue={handleDeliverySelect} />}

      {currentStep === "category" && <CategorySelector onSelectCategory={handleCategorySelect} />}

      {currentStep === "products" && (
        <ProductCatalog category={selectedCategory} onContinue={handleContinueToCheckout} />
      )}

      {currentStep === "checkout" && deliveryDate && (
        <CheckoutForm
          cart={cart}
          deliveryDate={deliveryDate}
          deliveryTime={deliveryTime}
          onSuccess={handleOrderSuccess}
        />
      )}

      {currentStep === "success" && (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 bg-success rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll contact you soon to confirm your delivery.
            </p>
            <Button onClick={handleStartOver} size="lg">
              Place Another Order
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
