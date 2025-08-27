import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Mock newsletter subscription
    toast({
      title: "Inscription réussie !",
      description: "Vous recevrez nos offres et actualités par email.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div data-testid="footer-company">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">CBT</span>
              </div>
              <span className="ml-2 text-xl font-bold">CBT</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Votre partenaire informatique de confiance depuis 2003. Solutions professionnelles au meilleur prix.
            </p>
            <p className="text-gray-400 text-xs">
              Solutions professionnelles adaptées aux meilleurs prix.
            </p>
          </div>

          {/* Quick Links */}
          <div data-testid="footer-links">
            <h3 className="text-lg font-bold mb-6">Liens rapides</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-accueil">
                    Accueil
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-prestations">
                    Prestations & Services
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-services">
                    Services
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/orders">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-commandes">
                    Commandes
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/suggestions">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-suggestion">
                    Suggestion
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/sav">
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-sav">
                    SAV
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div data-testid="footer-legal">
            <h3 className="text-lg font-bold mb-6">Informations légales</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-mentions">
                  Mentions légales
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-cgv">
                  Conditions générales de ventes
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-confidentialite">
                  Politique de confidentialité
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto text-sm" data-testid="footer-link-livraisons">
                  Livraisons
                </Button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div data-testid="footer-newsletter">
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Inscrivez-vous pour recevoir nos offres et actualités
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                data-testid="button-newsletter-submit"
              >
                <i className="fas fa-arrow-right"></i>
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm" data-testid="footer-copyright">
          <p>&copy; 2025 CBT - Computer & Business Technology. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
