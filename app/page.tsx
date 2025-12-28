import { supabase } from "@/supabaseClient";
import { Suspense } from "react";
import BestSellers from "@/components/BestSellers";
import RecentlyViewed from "@/components/RecentlyViewed";
import PromoSection from "@/components/PromoSection";
import ProductFeed from "@/components/ProductFeed";
import HomeSlider from "@/components/HomeSlider"; // Importing the new component

// Revalidate data every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60; 

export default async function Home() {
  // 1. Fetch Data Directly on Server (FAST) ⚡
  const { data: allProducts } = await supabase
    .from("products")
    .select("id, title, brand, slug, price, discounted_price, main_image_url, stock, category_id, created_at")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      
      {/* 2. Load the Interactive Slider */}
      <HomeSlider />

      <RecentlyViewed />

      <PromoSection />

      <BestSellers />

      <section className="py-16 bg-[#fdfdfd] px-4 md:px-10 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Explore All</h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto my-4 rounded-full"></div>
        </div>
        
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
            {/* Pass the server-fetched data to the feed */}
            <ProductFeed initialProducts={allProducts || []} />
        </Suspense>
        
      </section>
      
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