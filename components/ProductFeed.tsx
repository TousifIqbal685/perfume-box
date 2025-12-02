"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { X, Search, SlidersHorizontal } from "lucide-react";

export default function ProductFeed({ initialProducts = [] }: { initialProducts: any[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [visibleCount, setVisibleCount] = useState(12); 

  // --- FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    return initialProducts
      .filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                              p.brand.toLowerCase().includes(search.toLowerCase());
        const price = p.discounted_price || p.price;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        return matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.discounted_price || a.price;
        const priceB = b.discounted_price || b.price;
        if (sort === "price-asc") return priceA - priceB;
        if (sort === "price-desc") return priceB - priceA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); 
      });
  }, [initialProducts, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    setVisibleCount(12);
  }, [search, sort, minPrice, maxPrice]);

  return (
    <div className="relative min-h-[50vh] w-full">
      
      {/* RESULT COUNT */}
      <div className="mb-6 text-center md:text-left px-2">
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          Showing {filteredProducts.length} Results
        </p>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-gray-400">No products match your filters.</h3>
          <button 
            onClick={() => {setSearch(""); setMinPrice(0); setMaxPrice(100000);}} 
            className="mt-4 text-pink-600 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        // --- THIS IS THE LINE THAT CONTROLS SIDE-BY-SIDE ---
        // grid-cols-2 = 2 items per row on mobile
        // lg:grid-cols-5 = 5 items per row on desktop
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {filteredProducts.slice(0, visibleCount).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {visibleCount < filteredProducts.length && (
        <div className="mt-16 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg"
          >
            Load More
          </button>
        </div>
      )}

      {/* --- FLOATING FILTER BUTTON --- */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="fixed bottom-10 right-6 z-[100] bg-black text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center group"
        aria-label="Filter Products"
      >
        <SlidersHorizontal className="w-6 h-6" />
        <span className="absolute right-16 bg-black text-white text-xs font-bold py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Filter
        </span>
      </button>

      {/* --- SIDEBAR DRAWER --- */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[105] backdrop-blur-sm transition-opacity"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-[320px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-serif font-bold text-gray-900">Filter & Sort</h2>
          <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Sort By</h3>
            <div className="space-y-3">
              {[
                { label: "Newest Arrivals", val: "newest" },
                { label: "Price: Low to High", val: "price-asc" },
                { label: "Price: High to Low", val: "price-desc" }
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="sort" checked={sort === opt.val} onChange={() => setSort(opt.val)} className="accent-black w-4 h-4"/>
                  <span className={`text-sm ${sort === opt.val ? "text-black font-bold" : "text-gray-600 group-hover:text-black"}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-gray-100" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Search</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Brand or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition"
              />
            </div>
          </div>
          <hr className="border-gray-100" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Price Range</h3>
            <div className="flex items-center gap-3">
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"/>
              <span className="text-gray-400">-</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"/>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}