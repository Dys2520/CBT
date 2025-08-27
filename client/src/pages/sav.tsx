import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Phone, Mail, RotateCcw, Headphones } from "lucide-react";

const savTicketSchema = z.object({
  orderId: z.string().min(1, "Numéro de commande requis"),
  orderItemId: z.string().min(1, "Article requis"),
  type: z.enum(["defective_product", "damaged_delivery", "wrong_product", "change_of_mind", "other"]),
  description: z.string().min(10, "Description requise (minimum 10 caractères)"),
});

type SavTicketFormData = z.infer<typeof savTicketSchema>;

export default function Sav() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: savTickets = [] } = useQuery({
    queryKey: ["/api/sav-tickets"],
  });

  const form = useForm<SavTicketFormData>({
    resolver: zodResolver(savTicketSchema),
    defaultValues: {
      orderId: "",
      orderItemId: "",
      type: "defective_product",
      description: "",
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: SavTicketFormData) => {
      const response = await apiRequest("POST", "/api/sav-tickets", data);
      return response.json();
    },
    onSuccess: (ticket) => {
      toast({
        title: "Demande SAV créée !",
        description: `Votre demande ${ticket.ticketNumber} a été enregistrée avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sav-tickets"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande SAV. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SavTicketFormData) => {
    createTicketMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "in_progress":
        return "En cours";
      case "resolved":
        return "Résolu";
      case "closed":
        return "Fermé";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "defective_product":
        return "Produit défectueux";
      case "damaged_delivery":
        return "Produit endommagé à la livraison";
      case "wrong_product":
        return "Mauvais produit livré";
      case "change_of_mind":
        return "Changement d'avis";
      case "other":
        return "Autre";
      default:
        return type;
    }
  };

  const eligibleOrders = orders.filter((order: any) => 
    order.status === "delivered" || order.status === "shipped"
  );

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="sav-title">
            Service Après-Vente
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="sav-description">
            Un problème avec votre commande ? Notre équipe SAV est à votre disposition pour vous aider avec les retours, échanges et résolutions de problèmes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Return Request Form */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-6" data-testid="return-form-title">
                Demande de retour
              </h2>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="orderId">Numéro de commande *</Label>
                  <Select value={form.watch("orderId")} onValueChange={(value) => form.setValue("orderId", value)}>
                    <SelectTrigger data-testid="select-order">
                      <SelectValue placeholder="Choisir une commande" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleOrders.map((order: any) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.orderNumber} - {parseInt(order.total).toLocaleString()} FCFA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.orderId && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.orderId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="orderItemId">Article concerné *</Label>
                  <Select value={form.watch("orderItemId")} onValueChange={(value) => form.setValue("orderItemId", value)}>
                    <SelectTrigger data-testid="select-item">
                      <SelectValue placeholder="Choisir un article" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="item1">Laptop HP ProBook</SelectItem>
                      <SelectItem value="item2">Imprimante Canon</SelectItem>
                      <SelectItem value="item3">Écran 27" 4K</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.orderItemId && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.orderItemId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Type de demande *</Label>
                  <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as any)}>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defective_product">Produit défectueux</SelectItem>
                      <SelectItem value="damaged_delivery">Produit endommagé à la livraison</SelectItem>
                      <SelectItem value="wrong_product">Mauvais produit livré</SelectItem>
                      <SelectItem value="change_of_mind">Changement d'avis</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description du problème *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Décrivez le problème rencontré en détail..."
                    {...form.register("description")}
                    data-testid="textarea-description"
                  />
                  {form.formState.errors.description && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start">
                    <Checkbox className="mr-3 mt-1" data-testid="checkbox-privacy" />
                    <span className="text-sm text-foreground">
                      J'accepte que mes données soient traitées conformément à la{" "}
                      <Button variant="link" className="p-0 h-auto text-sm underline">
                        politique de confidentialité
                      </Button>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createTicketMutation.isPending}
                  data-testid="button-submit-ticket"
                >
                  {createTicketMutation.isPending ? "Envoi en cours..." : "Soumettre la demande"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* SAV Status & Info */}
          <div className="space-y-8">
            {/* Current Returns */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-foreground mb-6" data-testid="current-tickets-title">
                  Mes demandes en cours
                </h2>
                
                {savTickets.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-tickets">
                    <p className="text-muted-foreground">Aucune demande SAV en cours</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savTickets.map((ticket: any) => (
                      <div key={ticket.id} className="border border-border rounded-lg p-4" data-testid={`ticket-${ticket.id}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">Demande {ticket.ticketNumber}</h4>
                            <p className="text-sm text-muted-foreground">Commande {ticket.orderId}</p>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusLabel(ticket.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{getTypeLabel(ticket.type)}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Créée le {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SAV Info */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-foreground mb-6" data-testid="sav-info-title">
                  Informations SAV
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Délais de traitement</h4>
                      <p className="text-sm text-muted-foreground">Les demandes sont traitées sous 2-3 jours ouvrés</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RotateCcw className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Politique de retour</h4>
                      <p className="text-sm text-muted-foreground">Retours acceptés dans les 14 jours après livraison</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Headphones className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Support technique</h4>
                      <p className="text-sm text-muted-foreground">Assistance par email et téléphone</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Contactez notre équipe SAV</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start" data-testid="button-contact-email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email SAV
                    </Button>
                    <Button variant="outline" className="justify-start" data-testid="button-contact-phone">
                      <Phone className="h-4 w-4 mr-2" />
                      Appel SAV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
