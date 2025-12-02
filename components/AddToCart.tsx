"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCart({ product, price }: any) {
  const { addToCart, openCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price,
        image: product.main_image_url,
      },
      qty
    );
    openCart();
  };

  return (
    <div className="flex items-center gap-4 mt-6">

      {/* Quantity Selector */}
      <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-3 text-xl hover:text-pink-600"
        >
          –
        </button>

        <span className="px-4 text-lg">{qty}</span>

        <button
          onClick={() => setQty(qty + 1)}
          className="px-3 text-xl hover:text-pink-600"
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        className="bg-black hover:bg-gray-900 text-white px-10 py-3 rounded-lg text-lg font-semibold shadow transition-all"
      >
        Add to Cart
      </button>
    </div>
  );
}
