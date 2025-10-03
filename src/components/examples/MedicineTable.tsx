import { MedicineTable } from '../MedicineTable';

export default function MedicineTableExample() {
  const medicines = [
    { id: '1', name: 'Aspirin', category: 'Pain Relief', quantity: 150, price: 5.99, expiryDate: '2025-12-31' },
    { id: '2', name: 'Amoxicillin', category: 'Antibiotic', quantity: 8, price: 12.50, expiryDate: '2024-11-15' },
    { id: '3', name: 'Ibuprofen', category: 'Pain Relief', quantity: 45, price: 7.25, expiryDate: '2025-06-20' },
  ];

  return (
    <div className="p-4">
      <MedicineTable 
        medicines={medicines}
        onEdit={(med) => console.log('Edit:', med)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  );
}
