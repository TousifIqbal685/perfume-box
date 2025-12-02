"use client";

import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  // Logic to determine active price and discount
  const activePrice = product.discounted_price > 0 ? product.discounted_price : product.price;
  const hasDiscount = product.discounted_price > 0;
  
  // Calculate percentage off
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className="group block bg-white rounded-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      
      {/* IMAGE CONTAINER - Aspect Ratio 4:5 (Tall & Premium) */}
      <div className="relative aspect-[4/5] bg-[#f8f8f8] flex items-center justify-center overflow-hidden">
        <img
          src={product.main_image_url}
          alt={product.title}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="p-3 text-left">
        {/* Brand Name - Small & Uppercase */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
          {product.brand}
        </p>
        
        {/* Title - Limit to 2 lines to keep grid even */}
        <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-pink-600 transition-colors">
          {product.title}
        </h3>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">
            ৳ {activePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ৳ {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}