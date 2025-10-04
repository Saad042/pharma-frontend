import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ProductSearch } from "@/components/ProductSearch";
import { BillingCart } from "@/components/BillingCart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: number;
  name: string;
  category: number;
  category_name: string;
  quantity: number;
  price: string;
  expiry_date: string;
  is_low_stock: boolean;
  is_near_expiry: boolean;
  created_at: string;
  updated_at: string;
}

interface MedicinesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Medicine[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Billing() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch medicines with search
  const { data, isLoading } = useQuery<MedicinesResponse>({
    queryKey: ["/api/medicines/", { search: searchQuery }],
  });

  // Create sale mutation
  const checkoutMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const res = await apiRequest("POST", "/api/sales/", saleData);
      return res.json();
    },
    onSuccess: (data) => {
      // Invalidate medicines query to refresh stock quantities
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes("/api/medicines");
        },
      });
      // Clear cart and customer info
      setCartItems([]);
      setCustomerName("");
      setCustomerPhone("");
      // Redirect to checkout summary
      setLocation(`/checkout/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete sale",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity >= product.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.quantity} units available`,
          variant: "destructive",
        });
        return;
      }
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.quantity === 0) {
        toast({
          title: "Out of Stock",
          description: "This medicine is currently out of stock",
          variant: "destructive",
        });
        return;
      }
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    // Find the product to check stock
    const product = products.find(p => p.id === id);
    if (product && quantity > product.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} units available`,
        variant: "destructive",
      });
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (!customerName || !customerPhone) {
      toast({
        title: "Validation Error",
        description: "Please enter customer name and phone number",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      items: cartItems.map(item => ({
        medicine_id: parseInt(item.id),
        quantity: item.quantity,
      })),
    };

    checkoutMutation.mutate(saleData);
  };

  // Transform API data to component format
  const products =
    data?.results.map((med) => ({
      id: med.id.toString(),
      name: med.name,
      price: parseFloat(med.price),
      quantity: med.quantity,
      category: med.category_name,
    })) || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Create invoices and manage sales</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                data-testid="input-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number</Label>
              <Input
                id="customer-phone"
                placeholder="Enter phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                data-testid="input-customer-phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <ProductSearch
          products={products}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
        />
        <BillingCart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          isCheckingOut={checkoutMutation.isPending}
        />
      </div>
    </div>
  );
}
