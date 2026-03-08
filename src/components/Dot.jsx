import { capabilityLevels } from "../data/partners";

export default function Dot({ level, size = 14 }) {
  const c = capabilityLevels[level] || capabilityLevels.none;
  return (
    <div
      title={c.label}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c.bg,
        boxShadow: c.shadow,
        margin: "0 auto",
        transition: "transform 0.15s",
        cursor: "default",
      }}
    />
  );
}
