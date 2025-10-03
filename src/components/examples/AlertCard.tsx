import { AlertCard } from '../AlertCard';
import { AlertTriangle } from 'lucide-react';

export default function AlertCardExample() {
  return (
    <div className="p-4">
      <AlertCard 
        title="Low Stock Items"
        count={24}
        icon={AlertTriangle}
        variant="warning"
      />
    </div>
  );
}
