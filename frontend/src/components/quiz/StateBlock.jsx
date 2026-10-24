import { C, box, col, t } from './tokens';
import { Btn, Bone, Note } from './ui';

export default function StateBlock({ kind, loadingLabel, bones = [24, 12, 84, 84, 84], emptyTitle, emptyText, errorTitle, errorText, action, onAction }) {
  if (kind === "loading")
    return (
      <div role="status" aria-live="polite" style={col(24)}>
        <p style={t(13, 600, C.mute)}>{loadingLabel}</p>
        <div style={box({ padding: 20, ...col(16) })}>{bones.map((h, i) => <Bone key={i} h={h} />)}</div>
      </div>
    );
  if (kind === "empty")
    return (
      <div style={col(24)}>
        <div style={box({ padding: 24, borderRadius: 12, ...col(16) })}>
          <div style={{ width: 48, height: 48, background: C.lime, border: `2px solid ${C.ink}`, borderRadius: 10, display: "grid", placeItems: "center" }}>
            <div style={{ width: 16, height: 20, border: `1.7px solid ${C.ink}` }} />
          </div>
          <p style={t(16, 800)}>{emptyTitle}</p>
          <p style={t(13, 500, C.mute)}>{emptyText}</p>
        </div>
        <Btn full onClick={onAction}>{action}</Btn>
      </div>
    );
  return (
    <div role="alert" style={col(20)}>
      <div style={box({ padding: 20, background: C.errBg, borderRadius: 12, display: "flex", gap: 12 })}>
        <div style={{ width: 20, height: 20, flex: "none", border: `1.7px solid ${C.red}`, borderRadius: 999 }} />
        <div style={col(5)}>
          <p style={t(13, 800)}>{errorTitle}</p>
          <p style={t(11, 500, C.mute)}>{errorText}</p>
        </div>
      </div>
      <Btn full onClick={onAction}>{action}</Btn>
      <Note>Your existing learning data has not been removed.</Note>
    </div>
  );
}