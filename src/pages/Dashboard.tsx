import { DashboardCard } from "@/components/DashboardCard";
import { AlertCard } from "@/components/AlertCard";
import { Package, DollarSign, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your pharmacy operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value="1,248"
          icon={Package}
          trend="+12.5% from last month"
          trendPositive={true}
        />
        <DashboardCard
          title="Total Sales"
          value="$45,231"
          icon={DollarSign}
          trend="+8.2% from last month"
          trendPositive={true}
        />
        <DashboardCard
          title="Revenue"
          value="$12,234"
          icon={TrendingUp}
          trend="+23.1% from last month"
          trendPositive={true}
        />
        <DashboardCard
          title="Transactions"
          value="892"
          icon={TrendingUp}
          trend="+5.3% from last month"
          trendPositive={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AlertCard
          title="Low Stock Items"
          count={24}
          icon={AlertTriangle}
          variant="warning"
        />
        <AlertCard
          title="Near Expiry (30 days)"
          count={12}
          icon={Clock}
          variant="destructive"
        />
      </div>
    </div>
  );
}
