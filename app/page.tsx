"use client";

import { useEffect, useState, useCallback, Suspense } from "react"; // 1. Import Suspense
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import BestSellers from "@/components/BestSellers";
import RecentlyViewed from "@/components/RecentlyViewed";
import PromoSection from "@/components/PromoSection";
import ProductFeed from "@/components/ProductFeed";

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // --- CAROUSEL DATA ---
  const carouselSlides = [
    {
      src: "/Gemini_Generated_Image_qgakguqgakguqgak.png",
      title: "Designer Elegance",
      subtitle: "Timeless scents for every occasion.",
      link: "/products/designer",
      cta: "Shop Designer",
    },
    {
      src: "/unnamed (1).jpg",
      title: "Niche Masterpieces",
      subtitle: "Exclusive fragrances for the unique you.",
      link: "/products/niche",
      cta: "Discover Niche",
    },
    {
      src: "/arabian.png",
      title: "Arabian Ouds",
      subtitle: "Rich, exotic, and long-lasting.",
      link: "/products/arabian",
      cta: "Explore Arabian",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- SLIDER LOGIC ---
  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
  }, [carouselSlides.length]);

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  // --- SWIPE / DRAG HANDLERS ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // 1. TOUCH EVENTS (Mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // 2. MOUSE EVENTS (Desktop "Click & Drag")
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
        setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
        setTouchStart(null);
        return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // --- AUTO SLIDE ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 8000); 
    return () => clearInterval(intervalId);
  }, [nextSlide]); 

  // --- DATA FETCH ---
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, brand, slug, price, discounted_price, main_image_url, stock, category_id, created_at")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      
      setAllProducts(data || []);
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-b-[2.5rem] shadow-xl mx-auto max-w-[1600px]">
        <img
          src="https://emsivsdeacgigsxnsmho.supabase.co/storage/v1/object/public/product-images/cover-pic.jpg"
          alt="Perfume Banner"
          className="w-full h-full object-cover object-center"
        />
        
        {/* INCREASED DARKNESS OVERLAY: changed from bg-gradient-to-t to a solid darker bg-black/50 */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 
                className="text-5xl md:text-7xl font-serif font-bold tracking-tight max-w-4xl leading-tight"
                style={{ 
                    color: "black", 
                    // Premium Golden Outline & Shadow Effect
                    textShadow: "2px 2px 0px #D4AF37, -1px -1px 0 #D4AF37, 0 0 15px rgba(212, 175, 55, 0.8)" 
                }}
              >
                PERFUME BOX <br /> BANGLADESH
              </h1>

              <p 
                className="text-lg md:text-xl mt-6 italic font-light max-w-2xl"
                style={{ 
                    color: "#f8f8f8", 
                    textShadow: "0px 2px 4px rgba(0,0,0,0.8)" // Subtle black drop shadow for readability
                }}
              >
                Luxury you can smell
              </p>
          
          <Link
            href="/products/all"
            className="mt-10 px-8 py-3 bg-white text-black text-sm md:text-base font-bold uppercase tracking-widest rounded-full hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-xl transform hover:scale-105 inline-block"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      <RecentlyViewed />

      {/* PROMO CAROUSEL */}
      <section className="w-full mt-10 px-4 select-none">
        <div 
            className="max-w-[1600px] mx-auto relative h-[350px] md:h-[500px] overflow-hidden rounded-2xl shadow-lg bg-gray-900 group cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
          
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center pointer-events-none ${
                index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
              />
              <div className="relative z-20 text-center px-4 animate-in fade-in zoom-in duration-700 pointer-events-auto">
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-md mb-2">
                  {slide.title}
                </h3>
                <p className="text-gray-100 text-lg md:text-xl mb-8 drop-shadow-md font-light">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.link}
                  onMouseDown={(e) => e.stopPropagation()} 
                  className="px-8 py-3 bg-white text-black text-sm md:text-base font-bold uppercase tracking-widest rounded-full hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-xl transform hover:scale-105 inline-block"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-none">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto ${
                  idx === currentImageIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      
      <PromoSection />

      <BestSellers />

      {/* PRODUCT FEED - WRAPPED IN SUSPENSE FOR BUILD FIX */}
      <section className="py-16 bg-[#fdfdfd] px-4 md:px-10 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Explore All</h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        </div>
        
        {/* 2. Added Suspense Boundary Here */}
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
            <ProductFeed initialProducts={allProducts} />
        </Suspense>
        
      </section>
      
      {/* Featurette Section */}
      <section className="bg-gray-50 py-16 mt-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-around items-center text-center md:text-left gap-10">
            <div className="max-w-xs p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">100% Authentic</h3>
                <p className="text-gray-600 text-sm">Every bottle is sourced directly from verified distributors. Guaranteed quality.</p>
            </div>
             <div className="max-w-xs p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600 text-sm">Quick and reliable delivery across Dhaka and all over Bangladesh.</p>
            </div>
             <div className="max-w-xs p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Expert Curation</h3>
                <p className="text-gray-600 text-sm">Our collection is hand-picked for the ultimate scent experience.</p>
            </div>
        </div>
      </section>

    </main>
  );
}