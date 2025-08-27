import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, Mail, Settings } from "lucide-react";

const suggestionSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email invalide"),
  subject: z.string().min(1, "Sujet requis"),
  category: z.enum(["products", "services", "website", "delivery", "sav", "other"]),
  message: z.string().min(10, "Message requis (minimum 10 caractères)"),
  acceptPrivacy: z.boolean().refine(val => val, "Vous devez accepter la politique de confidentialité"),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

export default function Suggestions() {
  const { toast } = useToast();

  const form = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "products",
      message: "",
      acceptPrivacy: false,
    },
  });

  const createSuggestionMutation = useMutation({
    mutationFn: async (data: SuggestionFormData) => {
      const { acceptPrivacy, ...suggestionData } = data;
      const response = await apiRequest("POST", "/api/suggestions", suggestionData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Suggestion envoyée !",
        description: "Votre suggestion a été envoyée avec succès. Nous vous remercions pour votre retour.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre suggestion. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SuggestionFormData) => {
    createSuggestionMutation.mutate(data);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "products":
        return "Nouveaux produits";
      case "services":
        return "Amélioration des services";
      case "website":
        return "Fonctionnalité du site";
      case "delivery":
        return "Livraison";
      case "sav":
        return "Service après-vente";
      case "other":
        return "Autre";
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="suggestions-title">
            Formulaire de suggestions
          </h1>
          <p className="text-muted-foreground" data-testid="suggestions-description">
            Partagez vos idées, commentaires ou réclamations pour nous aider à améliorer nos services.
          </p>
        </div>

        <Card className="bg-card rounded-xl shadow-sm border border-border">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nom (facultatif)</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    {...form.register("name")}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    {...form.register("email")}
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  placeholder="Le sujet de votre suggestion"
                  {...form.register("subject")}
                  data-testid="input-subject"
                />
                {form.formState.errors.subject && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Catégorie de suggestion *</Label>
                <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value as any)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Nouveaux produits</SelectItem>
                    <SelectItem value="services">Amélioration des services</SelectItem>
                    <SelectItem value="website">Fonctionnalité du site</SelectItem>
                    <SelectItem value="delivery">Livraison</SelectItem>
                    <SelectItem value="sav">Service après-vente</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Décrivez votre suggestion en détail..."
                  {...form.register("message")}
                  data-testid="textarea-message"
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start">
                  <Checkbox
                    checked={form.watch("acceptPrivacy")}
                    onCheckedChange={(checked) => form.setValue("acceptPrivacy", !!checked)}
                    className="mr-3 mt-1"
                    data-testid="checkbox-privacy"
                  />
                  <span className="text-sm text-foreground">
                    J'accepte que mes données soient traitées conformément à la{" "}
                    <Button variant="link" className="p-0 h-auto text-sm underline">
                      politique de confidentialité
                    </Button>{" "}
                    *
                  </span>
                </label>
                {form.formState.errors.acceptPrivacy && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.acceptPrivacy.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createSuggestionMutation.isPending}
                data-testid="button-submit-suggestion"
              >
                {createSuggestionMutation.isPending ? "Envoi en cours..." : "Envoyer ma suggestion"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* How We Handle Suggestions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-8 text-center" data-testid="process-title">
            Comment nous traitons vos suggestions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="process-step-1">Examen</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes les suggestions sont examinées par notre équipe dans un délai de 48 heures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="process-step-2">Retour</h3>
                <p className="text-sm text-muted-foreground">
                  Nous vous contacterons par e-mail si nous avons besoin d'informations supplémentaires.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="process-step-3">Implémentation</h3>
                <p className="text-sm text-muted-foreground">
                  Les suggestions pertinentes sont intégrées dans notre processus d'amélioration continue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
