import { allCaps, partners } from "../data/partners";

export default function CoverageSummary({ onCapFilter, activeCapFilter }) {
  return (
    <div style={{
      marginTop: 40,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12,
    }}>
      {allCaps.map((cap) => {
        const primary = partners.filter((p) => p.capabilities[cap] === "primary").length;
        const secondary = partners.filter((p) => p.capabilities[cap] === "secondary").length;
        const learning = partners.filter((p) => p.capabilities[cap] === "learning").length;
        const total = primary + secondary;
        const isActive = activeCapFilter === cap;

        return (
          <div
            key={cap}
            onClick={() => onCapFilter(isActive ? null : cap)}
            style={{
              background: isActive ? "#111820" : "#0d1118",
              border: `1px solid ${isActive ? "#4da6ff44" : "#1a2030"}`,
              borderRadius: 6,
              padding: "14px 18px",
              cursor: "pointer",
              transition: "all 0.15s",
              outline: isActive ? "1px solid #4da6ff22" : "none",
            }}
          >
            <div style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isActive ? "#4da6ff" : "#3a4450",
              marginBottom: 8,
            }}>{cap}</div>
            <div style={{
              fontSize: 22,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              color: total > 2 ? "#00ff88" : total > 0 ? "#f0a500" : "#ff4444",
            }}>
              {total}
            </div>
            <div style={{ fontSize: 10, color: "#3a4450", marginTop: 3 }}>
              {primary}p · {secondary}s{learning > 0 ? ` · ${learning}l` : ""}
            </div>
            <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: "#1a2030", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((total / partners.length) * 100, 100)}%`,
                background: total > 2 ? "#00ff88" : total > 0 ? "#f0a500" : "#ff4444",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
