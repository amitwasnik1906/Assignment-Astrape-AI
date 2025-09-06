'use client';

import Image from 'next/image';
import { Item } from '@/types';
import { useCart } from '@/context/CartContext';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(item._id);
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <div className="card shadow-xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl">
      <div className="relative h-48">
        <Image
          src={item.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}`}
          alt={item.name}
          fill
          className="object-cover"
        />
        {!item.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-black">
          ₹{item.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!item.inStock || loading}
            className={`btn-primary bg-blue-600 p-1 text-sm transition-transform duration-200 ${
              (!item.inStock || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-blue-600 hover:cursor-pointer'
            }`}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
