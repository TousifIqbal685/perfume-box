"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    total,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-fadeIn"
      onClick={closeCart}
    >
      <div
        className="bg-white w-full max-w-md h-full p-6 flex flex-col shadow-xl animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            Product successfully added
          </h2>
          <button
            onClick={closeCart}
            className="text-2xl text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center border-b pb-5 last:border-none"
            >
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/80x80?text=No+Image"
                }
                className="w-20 h-20 rounded-lg object-cover shadow"
              />

              <div className="flex-1">
                <p className="font-semibold text-black">{item.title}</p>
                <p className="text-gray-600 text-sm">
                  ৳ {item.price.toLocaleString()}
                </p>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-2 mt-2">

                  {/* - BUTTON */}
                  <button
                    className="px-2 rounded border border-gray-400 text-black bg-white hover:bg-gray-100"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>

                  <span className="text-sm text-black px-1">
                    {item.quantity}
                  </span>

                  {/* + BUTTON */}
                  <button
                    className="px-2 rounded border border-gray-400 text-black bg-white hover:bg-gray-100"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>

                  <button
                    className="ml-auto text-red-500 text-sm hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-black font-medium">Subtotal</span>
            <span className="text-black font-semibold">
              ৳ {total.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-3 pt-2">

            {/* VIEW CART BUTTON */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex-1 text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              View Cart
            </Link>

            {/* CONTINUE SHOPPING BUTTON */}
            <button
              className="flex-1 text-center border border-gray-400 text-black py-2 rounded-md bg-white hover:bg-gray-100 transition"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
