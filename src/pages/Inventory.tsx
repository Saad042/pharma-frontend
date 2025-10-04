import { useState, useCallback, useEffect } from "react";
import { InventoryContent } from "@/components/InventoryContent";
import { AddMedicineDialog } from "@/components/AddMedicineDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type FilterType = "all" | "low_stock" | "near_expiry";

export default function Inventory() {
  const [searchInput, setSearchInput] = useState(""); // User's input
  const [searchQuery, setSearchQuery] = useState(""); // Debounced value for API
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Determine the endpoint based on filter
  const getEndpoint = () => {
    if (filter === "low_stock") {
      return "/api/medicines/low-stock/";
    } else if (filter === "near_expiry") {
      return "/api/medicines/near-expiry/";
    }
    return "/api/medicines/";
  };

  // Fetch medicines with search, pagination, and filters
  const { data, isLoading, error } = useQuery<MedicinesResponse>({
    queryKey: [getEndpoint(), { search: searchQuery, page, filter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (filter === "all") {
        params.append("page", page.toString());
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${getEndpoint()}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch medicines");
      return res.json();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/medicines/${id}/`);
    },
    onSuccess: () => {
      // Invalidate all medicine-related queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes("/api/medicines");
        }
      });
      toast({
        title: "Success",
        description: "Medicine deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete medicine",
        variant: "destructive",
      });
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingMedicine) {
        await apiRequest("PUT", `/api/medicines/${editingMedicine.id}/`, data);
      } else {
        await apiRequest("POST", "/api/medicines/", data);
      }
    },
    onSuccess: () => {
      // Invalidate all medicine-related queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes("/api/medicines");
        }
      });
      toast({
        title: "Success",
        description: editingMedicine
          ? "Medicine updated successfully"
          : "Medicine created successfully",
      });
      setDialogOpen(false);
      setEditingMedicine(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save medicine",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (medicine: any) => {
    // Find the original medicine with full data
    const originalMedicine = data?.results.find((m) => m.id.toString() === medicine.id);
    if (originalMedicine) {
      setEditingMedicine(originalMedicine);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      deleteMutation.mutate(parseInt(id));
    }
  };

  const handleSubmit = (formData: any) => {
    saveMutation.mutate({
      name: formData.name,
      category: parseInt(formData.category),
      quantity: parseInt(formData.quantity),
      price: formData.price,
      expiry_date: formData.expiryDate,
    });
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingMedicine(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const totalPages = data ? Math.ceil(data.count / 50) : 0;
  const hasNextPage = data?.next !== null;
  const hasPreviousPage = data?.previous !== null;
  const hasActiveFilters = filter !== "all" || searchInput !== "";

  // Transform API data to component format
  const medicines =
    data?.results.map((med) => ({
      id: med.id.toString(),
      name: med.name,
      category: med.category_name,
      quantity: med.quantity,
      price: parseFloat(med.price),
      expiryDate: med.expiry_date,
    })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your medicine stock</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setDialogOpen(true)} data-testid="button-add-medicine">
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            data-testid="input-search-inventory"
          />
        </div>

        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]" data-testid="select-filter">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Medicines</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="near_expiry">Near Expiry</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <InventoryContent
        medicines={medicines}
        isLoading={isLoading}
        error={error}
        isAdmin={isAdmin}
        filter={filter}
        searchQuery={searchInput}
        totalPages={totalPages}
        page={page}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {isAdmin && (
        <AddMedicineDialog
          key={editingMedicine?.id || 'new'}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleSubmit}
          initialData={
            editingMedicine
              ? {
                  name: editingMedicine.name,
                  category: editingMedicine.category.toString(),
                  quantity: editingMedicine.quantity.toString(),
                  price: editingMedicine.price,
                  expiryDate: editingMedicine.expiry_date,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
