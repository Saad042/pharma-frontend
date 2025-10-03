import { DashboardCard } from '../DashboardCard';
import { Package } from 'lucide-react';

export default function DashboardCardExample() {
  return (
    <div className="p-4">
      <DashboardCard 
        title="Total Products"
        value="1,248"
        icon={Package}
        trend="+12.5% from last month"
        trendPositive={true}
      />
    </div>
  );
}
