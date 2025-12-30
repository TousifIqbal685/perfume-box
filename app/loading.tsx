export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white z-[9999] relative">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-serif tracking-widest text-sm animate-pulse">
        Sorry for the wait...
      </p>
    </div>
  );
}