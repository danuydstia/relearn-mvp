import { C, t } from './tokens';

export const Btn = ({ children, onClick, disabled, full, w }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ height: 48, width: full ? "100%" : w, padding: "0 20px", font: "inherit", ...t(13, 800, disabled ? "#777A82" : C.ink),
      background: disabled ? C.chip : C.lime, border: `2px solid ${C.ink}`, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" }}>
    {children}
  </button>
);

export const Link = ({ children, onClick }) => (
  <button onClick={onClick} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", ...t(13, 800, C.link) }}>{children}</button>
);

export const Pill = ({ children, on = true }) => (
  <span style={{ ...t(11, 800, on ? C.ink : C.mute), padding: "5px 10px", background: on ? C.lime : C.chip, border: `2px solid ${C.ink}`, borderRadius: 8, display: "inline-block" }}>{children}</span>
);

export const Note = ({ children }) => <p style={t(11, 600, C.mute)}>{children}</p>;

export const Bone = ({ h }) => <div style={{ height: h, background: C.paper, borderRadius: 6 }} />;