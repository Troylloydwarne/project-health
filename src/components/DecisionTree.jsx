import { useState } from "react";
import { tree, STARTING_NODE } from "../data/decisionTree";
import { partners as partnerData, regionColors } from "../data/partners";

function ProgressBar({ history }) {
  const maxDepth = 5;
  const pct = Math.min((history.length / maxDepth) * 100, 90);
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 10, color: "#3a4450", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <span>Decision path</span>
        <span>{history.length} step{history.length !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ height: 2, background: "#1a2030", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #4da6ff, #00ff88)",
          borderRadius: 1,
          transition: "width 0.4s ease",
        }} />
      </div>
      {history.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {history.map((step, i) => (
            <span key={i} style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 3,
              background: "#0d1118",
              border: "1px solid #1a2030",
              color: "#5a6470",
              letterSpacing: "0.05em",
            }}>
              {step.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerCard({ name }) {
  const p = partnerData.find((d) => d.name === name);
  if (!p) return null;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      background: "#0d1118",
      border: "1px solid #1a2030",
      borderRadius: 6,
    }}>
      <span style={{ fontSize: 20 }}>{p.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#e0e8f0", fontWeight: 500 }}>{p.name}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 2,
            background: `${regionColors[p.region]}18`,
            color: regionColors[p.region],
            border: `1px solid ${regionColors[p.region]}33`,
            letterSpacing: "0.08em",
          }}>{p.region}</span>
          <span style={{
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 2,
            background: p.tier === "Primary" ? "#ffffff10" : "#ffffff06",
            color: p.tier === "Primary" ? "#ffffff" : "#3a4450",
            border: `1px solid ${p.tier === "Primary" ? "#ffffff20" : "#1a2030"}`,
          }}>{p.tier}</span>
        </div>
      </div>
      {p.rate && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>${p.rate}</div>
          <div style={{ fontSize: 9, color: "#3a4450" }}>/hr</div>
        </div>
      )}
    </div>
  );
}

function ResultView({ node, onReset, onBack }) {
  const isInternal = node.type === "internal";
  const accentColor = isInternal ? "#00ff88" : "#4da6ff";

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      {/* Recommendation badge */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3a4450", marginBottom: 10 }}>
          Recommendation
        </div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          borderRadius: 6,
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}30`,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.3px",
          }}>
            {node.recommendation}
          </span>
        </div>
      </div>

      {/* Rationale */}
      <div style={{
        background: "#0d1118",
        border: "1px solid #1a2030",
        borderRadius: 6,
        padding: "18px 20px",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 8 }}>
          Rationale
        </div>
        <div style={{ fontSize: 12, color: "#8a9aaa", lineHeight: 1.75 }}>{node.rationale}</div>
      </div>

      {/* Partner cards */}
      {node.partners.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 10 }}>
            Suggested Partner{node.partners.length > 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {node.partners.map((name) => (
              <PartnerCard key={name} name={name} />
            ))}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {node.alternatives.length > 0 && (
        <div style={{
          background: "#0a0e14",
          border: "1px solid #1a2030",
          borderRadius: 6,
          padding: "14px 18px",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a4450", marginBottom: 8 }}>
            Alternatives
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {node.alternatives.map((alt, i) => (
              <li key={i} style={{ fontSize: 11, color: "#5a6470", lineHeight: 1.7, marginBottom: 2 }}>{alt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Caveats */}
      {node.caveats.length > 0 && (
        <div style={{
          background: "#0a0e14",
          border: "1px solid #f0a50020",
          borderRadius: 6,
          padding: "14px 18px",
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0a500", marginBottom: 8 }}>
            Watch outs
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {node.caveats.map((c, i) => (
              <li key={i} style={{ fontSize: 11, color: "#7a6a40", lineHeight: 1.7, marginBottom: 2 }}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            padding: "9px 18px",
            borderRadius: 4,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "transparent",
            color: "#5a6470",
            border: "1px solid #1e2530",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            transition: "all 0.15s",
          }}
        >
          ← Back
        </button>
        <button
          onClick={onReset}
          style={{
            padding: "9px 18px",
            borderRadius: 4,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "#0d1118",
            color: "#c8d0dc",
            border: "1px solid #1e2530",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            transition: "all 0.15s",
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function QuestionView({ node, onAnswer, onBack, canGoBack }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 22,
          fontWeight: 800,
          color: "#ffffff",
          margin: "0 0 10px",
          lineHeight: 1.3,
          letterSpacing: "-0.3px",
        }}>
          {node.question}
        </h2>
        {node.hint && (
          <div style={{ fontSize: 11, color: "#4a5460", lineHeight: 1.6 }}>{node.hint}</div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {node.options.map((opt, i) => (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onAnswer(opt)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 18px",
              borderRadius: 6,
              background: hovered === i ? "#131c26" : "#0d1118",
              border: `1px solid ${hovered === i ? "#2a3a50" : "#1a2030"}`,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `1px solid ${hovered === i ? "#4da6ff44" : "#2a3040"}`,
              background: hovered === i ? "#4da6ff10" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: hovered === i ? "#4da6ff" : "#3a4450",
              flexShrink: 0,
              marginTop: 1,
              transition: "all 0.15s",
            }}>
              {String.fromCharCode(65 + i)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: hovered === i ? "#e0e8f0" : "#c8d0dc", fontWeight: 500, marginBottom: opt.description ? 3 : 0 }}>
                {opt.label}
              </div>
              {opt.description && (
                <div style={{ fontSize: 11, color: "#3a4450", lineHeight: 1.5 }}>{opt.description}</div>
              )}
            </div>
            <div style={{ color: hovered === i ? "#4da6ff" : "#2a3040", fontSize: 14, flexShrink: 0, marginTop: 2, transition: "color 0.15s" }}>→</div>
          </button>
        ))}
      </div>

      {canGoBack && (
        <button
          onClick={onBack}
          style={{
            padding: "7px 16px",
            borderRadius: 4,
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "transparent",
            color: "#3a4450",
            border: "1px solid #1a2030",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            transition: "all 0.15s",
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export default function DecisionTree() {
  // history = [{ nodeId, label }]
  const [history, setHistory] = useState([]);
  const [currentNodeId, setCurrentNodeId] = useState(STARTING_NODE);

  const currentNode = tree[currentNodeId];

  const handleAnswer = (opt) => {
    setHistory((h) => [...h, { nodeId: currentNodeId, label: opt.label }]);
    setCurrentNodeId(opt.next);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentNodeId(prev.nodeId);
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNodeId(STARTING_NODE);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Section header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4da6ff", marginBottom: 6 }}>
          Partner Selection
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 8px",
          letterSpacing: "-0.3px",
        }}>
          Decision Tree
        </h2>
        <div style={{ fontSize: 11, color: "#3a4450", lineHeight: 1.6 }}>
          Answer each question to get a partner recommendation. Internal PS is recommended for accounts ≥$300k ARR.
        </div>
        <div style={{ marginTop: 20, height: 1, background: "linear-gradient(90deg, #4da6ff33, #1e2530, transparent)" }} />
      </div>

      <ProgressBar history={history} />

      {currentNode.result ? (
        <ResultView node={currentNode} onReset={handleReset} onBack={handleBack} />
      ) : (
        <QuestionView
          node={currentNode}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={history.length > 0}
        />
      )}
    </div>
  );
}
