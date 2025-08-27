import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building, Users, Award, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="about-title">
          À propos de CBT
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="about-subtitle">
          Computer & Business Technology - Votre partenaire de confiance pour tous vos besoins informatiques
        </p>
      </div>

      {/* Company Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-card" data-testid="company-overview">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Notre Histoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Fondée avec la vision de démocratiser l'accès aux technologies informatiques, 
              CBT s'est imposée comme un acteur majeur dans le domaine des services informatiques. 
              Nous accompagnons nos clients dans leur transformation digitale avec des solutions 
              adaptées à leurs besoins spécifiques.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card" data-testid="company-mission">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Fournir des solutions informatiques de qualité, un service après-vente exceptionnel 
              et des conseils d'experts pour aider nos clients à optimiser leur productivité 
              et leur efficacité opérationnelle.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="services-title">
          Nos Domaines d'Expertise
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card" data-testid="expertise-hardware">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Matériel Informatique</h3>
              <p className="text-sm text-muted-foreground">
                Ordinateurs, composants, périphériques et équipements de dernière génération
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card" data-testid="expertise-services">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Services Techniques</h3>
              <p className="text-sm text-muted-foreground">
                Installation, maintenance, réparation et support technique professionnel
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card" data-testid="expertise-support">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">SAV Réactif</h3>
              <p className="text-sm text-muted-foreground">
                Service après-vente disponible 24/7 pour résoudre tous vos problèmes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <Card className="bg-card mb-12" data-testid="company-stats">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            CBT en Chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-clients">
                500+
              </div>
              <p className="text-sm text-muted-foreground">Clients Satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-projects">
                1200+
              </div>
              <p className="text-sm text-muted-foreground">Projets Réalisés</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-support">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">Support Disponible</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-experience">
                10+
              </div>
              <p className="text-sm text-muted-foreground">Années d'Expérience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="values-title">
          Nos Valeurs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-2" data-testid="value-quality">
              Qualité
            </Badge>
            <p className="text-sm text-muted-foreground">
              Produits et services de haute qualité
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-2" data-testid="value-innovation">
              Innovation
            </Badge>
            <p className="text-sm text-muted-foreground">
              Solutions technologiques à la pointe
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-2" data-testid="value-reliability">
              Fiabilité
            </Badge>
            <p className="text-sm text-muted-foreground">
              Engagement et respect des délais
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-2" data-testid="value-proximity">
              Proximité
            </Badge>
            <p className="text-sm text-muted-foreground">
              Relation client personnalisée
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <Separator className="mb-8" />
        <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="contact-cta-title">
          Prêt à démarrer votre projet ?
        </h2>
        <p className="text-muted-foreground mb-6">
          Contactez notre équipe d'experts pour discuter de vos besoins informatiques
        </p>
      </div>
    </div>
  );
}