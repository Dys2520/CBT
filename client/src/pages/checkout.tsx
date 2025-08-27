import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CheckoutSteps from "@/components/checkout-steps";
import { useLocation } from "wouter";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    address: z.string().min(1, "Adresse requise"),
    city: z.string().min(1, "Ville requise"),
    postalCode: z.string().min(1, "Code postal requis"),
    country: z.string().default("Bénin"),
  }),
  paymentMethod: z.enum(["check", "cash"]),
  acceptTerms: z.boolean().refine(val => val, "Vous devez accepter les conditions"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(2); // Start at identification step
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Bénin",
      },
      paymentMethod: "check",
      acceptTerms: false,
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      // Calculate totals
      const subtotal = cartItems.reduce((total: number, item: any) => {
        const price = item.product 
          ? parseFloat(item.product.price) 
          : item.service 
          ? parseFloat(item.service.price) 
          : 0;
        return total + (price * item.quantity);
      }, 0);

      const shippingCost = subtotal > 0 ? 5000 : 0;
      const total = subtotal + shippingCost;

      const orderData = {
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        total: total.toString(),
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        promoCode: null,
        discount: "0",
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Commande créée !",
        description: `Votre commande ${order.orderNumber} a été enregistrée avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      navigate(`/orders`);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: CheckoutFormData) => {
    if (step === 4) {
      // Final step - create order
      createOrderMutation.mutate(data);
    } else {
      handleNextStep();
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total: number, item: any) => {
    const price = item.product 
      ? parseFloat(item.product.price) 
      : item.service 
      ? parseFloat(item.service.price) 
      : 0;
    return total + (price * item.quantity);
  }, 0);

  const shippingCost = subtotal > 0 ? 5000 : 0;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Panier vide</h1>
          <p className="text-muted-foreground mb-6">
            Votre panier est vide. Ajoutez des produits avant de passer commande.
          </p>
          <Button onClick={() => navigate("/products")} data-testid="button-back-to-products">
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <CheckoutSteps currentStep={step} className="mb-8" />

        <Card className="bg-card rounded-xl shadow-sm border border-border">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 2: Identification */}
              {step === 2 && (
                <div data-testid="step-identification">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Informations de livraison</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        {...form.register("shippingAddress.firstName")}
                        data-testid="input-first-name"
                      />
                      {form.formState.errors.shippingAddress?.firstName && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.shippingAddress.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        {...form.register("shippingAddress.lastName")}
                        data-testid="input-last-name"
                      />
                      {form.formState.errors.shippingAddress?.lastName && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.shippingAddress.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <Input
                        id="address"
                        {...form.register("shippingAddress.address")}
                        data-testid="input-address"
                      />
                      {form.formState.errors.shippingAddress?.address && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.shippingAddress.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        {...form.register("shippingAddress.city")}
                        data-testid="input-city"
                      />
                      {form.formState.errors.shippingAddress?.city && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        {...form.register("shippingAddress.postalCode")}
                        data-testid="input-postal-code"
                      />
                      {form.formState.errors.shippingAddress?.postalCode && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.shippingAddress.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Livraison */}
              {step === 3 && (
                <div data-testid="step-shipping">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Mode de livraison</h2>
                  
                  <div className="space-y-4">
                    <Card className="p-4 border-2 border-primary">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Livraison standard</h3>
                          <p className="text-sm text-muted-foreground">Délai: 5-7 jours ouvrés</p>
                        </div>
                        <span className="font-bold">{shippingCost.toLocaleString()} FCFA</span>
                      </div>
                    </Card>

                    <Card className="p-4 border border-border opacity-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Livraison express</h3>
                          <p className="text-sm text-muted-foreground">Délai: 2-3 jours ouvrés (Indisponible)</p>
                        </div>
                        <span className="font-bold">10 000 FCFA</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div data-testid="step-payment">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Paiement</h2>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Choisissez votre méthode de paiement préférée et finalisez votre commande.
                    </p>
                    
                    <h3 className="font-bold text-foreground mb-4">Choisissez votre méthode de paiement</h3>
                    
                    <RadioGroup
                      value={form.watch("paymentMethod")}
                      onValueChange={(value) => form.setValue("paymentMethod", value as "check" | "cash")}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="check" id="check" data-testid="radio-check" />
                        <div className="flex-1">
                          <Label htmlFor="check" className="font-medium">Paiement par chèque</Label>
                          <div className="mt-2 p-4 bg-muted rounded">
                            <h4 className="font-medium mb-2">Informations pour le paiement par chèque</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Veuillez libeller votre chèque à l'ordre de :
                            </p>
                            <div className="bg-card border rounded p-3 text-sm">
                              <strong>Bénéficiaire :</strong><br />
                              CBT - Computer & Business Technology<br />
                              <strong>Adresse :</strong><br />
                              123 Avenue de la République, Cotonou, Bénin<br />
                              <strong>Montant :</strong><br />
                              {total.toLocaleString()} FCFA<br />
                              <strong>Référence à indiquer :</strong><br />
                              CMD-{Date.now()}
                            </div>
                            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
                              <p className="text-sm">
                                <strong>⚠️ Important :</strong> Votre commande sera traitée une fois que nous aurons reçu et encaissé 
                                votre chèque. Veuillez indiquer la référence ci-dessus pour prendre 5 à 7 jours ouvrables.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
                        <div className="flex-1">
                          <Label htmlFor="cash" className="font-medium">Paiement en espèces</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Paiement à la livraison ou en magasin
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start space-x-3">
                      <Checkbox
                        checked={form.watch("acceptTerms")}
                        onCheckedChange={(checked) => form.setValue("acceptTerms", !!checked)}
                        data-testid="checkbox-accept-terms"
                      />
                      <span className="text-sm">
                        J'accepte que mes données soient traitées conformément à la{" "}
                        <Button variant="link" className="p-0 h-auto text-sm underline">
                          politique de confidentialité
                        </Button>{" "}
                        *
                      </span>
                    </label>
                    {form.formState.errors.acceptTerms && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <Card className="bg-secondary/20 rounded-lg mb-6">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-primary mb-4">Récapitulatif</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sous-total</span>
                          <span>{subtotal.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Livraison</span>
                          <span>À calculer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxes</span>
                          <span>Incluses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remise</span>
                          <span>0 FCFA</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>{total.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                {step > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    data-testid="button-previous-step"
                  >
                    ← Retour à l'étape précédente
                  </Button>
                )}
                
                <div className="ml-auto">
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    data-testid="button-next-step"
                  >
                    {step === 4 
                      ? createOrderMutation.isPending 
                        ? "Création en cours..." 
                        : "Continuer vers confirmation"
                      : "Continuer"
                    }
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
