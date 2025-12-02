export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { supabase } from "@/supabaseClient";
import Link from "next/link";
import ProductFeed from "@/components/ProductFeed"; // Ensure this import is correct

const CATEGORY_MAP: any = {
  men: "e06e7a2b-2f05-4baa-90da-1573d82ae74b",
  women: "2ceb546a-4940-448a-9987-83870d2638f3",
  unisex: "243e4b4a-aa06-4679-9c7e-bd96db02de34",
  "body-spray": "7741f377-e4f5-45e8-b49b-9f2765c2ea60",
  all: null,
};

export default async function ProductsPage({ params }: any) {
  const { category: urlCategory } = await params;
  const categoryId = CATEGORY_MAP[urlCategory];

  let query = supabase
    .from("products")
    .select(
      "id, title, brand, slug, price, discounted_price, main_image_url, stock, category_id, created_at"
    )
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
  }

  // --- EMPTY STATE ---
  if (!products || products.length === 0) {
    return (
      <main className="bg-white min-h-screen px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 capitalize">
          {urlCategory === "all"
            ? "No products available"
            : `No ${urlCategory.replace("-", " ")} products available`}
        </h1>
        <p className="text-gray-500 mb-6">Sorry, nothing to show right now.</p>
        <Link
          href="/products/all"
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Back to All Products
        </Link>
      </main>
    );
  }

  // --- MAIN FEED ---
  // UPDATED: Used w-full and px-2 (small padding) to allow the grid to fill the screen
  return (
    <main className="bg-white min-h-screen w-full px-2 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 text-center mb-2 capitalize">
        {urlCategory === "all" ? "All Products" : `${urlCategory} Collection`}
      </h1>

      <div className="w-16 h-1 bg-gray-200 mx-auto mb-10 rounded-full"></div>

      {/* This component handles the 2-column mobile / 5-column desktop grid */}
      <ProductFeed initialProducts={products} />
    </main>
  );
}