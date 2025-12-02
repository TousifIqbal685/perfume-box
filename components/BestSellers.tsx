"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import ProductCard from "./ProductCard";
import Link from "next/link";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(4); // Start by showing only 4 items
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      // Fetch ALL best sellers at once so we can just "reveal" them with the button
      // We removed the .limit() so we get the full list to handle pagination locally
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_bestseller", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching best sellers:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchBestSellers();
  }, []);

  // Function to show 4 more items
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (loading) {
    return (
      <section className="py-8 px-4 md:px-10 max-w-[1400px] mx-auto">
        <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        <p className="text-center text-gray-500">Loading Best Sellers...</p>
      </section>
    );
  }

  // If no best sellers are found, don't render the section
  if (products.length === 0) return null;

  return (
    // UPDATED CLASS HERE: Adjusted padding to py-8 for perfect spacing
    <section className="py-8 px-4 md:px-10 max-w-[1400px] mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
          Featured & Best Sellers
        </h2>
        {/* Underline matching the brand color */}
        <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        <p className="text-gray-500 text-base">
          Our most loved and highly-rated scents.
        </p>
      </div>

      {/* GRID: 4 columns on desktop (md:grid-cols-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* We slice the array to only show the number of items in 'visibleCount' */}
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 text-center flex flex-col items-center gap-6">
        
        {/* LOAD MORE BUTTON: Only visible if there are hidden products left */}
        {visibleCount < products.length && (
            <button 
                onClick={handleLoadMore}
                className="px-8 py-3 bg-pink-100 text-gray-800 font-semibold rounded-full hover:text-pink-700 hover:bg-pink-200 transition-all transform active:scale-95 shadow-lg"
            >
                Load More
            </button>
            )}
        <Link 
          href="/products/all" 
          className="inline-block border-b-2 border-pink-600 text-pink-600 font-semibold hover:text-pink-700 hover:border-pink-700 transition-colors pb-1"
        >
          View Full Collection
        </Link>
      </div>
    </section>
  );
}