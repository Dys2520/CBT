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

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    rating?: number;
    reviewCount?: number;
    specs?: string;
    imageUrl?: string;
    isHot?: boolean;
    isNew?: boolean;
    inStock?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Produit ajouté !",
        description: `${product.name} a été ajouté à votre panier.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setIsAdding(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour ajouter des produits au panier.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive",
      });
      setIsAdding(false);
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier.",
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
    <Card className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative">
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`product-image-${product.id}`}
          />
        )}
        {product.isHot && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground" data-testid="badge-hot">
            HOT
          </Badge>
        )}
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white" data-testid="badge-new">
            Nouveau
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        
        {(product.rating !== undefined && product.reviewCount !== undefined) && (
          <div className="flex items-center my-2">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-sm text-muted-foreground ml-2" data-testid={`product-reviews-${product.id}`}>
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        {product.specs && (
          <p className="text-sm text-muted-foreground mb-3" data-testid={`product-specs-${product.id}`}>
            {product.specs}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground" data-testid={`product-price-${product.id}`}>
            {parseInt(product.price).toLocaleString()} FCFA
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
              isAdding 
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            }`}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? "Ajouté!" : product.inStock ? "Ajouter" : "Rupture"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
