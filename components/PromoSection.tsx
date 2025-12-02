"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import Link from "next/link";

export default function PromoSection() {
  const [ads, setAds] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setAds(data || []);
    };
    fetchAds();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 400; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (ads.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative group">
        
        {/* Title (Optional) */}
        <div className="text-center mb-6">
           <h3 className="text-2xl font-serif font-bold text-gray-800">Exclusive Offers</h3>
        </div>

        {/* Arrow Left */}
        {ads.length > 1 && (
          <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition">
             ❮
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-4"
        >
          {ads.map((ad) => (
            <div key={ad.id} className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[30vw] h-[250px] md:h-[320px] relative rounded-2xl overflow-hidden shadow-md shrink-0 transition-transform hover:scale-[1.01]">
              {ad.link ? (
                <Link href={ad.link} className="block w-full h-full">
                  <img src={ad.image_url} alt="Promo" className="w-full h-full object-cover" />
                </Link>
              ) : (
                <img src={ad.image_url} alt="Promo" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* Arrow Right */}
        {ads.length > 1 && (
          <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition">
             ❯
          </button>
        )}
      </div>
    </section>
  );
}