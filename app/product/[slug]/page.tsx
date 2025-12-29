import { supabase } from "@/supabaseClient";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import ProductFeed from "@/components/ProductFeed"; 
import { Metadata, ResolvingMetadata } from "next";

// Define the Props type for better safety
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. GENERATE DYNAMIC METADATA (For SEO & Social Sharing)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await the params object
  const { slug } = await params;

  // Fetch only what we need for SEO (Lightweight fetch)
  const { data: product } = await supabase
    .from("products")
    .select("title, description, main_image_url")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | Perfume Box BD",
    };
  }

  // Return the Metadata object
  return {
    title: `${product.title} | Perfume Box BD`,
    description: product.description?.slice(0, 160) || "Luxury perfume at the best price.", // Google likes descriptions under 160 chars
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: [product.main_image_url || ""], // Shows this image when shared on Facebook/WhatsApp
    },
  };
}

// 2. MAIN PAGE COMPONENT
export default async function ProductPage(props: any) {
  const { slug } = await props.params;

  if (!slug) return notFound();

  // Fetch Main Product
  const { data: product } = await supabase
    .from("products")
    .select(`
      id, title, brand, description, price, discounted_price, price_5ml, price_10ml,
      stock, top_notes, heart_notes, base_notes, main_image_url, slug, volume_ml,
      product_images ( id, image_url )
    `) 
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  // Fetch "Related Products"
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, title, brand, price, discounted_price, main_image_url, slug, created_at")
    .neq("id", product.id)
    .limit(50); 

  const price = product.discounted_price > 0 ? product.discounted_price : product.price;

  return (
    <>
      <ProductClient product={product} price={price} relatedProducts={[]} />

      {/* Dynamic Product Feed */}
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