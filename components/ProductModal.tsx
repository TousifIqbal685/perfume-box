"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  title: string;
  brand?: string;
  price: number;
  discounted_price?: number | null;
  description?: string | null;
  top_notes?: string | null;
  heart_notes?: string | null;
  base_notes?: string | null;
  main_image_url?: string | null;
  stock?: number | null;
  is_visible?: boolean | null; // ✅ NEW
};

export default function ProductModal({
  productId,
  initialProduct,
  open,
  onClose,
}: {
  productId: string;
  initialProduct?: Partial<Product>;
  open: boolean;
  onClose: () => void;
}) {
  const [product, setProduct] = useState<Product | null>(
    initialProduct
      ? ({
          discounted_price: null,
          ...initialProduct,
        } as Product)
      : null
  );
  const [loading, setLoading] = useState(false);
  const { addToCart, openCart } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchFullProduct = async () => {
      if (!open) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, title, brand, price, discounted_price, description, top_notes, heart_notes, base_notes, main_image_url, stock, is_visible" // ✅ added is_visible
        )
        .eq("id", productId)
        .single();

      if (!error && data) setProduct(data as Product);
      setLoading(false);
    };

    fetchFullProduct();
  }, [open, productId]);

  if (!open) return null;

  const price =
    product?.discounted_price && product.discounted_price > 0
      ? product.discounted_price
      : product?.price || 0;

  // ✅ same visibility logic as ProductCard
  const isInvisible = product?.is_visible === false;
  const isOut =
    isInvisible || (typeof product?.stock === "number" && product.stock <= 0);

  const handleAddToCart = () => {
    if (!product) return;
    if (isOut) return; // ✅ block add to cart when hidden or out of stock

    addToCart(
      {
        id: product.id,
        title: product.title,
        price,
        image: product.main_image_url || undefined,
      },
      qty
    );
    openCart();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
          {product?.main_image_url ? (
            <img
              src={product.main_image_url}
              alt={product.title}
              className={`w-full max-h-[1200px] object-contain border-4 border-gray-300 rounded-xl shadow-md ${
                isInvisible ? "opacity-40" : ""
              }`}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-black">
                {product?.title || "Loading..."}
              </h2>
              {product?.brand && (
                <p className="text-sm text-black mt-1">{product.brand}</p>
              )}
            </div>
            <button onClick={onClose} className="text-black text-xl">
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-pink-600 text-2xl font-bold">
              ৳ {price.toLocaleString()}
            </p>

            {product?.discounted_price &&
              product.discounted_price > 0 &&
              product.discounted_price !== product.price && (
                <p className="text-sm text-black line-through">
                  ৳ {product.price.toLocaleString()}
                </p>
              )}

            {/* ✅ Use isInvisible + stock to decide label */}
            {(typeof product?.stock === "number" || isInvisible) && (
              <p
                className={`text-sm font-medium ${
                  isOut ? "text-red-600" : "text-green-600"
                }`}
              >
                {isOut
                  ? "Out of stock"
                  : `${product?.stock ?? 0} in stock`}
              </p>
            )}
          </div>

          {loading && !product && (
            <p className="text-sm text-black">Loading details…</p>
          )}

          {product?.description && (
            <p className="text-sm text-black">{product.description}</p>
          )}

          {(product?.top_notes ||
            product?.heart_notes ||
            product?.base_notes) && (
            <div className="space-y-1 text-sm text-black">
              {product.top_notes && (
                <p>
                  <span className="font-semibold">Top Notes: </span>
                  {product.top_notes}
                </p>
              )}
              {product.heart_notes && (
                <p>
                  <span className="font-semibold">Heart Notes: </span>
                  {product.heart_notes}
                </p>
              )}
              {product.base_notes && (
                <p>
                  <span className="font-semibold">Base Notes: </span>
                  {product.base_notes}
                </p>
              )}
            </div>
          )}

          {/* QTY + ADD TO CART */}
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1 text-black"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4 text-black">{qty}</span>
              <button
                className="px-3 py-1 text-black"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOut}
              className={`flex-1 py-2 rounded-md text-sm md:text-base ${
                isOut
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {isOut ? "Unavailable" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
