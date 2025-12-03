"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; 

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { addToCart, openCart } = useCart(); 

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

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

  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const activePrice = item.discounted_price > 0 ? item.discounted_price : item.price;

    addToCart({
        id: item.id,
        title: item.title,
        price: activePrice,
        image: item.main_image_url,
        // quantity: 1 <-- REMOVED THIS LINE
    });
    openCart();
  };

  if (!mounted || products.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-12 py-8 bg-white mb-8 border-b border-gray-100">
      <div className="max-w-[1800px] mx-auto">
        <h2 className="text-2xl font-serif mb-6 px-2 text-gray-900">Recently Viewed</h2>

        <div className="relative group">
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
            {products.map((item: any) => (
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
                  
                   <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="absolute bottom-0 left-0 right-0 bg-black/90 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs py-2 
                               translate-y-0 md:translate-y-full md:group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 hover:bg-pink-600"
                  >
                    Quick Add +
                  </button>
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
    </section>
  );
}