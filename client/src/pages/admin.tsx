import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Package, 
  MessageCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Calendar,
  ShoppingCart,
  Euro,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  Warehouse,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Target,
  Zap
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Données de test pour l'admin - Version étendue avec plus de données
  const testOrders = [
    { id: "CBT-021", client: "Jean Dupont", email: "jean@example.com", date: "2023-06-15", time: "10:30", total: 500, status: "pending", payment: "Chèque", month: "Juin", category: "Électronique" },
    { id: "CBT-022", client: "Marie Martin", email: "marie@example.com", date: "2023-06-15", time: "14:20", total: 750, status: "confirmed", payment: "Carte", month: "Juin", category: "Périphériques" },
    { id: "CBT-023", client: "Paul Durand", email: "paul@example.com", date: "2023-06-15", time: "16:45", total: 300, status: "shipped", payment: "Virement", month: "Juin", category: "Accessoires" },
    { id: "CBT-024", client: "Sophie Petit", email: "sophie@example.com", date: "2023-06-16", time: "09:15", total: 1200, status: "delivered", payment: "Carte", month: "Juin", category: "Électronique" },
    { id: "CBT-025", client: "Luc Bernard", email: "luc@example.com", date: "2023-06-16", time: "11:30", total: 450, status: "cancelled", payment: "Chèque", month: "Juin", category: "Périphériques" },
    { id: "CBT-026", client: "Emma Dubois", email: "emma@example.com", date: "2023-05-20", time: "14:00", total: 890, status: "delivered", payment: "Carte", month: "Mai", category: "Électronique" },
    { id: "CBT-027", client: "Lucas Moreau", email: "lucas@example.com", date: "2023-05-22", time: "11:15", total: 320, status: "delivered", payment: "Virement", month: "Mai", category: "Accessoires" },
    { id: "CBT-028", client: "Chloé Leroy", email: "chloe@example.com", date: "2023-05-25", time: "16:30", total: 680, status: "delivered", payment: "Carte", month: "Mai", category: "Périphériques" },
    { id: "CBT-029", client: "Hugo Simon", email: "hugo@example.com", date: "2023-04-10", time: "09:45", total: 1500, status: "delivered", payment: "Virement", month: "Avril", category: "Électronique" },
    { id: "CBT-030", client: "Léa Petit", email: "lea@example.com", date: "2023-04-15", time: "13:20", total: 420, status: "delivered", payment: "Carte", month: "Avril", category: "Accessoires" },
  ];

  const testProducts = [
    { id: "PDT-021", name: "Ordinateur portable", category: "Électronique", price: "500€", stock: 15, status: "in_stock" },
    { id: "PDT-022", name: "Clavier mécanique", category: "Périphériques", price: "80€", stock: 3, status: "low_stock" },
    { id: "PDT-023", name: "Souris ergonomique", category: "Périphériques", price: "45€", stock: 0, status: "out_of_stock" },
    { id: "PDT-024", name: "Écran 24 pouces", category: "Électronique", price: "250€", stock: 8, status: "in_stock" },
  ];

  const testCategories = [
    { id: "1", name: "Électronique", description: "Produits électroniques divers", productCount: 4, color: "green" },
    { id: "2", name: "Périphériques", description: "Périphériques informatiques", productCount: 4, color: "blue" },
    { id: "3", name: "Accessoires", description: "Accessoires et câbles", productCount: 4, color: "orange" },
  ];

  const testClients = [
    { id: "1", name: "Jean Dupont", email: "jean@example.com", phone: "06 12 34 56 78", orders: 5, totalSpent: "2500€", status: "active" },
    { id: "2", name: "Marie Martin", email: "marie@example.com", phone: "06 87 65 43 21", orders: 3, totalSpent: "1800€", status: "active" },
    { id: "3", name: "Paul Durand", email: "paul@example.com", phone: "06 55 44 33 22", orders: 1, totalSpent: "300€", status: "inactive" },
  ];

  const testSavTickets = [
    { id: "SAV-001", client: "Jean Dupont", product: "Ordinateur portable", issue: "Écran défaillant", status: "pending", date: "15/06/2023", priority: "high", responseTime: 2.5, satisfaction: 4 },
    { id: "SAV-002", client: "Marie Martin", product: "Clavier mécanique", issue: "Touches bloquées", status: "in_progress", date: "14/06/2023", priority: "medium", responseTime: 1.8, satisfaction: 5 },
    { id: "SAV-003", client: "Paul Durand", product: "Souris", issue: "Clic défaillant", status: "resolved", date: "10/06/2023", priority: "low", responseTime: 0.5, satisfaction: 4.5 },
    { id: "SAV-004", client: "Emma Dubois", product: "Écran", issue: "Pixels morts", status: "resolved", date: "08/06/2023", priority: "medium", responseTime: 1.2, satisfaction: 5 },
    { id: "SAV-005", client: "Lucas Moreau", product: "Disque dur", issue: "Corruption données", status: "resolved", date: "05/06/2023", priority: "high", responseTime: 0.8, satisfaction: 4.8 },
  ];

  // Données pour les graphiques
  const monthlyRevenueData = [
    { month: "Jan", revenue: 4200, orders: 28, clients: 15 },
    { month: "Feb", revenue: 3800, orders: 25, clients: 18 },
    { month: "Mar", revenue: 5100, orders: 35, clients: 22 },
    { month: "Apr", revenue: 4700, orders: 32, clients: 20 },
    { month: "Mai", revenue: 6200, orders: 42, clients: 28 },
    { month: "Jun", revenue: 7813, orders: 53, clients: 35 },
  ];

  const categoryData = [
    { name: "Électronique", value: 45, count: 68, color: "#8884d8" },
    { name: "Périphériques", value: 30, count: 45, color: "#82ca9d" },
    { name: "Accessoires", value: 25, count: 40, color: "#ffc658" },
  ];

  const orderStatusData = [
    { status: "Livrées", count: 134, percentage: 76 },
    { status: "En cours", count: 23, percentage: 13 },
    { status: "En attente", count: 18, percentage: 10 },
    { status: "Annulées", count: 5, percentage: 1 },
  ];

  const performanceMetrics = {
    conversionRate: 3.2,
    averageOrderValue: 145,
    customerRetention: 68,
    responseTime: 1.4,
    satisfaction: 4.6
  };

  // Calculs statistiques avancés
  const statistics = useMemo(() => {
    const totalOrders = testOrders.length;
    const totalRevenue = testOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = testOrders.filter(order => order.status === "pending").length;
    const deliveredOrders = testOrders.filter(order => order.status === "delivered").length;
    const cancelledOrders = testOrders.filter(order => order.status === "cancelled").length;
    
    const currentMonthOrders = testOrders.filter(order => order.month === "Juin");
    const lastMonthOrders = testOrders.filter(order => order.month === "Mai");
    
    const revenueGrowth = lastMonthOrders.length > 0 
      ? ((currentMonthOrders.reduce((sum, order) => sum + order.total, 0) - 
          lastMonthOrders.reduce((sum, order) => sum + order.total, 0)) / 
          lastMonthOrders.reduce((sum, order) => sum + order.total, 0) * 100)
      : 0;

    const averageOrderValue = totalRevenue / totalOrders;
    const conversionRate = (deliveredOrders / totalOrders) * 100;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueGrowth: Math.round(revenueGrowth),
      averageOrderValue: Math.round(averageOrderValue),
      conversionRate: Math.round(conversionRate),
    };
  }, [testOrders]);

  const getStatusBadge = (status: string, type: string = "order") => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800", 
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      in_stock: "bg-green-100 text-green-800",
      low_stock: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };

    const labels = {
      pending: "En attente",
      confirmed: "Confirmée", 
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
      in_stock: "En stock",
      low_stock: "Stock bas",
      out_of_stock: "Épuisé",
      in_progress: "En cours",
      resolved: "Résolu",
      active: "Actif",
      inactive: "Inactif",
      high: "Haute",
      medium: "Moyenne",
      low: "Basse"
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles]} border-0`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? '↗' : '↘'} {change}
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1f71] text-white p-6 fixed h-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold">CBT Admin</h1>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm opacity-80">Administrateur</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "dashboard" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-dashboard"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Tableau de bord</span>
          </button>
          
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "orders" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-orders"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Commandes</span>
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "products" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-products"
          >
            <Package className="h-5 w-5" />
            <span>Produits</span>
          </button>
          
          <button
            onClick={() => setActiveTab("services")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "services" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-services"
          >
            <Settings className="h-5 w-5" />
            <span>Services</span>
          </button>
          
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "categories" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-categories"
          >
            <Grid3X3 className="h-5 w-5" />
            <span>Catégories</span>
          </button>
          
          <button
            onClick={() => setActiveTab("clients")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "clients" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-clients"
          >
            <Users className="h-5 w-5" />
            <span>Clients</span>
          </button>
          
          <button
            onClick={() => setActiveTab("sav")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "sav" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-sav"
          >
            <MessageCircle className="h-5 w-5" />
            <span>SAV</span>
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "settings" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            data-testid="nav-settings"
          >
            <Settings className="h-5 w-5" />
            <span>Paramètre</span>
          </button>
          
          <button
            onClick={() => window.location.href = "/api/logout"}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors"
            data-testid="nav-logout"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "dashboard" && "Tableau de bord"}
            {activeTab === "orders" && "Gestion des Commandes"}
            {activeTab === "products" && "Gestion des Produits"}
            {activeTab === "services" && "Gestion des Services"}
            {activeTab === "categories" && "Gestion des Catégories"}
            {activeTab === "clients" && "Gestion des Clients"}
            {activeTab === "sav" && "Service Après-Vente"}
            {activeTab === "settings" && "Paramètres"}
          </h1>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Primary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Commandes totales"
                  value={statistics.totalOrders.toString()}
                  icon={ShoppingCart}
                  change={`+12% depuis le mois dernier`}
                  changeType="increase"
                />
                <StatCard
                  title="Revenus"
                  value={`${statistics.totalRevenue}€`}
                  icon={Euro}
                  change={`+${statistics.revenueGrowth}% depuis le mois dernier`}
                  changeType={statistics.revenueGrowth > 0 ? "increase" : "decrease"}
                />
                <StatCard
                  title="Clients actifs"
                  value="35"
                  icon={Users}
                  change="+25% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Taux de conversion"
                  value={`${statistics.conversionRate}%`}
                  icon={Target}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Panier moyen</p>
                        <p className="text-2xl font-bold">{statistics.averageOrderValue}€</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                    <Progress value={75} className="mt-3" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rétention client</p>
                        <p className="text-2xl font-bold">{performanceMetrics.customerRetention}%</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                    <Progress value={performanceMetrics.customerRetention} className="mt-3" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Temps réponse SAV</p>
                        <p className="text-2xl font-bold">{performanceMetrics.responseTime}j</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                    <Progress value={70} className="mt-3" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                        <p className="text-2xl font-bold">{performanceMetrics.satisfaction}/5</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-purple-500" />
                    </div>
                    <Progress value={92} className="mt-3" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Stock bas</p>
                        <p className="text-2xl font-bold text-red-600">5</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <Progress value={15} className="mt-3" />
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <Card className="col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Évolution du chiffre d'affaires
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? `${value}€` : value,
                            name === 'revenue' ? 'Revenus' : name === 'orders' ? 'Commandes' : 'Clients'
                          ]}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3}
                          name="Revenus"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          fillOpacity={0.3}
                          name="Commandes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Ventes par catégorie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Status Overview & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>État des commandes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orderStatusData.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'Livrées' ? 'bg-green-500' :
                            item.status === 'En cours' ? 'bg-blue-500' :
                            item.status === 'En attente' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.count}</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Nouvelle commande</p>
                          <p className="text-sm text-muted-foreground">CBT-024 - Sophie Petit - 1200€</p>
                          <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Package className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Commande livrée</p>
                          <p className="text-sm text-muted-foreground">CBT-021 - Jean Dupont</p>
                          <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Stock bas</p>
                          <p className="text-sm text-muted-foreground">Clavier mécanique - 3 restants</p>
                          <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Nouveau ticket SAV</p>
                          <p className="text-sm text-muted-foreground">SAV-001 - Écran défaillant</p>
                          <p className="text-xs text-muted-foreground">Il y a 8 heures</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Button className="flex flex-col items-center gap-2 h-20" onClick={() => setActiveTab("orders")} data-testid="quick-action-orders">
                      <ShoppingCart className="h-6 w-6" />
                      <span className="text-sm">Commandes</span>
                    </Button>
                    <Button className="flex flex-col items-center gap-2 h-20" onClick={() => setActiveTab("products")} data-testid="quick-action-products">
                      <Package className="h-6 w-6" />
                      <span className="text-sm">Produits</span>
                    </Button>
                    <Button className="flex flex-col items-center gap-2 h-20" onClick={() => setActiveTab("clients")} data-testid="quick-action-clients">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Clients</span>
                    </Button>
                    <Button className="flex flex-col items-center gap-2 h-20" onClick={() => setActiveTab("sav")} data-testid="quick-action-sav">
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-sm">SAV</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center gap-2 h-20" data-testid="quick-action-export">
                      <Download className="h-6 w-6" />
                      <span className="text-sm">Exporter</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center gap-2 h-20" onClick={() => setActiveTab("settings")} data-testid="quick-action-settings">
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">Paramètres</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Commandes"
                  value="153"
                  icon={ShoppingCart}
                  change="+12% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="En attente"
                  value="18"
                  icon={Calendar}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Livrées"
                  value="134"
                  icon={Package}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Annulées"
                  value="5"
                  icon={AlertTriangle}
                  change="-2% depuis le mois dernier"
                  changeType="decrease"
                />
              </div>

              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher"
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="search-orders"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="filter-status">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" placeholder="Date de début" className="w-48" data-testid="date-start" />
                  <Input type="date" placeholder="Date de fin" className="w-48" data-testid="date-end" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" data-testid="button-filters">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres avancés
                  </Button>
                  <Button variant="outline" data-testid="button-export">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button data-testid="button-new-order">
                    Nouvelle commande
                  </Button>
                </div>
              </div>

              {/* Orders Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left p-4 font-medium">ID</th>
                          <th className="text-left p-4 font-medium">Client</th>
                          <th className="text-left p-4 font-medium">Date</th>
                          <th className="text-left p-4 font-medium">Total</th>
                          <th className="text-left p-4 font-medium">Statut</th>
                          <th className="text-left p-4 font-medium">Paiement</th>
                          <th className="text-left p-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testOrders.map((order) => (
                          <tr key={order.id} className="border-t hover:bg-gray-50">
                            <td className="p-4">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-4 font-medium">{order.id}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{order.client}</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p>{order.date}</p>
                                <p className="text-sm text-muted-foreground">{order.time}</p>
                              </div>
                            </td>
                            <td className="p-4 font-medium">{order.total}€</td>
                            <td className="p-4">{getStatusBadge(order.status)}</td>
                            <td className="p-4">{order.payment}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" data-testid={`view-order-${order.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`edit-order-${order.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`delete-order-${order.id}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Affichage de 1 à 5 sur 24 résultats
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, "...", 6, 7].map((page, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={page === 1 ? "default" : "outline"}
                          className="w-8 h-8"
                          data-testid={`page-${page}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="En stock"
                  value="153"
                  icon={Package}
                  change="+12% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Stock bas"
                  value="18"
                  icon={AlertTriangle}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Livrées"
                  value="134"
                  icon={ShoppingCart}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Épuisées"
                  value="5"
                  icon={AlertTriangle}
                  change="-2% depuis le mois dernier"
                  changeType="decrease"
                />
              </div>

              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher"
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="search-products"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48" data-testid="filter-product-status">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="in_stock">En stock</SelectItem>
                      <SelectItem value="low_stock">Stock bas</SelectItem>
                      <SelectItem value="out_of_stock">Épuisé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" placeholder="Date de début" className="w-48" data-testid="product-date-start" />
                  <Input type="date" placeholder="Date de fin" className="w-48" data-testid="product-date-end" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-yellow-500 text-white" data-testid="button-category">
                    Catégorie
                  </Button>
                  <Button data-testid="button-new-product">
                    Nouveau produit
                  </Button>
                </div>
              </div>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des produits</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left p-4 font-medium">ID</th>
                          <th className="text-left p-4 font-medium">Nom</th>
                          <th className="text-left p-4 font-medium">Catégorie</th>
                          <th className="text-left p-4 font-medium">Prix</th>
                          <th className="text-left p-4 font-medium">Stock</th>
                          <th className="text-left p-4 font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testProducts.map((product) => (
                          <tr key={product.id} className="border-t hover:bg-gray-50">
                            <td className="p-4">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-4 font-medium">{product.id}</td>
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">{product.price}</td>
                            <td className="p-4">{product.stock}</td>
                            <td className="p-4">{getStatusBadge(product.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Affichage de 1 à 5 sur 24 résultats
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, "...", 6, 7].map((page, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={page === 1 ? "default" : "outline"}
                          className="w-8 h-8"
                          data-testid={`product-page-${page}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <Tabs value="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="products" className="flex items-center gap-2" data-testid="tab-products">
                    <Package className="h-4 w-4" />
                    Produits
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="flex items-center gap-2" data-testid="tab-categories">
                    <Grid3X3 className="h-4 w-4" />
                    Catégories
                  </TabsTrigger>
                  <TabsTrigger value="stock" className="flex items-center gap-2" data-testid="tab-stock">
                    <Warehouse className="h-4 w-4" />
                    Gestion de stock
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="categories" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gestion des produits</h2>
                    <Button data-testid="button-add-category">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une catégorie
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testCategories.map((category) => (
                      <Card key={category.id} className={`border-l-4 ${
                        category.color === 'green' ? 'border-l-green-500' : 
                        category.color === 'blue' ? 'border-l-blue-500' : 
                        'border-l-orange-500'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{category.name}</h3>
                              <p className="text-muted-foreground text-sm">{category.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`edit-category-${category.id}`}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600" data-testid={`delete-category-${category.id}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm inline-block">
                            {category.productCount} produits
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Clients</h2>
                <Button data-testid="button-add-client">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau client
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Clients"
                  value="13"
                  icon={Users}
                  change="+5% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Clients Actifs"
                  value="10"
                  icon={Users}
                  change="+3% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Nouveaux ce mois"
                  value="2"
                  icon={Users}
                  change="+100% depuis le mois dernier"
                  changeType="increase"
                />
                <StatCard
                  title="Chiffre d'affaires moyen"
                  value="1535€"
                  icon={Euro}
                  change="+8% depuis le mois dernier"
                  changeType="increase"
                />
              </div>

              {/* Clients Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Nom</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Téléphone</th>
                          <th className="text-left p-4 font-medium">Commandes</th>
                          <th className="text-left p-4 font-medium">Total dépensé</th>
                          <th className="text-left p-4 font-medium">Statut</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testClients.map((client) => (
                          <tr key={client.id} className="border-t hover:bg-gray-50">
                            <td className="p-4 font-medium">{client.name}</td>
                            <td className="p-4">{client.email}</td>
                            <td className="p-4">{client.phone}</td>
                            <td className="p-4">{client.orders}</td>
                            <td className="p-4 font-medium">{client.totalSpent}</td>
                            <td className="p-4">{getStatusBadge(client.status)}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" data-testid={`view-client-${client.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`edit-client-${client.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Services</h2>
                <Button data-testid="button-add-service">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau service
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Services Actifs"
                  value="12"
                  icon={Settings}
                  change="+2 ce mois"
                  changeType="increase"
                />
                <StatCard
                  title="Réservations"
                  value="45"
                  icon={Calendar}
                  change="+15% ce mois"
                  changeType="increase"
                />
                <StatCard
                  title="Revenus Services"
                  value="3240€"
                  icon={Euro}
                  change="+12% ce mois"
                  changeType="increase"
                />
                <StatCard
                  title="Satisfaction"
                  value="4.8/5"
                  icon={MessageCircle}
                  change="+0.2 ce mois"
                  changeType="increase"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Services disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de gestion des services en cours de développement...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SAV Tab */}
          {activeTab === "sav" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Service Après-Vente</h2>
                <Button data-testid="button-new-ticket">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau ticket
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Tickets Ouverts"
                  value="8"
                  icon={MessageCircle}
                  change="-2 cette semaine"
                  changeType="decrease"
                />
                <StatCard
                  title="En Cours"
                  value="3"
                  icon={Settings}
                  change="Stable"
                  changeType="increase"
                />
                <StatCard
                  title="Résolus ce mois"
                  value="24"
                  icon={Package}
                  change="+20% ce mois"
                  changeType="increase"
                />
                <StatCard
                  title="Temps moyen"
                  value="2.1j"
                  icon={Calendar}
                  change="-0.3j ce mois"
                  changeType="decrease"
                />
              </div>

              {/* SAV Tickets Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Ticket ID</th>
                          <th className="text-left p-4 font-medium">Client</th>
                          <th className="text-left p-4 font-medium">Produit</th>
                          <th className="text-left p-4 font-medium">Problème</th>
                          <th className="text-left p-4 font-medium">Priorité</th>
                          <th className="text-left p-4 font-medium">Statut</th>
                          <th className="text-left p-4 font-medium">Date</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testSavTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-t hover:bg-gray-50">
                            <td className="p-4 font-medium">{ticket.id}</td>
                            <td className="p-4">{ticket.client}</td>
                            <td className="p-4">{ticket.product}</td>
                            <td className="p-4">{ticket.issue}</td>
                            <td className="p-4">{getStatusBadge(ticket.priority)}</td>
                            <td className="p-4">{getStatusBadge(ticket.status)}</td>
                            <td className="p-4">{ticket.date}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" data-testid={`view-ticket-${ticket.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`edit-ticket-${ticket.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Paramètres</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Configuration du système</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de paramétrage en cours de développement...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}