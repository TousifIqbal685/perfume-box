"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Optimization

export default function HomeSlider() {
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

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-b-[2.5rem] shadow-xl mx-auto max-w-[1600px]">
        <Image
          src="https://emsivsdeacgigsxnsmho.supabase.co/storage/v1/object/public/product-images/cover-pic.jpg"
          alt="Perfume Banner"
          fill
          priority // Loads this image immediately
          className="object-cover object-center"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight max-w-4xl leading-tight"
            style={{
              color: "black",
              textShadow: "2px 2px 0px #D4AF37, -1px -1px 0 #D4AF37, 0 0 15px rgba(212, 175, 55, 0.8)",
            }}
          >
            PERFUME BOX <br /> BANGLADESH
          </h1>

          <p
            className="text-lg md:text-xl mt-6 italic font-light max-w-2xl"
            style={{
              color: "#f8f8f8",
              textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
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
              {/* Note: Standard img used here as these slide images might be external/local varying paths */}
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
    </>
  );
}