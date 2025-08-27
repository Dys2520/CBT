import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MessageCircle, AlertTriangle, Users, TrendingUp, Calendar } from "lucide-react";

export default function Admin() {
  const { data: allOrders = [] } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: allSavTickets = [] } = useQuery({
    queryKey: ["/api/admin/sav-tickets"],
  });

  const { data: allSuggestions = [] } = useQuery({
    queryKey: ["/api/admin/suggestions"],
  });

  // Calculate stats
  const totalRevenue = allOrders.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total || 0), 0
  );

  const pendingOrders = allOrders.filter((order: any) => order.status === "pending").length;
  const activeSavTickets = allSavTickets.filter((ticket: any) => 
    ticket.status === "pending" || ticket.status === "in_progress"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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

  const getStatusLabel = (status: string, type: "order" | "ticket" = "order") => {
    if (type === "ticket") {
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
    }

    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "processing":
        return "En traitement";
      case "shipped":
        return "Expédiée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <TrendingUp className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="admin-title">
            Administration CBT
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-revenue">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalRevenue.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-orders">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Commandes totales</p>
                  <p className="text-2xl font-bold text-foreground">{allOrders.length}</p>
                  <p className="text-xs text-muted-foreground">{pendingOrders} en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-sav">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Tickets SAV</p>
                  <p className="text-2xl font-bold text-foreground">{allSavTickets.length}</p>
                  <p className="text-xs text-muted-foreground">{activeSavTickets} actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-suggestions">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Suggestions</p>
                  <p className="text-2xl font-bold text-foreground">{allSuggestions.length}</p>
                  <p className="text-xs text-muted-foreground">Ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" data-testid="tab-orders">Commandes</TabsTrigger>
            <TabsTrigger value="sav" data-testid="tab-sav">SAV</TabsTrigger>
            <TabsTrigger value="suggestions" data-testid="tab-suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="orders-section-title">Gestion des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {allOrders.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-orders-admin">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune commande trouvée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOrders.slice(0, 10).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`admin-order-${order.id}`}>
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-foreground">{order.orderNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-foreground">
                            {parseInt(order.total).toLocaleString()} FCFA
                          </span>
                          <Button variant="outline" size="sm" data-testid={`button-view-order-admin-${order.id}`}>
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SAV Tab */}
          <TabsContent value="sav" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="sav-section-title">Gestion des tickets SAV</CardTitle>
              </CardHeader>
              <CardContent>
                {allSavTickets.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-sav-admin">
                    <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun ticket SAV trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allSavTickets.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`admin-ticket-${ticket.id}`}>
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-foreground">{ticket.ticketNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusLabel(ticket.status, "ticket")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">
                            {ticket.type.replace("_", " ")}
                          </span>
                          <Button variant="outline" size="sm" data-testid={`button-view-ticket-admin-${ticket.id}`}>
                            Traiter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="suggestions-section-title">Gestion des suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                {allSuggestions.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-suggestions-admin">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune suggestion trouvée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allSuggestions.map((suggestion: any) => (
                      <div key={suggestion.id} className="p-4 border rounded-lg" data-testid={`admin-suggestion-${suggestion.id}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{suggestion.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.email} • {new Date(suggestion.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mt-2">{suggestion.message}</p>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button variant="outline" size="sm" data-testid={`button-reply-suggestion-${suggestion.id}`}>
                            Répondre
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-archive-suggestion-${suggestion.id}`}>
                            Archiver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
