"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  // Start with 8 items (2 rows of 4)
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Load another 2 rows (8 items)
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.slice(0, visibleCount).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Show button only if there are more products to show */}
      {visibleCount < products.length && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-pink-100 text-gray-800 font-semibold rounded-full hover:text-pink-700 hover:bg-pink-200 transition-all transform active:scale-95 shadow-lg"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}