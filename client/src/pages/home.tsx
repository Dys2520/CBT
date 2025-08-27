import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import ServiceCard from "@/components/service-card";
import { Link } from "wouter";
import { ShoppingCart, Package, Wrench, HeadphonesIcon } from "lucide-react";

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const featuredProducts = products.slice(0, 4);
  const featuredServices = services.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="cbt-gradient py-20" data-testid="welcome-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="welcome-title">
              Bienvenue chez CBT
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="welcome-description">
              Découvrez nos derniers produits et services informatiques professionnels.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-voir-produits">
                  Voir nos produits
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="secondary" data-testid="button-nos-services">
                  Nos services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white" data-testid="quick-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card data-testid="stat-products">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{products.length}</h3>
                <p className="text-sm text-muted-foreground">Produits disponibles</p>
              </CardContent>
            </Card>

            <Card data-testid="stat-services">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{services.length}</h3>
                <p className="text-sm text-muted-foreground">Services professionnels</p>
              </CardContent>
            </Card>

            <Card data-testid="stat-cart">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{cartItems.length}</h3>
                <p className="text-sm text-muted-foreground">Articles dans le panier</p>
              </CardContent>
            </Card>

            <Card data-testid="stat-orders">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{orders.length}</h3>
                <p className="text-sm text-muted-foreground">Commandes passées</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-background" data-testid="featured-products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground" data-testid="featured-products-title">
                Produits populaires
              </h2>
              <Link href="/products">
                <Button variant="outline" data-testid="button-voir-tous-produits">
                  Voir tous
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-muted" data-testid="featured-services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground" data-testid="featured-services-title">
                Services recommandés
              </h2>
              <Link href="/services">
                <Button variant="outline" data-testid="button-voir-tous-services">
                  Voir tous
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-16 bg-white" data-testid="quick-actions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="quick-actions-title">
            Actions rapides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/cart">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-voir-panier">
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Voir mon panier</h3>
                  <p className="text-muted-foreground">
                    {cartItems.length} article{cartItems.length !== 1 ? 's' : ''} en attente
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-mes-commandes">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Mes commandes</h3>
                  <p className="text-muted-foreground">
                    Suivre le statut de vos achats
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/sav">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-service-apres-vente">
                <CardContent className="p-8 text-center">
                  <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Service après-vente</h3>
                  <p className="text-muted-foreground">
                    Retours et assistance technique
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
