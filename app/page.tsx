"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import BestSellers from "@/components/BestSellers";
import RecentlyViewed from "@/components/RecentlyViewed";
import PromoSection from "@/components/PromoSection";
import ProductFeed from "@/components/ProductFeed";

export default function Home() {
  const videoUrl = "https://www.facebook.com/reel/732973635905006/";
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    videoUrl
  )}&show_text=false&t=0&autoplay=1&muted=1`;

  const [allProducts, setAllProducts] = useState<any[]>([]);

  // --- CAROUSEL STATE & LOGIC ---
  const carouselImages = [
    "/Gemini_Generated_Image_qgakguqgakguqgak.png",
    "/unnamed (1).jpg",
    "/arabian.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set up a timer to change the image every 5 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  // ---------------------------

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
    <main className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-b-[2.5rem] shadow-xl mx-auto max-w-[1600px]">
        <img
          src="https://emsivsdeacgigsxnsmho.supabase.co/storage/v1/object/public/product-images/cover-pic.jpg"
          alt="Perfume Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight drop-shadow-lg max-w-4xl leading-tight">
            The Art of Scent. <br /> Curated for You.
          </h1>
          <p className="text-lg md:text-xl mt-6 italic font-light opacity-90 max-w-2xl text-gray-100">
            Experience premium, authentic fragrances that define elegance and presence.
          </p>
          <Link
            href="/products/all"
            className="mt-10 px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      <RecentlyViewed />

      {/* --- NEW SECTION: AUTO-SCROLLING CAROUSEL (RESIZED) --- */}
      <section className="w-full mt-10 px-4">
        {/* Constrained max-width to match Hero and reduced height to preserve quality */}
        <div className="max-w-[1600px] mx-auto relative h-[350px] md:h-[500px] overflow-hidden rounded-2xl shadow-lg bg-gray-50">
          {carouselImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Carousel Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>
      </section>
      {/* --- END NEW SECTION --- */}

      {/* VIDEO SECTION */}
      <section className="py-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Watch Our Story
            </h2>
            <p className="text-gray-500 mt-2">Discover the essence of elegance</p>
          </div>
          <div className="w-full max-w-[350px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-black">
            <iframe
              src={embedUrl}
              width="100%"
              height="620" 
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </section>
      
      <PromoSection />

      <BestSellers />

      {/* PRODUCT FEED */}
      <section className="py-16 bg-[#fdfdfd] px-4 md:px-10 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Explore All</h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        </div>
        <ProductFeed initialProducts={allProducts} />
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