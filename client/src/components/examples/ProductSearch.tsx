import { ProductSearch } from '../ProductSearch';

export default function ProductSearchExample() {
  const products = [
    { id: '1', name: 'Aspirin', price: 5.99, quantity: 150, category: 'Pain Relief' },
    { id: '2', name: 'Amoxicillin', price: 12.50, quantity: 8, category: 'Antibiotic' },
    { id: '3', name: 'Ibuprofen', price: 7.25, quantity: 45, category: 'Pain Relief' },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <ProductSearch 
        products={products}
        onAddToCart={(product) => console.log('Add to cart:', product)}
      />
    </div>
  );
}
