"use client";

export default function ContactPage() {
  return (
    // Container: Centers the image with padding
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      
      <img
        src="/Contact.jpg"
        alt="Contact Us"
        // max-h-[60vh]: Limits height to 60% of screen (smaller than before)
        // max-w-2xl: Limits width so it doesn't stretch too wide
        // object-contain: Ensures the whole image is visible without cropping
        className="w-auto h-auto max-w-2xl max-h-[60vh] object-contain shadow-2xl rounded-xl"
      />
      
    </main>
  );
}