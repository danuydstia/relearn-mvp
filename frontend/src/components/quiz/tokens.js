export const C = { 
  ink: "#171916", mute: "#62665C", lime: "#D5F35B", paper: "#F7F7F2", 
  chip: "#F2F1EC", link: "#405C04", red: "#A53932", green: "#27644B", errBg: "#FFF5F2" 
};

export const box = (extra = {}) => ({ background: "white", border: `2px solid ${C.ink}`, borderRadius: 8, ...extra });
export const t = (size, weight, color = C.ink, extra = {}) => ({ fontSize: size, fontWeight: weight, color, lineHeight: 1.5, margin: 0, ...extra });
export const col = (gap, extra = {}) => ({ display: "flex", flexDirection: "column", gap, ...extra });
export const row = (gap, extra = {}) => ({ display: "flex", alignItems: "center", gap, ...extra });