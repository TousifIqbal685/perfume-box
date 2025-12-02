"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; 
import { Package, LogOut, ShoppingBag } from "lucide-react";

export default function ProfilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const { user, logout } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/"); 
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                price,
                quantity,
                product:products (title, main_image_url, brand)
            )
        `)
        .eq("app_user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };

    if (user) {
        fetchOrders();
    } else {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-blue-100 text-blue-700 border-blue-200";
      case "dispatched": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4 lg:px-20 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-serif font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-2 text-base">
                    Welcome back, <span className="font-bold text-black">{user?.full_name || user?.phone}</span>
                </p>
            </div>
            
            <button 
                onClick={logout}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
                <LogOut className="w-4 h-4" />
                Log Out
            </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-gray-100">
            <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2 mb-8">Time to find your signature scent.</p>
            <button onClick={() => router.push('/products/all')} className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                
                {/* ORDER HEADER */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-6 justify-between items-center">
                    <div className="flex gap-8">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Order Placed</p>
                            <p className="text-sm font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total</p>
                            <p className="text-sm font-semibold text-gray-900">৳ {order.total_amount.toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Order #</p>
                            <p className="text-sm font-mono text-gray-500">{order.id.slice(0, 8)}</p>
                        </div>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                    </div>
                </div>

                {/* ORDER ITEMS LIST */}
                <div className="p-6">
                    <div className="space-y-6">
                        {order.order_items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="shrink-0 w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden p-2">
                                    <img src={item.product?.main_image_url} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-bold text-gray-900 line-clamp-1">{item.product?.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{item.product?.brand}</p>
                                    <div className="flex items-center text-sm text-gray-600 gap-4">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Qty: {item.quantity}</span>
                                        <span>৳ {item.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}