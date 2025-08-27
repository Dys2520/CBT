import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, User, Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const navigationItems = [
    { href: "/", label: "Accueil" },
    { href: "/products", label: "Produits" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "À propos" },
    { href: "/orders", label: "Commandes", requiresAuth: true },
    { href: "/suggestions", label: "Suggestion" },
    { href: "/sav", label: "SAV", requiresAuth: true },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="logo-link">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">CBT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                if (item.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActiveLink(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary"
                      }`}
                      data-testid={`nav-${item.href.replace("/", "") || "home"}`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* CTA Button */}
            <Link href="/services">
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex"
                size="sm"
                data-testid="button-start-service"
              >
                Commencez ici un service
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {isAuthenticated && cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full min-w-5 h-5 flex items-center justify-center text-xs"
                    data-testid="cart-count"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-sm">
                  <span className="text-foreground">
                    {user?.firstName || user?.email || "Utilisateur"}
                  </span>
                </div>
                <Button 
                  onClick={() => window.location.href = "/api/logout"}
                  variant="ghost" 
                  size="sm"
                  data-testid="button-logout"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  variant="ghost" 
                  size="sm"
                  className="text-sm"
                  data-testid="button-login"
                >
                  <User className="h-4 w-4 mr-1" />
                  Connexion
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => {
                    if (item.requiresAuth && !isAuthenticated) return null;
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            isActiveLink(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-foreground"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid={`mobile-nav-${item.href.replace("/", "") || "home"}`}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
