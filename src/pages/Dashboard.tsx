import { DashboardCard } from "@/components/DashboardCard";
import { AlertCard } from "@/components/AlertCard";
import { Package, DollarSign, TrendingUp, AlertTriangle, Clock, ShoppingCart, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  total_products: number;
  total_sales: number;
  revenue: number;
  transactions: number;
  low_stock_count: number;
  near_expiry_count: number;
  cancelled_transactions: number;
  trends: {
    revenue_change: number;
    transactions_change: number;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your pharmacy operations</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your pharmacy operations</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const formatTrend = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}% from last month`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your pharmacy operations</p>
      </div>

      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Products"
            value={stats.total_products.toString()}
            icon={Package}
          />
          <DashboardCard
            title="Total Sales"
            value={`$${stats.total_sales.toFixed(2)}`}
            icon={DollarSign}
          />
          <DashboardCard
            title="Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            icon={TrendingUp}
            trend={formatTrend(stats.trends.revenue_change)}
            trendPositive={stats.trends.revenue_change >= 0}
          />
          <DashboardCard
            title="Transactions"
            value={stats.transactions.toString()}
            icon={ShoppingCart}
            trend={formatTrend(stats.trends.transactions_change)}
            trendPositive={stats.trends.transactions_change >= 0}
          />
          <DashboardCard
            title="Cancelled Transactions"
            value={stats.cancelled_transactions.toString()}
            icon={XCircle}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <AlertCard
          title="Low Stock Items"
          count={stats.low_stock_count}
          icon={AlertTriangle}
          variant="warning"
        />
        <AlertCard
          title="Near Expiry (30 days)"
          count={stats.near_expiry_count}
          icon={Clock}
          variant="destructive"
        />
      </div>
    </div>
  );
}
