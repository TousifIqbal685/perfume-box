// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext"; // Import UserProvider
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Perfume Box | Signature Scents",
  description: "Authentic and Premium Perfumes in Bangladesh. Discover luxury.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        
        {/* Wrap everything in UserProvider so auth state is global */}
        <UserProvider>
          <CartProvider>
            {/* HEADER + CART DRAWER */}
            <Header />
            <CartDrawer />

            {/* MAIN CONTENT GROWS TO FILL, PUSHING FOOTER DOWN */}
            <main className="flex-1">
              {children}
            </main>

            {/* FOOTER ALWAYS AT VERY BOTTOM */}
            <Footer />
          </CartProvider>
        </UserProvider>
        
      </body>
    </html>
  );
}