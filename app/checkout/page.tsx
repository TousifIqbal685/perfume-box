"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { CheckCircle, MapPin, Phone, Mail, User, Truck, CreditCard, ShoppingBag, Banknote } from "lucide-react";
import { sendOrderEmail } from "@/app/actions";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { items, clearCart, total: cartTotal } = useCart();
  const { user, refreshUser } = useUser(); 

  // --- STATES ---
  const [shippingCost, setShippingCost] = useState<number>(0); 
  const [shippingLocation, setShippingLocation] = useState<"inside" | "outside" | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [trxID, setTrxID] = useState("");

  const discount = Number(searchParams.get("voucher")) || 0;
  
  // --- LOGIC: FREE SHIPPING OVER 20,000 ---
  const isFreeShipping = cartTotal >= 20000;

  // Calculate Final Total
  const finalTotal = cartTotal + shippingCost - discount;

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
        setFullName(user.full_name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
        setAddress(user.address || ""); 
        setCity(user.city || "");       
    }
  }, [user]);

  // --- EFFECT: Update Shipping Cost based on Total & Location ---
  useEffect(() => {
    if (shippingLocation) {
        if (isFreeShipping) {
            setShippingCost(0); // Force 0 if eligible
        } else {
            setShippingCost(shippingLocation === 'inside' ? 100 : 150); // Standard rates
        }
    }
  }, [shippingLocation, isFreeShipping]);

  // --- HANDLERS ---
  const handleShippingChange = (location: "inside" | "outside") => {
    setShippingLocation(location);
    // Cost is handled by the useEffect above
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !phone || !email || !address || !city) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!shippingLocation) {
        setErrorMsg("Please select a shipping location.");
        return;
    }

    if (paymentMethod === "bkash" && !trxID.trim()) {
        setErrorMsg("Please enter your bKash Transaction ID.");
        return;
    }

    setLoading(true);
    try {
      let appUserId = user?.id; 

      if (!appUserId) {
        const { data: existingUser } = await supabase.from("app_users").select("id").eq("phone", phone).single();
        if (existingUser) {
          appUserId = existingUser.id;
          await supabase.from("app_users").update({ full_name: fullName, address, city, email }).eq("id", appUserId);
        } else {
          const { data: newUser, error: createError } = await supabase
            .from("app_users")
            .insert([{ phone, full_name: fullName, email, address, city }])
            .select().single();
          if (createError) throw createError;
          appUserId = newUser.id;
        }
        if (typeof window !== "undefined" && appUserId) localStorage.setItem("app_user_id", appUserId);
      } else {
          await supabase.from("app_users").update({ full_name: fullName, email, address, city }).eq("id", appUserId);
          refreshUser();
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert([{ full_name: fullName, phone, email, address: `${address}, ${city}` }])
        .select().single();

      if (customerError) throw customerError;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: customer.id,
            app_user_id: appUserId,
            total_amount: finalTotal,
            shipping_fee: shippingCost,
            discount: discount,
            payment_method: paymentMethod,
            trx_id: paymentMethod === 'bkash' ? trxID : null,
            payment_status: "pending",
            order_status: "received", 
          },
        ])
        .select().single();

      if (orderError) throw orderError;

      const itemsPayload = items.map((item) => {
        const realProductId = item.id.substring(0, 36);
        return {
            order_id: order.id,
            product_id: realProductId, 
            quantity: item.quantity,
            price: item.price,
        };
      });

      const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsError) throw itemsError;

      const emailPayload = {
        id: order.id,
        customer_name: fullName,
        phone: phone,
        address: `${address}, ${city}`,
        total_amount: finalTotal,
        items: items, 
      };

      sendOrderEmail(emailPayload);

      clearCart();
      router.push(`/order-success?orderId=${order.id}`);
      
    } catch (err: any) {
      console.error("Order Error:", err); 
      setErrorMsg(err.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
     return (
        <div className="min-h-screen flex items-center justify-center">
           <p>Your cart is empty. Redirecting...</p>
        </div>
     )
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Stepper */}
        <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-gray-400 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Cart
                </span>
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <span className="text-black flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">2</div>
                    Checkout Details
                </span>
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <span className="text-gray-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Complete
                </span>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: ADDRESS FORM ONLY --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Shipping Information</h1>
                
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 font-medium animate-pulse">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name*
                            </label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50/50"
                                placeholder="e.g. John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone Number*
                            </label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50/50"
                                placeholder="017xxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email Address*
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50/50"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Street Address*
                            </label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50/50"
                                placeholder="House, Road, Area"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City*</label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50/50"
                                placeholder="Dhaka"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Helpful Note */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                 <div className="mt-1 text-blue-600"><Truck className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-sm font-bold text-blue-900">Fast Delivery</h4>
                    <p className="text-xs text-blue-700 mt-1">We usually deliver within 2 days inside Dhaka and 3-5 days outside.</p>
                 </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY + PAYMENTS + BUTTON --- */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-4 border-b">Order Summary</h2>

                {/* 1. ITEMS LIST */}
                <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                <img 
                                    src={item.image || ""} 
                                    alt={item.title || "Product"}
                                    className="w-full h-full object-cover mix-blend-multiply" 
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-semibold">
                                ৳ {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. DELIVERY METHOD */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Delivery Method
                    </h3>
                    
                    {isFreeShipping && (
                        <p className="text-xs text-green-600 font-bold mb-2">
                            🎉 Your order qualifies for FREE Shipping!
                        </p>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all ${shippingLocation === 'inside' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="shipping" 
                                    className="w-4 h-4 accent-black"
                                    checked={shippingLocation === 'inside'}
                                    onChange={() => handleShippingChange('inside')}
                                />
                                <span className="text-sm font-medium text-gray-700">Inside Dhaka</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                                {isFreeShipping ? (
                                    <span className="text-green-600">Free</span>
                                ) : "৳ 100"}
                            </span>
                        </label>

                        <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all ${shippingLocation === 'outside' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                             <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="shipping" 
                                    className="w-4 h-4 accent-black"
                                    checked={shippingLocation === 'outside'}
                                    onChange={() => handleShippingChange('outside')}
                                />
                                <span className="text-sm font-medium text-gray-700">Outside Dhaka</span>
                             </div>
                             <span className="text-sm font-bold text-gray-900">
                                {isFreeShipping ? (
                                    <span className="text-green-600">Free</span>
                                ) : "৳ 150"}
                             </span>
                        </label>
                    </div>
                </div>

                {/* 3. PAYMENT METHOD */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Payment Method
                    </h3>
                    <div className="space-y-3">
                        {/* COD */}
                        <label className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input 
                                type="radio" 
                                name="payment" 
                                className="w-4 h-4 accent-black"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                            />
                            <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                        </label>

                        {/* bKash */}
                        <label className={`cursor-pointer border rounded-lg p-3 block transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    className="w-4 h-4 accent-pink-600"
                                    checked={paymentMethod === 'bkash'}
                                    onChange={() => setPaymentMethod('bkash')}
                                />
                                <span className="text-sm font-bold text-pink-600">bKash Payment</span>
                            </div>
                            
                            {paymentMethod === 'bkash' && (
                                <div className="mt-3 pl-7 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                    <p className="text-xs text-gray-600">Send <strong>৳ {finalTotal.toLocaleString()}</strong> to: <span className="font-bold select-all">01716938156</span> (Personal)</p>
                                    <input 
                                        type="text"
                                        placeholder="Enter TrxID"
                                        value={trxID}
                                        onChange={(e) => setTrxID(e.target.value)}
                                        className="w-full text-sm border border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-pink-600 uppercase"
                                    />
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* 4. TOTALS */}
                <div className="space-y-2 text-sm text-gray-600 mb-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-gray-900">
                             {shippingCost > 0 ? `৳ ${shippingCost}` : (isFreeShipping && shippingLocation ? <span className="text-green-600 font-bold">Free</span> : '--')}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">- ৳ {discount.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end mb-6">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">৳ {finalTotal.toLocaleString()}</span>
                </div>

                <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>
                            Place Order <CreditCard className="w-5 h-5" />
                        </>
                    )}
                </button>
                
                <p className="text-[10px] text-center text-gray-400 mt-4">
                    By placing this order, you agree to our Terms of Service.
                </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}