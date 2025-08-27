import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, User } from "lucide-react";

export default function GuestCart() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="guest-cart-title">
              Votre panier
            </h1>
            <p className="text-muted-foreground" data-testid="guest-cart-description">
              Connectez-vous pour voir votre panier et passer commande
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Connexion requise
                </h2>
                <p className="text-muted-foreground mb-6">
                  Pour ajouter des produits à votre panier et passer commande, 
                  vous devez créer un compte ou vous connecter.
                </p>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="w-full mb-4"
                  data-testid="button-login-from-cart"
                >
                  <User className="h-4 w-4 mr-2" />
                  Se connecter / Créer un compte
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="w-full"
                  data-testid="button-continue-shopping"
                >
                  Continuer les achats
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2">Pourquoi créer un compte ?</h3>
            <ul className="list-disc text-left max-w-md mx-auto space-y-1">
              <li>Sauvegardez vos produits favoris</li>
              <li>Accédez à l'historique de vos commandes</li>
              <li>Bénéficiez d'un service après-vente personnalisé</li>
              <li>Recevez des offres exclusives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}