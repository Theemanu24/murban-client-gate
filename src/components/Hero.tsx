import React from "react";

export default function Hero() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1600')] before:content-[''] before:absolute before:inset-0 before:bg-black/60"
    >
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Welcome</h1>
      </div>
    </div>
  );
}
