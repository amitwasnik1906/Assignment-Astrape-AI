'use client';

import { useEffect, useState } from 'react';
import { itemsAPI } from '@/lib/api';
import { Item } from '@/types';
import ItemCard from '@/components/ItemCard';
import FilterBar from '@/components/FilterBar';

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.search) params.search = filters.search;

      const response = await itemsAPI.getItems(params);
      setItems(response.data.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="text-center mb-12 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Discover Amazing Products
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of premium products designed to enhance your lifestyle
        </p>
      </div>
      
      <FilterBar filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Loading amazing products...</p>
        </div>
      ) : (
        <div className="pb-16">
          {items.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{items.length}</span> products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-32">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0010.586 13H5" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', search: '' })}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}