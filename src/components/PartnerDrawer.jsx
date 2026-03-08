import { allCaps, capabilityDescriptions, capabilityLevels, regionColors } from "../data/partners";
import Dot from "./Dot";

export default function PartnerDrawer({ partner, onClose }) {
  if (!partner) return null;

  const capEntries = allCaps.map((cap) => ({
    cap,
    level: partner.capabilities[cap],
    desc: capabilityDescriptions[cap],
  }));

  const active = capEntries.filter((e) => e.level !== "none");
  const score = active.reduce((s, e) => s + (e.level === "primary" ? 2 : e.level === "secondary" ? 1 : 0.5), 0);
  const maxScore = allCaps.length * 2;
  const pct = Math.round((score / maxScore) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "#0a0e14aa",
          backdropFilter: "blur(2px)",
          zIndex: 40,
          animation: "fadeBackdrop 0.2s ease",
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          background: "#0d1118",
          borderLeft: "1px solid #1e2530",
          zIndex: 50,
          overflowY: "auto",
          padding: "32px 28px",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            color: "#3a4450",
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
            padding: 4,
          }}
        >
          ×
        </button>

        {/* Partner header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{partner.flag}</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 6px",
          }}>
            {partner.name}
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 3,
              background: `${regionColors[partner.region]}18`,
              color: regionColors[partner.region],
              border: `1px solid ${regionColors[partner.region]}33`,
              letterSpacing: "0.1em",
            }}>{partner.region}</span>
            <span style={{
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 3,
              background: partner.tier === "Primary" ? "#ffffff10" : "#ffffff06",
              color: partner.tier === "Primary" ? "#fff" : "#3a4450",
              border: `1px solid ${partner.tier === "Primary" ? "#ffffff20" : "#1a2030"}`,
              letterSpacing: "0.08em",
            }}>{partner.tier}</span>
            {partner.since && (
              <span style={{ fontSize: 10, color: "#3a4450" }}>Since {partner.since}</span>
            )}
          </div>
        </div>

        {/* Capability score */}
        <div style={{
          background: "#0a0e14",
          border: "1px solid #1a2030",
          borderRadius: 6,
          padding: "16px 20px",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450" }}>Capability Score</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: pct >= 50 ? "#00ff88" : pct >= 25 ? "#f0a500" : "#ff4444",
            }}>{pct}<span style={{ fontSize: 14, color: "#3a4450" }}>%</span></div>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "#1a2030", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: pct >= 50 ? "#00ff88" : pct >= 25 ? "#f0a500" : "#ff4444",
              borderRadius: 2,
              transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: "#3a4450", marginTop: 8 }}>
            {active.filter(e => e.level === "primary").length} primary · {active.filter(e => e.level === "secondary").length} secondary · {active.filter(e => e.level === "learning").length} learning
          </div>
        </div>

        {/* Rate */}
        {partner.rate && (
          <div style={{
            background: "#0a0e14",
            border: "1px solid #1a2030",
            borderRadius: 6,
            padding: "14px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450" }}>Rate</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              ${partner.rate}<span style={{ fontSize: 12, color: "#3a4450", fontFamily: "'DM Mono', monospace" }}>/hr</span>
            </div>
          </div>
        )}

        {/* Capabilities breakdown */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 12 }}>Capabilities</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {capEntries.map(({ cap, level, desc }) => {
              const c = capabilityLevels[level] || capabilityLevels.none;
              return (
                <div key={cap} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 4,
                  background: level !== "none" ? "#0a0e14" : "transparent",
                  border: `1px solid ${level !== "none" ? "#1a2030" : "transparent"}`,
                  opacity: level === "none" ? 0.35 : 1,
                }}>
                  <Dot level={level} size={10} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#c8d0dc", fontWeight: 500 }}>{cap}</div>
                    <div style={{ fontSize: 10, color: "#3a4450", marginTop: 1 }}>{desc}</div>
                  </div>
                  {level !== "none" && (
                    <span style={{
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: c.bg,
                      flexShrink: 0,
                    }}>{c.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{
          background: "#0a0e14",
          border: "1px solid #1a2030",
          borderRadius: 6,
          padding: "14px 20px",
          marginBottom: partner.contact ? 16 : 0,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 8 }}>Notes</div>
          <div style={{ fontSize: 12, color: "#7a8490", lineHeight: 1.7 }}>{partner.notes}</div>
        </div>

        {/* Contact */}
        {partner.contact && (
          <div style={{
            background: "#0a0e14",
            border: "1px solid #1a2030",
            borderRadius: 6,
            padding: "14px 20px",
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 6 }}>Contact</div>
            <div style={{ fontSize: 11, color: "#4da6ff" }}>{partner.contact}</div>
          </div>
        )}
      </div>
    </>
  );
}
