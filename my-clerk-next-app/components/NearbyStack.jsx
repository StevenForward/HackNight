"use client";

// Vertical stack of the ~5 closest establishments to where the user clicked.
// Shown at the top-right. Selecting one opens that place's timeline panel.
export default function NearbyStack({ loading, places, onSelect, onClose, error }) {
  return (
    <div className="absolute right-4 top-4 z-[1000] w-80 max-w-[calc(100vw-2rem)]">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Closest places</p>
            <p className="text-xs text-zinc-500">Pick the spot you remember</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-black/5 hover:text-zinc-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="thin-scroll max-h-[60vh] divide-y divide-black/5 overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500">
              Searching nearby…
            </div>
          )}
          {error && !loading && (
            <div className="px-4 py-6 text-center text-sm text-rose-600">{error}</div>
          )}
          {!loading && !error && places.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500">
              No establishments found right here. Try clicking a little closer to a building.
            </div>
          )}
          {!loading &&
            places.map((p) => (
              <button
                key={p.googlePlaceId}
                onClick={() => onSelect(p)}
                className="block w-full px-4 py-3 text-left transition-colors hover:bg-blue-50"
              >
                <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                {p.type && <p className="text-xs text-blue-600">{p.type}</p>}
                {p.address && (
                  <p className="mt-0.5 text-xs text-zinc-500">{p.address}</p>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
