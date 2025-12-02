"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderSuccess() {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  // Handle the Popup Timer
  useEffect(() => {
    // 1. Show popup 0.5s after page loads (for better attention)
    const startTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 500);

    // 2. Hide popup after 10.5 seconds
    const endTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans pb-20 relative">
      
      {/* --- NOTIFICATION POPUP --- */}
      {/* Fixed position ensures it stays near the header user icon */}
      <div 
        className={`fixed top-20 right-4 md:right-16 z-50 transition-all duration-500 ease-out transform ${
          showTooltip ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative bg-[#f0fdf4] border border-green-200 shadow-xl rounded-xl p-4 w-64">
          
          {/* The little arrow pointing up to the user icon */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-[#f0fdf4] border-t border-l border-green-200 transform rotate-45"></div>

          <div className="flex justify-between items-start">
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Track your progress!</p>
              <p className="text-xs text-green-700 mb-2">You can view order status here.</p>
              <Link 
                href="/profile" 
                className="text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded-full hover:bg-green-700 transition-colors inline-block"
              >
                Show My Orders
              </Link>
            </div>
            
            <button 
              onClick={() => setShowTooltip(false)} 
              className="text-green-400 hover:text-green-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* -------------------------- */}

      <div className="max-w-md w-full text-center">
        
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8 animate-fade-in-up">
          <CheckCircle className="h-12 w-12 text-green-600" aria-hidden="true" />
        </div>
        
        {/* Heading */}
        <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight mb-4 animate-fade-in-up delay-100">
          Thank You for Your Order!
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-12 leading-relaxed animate-fade-in-up delay-200">
          Your order has been placed successfully. We are now processing it and will notify you once it's on its way.
        </p>

        {/* Action Button */}
        <div className="animate-fade-in-up delay-300">
          <button
            onClick={() => router.push("/products/all")}
            className="w-full sm:w-auto px-8 py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Continue Shopping
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-gray-400 mt-8 animate-fade-in-up delay-400">
          Need help? <a href="#" className="underline hover:text-gray-600 transition-colors">Contact Support</a>
        </p>

      </div>
    </main>
  );
}