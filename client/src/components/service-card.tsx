import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import StarRating from "./star-rating";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    price: string;
    rating?: number;
    reviewCount?: number;
    description?: string;
    imageUrl?: string;
    isNew?: boolean;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        serviceId: service.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Service ajouté !",
        description: `${service.name} a été ajouté à votre panier.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setIsAdding(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour commander des services.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le service au panier.",
        variant: "destructive",
      });
      setIsAdding(false);
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour commander des services.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    setIsAdding(true);
    addToCartMutation.mutate();
  };

  return (
    <Card className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow" data-testid={`service-card-${service.id}`}>
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative">
        {service.imageUrl && (
          <img 
            src={service.imageUrl} 
            alt={service.name}
            className="w-full h-full object-cover"
            data-testid={`service-image-${service.id}`}
          />
        )}
        {service.isNew && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white" data-testid="badge-new">
            Nouveau
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-foreground mb-2" data-testid={`service-name-${service.id}`}>
          {service.name}
        </h3>
        
        {(service.rating !== undefined && service.reviewCount !== undefined) && (
          <div className="flex items-center my-2">
            <StarRating rating={service.rating} size="sm" />
            <span className="text-sm text-muted-foreground ml-2" data-testid={`service-reviews-${service.id}`}>
              ({service.reviewCount})
            </span>
          </div>
        )}
        
        {service.description && (
          <p className="text-sm text-muted-foreground mb-3" data-testid={`service-description-${service.id}`}>
            {service.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground" data-testid={`service-price-${service.id}`}>
            {parseInt(service.price).toLocaleString()} FCFA
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
              isAdding 
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            }`}
            data-testid={`button-add-service-${service.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? "Ajouté!" : "Commander"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
