import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CheckoutSteps from "@/components/checkout-steps";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    },
  });

  const applyPromoMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/validate-promo", {
        code,
        orderAmount: subtotal,
      });
      return response.json();
    },
    onSuccess: (promoData) => {
      toast({
        title: "Code promo appliqué !",
        description: `Réduction de ${promoData.discountPercent || promoData.discountAmount} appliquée.`,
      });
    },
    onError: () => {
      toast({
        title: "Code promo invalide",
        description: "Ce code promo n'est pas valide ou a expiré.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    applyPromoMutation.mutate(promoCode);
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

  const shipping = subtotal > 0 ? 5000 : 0; // 5000 FCFA shipping
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-background rounded mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-background rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-background rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <CheckoutSteps currentStep={1} className="mb-8" />

        <Card className="bg-card rounded-xl shadow-sm border border-border">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-foreground mb-8" data-testid="cart-title">
              Votre panier
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-16" data-testid="empty-cart">
                <h3 className="text-xl font-bold text-foreground mb-2">Votre panier est vide</h3>
                <p className="text-muted-foreground mb-6">
                  Découvrez nos produits et services pour commencer vos achats.
                </p>
                <div className="space-x-4">
                  <Link href="/products">
                    <Button data-testid="button-browse-products">
                      Voir nos produits
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" data-testid="button-browse-services">
                      Voir nos services
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-2">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="cart-table">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 font-medium text-foreground">Produit</th>
                          <th className="text-center py-3 font-medium text-foreground">Prix unitaire</th>
                          <th className="text-center py-3 font-medium text-foreground">Quantité</th>
                          <th className="text-right py-3 font-medium text-foreground">Total</th>
                          <th className="text-center py-3 font-medium text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item: any) => {
                          const product = item.product || item.service;
                          const price = parseFloat(product.price);
                          const itemTotal = price * item.quantity;

                          return (
                            <tr key={item.id} className="border-b border-border" data-testid={`cart-item-${item.id}`}>
                              <td className="py-4">
                                <div>
                                  <h4 className="font-medium text-foreground" data-testid={`item-name-${item.id}`}>
                                    {product.name}
                                  </h4>
                                  {product.specs && (
                                    <p className="text-sm text-muted-foreground" data-testid={`item-specs-${item.id}`}>
                                      Réf: {product.specs}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="text-center py-4" data-testid={`item-price-${item.id}`}>
                                {price.toLocaleString()} FCFA
                              </td>
                              <td className="text-center py-4">
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    data-testid={`button-decrease-${item.id}`}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center" data-testid={`item-quantity-${item.id}`}>
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    data-testid={`button-increase-${item.id}`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="text-right py-4" data-testid={`item-total-${item.id}`}>
                                {itemTotal.toLocaleString()} FCFA
                              </td>
                              <td className="text-center py-4">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveItem(item.id)}
                                  data-testid={`button-remove-${item.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6 flex space-x-4">
                    <form onSubmit={handleApplyPromo} className="flex space-x-2">
                      <Input
                        placeholder="Code promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        data-testid="input-promo-code"
                      />
                      <Button type="submit" data-testid="button-apply-promo">
                        Appliquer
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="bg-secondary/20 rounded-lg">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-primary mb-4" data-testid="summary-title">
                        Récapitulatif
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sous-total</span>
                          <span data-testid="summary-subtotal">{subtotal.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Livraison</span>
                          <span data-testid="summary-shipping">
                            {shipping === 0 ? "Gratuite" : `${shipping.toLocaleString()} FCFA`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxes</span>
                          <span data-testid="summary-taxes">Incluses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remise</span>
                          <span data-testid="summary-discount">0 FCFA</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span data-testid="summary-total">{total.toLocaleString()} FCFA</span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Link href="/checkout">
                          <Button className="w-full" data-testid="button-continue-checkout">
                            Continuer
                          </Button>
                        </Link>
                        <Link href="/products">
                          <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                            ← Continuer mes achats
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
