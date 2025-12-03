"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const {
    items,
    total,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  const isEmpty = items.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end transition-opacity duration-300"
      onClick={closeCart}
    >
      <div
        className="bg-[#fffafb] w-full max-w-md h-full flex flex-col shadow-2xl animate-slideIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-rose-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {isEmpty ? "Shopping Bag" : `Your Cart (${items.length})`}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Your cart is currently empty.</p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start pb-6 border-b border-dashed border-rose-100 last:border-none"
                >
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={item.image || "https://via.placeholder.com/80x80?text=No+Image"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col h-24 justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                      </div>
                      <p className="text-rose-600 font-semibold mt-1">
                        ৳ {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Control Pill */}
                    <div className="flex items-center">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm">
                        <button
                          className="px-3 py-1 text-gray-500 hover:text-rose-600 transition"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium text-gray-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 text-gray-500 hover:text-rose-600 transition"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && (
          <div className="p-6 bg-white border-t border-rose-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-2xl font-serif font-bold text-gray-900">
                ৳ {total.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">
              Tax included. Shipping calculated at checkout.
            </p>

            <div className="space-y-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full text-center bg-rose-600 text-white py-3.5 rounded-full font-semibold hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200/50 transition-all transform active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>

              <button
                className="w-full text-center text-gray-500 hover:text-gray-800 text-sm font-medium transition py-2"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}