import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Products from "@/pages/products";
import Services from "@/pages/services";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import Sav from "@/pages/sav";
import Suggestions from "@/pages/suggestions";
import Admin from "@/pages/admin";
import About from "@/pages/about";
import GuestCart from "@/pages/guest-cart";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          {isLoading || !isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/products" component={Products} />
              <Route path="/services" component={Services} />
              <Route path="/about" component={About} />
              <Route path="/cart" component={GuestCart} />
              <Route path="/suggestions" component={Suggestions} />
              <Route path="/admin">
                {() => {
                  window.location.href = "/api/login";
                  return <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold mb-2">Accès administrateur</h2>
                      <p className="text-muted-foreground mb-4">Redirection vers la page de connexion...</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  </div>;
                }}
              </Route>
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/products" component={Products} />
              <Route path="/services" component={Services} />
              <Route path="/about" component={About} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/orders" component={Orders} />
              <Route path="/sav" component={Sav} />
              <Route path="/admin" component={Admin} />
              <Route path="/suggestions" component={Suggestions} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
