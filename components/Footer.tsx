"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, MapPin, MessageSquare, Smartphone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white font-sans border-t-4 border-pink-600">
      
      {/* 1. TOP ACTION BAR */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-wrap justify-center md:justify-between gap-6 text-sm font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 cursor-pointer hover:text-pink-500 transition">
              <MapPin className="w-5 h-5" /> Find a Store
            </span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-pink-500 transition">
              <MessageSquare className="w-5 h-5" /> Customer Service
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 cursor-pointer hover:text-pink-500 transition">
              <Smartphone className="w-5 h-5" /> Get the App
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* COL 1: ABOUT */}
        <div>
          <h3 className="text-base font-bold uppercase tracking-widest mb-6">About Perfume Box</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/about" className="hover:underline hover:text-white transition">Our Story</Link></li>
            <li><Link href="/authenticity" className="hover:underline hover:text-white transition">Authenticity Guarantee</Link></li>
            <li><Link href="/careers" className="hover:underline hover:text-white transition">Careers</Link></li>
            <li><Link href="/terms" className="hover:underline hover:text-white transition">Terms of Use</Link></li>
            <li><Link href="/privacy" className="hover:underline hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* COL 2: HELP */}
        <div>
          <h3 className="text-base font-bold uppercase tracking-widest mb-6">Help & Support</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/shipping" className="hover:underline hover:text-white transition">Shipping & Delivery</Link></li>
            <li><Link href="/returns" className="hover:underline hover:text-white transition">Returns & Exchanges</Link></li>
            <li><Link href="/contact" className="hover:underline hover:text-white transition">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:underline hover:text-white transition">FAQs</Link></li>
            <li><Link href="/order-status" className="hover:underline hover:text-white transition">Order Status</Link></li>
          </ul>
        </div>

        {/* COL 3: SHOP */}
        <div>
          <h3 className="text-base font-bold uppercase tracking-widest mb-6">Shop Collection</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/products/men" className="hover:underline hover:text-white transition">Men's Fragrance</Link></li>
            <li><Link href="/products/women" className="hover:underline hover:text-white transition">Women's Fragrance</Link></li>
            <li><Link href="/products/unisex" className="hover:underline hover:text-white transition">Unisex Collection</Link></li>
            <li><Link href="/products/body-spray" className="hover:underline hover:text-white transition">Body Mists</Link></li>
            <li><Link href="/products/all" className="hover:underline hover:text-white transition">New Arrivals</Link></li>
          </ul>
        </div>

        {/* COL 4: NEWSLETTER */}
        <div className="lg:pl-8">
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4 text-white">
            We Belong to Something <span className="italic text-pink-500">Beautiful</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Sign up for Perfume Box emails and get the first look at new arrivals and exclusive offers.
          </p>
          
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
            />
            <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
              Sign Up
            </button>
          </form>
        </div>

      </div>

      {/* 3. BOTTOM BAR (Logo, Copyright, Socials) */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* LEFT: LOGO & COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* LOGO ADDED HERE */}
            <img 
              src="/logo.jpg" 
              alt="Perfume Box Logo" 
              className="w-14 h-14 rounded-full object-cover border border-gray-700 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            />
            
            {/* COPYRIGHT TEXT */}
            <div className="text-xs text-gray-500 text-center md:text-left">
              <p>© {year} Perfume Box Bangladesh. All rights reserved.</p>
              <p className="mt-1 opacity-75">100% Authentic Products. Sourced from Dubai, USA & UK.</p>
            </div>
          </div>

          {/* RIGHT: SOCIAL ICONS */}
          <div className="flex items-center gap-8">
            <a 
              href="https://www.facebook.com/profile.php?id=61561883782700" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col items-center gap-1 hover:text-pink-500 transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Facebook</span>
            </a>

            <a 
              href="https://www.instagram.com/perfumeboxbangladesh" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col items-center gap-1 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
            </a>

            <a 
              href="https://wa.me/8801716938156" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col items-center gap-1 hover:text-pink-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}