import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
}

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (id: string) => void;
}

export function MedicineTable({ medicines, onEdit, onDelete }: MedicineTableProps) {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity < 10) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { color: "text-chart-4", urgent: true };
    if (days < 30) return { color: "text-chart-3", urgent: true };
    return { color: "text-foreground", urgent: false };
  };

  const showActions = onEdit || onDelete;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.quantity);
            const expiryStatus = getExpiryStatus(medicine.expiryDate);

            return (
              <TableRow key={medicine.id} data-testid={`row-medicine-${medicine.id}`}>
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>{medicine.category}</TableCell>
                <TableCell className="text-right tabular-nums">{medicine.quantity}</TableCell>
                <TableCell className="text-right tabular-nums">Rs{medicine.price.toFixed(2)}</TableCell>
                <TableCell className={expiryStatus.color}>
                  {format(new Date(medicine.expiryDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(medicine)}
                          data-testid={`button-edit-${medicine.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(medicine.id)}
                          data-testid={`button-delete-${medicine.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
