"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext"; // IMPORT NEW CONTEXT
import { CheckCircle, MapPin, Phone, Mail, User, Truck, CreditCard, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { items, clearCart, total: cartTotal } = useCart();
  const { user, refreshUser } = useUser(); // Get user & refresh helper

  const shippingFee = Number(searchParams.get("shipping")) || 0;
  const discount = Number(searchParams.get("voucher")) || 0;
  const paymentMethod = searchParams.get("payment") || "cod";
  const trxID = searchParams.get("trx") || "";

  const finalTotal = cartTotal + shippingFee - discount;

  // States for form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- PRE-FILL FORM WHEN USER LOADS ---
  useEffect(() => {
    if (user) {
        setFullName(user.full_name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
        setAddress(user.address || ""); 
        setCity(user.city || "");       
    }
  }, [user]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // --- STEP 1: IDENTIFY OR CREATE APP USER ---
      let appUserId = user?.id; 

      if (!appUserId) {
        // Not logged in? Check if user exists by Phone
        const { data: existingUser } = await supabase.from("app_users").select("id").eq("phone", phone).single();

        if (existingUser) {
          appUserId = existingUser.id;
          // Update missing info for existing guest
          await supabase.from("app_users").update({ 
              full_name: fullName, 
              address, 
              city,
              email 
          }).eq("id", appUserId);
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabase
            .from("app_users")
            .insert([{ phone, full_name: fullName, email, address, city }])
            .select()
            .single();
          
          if (createError) throw createError;
          appUserId = newUser.id;
        }

        // Auto-login locally
            // FIX: We check if appUserId exists (is truthy) before saving
            if (typeof window !== "undefined" && appUserId) {
                localStorage.setItem("app_user_id", appUserId);
            }
      } else {
          // Already logged in? Update profile with latest address info
          await supabase.from("app_users").update({ 
              full_name: fullName, 
              email, 
              address, 
              city 
          }).eq("id", appUserId);
          
          // Refresh context immediately
          refreshUser();
      }

      // --- STEP 2: CREATE SHIPPING CUSTOMER ENTRY ---
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert([{ full_name: fullName, phone, email, address: `${address}, ${city}` }])
        .select()
        .single();

      if (customerError) throw customerError;

      // --- STEP 3: CREATE ORDER ---
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: customer.id,
            app_user_id: appUserId, // Linked to App User
            total_amount: finalTotal,
            shipping_fee: shippingFee,
            discount: discount,
            payment_method: paymentMethod,
            trx_id: trxID,
            payment_status: "pending",
            order_status: "received", 
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // --- STEP 4: CREATE ORDER ITEMS ---
      const itemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);

      if (itemsError) throw itemsError;

      // Cleanup & Redirect
      clearCart();
      router.push(`/order-success?orderId=${order.id}`);
      
      setTimeout(() => {
         window.location.href = `/order-success?orderId=${order.id}`; 
      }, 100);

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
        
        {/* PROGRESS BAR */}
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

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* FORM COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Shipping Information</h1>
                
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={placeOrder} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name*
                            </label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
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
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                                placeholder="017xxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email Address (Optional)
                        </label>
                        <input
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
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
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                                placeholder="House, Road, Area"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City*</label>
                            <input
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                                placeholder="Dhaka"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* LIFECYCLE PREVIEW */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-80 grayscale-[0.5]">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Lifecycle Preview</h3>
                 <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-blue-600">Received</span>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center border-2 border-white shadow-sm">
                            <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Dispatched</span>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center border-2 border-white shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Delivered</span>
                    </div>
                 </div>
                 <p className="text-xs text-center text-gray-400 mt-4">*You can track these statuses after placing order</p>
            </div>
          </div>

          {/* SUMMARY COLUMN */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-4 border-b">Order Summary</h2>

                <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                {/* FIX: Add || "" to convert null to an empty string */}
                                <img 
                                    src={item.image || ""} 
                                    alt={item.title || "Product"}
                                    className="w-full h-full object-cover mix-blend-multiply" 
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-semibold">
                                ৳ {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            {paymentMethod === 'bkash' ? (
                                <div className="w-2 h-2 rounded-full bg-pink-500 ring-4 ring-pink-100"></div>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-black ring-4 ring-gray-200"></div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {paymentMethod === 'bkash' ? 'bKash Payment' : 'Cash on Delivery'}
                            </p>
                            {paymentMethod === 'bkash' && trxID && (
                                <p className="text-xs text-gray-500 break-all">TrxID: {trxID}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-gray-900">৳ {shippingFee.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">- ৳ {discount.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-end mb-8">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-gray-900">৳ {finalTotal.toLocaleString()}</span>
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
                
                <p className="text-xs text-center text-gray-400 mt-4">
                    By placing this order, you agree to our Terms of Service.
                </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}