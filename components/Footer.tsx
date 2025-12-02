"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-24 font-sans">
      {/* ===== TOP LIGHT FOOTER ===== */}
      <div className="bg-[#fcfcfc] border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 grid gap-12 md:grid-cols-4">
          
          {/* BRAND */}
          <div className="md:pr-8">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/logo.jpg"
                alt="Perfume Box Logo"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                Perfume Box
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-7 font-light">
              We sell 100% authentic perfumes in Bangladesh — directly imported
              from Dubai, USA & UK showrooms. Guaranteed authenticity and the
              best prices.
            </p>
            <p className="mt-4 text-sm text-gray-900 font-medium">
              Keep loving Perfume Box — keep smelling premium.
            </p>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Information</h3>
            <ul className="space-y-4 text-sm text-gray-500 font-light">
              <li className="hover:text-black transition-colors cursor-pointer">Payment Information</li>
              <li className="hover:text-black transition-colors cursor-pointer">Return & Refund Policy</li>
              <li className="hover:text-black transition-colors cursor-pointer">Shipping Policy</li>
              <li className="hover:text-black transition-colors cursor-pointer">Product Care</li>
              <li className="hover:text-black transition-colors cursor-pointer">Cancelation Policy</li>
              <li className="hover:text-black transition-colors cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-black transition-colors cursor-pointer">Privacy & Cookies Policy</li>
            </ul>
          </div>

          {/* COLLECTION – LINKS HOOKED TO HEADER ROUTES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Collection</h3>
            <ul className="space-y-4 text-sm text-gray-500 font-light">
              <li>
                <Link
                  href="/products/men"
                  className="hover:text-red-700 transition-colors"
                >
                  Men Perfume
                </Link>
              </li>
              <li>
                <Link
                  href="/products/women"
                  className="hover:text-red-700 transition-colors"
                >
                  Women Perfume
                </Link>
              </li>
              <li>
                <Link
                  href="/products/unisex"
                  className="hover:text-red-700 transition-colors"
                >
                  Unisex Perfume
                </Link>
              </li>
              <li>
                <Link
                  href="/products/body-spray"
                  className="hover:text-red-700 transition-colors"
                >
                  Body Spray
                </Link>
              </li>
              <li className="text-red-600 font-medium">Hot Deals</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-500 font-light">
              <li className="flex items-center gap-2">
                <span className="text-gray-900">📞</span> +8801716938156
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-900">📍</span> Lalbagh, Dhaka – 1211
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-900">⏰</span> Sat–Thu: 11:00 AM to 8:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR (UPDATED: White BG, Bigger Logo, Premium Look) ===== */}
      <div className="bg-white border-t border-gray-100">
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left – Logo (Bigger & Full Left) */}
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpg"
              alt="Perfume Box Logo"
              className="w-14 h-14 rounded-full object-cover shadow-md border border-gray-100"
            />
             <span className="hidden md:block text-sm font-bold tracking-[0.2em] text-gray-900 uppercase">
                Perfume Box
             </span>
          </div>

          {/* Center – Social Links (Premium Red Hover) */}
          <nav className="flex flex-wrap justify-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">

            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/profile.php?id=61561883782700&sk=about_profile_transparency"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-red-700 hover:scale-105"
            >
              Facebook
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/perfumeboxbangladesh?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-red-700 hover:scale-105"
            >
              Instagram
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/8801716938156"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-red-700 hover:scale-105"
            >
              WhatsApp
            </a>

          </nav>

          {/* Right – YEAR */}
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 md:mt-0">
            © {year} Perfume Box. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}