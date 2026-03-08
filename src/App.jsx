import { useState, useMemo } from "react";
import {
  partners,
  capabilityGroups,
  allCaps,
  regionColors,
} from "./data/partners";
import Dot from "./components/Dot";
import PartnerDrawer from "./components/PartnerDrawer";
import CoverageSummary from "./components/CoverageSummary";
import DecisionTree from "./components/DecisionTree";

const SORT_OPTIONS = [
  { key: "name", label: "Name" },
  { key: "rate", label: "Rate" },
  { key: "tier", label: "Tier" },
  { key: "score", label: "Score" },
];

function capabilityScore(p) {
  return allCaps.reduce((s, c) => {
    const l = p.capabilities[c];
    return s + (l === "primary" ? 3 : l === "secondary" ? 2 : l === "learning" ? 1 : 0);
  }, 0);
}

function thStyle(overrides = {}) {
  return {
    textAlign: "center",
    padding: "10px 8px",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#3a4450",
    textTransform: "uppercase",
    borderBottom: "1px solid #1a2030",
    whiteSpace: "nowrap",
    fontWeight: 500,
    ...overrides,
  };
}

function tdStyle(overrides = {}) {
  return {
    padding: "13px 8px",
    textAlign: "center",
    borderBottom: "1px solid #111820",
    verticalAlign: "middle",
    ...overrides,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("matrix");
  const [regionFilter, setRegionFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [sortKey, setSortKey] = useState("tier");
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeCapFilter, setActiveCapFilter] = useState(null);

  const regions = ["All", "EMEA", "US", "India"];
  const tiers = ["All", "Primary", "Secondary"];

  const filtered = useMemo(() => {
    let list = partners;
    if (regionFilter !== "All") list = list.filter((p) => p.region === regionFilter);
    if (tierFilter !== "All") list = list.filter((p) => p.tier === tierFilter);
    if (activeCapFilter) list = list.filter((p) => p.capabilities[activeCapFilter] !== "none");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let av, bv;
      if (sortKey === "name") { av = a.name; bv = b.name; }
      else if (sortKey === "rate") { av = a.rate ?? 0; bv = b.rate ?? 0; }
      else if (sortKey === "tier") { av = a.tier === "Primary" ? 0 : 1; bv = b.tier === "Primary" ? 0 : 1; }
      else { av = capabilityScore(a); bv = capabilityScore(b); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [regionFilter, tierFilter, activeCapFilter, search, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const totalPrimary = partners.filter((p) => p.tier === "Primary").length;
  const totalSecondary = partners.filter((p) => p.tier === "Secondary").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e14",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#c8d0dc",
      padding: "40px 32px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0e14; }
        ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }
        .partner-row { transition: background 0.15s; cursor: pointer; }
        .partner-row:hover { background: #131c26 !important; }
        .filter-btn { transition: all 0.15s; cursor: pointer; border: none; font-family: 'DM Mono', monospace; }
        .filter-btn:hover { opacity: 0.85; }
        .sort-btn { background: none; border: none; color: inherit; cursor: pointer; font-family: inherit; font-size: inherit; padding: 0; display: inline-flex; align-items: center; gap: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeBackdrop { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.35s ease forwards; opacity: 0; }
        .search-input { background: #0d1118; border: 1px solid #1e2530; border-radius: 4px; color: #c8d0dc; font-family: 'DM Mono', monospace; font-size: 11px; padding: 6px 12px; outline: none; transition: border-color 0.15s; width: 200px; }
        .search-input:focus { border-color: #2a3a50; }
        .search-input::placeholder { color: #3a4450; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#4da6ff", marginBottom: 6, textTransform: "uppercase" }}>
              Gainsight Professional Services
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 30,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              Partner Network
            </h1>
            <div style={{ marginTop: 8, fontSize: 11, color: "#5a6470" }}>
              {totalPrimary} primary · {totalSecondary} secondary · {partners.length} total active
            </div>
          </div>

          {/* Search + filters — only shown on matrix tab */}
          <div style={{ display: activeTab === "matrix" ? "flex" : "none", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="search-input"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {regions.map((r) => (
              <button
                key={r}
                className="filter-btn"
                onClick={() => setRegionFilter(r)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: regionFilter === r ? (regionColors[r] || "#ffffff") : "#111820",
                  color: regionFilter === r ? "#0a0e14" : "#5a6470",
                  border: `1px solid ${regionFilter === r ? "transparent" : "#1e2530"}`,
                  fontWeight: 500,
                }}
              >
                {r}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: "#1e2530" }} />
            {tiers.map((t) => (
              <button
                key={t}
                className="filter-btn"
                onClick={() => setTierFilter(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: tierFilter === t ? "#ffffff" : "#111820",
                  color: tierFilter === t ? "#0a0e14" : "#5a6470",
                  border: `1px solid ${tierFilter === t ? "transparent" : "#1e2530"}`,
                  fontWeight: 500,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {(activeCapFilter || search.trim()) && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#3a4450", letterSpacing: "0.1em", textTransform: "uppercase" }}>Filters:</span>
            {activeCapFilter && (
              <span
                onClick={() => setActiveCapFilter(null)}
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 3,
                  background: "#4da6ff18",
                  color: "#4da6ff",
                  border: "1px solid #4da6ff33",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                {activeCapFilter} ×
              </span>
            )}
            {search.trim() && (
              <span
                onClick={() => setSearch("")}
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 3,
                  background: "#ffffff10",
                  color: "#7a8490",
                  border: "1px solid #1e2530",
                  cursor: "pointer",
                }}
              >
                &quot;{search}&quot; ×
              </span>
            )}
            <span style={{ fontSize: 10, color: "#3a4450" }}>
              {filtered.length} of {partners.length} partners
            </span>
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginTop: 28, borderBottom: "1px solid #1a2030" }}>
          {[
            { id: "matrix", label: "Capability Matrix" },
            { id: "decision", label: "Partner Selector" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 20px",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "#4da6ff" : "transparent"}`,
                color: activeTab === tab.id ? "#4da6ff" : "#3a4450",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                marginBottom: -1,
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Tree tab */}
      {activeTab === "decision" && (
        <DecisionTree />
      )}

      {/* Matrix tab */}
      {activeTab === "matrix" && <>

      {/* Sort controls */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#3a4450", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 6 }}>Sort:</span>
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.key}
            className="filter-btn sort-btn"
            onClick={() => handleSort(o.key)}
            style={{
              padding: "4px 10px",
              borderRadius: 3,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: sortKey === o.key ? "#1a2030" : "transparent",
              color: sortKey === o.key ? "#c8d0dc" : "#3a4450",
              border: `1px solid ${sortKey === o.key ? "#2a3040" : "transparent"}`,
            }}
          >
            {o.label}
            {sortKey === o.key && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? " ↑" : " ↓"}</span>}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Primary", color: "#00ff88" },
          { label: "Secondary", color: "#f0a500" },
          { label: "Learning", color: "#4da6ff" },
          { label: "None", color: "#1e2530" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "#5a6470" }}>
            <div style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: l.color,
              boxShadow: l.color !== "#1e2530" ? `0 0 5px ${l.color}` : "none",
              flexShrink: 0,
            }} />
            {l.label}
          </div>
        ))}
        <div style={{ fontSize: 10, color: "#2a3040", marginLeft: "auto" }}>
          Click a row for details · Click a capability card to filter
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 940 }}>
          <thead>
            <tr>
              <th style={thStyle({ width: 210, textAlign: "left", paddingLeft: 16 })}>Partner</th>
              <th style={thStyle({ width: 72 })}>Region</th>
              <th style={thStyle({ width: 72 })}>Tier</th>
              {Object.entries(capabilityGroups).map(([, caps]) =>
                caps.map((cap, i) => (
                  <th
                    key={cap}
                    style={thStyle({
                      width: 74,
                      borderLeft: i === 0 ? "1px solid #1a2030" : "none",
                      color: activeCapFilter === cap ? "#4da6ff" : i === 0 ? "#546070" : "#3a4450",
                    })}
                  >
                    {cap}
                  </th>
                ))
              )}
              <th style={thStyle({ textAlign: "left", paddingLeft: 16, borderLeft: "1px solid #1a2030" })}>Notes</th>
              <th style={thStyle({ width: 72 })}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3 + allCaps.length + 2}
                  style={{ textAlign: "center", padding: "48px 16px", color: "#3a4450", fontSize: 12 }}
                >
                  No partners match your filters.
                </td>
              </tr>
            )}
            {filtered.map((p, idx) => (
              <tr
                key={p.name}
                className="partner-row fade-in"
                style={{
                  background: idx % 2 === 0 ? "#0d1118" : "#0a0e14",
                  animationDelay: `${idx * 35}ms`,
                }}
                onClick={() => setSelectedPartner(p)}
              >
                <td style={tdStyle({ paddingLeft: 16, paddingRight: 16 })}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{p.flag}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#e0e8f0", fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "#3a4450", marginTop: 2 }}>Since {p.since}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle()}>
                  <span style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 3,
                    background: `${regionColors[p.region]}18`,
                    color: regionColors[p.region],
                    letterSpacing: "0.1em",
                    border: `1px solid ${regionColors[p.region]}33`,
                    whiteSpace: "nowrap",
                  }}>
                    {p.region}
                  </span>
                </td>
                <td style={tdStyle()}>
                  <span style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 3,
                    background: p.tier === "Primary" ? "#ffffff10" : "#ffffff06",
                    color: p.tier === "Primary" ? "#ffffff" : "#3a4450",
                    border: `1px solid ${p.tier === "Primary" ? "#ffffff20" : "#1a2030"}`,
                  }}>
                    {p.tier}
                  </span>
                </td>
                {Object.entries(capabilityGroups).map(([, caps]) =>
                  caps.map((cap, i) => (
                    <td
                      key={cap}
                      style={tdStyle({
                        borderLeft: i === 0 ? "1px solid #1a2030" : "none",
                        background:
                          activeCapFilter === cap && p.capabilities[cap] !== "none"
                            ? "#4da6ff08"
                            : undefined,
                      })}
                    >
                      <Dot level={p.capabilities[cap]} />
                    </td>
                  ))
                )}
                <td style={tdStyle({
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderLeft: "1px solid #1a2030",
                  fontSize: 11,
                  color: "#5a6470",
                  lineHeight: 1.5,
                  maxWidth: 260,
                  textAlign: "left",
                })}>
                  {p.notes}
                </td>
                <td style={tdStyle()}>
                  {p.rate
                    ? <span style={{ fontSize: 11, color: "#7a8490", whiteSpace: "nowrap" }}>${p.rate}/hr</span>
                    : <span style={{ fontSize: 10, color: "#2a3040" }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage summary */}
      <CoverageSummary onCapFilter={setActiveCapFilter} activeCapFilter={activeCapFilter} />

      {/* Footer */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: "#2a3040", letterSpacing: "0.1em" }}>
          GAINSIGHT PS · PARTNER NETWORK · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase()}
        </div>
        <div style={{ fontSize: 10, color: "#2a3040" }}>{filtered.length} partners shown</div>
      </div>

      </>}

      {/* Detail drawer (available on both tabs) */}
      <PartnerDrawer partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
    </div>
  );
}
