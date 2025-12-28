"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";

export default function ProductClient({ product, price: initialPrice, relatedProducts }: any) {
  
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

  const getActivePrice = () => {
    if (selectedSize === "5ml") return product.price_5ml;
    if (selectedSize === "10ml") return product.price_10ml;
    return initialPrice; 
  };

  const activePrice = getActivePrice();

  // --- CRITICAL FIX: GENERATE UNIQUE CART ITEM ---
  const productForCart = {
    ...product,
    // 1. UNIQUE ID: Appends size to ID if it's a decant (e.g. "123-5ml")
    id: selectedSize === "full" ? product.id : `${product.id}-${selectedSize}`,
    // 2. UNIQUE TITLE: Appends size text so user sees what they bought
    title: selectedSize === "full" 
      ? product.title 
      : `${product.title} (${selectedSize} Decant)`,
    // 3. ACTIVE PRICE
    price: activePrice, 
  };
  // ------------------------------------------------------------------

  useEffect(() => {
    const item = {
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: initialPrice,
      main_image_url: product.main_image_url,
      slug: product.slug,
    };

    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((i: any) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 12);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product, initialPrice]);

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
    <main className="bg-white min-h-screen pb-10 font-sans">
      
      <div className="px-6 lg:px-20 py-3 text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-100 mb-4">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products/all" className="hover:text-black transition">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold">{product.title}</span>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* LEFT — IMAGES */}
          <div className="lg:col-span-5">
            <div className="w-full bg-[#f8f8f8] rounded-sm flex items-center justify-center p-4 aspect-[4/5] lg:h-[420px] cursor-zoom-in">
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-auto object-contain mix-blend-multiply drop-shadow-md"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center lg:justify-start">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(img)}
                    className={`shrink-0 w-14 h-14 bg-[#f8f8f8] border transition-all duration-300 
                      ${img === currentImage ? "border-black ring-1 ring-black" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — DETAILS */}
          <div className="lg:col-span-7 flex flex-col justify-start pl-0 lg:pl-4 pt-2">
            <div className="mb-2">
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1 block">
                {product.brand}
              </span>
              <h1 className="text-2xl lg:text-3xl font-serif text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-2xl lg:text-3xl font-serif font-medium text-gray-900">
                ৳ {activePrice?.toLocaleString()}
              </span>
              {selectedSize === "full" && product.discounted_price > 0 && (
                <span className="text-sm text-gray-400 line-through font-serif">
                  ৳ {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 leading-relaxed mb-6">
              <p>{product.description}</p>
            </div>

            {/* --- DROPDOWN SIZE SELECTOR --- */}
            {(product.price_5ml || product.price_10ml) && (
              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1 block font-serif">
                  Select Size (ml)
                </label>
                <div className="relative max-w-xs">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as "full" | "5ml" | "10ml")}
                    className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-black focus:border-black block p-2.5 pr-10 cursor-pointer tracking-wide font-serif"
                  >
                    <option value="full">
                      {product.volume_ml ? `${product.volume_ml} ml` : "Full Bottle"} 
                      {" "}- ৳ {initialPrice.toLocaleString()}
                    </option>
                    {product.price_5ml && (
                      <option value="5ml">
                        5ml Decant - ৳ {product.price_5ml.toLocaleString()}
                      </option>
                    )}
                    {product.price_10ml && (
                      <option value="10ml">
                        10ml Decant - ৳ {product.price_10ml.toLocaleString()}
                      </option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 border-t border-b border-gray-100 py-3 mb-5 text-[13px]">
              {product.top_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">TOP NOTES</span>
                  <span className="col-span-2 text-gray-600 truncate">{product.top_notes}</span>
                </div>
              )}
              {product.heart_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">HEART NOTES</span>
                  <span className="col-span-2 text-gray-600 truncate">{product.heart_notes}</span>
                </div>
              )}
              {product.base_notes && (
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-900">BASE NOTES</span>
                  <span className="col-span-2 text-gray-600 truncate">{product.base_notes}</span>
                </div>
              )}
            </div>

            <div className="mb-5">
               <AddToCart product={productForCart} price={activePrice} />
            </div>

            <div className="text-[11px] text-gray-500 space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                {product.stock > 0 ? "In Stock & Ready to Ship" : "Out of Stock"}
              </p>
              <p>• 100% Authentic Guaranteed</p>
              <p>• Free shipping on orders over ৳20,000</p>
            </div>
          </div>
        </div>
      </div> 

      {/* --- RELATED PRODUCTS --- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="w-full px-4 md:px-12 mt-16 border-t border-gray-200 pt-10 relative group">
          <div className="max-w-[1800px] mx-auto">
            <h2 className="text-xl font-serif mb-6 px-2">You May Also Like</h2>
            <div className="relative">
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all opacity-0 group-hover:opacity-100 duration-300 -ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2">
                {relatedProducts.map((item: any) => (
                  <Link key={item.id} href={`/product/${item.slug}`} className="group/card block w-[150px] md:w-[170px] flex-shrink-0">
                    <div className="bg-[#f8f8f8] aspect-[4/5] w-full flex items-center justify-center mb-3 relative overflow-hidden rounded-sm">
                      <img src={item.main_image_url} alt={item.title} className="h-[80%] w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-105"/>
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{item.brand}</p>
                      <h3 className="text-xs font-serif text-gray-900 group-hover/card:text-pink-600 transition-colors whitespace-nowrap overflow-hidden text-ellipsis px-1">{item.title}</h3>
                      <p className="text-xs font-medium text-gray-900 mt-0.5">৳ {item.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all opacity-0 group-hover:opacity-100 duration-300 -mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}