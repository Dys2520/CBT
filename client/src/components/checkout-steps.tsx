import { ShoppingCart, User, Truck, CreditCard, Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
  className?: string;
}

const steps = [
  { id: 1, label: "Panier", icon: ShoppingCart },
  { id: 2, label: "Identification", icon: User },
  { id: 3, label: "Livraison", icon: Truck },
  { id: 4, label: "Paiement", icon: CreditCard },
  { id: 5, label: "Confirmation", icon: Check },
];

export default function CheckoutSteps({ currentStep, className = "" }: CheckoutStepsProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} data-testid="checkout-steps">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isInactive = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "step-completed"
                      : isActive
                      ? "step-active"
                      : "step-inactive"
                  }`}
                  data-testid={`step-${step.id}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium mt-2" data-testid={`step-label-${step.id}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
                  data-testid={`step-connector-${step.id}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
