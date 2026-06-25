"use client";

const MS_DAY = 86400000;
const TOP = 70; // px before the first (most recent) dot
const MIN_GAP = 116; // min px between consecutive dots (no overlap + padding)
const PX_PER_DAY = 0.45; // proportional spacing: older memories sit further down
const TAIL = 460; // px the line continues past the oldest dot, off-screen

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Lays out contributions vertically, scaled to elapsed time but with a minimum
// gap so dots never overlap. Returns each item with its `y` pixel offset.
export function layoutTimeline(contributions) {
  if (contributions.length === 0) return { items: [], totalHeight: TOP + TAIL };
  const ref = new Date(contributions[0].memory_date + "T00:00:00").getTime();
  let prev = TOP;
  const items = contributions.map((c, i) => {
    const days = Math.max(0, (ref - new Date(c.memory_date + "T00:00:00").getTime()) / MS_DAY);
    const proportional = TOP + days * PX_PER_DAY;
    const y = i === 0 ? TOP : Math.max(prev + MIN_GAP, proportional);
    prev = y;
    return { c, y };
  });
  return { items, totalHeight: prev + TAIL };
}

export default function Timeline({ contributions, selectedId, onSelect }) {
  const { items, totalHeight } = layoutTimeline(contributions);
  const lineX = 26;

  return (
    <div className="relative shrink-0" style={{ width: 150, height: totalHeight }}>
      {/* The line — extends past the oldest dot and fades off-screen */}
      <div
        className="absolute w-[2px]"
        style={{
          left: lineX,
          top: 12,
          height: totalHeight - 12,
          background:
            "linear-gradient(to bottom, #93c5fd 0%, #93c5fd 70%, rgba(147,197,253,0) 100%)",
        }}
      />

      {items.map(({ c, y }) => {
        const selected = c.id === selectedId;
        return (
          <div key={c.id} className="absolute left-0" style={{ top: y, transform: "translateY(-50%)" }}>
            <button
              onClick={() => onSelect(c.id)}
              className={[
                "relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                selected
                  ? "scale-110 border-blue-600 bg-blue-600 text-white shadow-lg"
                  : c.is_current
                  ? "border-emerald-500 bg-white text-emerald-600 hover:bg-emerald-50"
                  : "border-blue-400 bg-white text-blue-600 hover:bg-blue-50",
              ].join(" ")}
              style={{ marginLeft: lineX - 18 + 2 }}
              title={fmtDate(c.memory_date)}
            >
              {c.index}
            </button>
            <div
              className="pointer-events-none absolute whitespace-nowrap text-[11px] leading-tight"
              style={{ left: lineX + 26, top: "50%", transform: "translateY(-50%)" }}
            >
              <div className="font-semibold text-zinc-700">
                {c.is_current ? "Now" : fmtDate(c.memory_date)}
              </div>
              {!c.is_current && (
                <div className="text-zinc-400">{new Date(c.memory_date + "T00:00:00").getFullYear()}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
