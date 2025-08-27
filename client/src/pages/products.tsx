import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/product-card";
import { Search, Filter } from "lucide-react";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [promotionsOnly, setPromotionsOnly] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", {
      search: searchTerm,
      categoryId: selectedCategory,
      brand: selectedBrand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStockOnly ? true : undefined,
    }],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/product-categories"],
  });

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query dependency
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setPromotionsOnly(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="cbt-gradient py-16" data-testid="products-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4" data-testid="products-title">
              Prestations & Services
            </h1>
            <p className="text-white/90 max-w-3xl mx-auto" data-testid="products-description">
              Découvrez notre gamme complète de produits informatiques et services professionnels pour répondre à tous vos besoins technologiques.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Rechercher un produit ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-card text-foreground"
                data-testid="input-search-products"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                data-testid="button-search-products"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button 
              className="bg-white text-primary" 
              data-testid="tab-nos-produits"
            >
              <i className="fas fa-laptop mr-2"></i>
              Nos Produits
            </Button>
            <Button 
              className="bg-white/20 text-white hover:bg-white hover:text-primary transition-colors"
              data-testid="tab-nos-services"
            >
              <i className="fas fa-tools mr-2"></i>
              Nos Services
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            <Button 
              size="sm"
              className={selectedCategory === "" ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white hover:text-primary"}
              onClick={() => setSelectedCategory("")}
              data-testid="filter-tous"
            >
              Tous
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                className={selectedCategory === category.id ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white hover:text-primary"}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`filter-${category.slug}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-16" data-testid="products-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse" data-testid={`skeleton-product-${i}`}>
                  <div className="h-48 bg-muted rounded-t-xl"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16" data-testid="no-products-found">
              <h3 className="text-xl font-bold text-foreground mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou supprimez les filtres.
              </p>
              <Button onClick={clearFilters} data-testid="button-clear-filters">
                Effacer les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center">
              <Button size="lg" data-testid="button-load-more-products">
                Voir plus de produits
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Advanced Search */}
      <section className="bg-muted py-16" data-testid="advanced-search">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8" data-testid="advanced-search-title">
            Recherche avancée
          </h2>
          <p className="text-muted-foreground mb-8" data-testid="advanced-search-description">
            Trouvez rapidement le produit dont vous avez besoin
          </p>

          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Marque</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger data-testid="select-brand">
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les marques</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prix (FCFA)</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      data-testid="input-min-price"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      data-testid="input-max-price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Disponibilité</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Checkbox
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                        data-testid="checkbox-in-stock"
                      />
                      <span className="ml-2 text-sm">En stock uniquement</span>
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={promotionsOnly}
                        onCheckedChange={setPromotionsOnly}
                        data-testid="checkbox-promotions"
                      />
                      <span className="ml-2 text-sm">Promotions uniquement</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {selectedCategory && (
                  <Button size="sm" className="bg-primary text-primary-foreground" data-testid="active-filter-category">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Button>
                )}
                {selectedBrand && (
                  <Button size="sm" className="bg-primary text-primary-foreground" data-testid="active-filter-brand">
                    {selectedBrand}
                  </Button>
                )}
                {inStockOnly && (
                  <Button size="sm" className="bg-primary text-primary-foreground" data-testid="active-filter-instock">
                    En stock
                  </Button>
                )}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline" onClick={clearFilters} data-testid="button-reset-filters">
                  Réinitialiser
                </Button>
                <Button data-testid="button-apply-filters">
                  Appliquer les filtres
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
