import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import ServiceCard from "@/components/service-card";
import { Monitor, Server, Printer, Tv, Search, Star, ShoppingCart, User, Truck, CreditCard, Check, Bolt, HelpCircle, ShoppingBag, Lightbulb } from "lucide-react";

export default function Landing() {
  const featuredProducts = [
    {
      id: "1",
      name: "Ordinateur Portable Pro",
      price: "765 000",
      rating: 5.0,
      reviewCount: 24,
      specs: "Intel i7, 16GB RAM, 512GB SSD",
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isHot: true,
      inStock: true
    },
    {
      id: "2",
      name: "Serveur NAS Pro",
      price: "275 000",
      rating: 5.0,
      reviewCount: 18,
      specs: "4 baies, RAID 5/6, 10G Ethernet",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isHot: false,
      inStock: true
    },
    {
      id: "3",
      name: "Imprimante Laser Pro",
      price: "185 700",
      rating: 5.0,
      reviewCount: 5,
      specs: "A4/A3, 60ppm, Wifi, Scan, Copy",
      imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isHot: false,
      isNew: true,
      inStock: true
    },
    {
      id: "4",
      name: 'Écran 27" 4K',
      price: "65 000",
      rating: 4.0,
      reviewCount: 4,
      specs: "IPS, 99% sRGB, USB-C, adjustement",
      imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isHot: false,
      inStock: true
    }
  ];

  const featuredServices = [
    {
      id: "1",
      name: "Maintenance informatique",
      price: "15 800",
      rating: 5.0,
      reviewCount: 24,
      description: "Nettoyage, mise à jour, prévention",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      id: "2",
      name: "Installation de matériel",
      price: "75 500",
      rating: 5.0,
      reviewCount: 18,
      description: "Ordinateurs, imprimantes, logiciels",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      id: "3",
      name: "Dépannage technique",
      price: "168 700",
      rating: 5.0,
      reviewCount: 5,
      description: "Pannes, virus, récupération",
      imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isNew: true
    },
    {
      id: "4",
      name: "Conseil en informatique",
      price: "65 000",
      rating: 4.0,
      reviewCount: 4,
      description: "Audit, configuration, environnement",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="cbt-gradient py-20 relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
              Votre partenaire technologique,<br />
              solutions professionnelles
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
              Découvrez notre gamme complète de produits informatiques et services professionnels pour répondre à tous vos besoins technologiques.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-discover-solutions">
              Découvrir nos solutions
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 border border-white/20 rounded-3xl transform rotate-45"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 border border-white/20 rounded-3xl transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/20 rounded-2xl transform rotate-12"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 border border-white/20 rounded-2xl transform -rotate-12"></div>
          </div>

          <div className="mt-16 flex justify-center space-x-2">
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-2 h-1 bg-white/50 rounded-full"></div>
            <div className="w-2 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-16 bg-white" data-testid="company-intro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="company-title">
            CBT - Computer & Business Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="company-description">
            Votre partenaire informatique de confiance depuis 2003. Solutions professionnelles au meilleur prix.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button className="bg-primary text-primary-foreground" data-testid="filter-tous">Tous</Button>
            <Button variant="secondary" data-testid="filter-ordinateurs">Ordinateurs</Button>
            <Button variant="secondary" data-testid="filter-peripheriques">Périphériques</Button>
            <Button variant="secondary" data-testid="filter-services">Services</Button>
            <Button variant="secondary" data-testid="filter-mobiliers">Mobiliers</Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" data-testid="button-voir-plus-produits">
              Voir plus de produits
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-muted" data-testid="quick-access">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="quick-access-title">
            Accès rapide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card data-testid="card-prestations">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bolt className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Prestations & Services</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Découvrez nos services de maintenance et installation professionnels.
                </p>
                <Button variant="link" className="text-accent p-0 h-auto font-medium" data-testid="link-prestations">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-apropos">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-foreground mb-2">À propos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre histoire, valeurs et équipe technique professionnelle.
                </p>
                <Button variant="link" className="text-accent p-0 h-auto font-medium" data-testid="link-apropos">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-commandes">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Mes Commandes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suivez vos commandes et consultez l'historique de vos achats.
                </p>
                <Button variant="link" className="text-accent p-0 h-auto font-medium" data-testid="link-commandes">
                  Consulter →
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-suggestions">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Faire une suggestion</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Partagez vos idées pour nous aider à améliorer nos services.
                </p>
                <Button variant="link" className="text-accent p-0 h-auto font-medium" data-testid="link-suggestions">
                  Suggérer →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="services-title">
              Nos Services
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto" data-testid="services-description">
              Services professionnels de maintenance, installation et conseil informatique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Progress Demo */}
      <section className="py-16 bg-muted" data-testid="checkout-demo">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="checkout-demo-title">
            Processus de commande simple
          </h2>
          
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full step-completed flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium mt-2">Panier</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full step-completed flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium mt-2">Identification</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full step-completed flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium mt-2">Livraison</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full step-completed flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium mt-2">Paiement</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full step-completed flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium mt-2">Confirmation</span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="demo-order-confirmed">
                Commande confirmée !
              </h3>
              <p className="text-muted-foreground" data-testid="demo-order-description">
                Processus de commande sécurisé en 5 étapes simples.<br />
                Paiement par chèque ou espèces accepté.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="cbt-gradient py-16" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" data-testid="contact-title">
            Besoin d'aide ? Contactez-nous
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto" data-testid="contact-description">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" data-testid="button-contact-email">
              <i className="fas fa-envelope mr-2"></i>
              contact@cbt.com
            </Button>
            <Button variant="secondary" data-testid="button-contact-phone">
              <i className="fas fa-phone mr-2"></i>
              +229 00000000
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-contact-whatsapp">
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
