import { memo } from "react";
import { MedicineTable } from "@/components/MedicineTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
}

interface InventoryContentProps {
  medicines: Medicine[];
  isLoading: boolean;
  error: any;
  isAdmin: boolean;
  filter: string;
  searchQuery: string;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onEdit?: (medicine: any) => void;
  onDelete?: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const InventoryContent = memo(function InventoryContent({
  medicines,
  isLoading,
  error,
  isAdmin,
  filter,
  searchQuery,
  totalPages,
  page,
  hasNextPage,
  hasPreviousPage,
  onEdit,
  onDelete,
  onPageChange,
}: InventoryContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Failed to load medicines</p>
      </div>
    );
  }

  const hasActiveFilters = filter !== "all" || searchQuery !== "";

  return (
    <>
      {hasActiveFilters && (
        <div className="flex gap-2">
          {filter !== "all" && (
            <Badge variant="secondary" data-testid="badge-filter">
              Filter: {filter === "low_stock" ? "Low Stock" : "Near Expiry"}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" data-testid="badge-search">
              Search: {searchQuery}
            </Badge>
          )}
        </div>
      )}

      <MedicineTable
        medicines={medicines}
        onEdit={isAdmin ? onEdit : undefined}
        onDelete={isAdmin ? onDelete : undefined}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPreviousPage}
              data-testid="button-previous-page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
});
