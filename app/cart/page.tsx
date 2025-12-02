"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";

// --- ICONS ---
const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const EmptyCartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MinusIcon = () => (
  <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
    <path
      d="M1 1H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M5 1V9M1 5H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Payment Icons
const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);

export default function CartPage() {
  const router = useRouter();
  const { items, total, updateQuantity, removeFromCart } = useCart();

  // Shipping selector
  const [shippingType, setShippingType] = useState<"inside" | "outside">("inside");
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [bkashTrx, setBkashTrx] = useState("");

  const shippingFee = useMemo(
    () => (shippingType === "inside" ? 70 : 100),
    [shippingType]
  );

  const grandTotal = total + shippingFee;

  // Voucher Code
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyVoucher = () => {
    if (voucher.toLowerCase() === "perfume10") {
      setDiscount(10); // flat 10 tk discount
    } else {
      setDiscount(0);
    }
  };

  // Checkout handler
  const handleCheckout = () => {
    // Basic validation for bKash
    if (paymentMethod === "bkash" && bkashTrx.length < 5) {
        alert("Please enter a valid bKash Transaction ID");
        return;
    }

    const payload = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    router.push(
      `/checkout?cart=${encodeURIComponent(
        JSON.stringify(payload)
      )}&subtotal=${total}&shipping=${shippingFee}&voucher=${discount}&payment=${paymentMethod}&trx=${bkashTrx}`
    );
  };

  // --- EMPTY CART STATE ---
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-50 p-6 rounded-full mb-6 animate-fade-in">
          <EmptyCartIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3 tracking-tight">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8 text-base max-w-md mx-auto leading-relaxed">
          Looks like you haven't made your choice yet. Explore our collection of
          exclusive fragrances.
        </p>
        <a
          href="/products/all"
          className="px-10 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Browse Collection
        </a>
      </main>
    );
  }

  // --- FILLED CART STATE ---
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900 pb-20 pt-6 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-medium tracking-tight text-gray-900">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"} in your bag
            </p>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Product List */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {items.map((item) => {
              const lineTotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="group relative flex gap-4 bg-white p-3 sm:p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
                >
                  {/* PRODUCT IMAGE (Fixed Width, Shrink-0) */}
                  <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  {/* RIGHT SIDE DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">
                    
                    {/* Top Row: Title & Remove Button */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="pr-6">
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                           Unit: ৳ {item.price.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Remove Button (Positioned Top Right) */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors -mr-1 -mt-1 p-2"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Bottom Row: Quantity & Line Total */}
                    <div className="flex items-end justify-between mt-3">
                      
                      {/* Compact Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-8 sm:h-10">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-8 sm:w-10 h-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <MinusIcon />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-sm font-semibold text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 sm:w-10 h-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      {/* Line Total Price */}
                      <div className="text-right">
                          <span className="text-sm sm:text-lg font-bold text-gray-900">
                          ৳ {lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Order Summary (Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-serif font-medium text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ৳ {total.toLocaleString()}
                  </span>
                </div>

                {/* Shipping Selection */}
                <div className="pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
                    Shipping
                  </span>
                  <div className="space-y-3">
                    {/* Inside Dhaka */}
                    <label
                      className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        shippingType === "inside"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            shippingType === "inside"
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                        >
                          {shippingType === "inside" && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="shipping"
                          value="inside"
                          checked={shippingType === "inside"}
                          onChange={() => setShippingType("inside")}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Inside Dhaka
                        </span>
                      </div>
                      <span className="text-sm font-semibold">৳70</span>
                    </label>

                    {/* Outside Dhaka */}
                    <label
                      className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        shippingType === "outside"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            shippingType === "outside"
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                        >
                          {shippingType === "outside" && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="shipping"
                          value="outside"
                          checked={shippingType === "outside"}
                          onChange={() => setShippingType("outside")}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Outside Dhaka
                        </span>
                      </div>
                      <span className="text-sm font-semibold">৳100</span>
                    </label>
                  </div>
                </div>

                {/* Voucher */}
                <div className="pt-2">
                   <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                    Promo Code
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-colors"
                    />
                    <button
                      onClick={applyVoucher}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      Voucher applied (-৳{discount})
                    </p>
                  )}
                </div>

                {/* --- NEW PAYMENT METHOD SECTION --- */}
                <div className="pt-2">
                   <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
                    Payment Method
                  </span>
                  <div className="space-y-3">
                    
                    {/* Cash On Delivery */}
                    <label
                      className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === "cod"
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="hidden"
                        />
                         <div className="flex items-center gap-2">
                           <CashIcon />
                           <span className="text-sm font-medium text-gray-900">Cash On Delivery</span>
                         </div>
                      </div>
                    </label>

                    {/* bKash Payment */}
                    <label
                      className={`relative flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "bkash"
                          ? "border-pink-500 bg-pink-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                paymentMethod === "bkash"
                                ? "border-pink-600"
                                : "border-gray-300"
                            }`}
                            >
                            {paymentMethod === "bkash" && (
                                <div className="w-2 h-2 rounded-full bg-pink-600" />
                            )}
                            </div>
                            <input
                            type="radio"
                            name="payment"
                            value="bkash"
                            checked={paymentMethod === "bkash"}
                            onChange={() => setPaymentMethod("bkash")}
                            className="hidden"
                            />
                            <div className="flex items-center gap-2">
                                <MobileIcon />
                                <span className="text-sm font-bold text-gray-900">bKash Payment</span>
                            </div>
                        </div>
                      </div>

                      {/* bKash Instructions - Only shows when selected */}
                      {paymentMethod === "bkash" && (
                          <div className="mt-3 pl-7 animate-fade-in">
                              <p className="text-xs text-gray-600 mb-2">
                                  Send Money (Personal) to: <br/>
                                  <span className="text-sm font-bold text-pink-600 tracking-wide">01625276061</span>
                              </p>
                              <input 
                                type="text" 
                                placeholder="Enter Transaction ID (TrxID)"
                                value={bkashTrx}
                                onChange={(e) => setBkashTrx(e.target.value)}
                                className="w-full bg-white border border-pink-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-500 transition-colors placeholder:text-gray-400"
                              />
                          </div>
                      )}
                    </label>

                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 my-4"></div>

                {/* Grand Total */}
                <div className="flex justify-between items-end mb-6">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 block leading-none">
                      ৳ {(grandTotal - discount).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      VAT included
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-lg text-sm font-semibold tracking-wide"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}