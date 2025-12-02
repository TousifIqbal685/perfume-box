"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Star } from "lucide-react";

type ProductCardProps = {
  product: any;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openCart } = useCart();

  const price =
    product.discounted_price && product.discounted_price > 0
      ? product.discounted_price
      : product.price;

  // 🔥 ADMIN VISIBILITY CHECK
  const isInvisible = product.is_visible === false;

  // SALE badge → Only if visible and discounted
  const showSaleBadge =
    !isInvisible &&
    product.discounted_price &&
    product.discounted_price > 0 &&
    product.discounted_price < product.price;

  // STOCK OUT badge → If admin made invisible OR stock = 0
  const showStockOutBadge = isInvisible || product.stock === 0;

  // Calculate discount percentage for a clearer "Deal" feeling
  const discountPercent =
    showSaleBadge && product.price > 0
      ? Math.round(((product.price - price) / product.price) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Disable cart if invisible or no stock
    if (showStockOutBadge) return;

    addToCart(
      {
        id: product.id,
        title: product.title,
        price,
        image: product.main_image_url,
      },
      1
    );
    openCart();
  };

  return (
    <Link href={`/product/${product.slug}`} className="group h-full block">
      <div className="relative bg-white h-full flex flex-col transition-all duration-500 ease-out border border-transparent hover:border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl overflow-hidden">
        
        {/* --- IMAGE AREA --- */}
        <div className="relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden">
          
          {/* Badges - Sleek & Floating */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {showSaleBadge && (
              <span className="bg-rose-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 uppercase rounded-sm shadow-sm backdrop-blur-md">
                -{discountPercent}%
              </span>
            )}
            {showStockOutBadge && (
              <span className="bg-gray-900 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 uppercase rounded-sm shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Product Image */}
          {product.main_image_url ? (
            <img
              src={product.main_image_url}
              alt={product.title}
              // 'mix-blend-multiply' makes white backgrounds on images disappear into the gray card background
              className={`w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-110 ${
                showStockOutBadge ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-xs uppercase tracking-widest font-medium">No Image</span>
            </div>
          )}

          {/* DESKTOP HOVER ACTION: "Quick Add" slides up */}
          {!showStockOutBadge && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 hidden md:block">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 text-sm font-medium tracking-wide uppercase hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* --- DETAILS AREA --- */}
        <div className="p-5 flex flex-col flex-grow text-center relative z-10 bg-white">
          
          {/* Brand Name */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">
            {product.brand}
          </p>

          {/* Product Title - Serif Font for Luxury */}
          <h3 className="font-serif text-lg text-gray-900 leading-snug mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Ratings (Optional Visual Touch) */}
          {/* <div className="flex justify-center gap-0.5 mb-3 text-yellow-400">
             {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          </div> */}

          {/* Pricing */}
          <div className="mt-auto flex items-center justify-center gap-3">
            <span className={`text-base font-semibold ${product.discounted_price > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
              ৳ {price.toLocaleString()}
            </span>
            {product.discounted_price > 0 && (
              <span className="text-sm text-gray-400 line-through decoration-gray-300">
                ৳ {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* MOBILE BUTTON: Always visible since you can't hover on phone */}
          <div className="mt-4 md:hidden">
            <button
              disabled={showStockOutBadge}
              onClick={handleAddToCart}
              className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors ${
                showStockOutBadge
                  ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                  : "bg-transparent border-gray-900 text-gray-900 hover:bg-black hover:text-white"
              }`}
            >
              {showStockOutBadge ? "Sold Out" : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
}