import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package, Eye, Calendar, CreditCard } from "lucide-react";

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "processing":
        return "En traitement";
      case "shipped":
        return "Expédiée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "check":
        return "Chèque";
      case "cash":
        return "Espèces";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Package className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="orders-title">
            Mes commandes
          </h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center" data-testid="no-orders">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Aucune commande</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore passé de commande. Découvrez nos produits pour commencer.
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
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card key={order.id} className="overflow-hidden" data-testid={`order-card-${order.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div>
                        <h3 className="font-bold text-foreground" data-testid={`order-number-${order.id}`}>
                          Commande {order.orderNumber}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span data-testid={`order-date-${order.id}`}>
                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        className={getStatusColor(order.status)}
                        data-testid={`order-status-${order.id}`}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground" data-testid={`order-total-${order.id}`}>
                          {parseInt(order.total).toLocaleString()} FCFA
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CreditCard className="h-4 w-4 mr-1" />
                          <span data-testid={`order-payment-${order.id}`}>
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" data-testid={`button-view-order-${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Adresse de livraison</h4>
                        <div className="text-muted-foreground">
                          {order.shippingAddress && (
                            <div data-testid={`order-address-${order.id}`}>
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                              {order.shippingAddress.address}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                              {order.shippingAddress.country}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Récapitulatif</h4>
                        <div className="space-y-1 text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Sous-total:</span>
                            <span>{parseInt(order.subtotal).toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Livraison:</span>
                            <span>{parseInt(order.shippingCost).toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between font-medium text-foreground">
                            <span>Total:</span>
                            <span>{parseInt(order.total).toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" size="sm" data-testid={`button-track-order-${order.id}`}>
                      Suivre la commande
                    </Button>
                    
                    {order.status === "delivered" && (
                      <Link href="/sav">
                        <Button variant="outline" size="sm" data-testid={`button-return-order-${order.id}`}>
                          Retourner un article
                        </Button>
                      </Link>
                    )}
                    
                    <Button variant="outline" size="sm" data-testid={`button-reorder-${order.id}`}>
                      Commander à nouveau
                    </Button>
                    
                    <Button variant="outline" size="sm" data-testid={`button-download-invoice-${order.id}`}>
                      Télécharger la facture
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-bold text-foreground mb-4" data-testid="help-section-title">
              Besoin d'aide avec vos commandes ?
            </h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe support est disponible pour vous aider avec toutes vos questions concernant vos commandes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sav">
                <Button variant="outline" data-testid="button-contact-sav">
                  Contacter le SAV
                </Button>
              </Link>
              <Link href="/suggestions">
                <Button variant="outline" data-testid="button-make-suggestion">
                  Faire une suggestion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
