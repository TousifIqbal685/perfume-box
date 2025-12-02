"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Phone, ArrowRight, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useUser();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState(""); // New Name State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  async function handleSubmit() {
    if (!fullName.trim()) {
        setError("Please enter your name");
        return;
    }
    if (phone.length < 11) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    // Pass Name to login function
    const success = await login(phone, fullName);
    
    setLoading(false);
    if (success) {
      onClose();
      window.location.reload(); 
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-8 animate-fadeIn relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-black"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 pt-2">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your details to access your orders.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* NAME INPUT */}
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white font-medium tracking-wide"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* PHONE INPUT */}
          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white font-medium tracking-wide"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <div className="text-center bg-red-50 text-red-600 text-xs py-2 rounded-lg font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center font-bold shadow-lg hover:shadow-xl active:scale-[0.98] gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}