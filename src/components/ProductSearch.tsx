import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface ProductSearchProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function ProductSearch({
  products,
  onAddToCart,
  isLoading,
  searchValue,
  onSearchChange
}: ProductSearchProps) {
  const [localSearch, setLocalSearch] = useState("");

  const search = searchValue !== undefined ? searchValue : localSearch;
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearch(value);
    }
  };

  const filteredProducts = searchValue !== undefined
    ? products // Already filtered by API
    : products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Search Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            data-testid="input-product-search"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No products found
            </p>
          ) : (
            filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
              data-testid={`product-${product.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.quantity}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold tabular-nums">${product.price.toFixed(2)}</span>
                <Button
                  size="icon"
                  onClick={() => onAddToCart(product)}
                  disabled={product.quantity === 0}
                  data-testid={`button-add-${product.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
