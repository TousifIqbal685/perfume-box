"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";

export default function ProductClient({ product, price: initialPrice, relatedProducts }: any) {
  
  // 1. Ref for the scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [
    product.main_image_url,
    ...(product.product_images?.map((i: any) => i.image_url) || [])
  ].filter(Boolean);

  const [currentImage, setCurrentImage] = useState(images[0]);
  
  // ------------------------------------------------------------------
  // 2. SIZE & PRICE LOGIC
  // ------------------------------------------------------------------
  const [selectedSize, setSelectedSize] = useState<"full" | "5ml" | "10ml">("full");

  // Determine the active price based on selection
  const getActivePrice = () => {
    if (selectedSize === "5ml") return product.price_5ml;
    if (selectedSize === "10ml") return product.price_10ml;
    return initialPrice; // Default (Full Bottle)
  };

  const activePrice = getActivePrice();

  // Create a modified product object for the Cart
  // This ensures the Cart sees "Versace Eros (5ml Decant)" instead of just "Versace Eros"
  const productForCart = {
    ...product,
    price: activePrice, // Override with current selected price
    title: selectedSize === "full" 
      ? product.title 
      : `${product.title} (${selectedSize} Decant)`
  };
  // ------------------------------------------------------------------


  // 3. SAVE TO RECENTLY VIEWED (Local Storage)
  useEffect(() => {
    const item = {
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: initialPrice, // Always save the base price for history
      main_image_url: product.main_image_url,
      slug: product.slug,
    };

    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((i: any) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 12);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product, initialPrice]);


  // 4. Scroll handler function
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <main className="bg-white min-h-screen pb-20 font-sans">
      
      {/* BREADCRUMBS */}
      <div className="px-6 lg:px-20 py-4 text-xs uppercase tracking-widest text-gray-500 border-b border-gray-100 mb-10">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products/all" className="hover:text-black transition">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold">{product.title}</span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-20">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT — IMAGES */}
          <div className="lg:col-span-5">
            <div className="w-full bg-[#f8f8f8] rounded-sm flex items-center justify-center p-6 aspect-[4/5] lg:h-[500px] cursor-zoom-in">
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-auto object-contain mix-blend-multiply drop-shadow-md"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center lg:justify-start">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(img)}
                    className={`shrink-0 w-16 h-16 bg-[#f8f8f8] border transition-all duration-300 
                      ${img === currentImage ? "border-black ring-1 ring-black" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — DETAILS */}
          <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-8">
            
            {/* Brand & Title */}
            <div className="mb-4">
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 block">
                {product.brand}
              </span>
              <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-2xl lg:text-3xl font-medium text-gray-900">
                ৳ {activePrice?.toLocaleString()}
              </span>
              
              {/* Only show crossed out price if Full Bottle is selected AND there is a discount */}
              {selectedSize === "full" && product.discounted_price > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ৳ {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-sm text-gray-600 leading-relaxed mb-8">
              <p>{product.description}</p>
            </div>

            {/* --- ELEGANT SIZE SELECTOR --- */}
            {/* Only show if at least one decant option exists */}
            {(product.price_5ml || product.price_10ml) && (
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 block">
                  Select Size
                </span>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Full Bottle Option */}
                  <button
                    onClick={() => setSelectedSize("full")}
                    className={`relative border rounded-lg p-3 text-center transition-all duration-200 
                      ${selectedSize === "full" 
                        ? "border-black bg-black text-white shadow-md" 
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                  >
                    <span className="block text-xs font-semibold uppercase tracking-wide">Full Bottle</span>
                    <span className={`block text-sm font-medium mt-1 ${selectedSize === 'full' ? 'text-white' : 'text-gray-900'}`}>
                       ৳ {initialPrice.toLocaleString()}
                    </span>
                  </button>

                  {/* 5ml Option */}
                  {product.price_5ml && (
                    <button
                      onClick={() => setSelectedSize("5ml")}
                      className={`relative border rounded-lg p-3 text-center transition-all duration-200 
                        ${selectedSize === "5ml" 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide">5ml Decant</span>
                      <span className={`block text-sm font-medium mt-1 ${selectedSize === '5ml' ? 'text-white' : 'text-gray-900'}`}>
                        ৳ {product.price_5ml.toLocaleString()}
                      </span>
                    </button>
                  )}

                  {/* 10ml Option */}
                  {product.price_10ml && (
                    <button
                      onClick={() => setSelectedSize("10ml")}
                      className={`relative border rounded-lg p-3 text-center transition-all duration-200 
                        ${selectedSize === "10ml" 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide">10ml Decant</span>
                      <span className={`block text-sm font-medium mt-1 ${selectedSize === '10ml' ? 'text-white' : 'text-gray-900'}`}>
                         ৳ {product.price_10ml.toLocaleString()}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-4 border-t border-b border-gray-100 py-6 mb-8 text-sm">
              {product.top_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">TOP NOTES</span>
                  <span className="col-span-2 text-gray-600">{product.top_notes}</span>
                </div>
              )}
              {product.heart_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">HEART NOTES</span>
                  <span className="col-span-2 text-gray-600">{product.heart_notes}</span>
                </div>
              )}
              {product.base_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">BASE NOTES</span>
                  <span className="col-span-2 text-gray-600">{product.base_notes}</span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
               {/* Pass the modified 'productForCart' and 'activePrice' */}
               <AddToCart product={productForCart} price={activePrice} />
            </div>

            {/* Extra Info */}
            <div className="text-xs text-gray-500 space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                {product.stock > 0 ? "In Stock & Ready to Ship" : "Out of Stock"}
              </p>
              <p>• 100% Authentic Guaranteed</p>
              <p>• Free shipping on orders over ৳5,000</p>
            </div>

          </div>
        </div>
      </div> 


      {/* --- "RELATED PRODUCTS" --- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="w-full px-4 md:px-12 mt-24 border-t border-gray-200 pt-16 relative group">
          <div className="max-w-[1800px] mx-auto">
            
            <h2 className="text-2xl font-serif mb-8 px-2">You May Also Like</h2>
            
            <div className="relative">
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all opacity-0 group-hover:opacity-100 duration-300 -ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2"
              >
                {relatedProducts.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/product/${item.slug}`} 
                    className="group/card block w-[160px] md:w-[190px] flex-shrink-0"
                  >
                    <div className="bg-[#f8f8f8] aspect-[4/5] w-full flex items-center justify-center mb-4 relative overflow-hidden rounded-sm">
                      <img 
                        src={item.main_image_url} 
                        alt={item.title} 
                        className="h-[80%] w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{item.brand}</p>
                      <h3 className="text-sm font-serif text-gray-900 group-hover/card:text-pink-600 transition-colors whitespace-nowrap overflow-hidden text-ellipsis px-1">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-gray-900 mt-1">৳ {item.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all opacity-0 group-hover:opacity-100 duration-300 -mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            
            </div>
          </div>
        </div>
      )}

    </main>
  );
}