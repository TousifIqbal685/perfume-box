"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext"; 
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart, openCart } = useCart(); 
  
  const [selectedSize, setSelectedSize] = useState<"full" | "5ml" | "10ml">("full");

  // Price Logic
  const activeFullPrice = product.discounted_price > 0 ? product.discounted_price : product.price;
  const hasDecants = product.price_5ml > 0 || product.price_10ml > 0;

  let currentPrice = activeFullPrice;
  if (selectedSize === "5ml") currentPrice = product.price_5ml;
  if (selectedSize === "10ml") currentPrice = product.price_10ml;

  const hasDiscount = selectedSize === "full" && product.discounted_price > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  // --- CRITICAL FIX: GENERATE UNIQUE CART ITEM ---
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // 1. UNIQUE ID GENERATION
    const uniqueId = selectedSize === "full" 
      ? product.id 
      : `${product.id}-${selectedSize}`;

    // 2. UNIQUE TITLE GENERATION
    const uniqueTitle = selectedSize === "full"
      ? product.title
      : `${product.title} (${selectedSize} Decant)`;

    addToCart({
      id: uniqueId, 
      title: uniqueTitle,
      price: currentPrice,
      image: product.main_image_url,
    });
    openCart(); 
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className="group block bg-white rounded-md overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    >
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] bg-[#f8f8f8] flex items-center justify-center overflow-hidden">
        <img
          src={product.main_image_url}
          alt={product.title}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            -{discountPercent}%
          </span>
        )}

        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-black/90 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs py-2 md:py-3 
                     translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20 hover:bg-pink-600"
        >
          Quick Add +
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="p-3 text-left">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
          {product.brand}
        </p>
        
        <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-pink-600 transition-colors">
          {product.title}
        </h3>

        {/* DROPDOWN SELECTOR */}
        {hasDecants && (
          <div className="mb-2" onClick={stopPropagation}>
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as any)}
              className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer font-serif uppercase"
            >
              <option value="full">
                 {product.volume_ml ? `${product.volume_ml} ml` : "Full Bottle"} 
              </option>
              {product.price_5ml > 0 && <option value="5ml">5 ml</option>}
              {product.price_10ml > 0 && <option value="10ml">10 ml</option>}
            </select>
          </div>
        )}
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900 font-serif">
            ৳ {currentPrice.toLocaleString()}
          </span>
          {hasDiscount && selectedSize === 'full' && (
            <span className="text-xs text-gray-400 line-through font-serif">
              ৳ {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}