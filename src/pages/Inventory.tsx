import { useState } from "react";
import { MedicineTable } from "@/components/MedicineTable";
import { AddMedicineDialog } from "@/components/AddMedicineDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const medicines = [
    { id: '1', name: 'Aspirin', category: 'Pain Relief', quantity: 150, price: 5.99, expiryDate: '2025-12-31' },
    { id: '2', name: 'Amoxicillin', category: 'Antibiotic', quantity: 8, price: 12.50, expiryDate: '2024-11-15' },
    { id: '3', name: 'Ibuprofen', category: 'Pain Relief', quantity: 45, price: 7.25, expiryDate: '2025-06-20' },
    { id: '4', name: 'Paracetamol', category: 'Pain Relief', quantity: 5, price: 4.50, expiryDate: '2025-03-10' },
    { id: '5', name: 'Vitamin C', category: 'Vitamin', quantity: 120, price: 8.99, expiryDate: '2025-09-15' },
  ];

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your medicine stock</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-medicine">
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-inventory"
        />
      </div>

      <MedicineTable
        medicines={filteredMedicines}
        onEdit={(med) => console.log('Edit:', med)}
        onDelete={(id) => console.log('Delete:', id)}
      />

      <AddMedicineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => console.log('Add medicine:', data)}
      />
    </div>
  );
}
