import { supabase } from "@/supabaseClient";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductPage(props: any) {
  const { slug } = await props.params;

  if (!slug) return notFound();

  // 1. Fetch Main Product
  // UPDATED: Added price_5ml and price_10ml to the selection
  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      title,
      brand,
      description,
      price,
      discounted_price,
      price_5ml,
      price_10ml,
      stock,
      top_notes,
      heart_notes,
      base_notes,
      main_image_url,
      slug,
      product_images ( id, image_url )
    `)
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  // 2. Fetch "Best Sellers" for Related Products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, title, brand, price, main_image_url, slug")
    .eq("is_bestseller", true) 
    .neq("id", product.id)
    .limit(20);

  // Default "Full Bottle" price logic
  const price =
    product.discounted_price > 0 ? product.discounted_price : product.price;

  return <ProductClient product={product} price={price} relatedProducts={relatedProducts || []} />;
}