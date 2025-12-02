"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import AuthModal from "./AuthModal";

import { Search, ShoppingBag, Menu, X, User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { total, itemCount, openCart } = useCart();

  const handleUserClick = () => {
    if (user) router.push("/profile");
    else setShowLoginPopup(true);
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-medium tracking-wide transition-all duration-300 relative group ${
      isActive ? "text-black" : "text-gray-600 hover:text-black"
    }`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);
      if (isOutsideDesktop && isOutsideMobile) setResults([]);
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
      <AuthModal open={showLoginPopup} onClose={() => setShowLoginPopup(false)} />

      {/* --- HEADER CONTAINER --- */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all">
        
        {/* TOP NAV BAR */}
        <nav className="max-w-[1800px] mx-auto flex items-center justify-between px-6 md:px-12 h-20 md:h-24">
          
          {/* 1. LEFT: LOGO */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.jpg"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-sm object-cover border border-gray-100 group-hover:opacity-90 transition-opacity"
                alt="Logo"
              />
              <span className="text-xl md:text-2xl font-bold font-serif tracking-tight text-gray-900">
                PERFUME BOX
              </span>
            </Link>
          </div>

          {/* 2. CENTER: SEARCH BAR (Professional & Wide) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-12 justify-center relative" ref={searchContainerRef}>
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-50 transition-all duration-300 shadow-inner"
                placeholder="Search for scents, brands..."
              />
              
              {/* Desktop Search Results Dropdown */}
              {results.length > 0 && (
                <div className="absolute top-14 left-0 w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Products</div>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.main_image_url}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md bg-gray-100 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. RIGHT: ICONS & LINKS */}
          <div className="flex items-center gap-6 md:gap-8">
            
            {/* Desktop Nav Links (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-8 mr-4">
               {["ALL", "MEN", "WOMEN", "UNISEX"].map((item) => (
                 <Link 
                   key={item} 
                   href={`/products/${item.toLowerCase()}`} 
                   className={getLinkClass(`/products/${item.toLowerCase()}`)}
                 >
                   {item}
                   {/* Underline Animation */}
                   <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                 </Link>
               ))}
            </div>

            {/* Account Icon */}
            <button onClick={handleUserClick} className="hidden md:flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
              <User className="w-6 h-6" />
              {user && <span className="text-sm font-medium hidden xl:block max-w-[100px] truncate">{user.full_name?.split(' ')[0]}</span>}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={openCart}
              className="flex items-center gap-3 group relative"
            >
              <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform scale-100 transition-transform group-hover:scale-110">
                    {itemCount}
                  </span>
                )}
              </div>
              {/* Total Price */}
              {total > 0 && (
                 <span className="hidden sm:block text-sm font-bold text-gray-900 tabular-nums">
                   ৳ {total.toLocaleString()}
                 </span>
              )}
            </button>

          </div>
        </nav>

        {/* --- MOBILE SEARCH BAR (Clean & separate) --- */}
        <div ref={mobileSearchRef} className="md:hidden px-6 pb-4 bg-white border-b border-gray-50">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
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
                      <img src={product.main_image_url} alt={product.title} className="w-10 h-10 object-cover rounded-md bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>

        {/* --- MOBILE MENU DRAWER --- */}
        <div 
          className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className={`absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <span className="font-serif font-bold text-xl">MENU</span>
               <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-1">
              {[
                { name: "ALL PRODUCTS", path: "/products/all" },
                { name: "MEN", path: "/products/men" },
                { name: "WOMEN", path: "/products/women" },
                { name: "UNISEX", path: "/products/unisex" },
                { name: "BODY SPRAY", path: "/products/body-spray" }
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 text-sm font-bold tracking-wide border-b border-gray-50 last:border-0 hover:text-pink-600 transition-colors ${
                    pathname === link.path ? "text-black" : "text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User Section at Bottom */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <button 
                  onClick={() => { handleUserClick(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-900 hover:bg-gray-100 transition-all"
               >
                  <User className="w-5 h-5" />
                  {user ? "My Profile" : "Login / Sign Up"}
               </button>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}