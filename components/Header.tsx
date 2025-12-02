"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import AuthModal from "./AuthModal";

import { Search, ShoppingBag, Menu, X, UserCircle } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { total, itemCount, openCart } = useCart();

  const handleUserClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      setShowLoginPopup(true);
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "text-black font-extrabold"
      : "text-gray-700 font-medium hover:text-black transition-colors";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("id,title,brand,main_image_url,slug")
        .ilike("title", `%${search}%`)
        .limit(5);

      setResults(data || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleProductClick = (slug: string) => {
    setSearch("");
    setResults([]);
    router.push(`/product/${slug}`);
  };

  return (
    <>
      <AuthModal
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />

      <header className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-sm z-50 transition-all border-b border-gray-100">
        <nav className="relative flex items-center justify-between px-4 md:px-10 py-3 md:py-4 h-16 md:h-20">
          
          {/* 1. MOBILE MENU BUTTON (LEFT) */}
          <button
            className="md:hidden p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 2. LOGO (CENTER ON MOBILE, LEFT ON DESKTOP) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:static md:transform-none md:flex md:items-center gap-3">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <img
                src="/logo.jpg"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm object-cover"
                alt="Logo"
              />
              <span className="text-lg md:text-2xl font-bold font-serif whitespace-nowrap">
                PERFUME BOX
              </span>
            </Link>
          </div>

          {/* 3. DESKTOP NAV LINKS (CENTER) */}
          <div className="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/products/all" className={getLinkClass("/products/all")}>
              ALL
            </Link>
            <Link href="/products/men" className={getLinkClass("/products/men")}>
              MEN
            </Link>
            <Link href="/products/women" className={getLinkClass("/products/women")}>
              WOMEN
            </Link>
            <Link href="/products/unisex" className={getLinkClass("/products/unisex")}>
              UNISEX
            </Link>
            <Link href="/products/body-spray" className={getLinkClass("/products/body-spray")}>
              BODY SPRAY
            </Link>
          </div>

          {/* 4. RIGHT SIDE ICONS */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* Search (Desktop Only for Layout Cleanliness) */}
            <div
              ref={searchContainerRef}
              className="relative hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-64 lg:w-72 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-black"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                placeholder="Search..."
              />
              {/* Dropdown */}
              {results.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-[100]">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                    >
                      <img
                        src={product.main_image_url}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-md bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Icon (Desktop) */}
            <button onClick={handleUserClick} className="hidden md:flex hover:scale-105 transition-transform">
              <UserCircle
                className={`w-7 h-7 ${user ? "text-black" : "text-gray-600"}`}
              />
            </button>

            {/* CART (ALWAYS VISIBLE) */}
            <button 
              onClick={openCart}
              className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {itemCount}
                  </span>
                )}
              </div>
              
              {/* Price - Hidden on very small screens if space is tight, or visible if desired */}
              {total > 0 && (
                 <span className="text-sm font-bold text-gray-900 hidden sm:block">
                    ৳ {total.toLocaleString()}
                 </span>
              )}
            </button>

          </div>
        </nav>

        {/* MOBILE SEARCH BAR (Visible below header on mobile) */}
        <div className="md:hidden px-4 pb-3">
            <div className="flex items-center bg-gray-100 px-4 py-2.5 rounded-xl">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                    placeholder="Search perfumes..."
                />
            </div>
             {/* Mobile Search Results */}
             {results.length > 0 && (
                <div className="absolute left-4 right-4 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 z-[100] max-h-[60vh] overflow-y-auto">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                    >
                      <img
                        src={product.main_image_url}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-md bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-inner absolute w-full left-0 top-full h-screen z-40">
            <Link
              href="/products/all"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg ${getLinkClass("/products/all")}`}
            >
              ALL PRODUCTS
            </Link>
            <Link
              href="/products/men"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg ${getLinkClass("/products/men")}`}
            >
              MEN
            </Link>
            <Link
              href="/products/women"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg ${getLinkClass("/products/women")}`}
            >
              WOMEN
            </Link>
            <Link
              href="/products/unisex"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg ${getLinkClass("/products/unisex")}`}
            >
              UNISEX
            </Link>
            <Link
              href="/products/body-spray"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg ${getLinkClass("/products/body-spray")}`}
            >
              BODY SPRAY
            </Link>
            
            <div className="border-t border-gray-100 my-2 pt-2">
                <button 
                    onClick={() => { handleUserClick(); setMobileOpen(false); }}
                    className="flex items-center gap-3 w-full py-3 px-4 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                    <UserCircle className="w-5 h-5" />
                    {user ? "My Profile" : "Login / Sign Up"}
                </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}