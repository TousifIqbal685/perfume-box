"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import ProductCard from "./ProductCard"; // Using your shared component
import Link from "next/link";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ref for the horizontal scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBestSellers() {
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <section className="py-12 w-full px-2 md:px-6">
        <div className="w-16 h-1 bg-gray-200 mx-auto my-4 rounded-full animate-pulse"></div>
        <p className="text-center text-gray-400 text-sm">Loading Best Sellers...</p>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white w-full px-2 md:px-6 border-t border-gray-100">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
          Featured & Best Sellers
        </h2>
        <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        <p className="text-gray-500 text-sm md:text-base">
          Our most loved and highly-rated scents.
        </p>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className="relative group max-w-[1800px] mx-auto">
        
        {/* Left Arrow Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all transform -translate-x-3 opacity-0 group-hover:opacity-100 duration-300"
          aria-label="Scroll Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollRef}
          className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
        >
          {products.map((product) => (
            // --- FIX HERE: Explicit widths ensure they don't stretch huge ---
            // Mobile: 160px wide (fits 2 easily on screen)
            // Desktop: 240px wide (standard size)
            <div key={product.id} className="min-w-[160px] w-[160px] md:min-w-[240px] md:w-[240px] flex-shrink-0">
               <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all transform translate-x-3 opacity-0 group-hover:opacity-100 duration-300"
          aria-label="Scroll Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </div>

      {/* FOOTER LINK */}
      <div className="mt-10 text-center">
        <Link 
          href="/products/all" 
          className="inline-block border-b-2 border-black text-black font-bold hover:text-pink-600 hover:border-pink-600 transition-colors pb-1 text-sm tracking-wide uppercase"
        >
          View Full Collection
        </Link>
      </div>
    </section>
  );
}