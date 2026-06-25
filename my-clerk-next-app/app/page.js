"use client";

import dynamic from "next/dynamic";

// The whole experience is map-driven and depends on Leaflet (browser-only),
// so we load it client-side with SSR disabled.
const MapApp = dynamic(() => import("@/components/MapApp"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#aadaff] text-zinc-700">
      Loading map…
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-full w-full">
      <MapApp />
    </main>
  );
}
