import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleItem {
  id: number;
  medicine: number;
  name: string;
  price: string;
  quantity: number;
  line_total: string;
}

interface Sale {
  id: number;
  customer_name: string;
  customer_phone: string;
  items: SaleItem[];
  subtotal: string;
  tax: string;
  total: string;
  status: "completed" | "cancelled";
  created_by: number;
  created_by_username: string;
  created_at: string;
}

export default function CheckoutSummary() {
  const [, params] = useRoute("/checkout/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const saleId = params?.id;

  // Fetch sale details
  const { data: sale, isLoading, error } = useQuery<Sale>({
    queryKey: [`/api/sales/${saleId}/`],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sales/${saleId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch sale details");
      return res.json();
    },
    enabled: !!saleId,
  });

  useEffect(() => {
    if (!saleId) {
      setLocation("/billing");
    }
  }, [saleId, setLocation]);

  const handleViewPDF = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sales/${saleId}/pdf/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Open PDF in new tab
      window.open(url, "_blank");

      // Clean up the URL after a delay to allow the browser to load it
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "Success",
        description: "Invoice PDF opened in new tab",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sale details...</p>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load sale details</p>
          <Button onClick={() => setLocation("/billing")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/billing")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              sale.status === "completed"
                ? "bg-green-100 dark:bg-green-900"
                : "bg-red-100 dark:bg-red-900"
            }`}
          >
            {sale.status === "completed" ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {sale.status === "completed" ? "Payment Successful!" : "Sale Canceled"}
              </h1>
              <Badge
                variant={sale.status === "completed" ? "default" : "destructive"}
                className={sale.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {sale.status === "completed" ? "Completed" : "Canceled"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Invoice #{sale.id} - {new Date(sale.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{sale.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{sale.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processed by:</span>
              <span className="font-medium">{sale.created_by_username}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">
                    ${parseFloat(item.line_total).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  ${parseFloat(sale.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="tabular-nums">
                  ${parseFloat(sale.tax).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="tabular-nums">
                  ${parseFloat(sale.total).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleViewPDF} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            View Invoice PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/billing")}
          >
            New Sale
          </Button>
        </div>
      </div>
    </div>
  );
}
