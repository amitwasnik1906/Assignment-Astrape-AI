'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-32">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start exploring our amazing products!
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.items.reduce((total, item) => total + item.quantity, 0)} items in your cart
          </p>
        </div>
        <button
          onClick={handleClearCart}
          disabled={loading}
          className="px-6 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 border border-red-200 transition-all duration-200 disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cart.items.map((cartItem) => (
              <div key={cartItem._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={cartItem.item.image || `https://via.placeholder.com/100x100?text=${encodeURIComponent(cartItem.item.name)}`}
                      alt={cartItem.item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {cartItem.item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {cartItem.item.category}
                      </span>
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{cartItem.item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                      disabled={loading}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                      disabled={loading}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(cartItem.item._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">
                  Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                </span>
                <span className="font-semibold">₹{cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center py-2">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full mb-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() => alert('Checkout functionality would be implemented here')}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}