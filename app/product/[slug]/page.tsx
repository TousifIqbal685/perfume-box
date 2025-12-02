import { supabase } from "@/supabaseClient";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import ProductFeed from "@/components/ProductFeed"; 

export default async function ProductPage(props: any) {
  const { slug } = await props.params;

  if (!slug) return notFound();

  // 1. Fetch Main Product
  const { data: product } = await supabase
    .from("products")
    .select(`
      id, title, brand, description, price, discounted_price, price_5ml, price_10ml,
      stock, top_notes, heart_notes, base_notes, main_image_url, slug,
      product_images ( id, image_url )
    `)
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  // 2. Fetch "Related Products"
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, title, brand, price, discounted_price, main_image_url, slug, created_at")
    .neq("id", product.id)
    .limit(50); 

  const price = product.discounted_price > 0 ? product.discounted_price : product.price;

  return (
    <>
      <ProductClient product={product} price={price} relatedProducts={[]} />

      {/* 4. Add the Dynamic Product Feed below */}
      {/* UPDATED: Removed max-w container to allow full width grid */}
      <div className="bg-white border-t border-gray-100 w-full px-2 md:px-6 pb-20">
        <div className="pt-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8 text-center md:text-left px-2">
            You May Also Like
          </h2>
          <ProductFeed initialProducts={relatedProducts || []} />
        </div>
      </div>
    </>
  );
}