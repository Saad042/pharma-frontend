import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Sale {
  id: number;
  customer_name: string;
  customer_phone: string;
  subtotal: string;
  tax: string;
  total: string;
  status: "completed" | "cancelled";
  created_by: number;
  created_by_username: string;
  created_at: string;
}

interface SalesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sale[];
}

export default function Sales() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch sales
  const { data, isLoading, error } = useQuery<SalesResponse>({
    queryKey: ["/api/sales/", { search: searchQuery, ordering, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (ordering) {
        params.append("ordering", ordering);
      }
      params.append("page", page.toString());

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sales/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch sales");
      return res.json();
    },
  });

  // Cancel sale mutation
  const cancelMutation = useMutation({
    mutationFn: async (saleId: number) => {
      await apiRequest("POST", `/api/sales/${saleId}/cancel/`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes("/api/sales");
        },
      });
      toast({
        title: "Success",
        description: "Sale cancelled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel sale",
        variant: "destructive",
      });
    },
  });

  const handleRowClick = (saleId: number) => {
    setLocation(`/checkout/${saleId}`);
  };

  const handleCancelSale = (e: React.MouseEvent, saleId: number) => {
    e.stopPropagation(); // Prevent row click
    if (confirm("Are you sure you want to cancel this sale? This action cannot be undone.")) {
      cancelMutation.mutate(saleId);
    }
  };

  const totalPages = data ? Math.ceil(data.count / 50) : 0;
  const hasNextPage = data?.next !== null;
  const hasPreviousPage = data?.previous !== null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales History</h1>
        <p className="text-muted-foreground">View all completed sales</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            data-testid="input-search-sales"
          />
        </div>

        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger className="w-[200px]" data-testid="select-ordering">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">Newest First</SelectItem>
            <SelectItem value="created_at">Oldest First</SelectItem>
            <SelectItem value="-total">Highest Total</SelectItem>
            <SelectItem value="total">Lowest Total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading sales...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-destructive">Failed to load sales</p>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No sales found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Date</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.results.map((sale) => (
                    <TableRow
                      key={sale.id}
                      onClick={() => handleRowClick(sale.id)}
                      className="cursor-pointer hover:bg-muted/50"
                      data-testid={`sale-row-${sale.id}`}
                    >
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell>{sale.customer_name}</TableCell>
                      <TableCell>{sale.customer_phone}</TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        ${parseFloat(sale.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={sale.status === "completed" ? "default" : "destructive"}
                          className={sale.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
                          data-testid={`badge-status-${sale.id}`}
                        >
                          {sale.status === "completed" ? "Completed" : "Canceled"}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.created_by_username}</TableCell>
                      <TableCell>
                        {new Date(sale.created_at).toLocaleString()}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleCancelSale(e, sale.id)}
                            disabled={cancelMutation.isPending || sale.status === "cancelled"}
                            data-testid={`button-cancel-${sale.id}`}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!hasPreviousPage}
                      data-testid="button-previous-page"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!hasNextPage}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
