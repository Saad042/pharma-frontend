import { useState } from 'react';
import { BillingCart } from '../BillingCart';

export default function BillingCartExample() {
  const [items, setItems] = useState([
    { id: '1', name: 'Aspirin', price: 5.99, quantity: 2 },
    { id: '2', name: 'Ibuprofen', price: 7.25, quantity: 1 },
  ]);

  return (
    <div className="p-4 max-w-md">
      <BillingCart 
        items={items}
        onUpdateQuantity={(id, qty) => {
          setItems(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
        }}
        onRemoveItem={(id) => {
          setItems(items.filter(item => item.id !== id));
        }}
        onCheckout={() => console.log('Checkout clicked')}
      />
    </div>
  );
}
