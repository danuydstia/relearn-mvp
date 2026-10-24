import { col, C, t } from './tokens';
import { HEAD, STATES, FOOTER_TEXT } from './copy';
import StateBlock from './StateBlock';
import { Note } from './ui';

const Head = ({ title, sub }) => (
  <div style={col(8)}>
    <h1 style={t(32, 800, C.ink, { lineHeight: "48px" })}>{title}</h1>
    <p style={t(14, 600, C.mute)}>{sub}</p>
  </div>
);

export default function QuizShell({ view, status = "ready", children, onStateAction }) {
  const [title, sub] = HEAD[view];
  const s = STATES[view];
  
  return (
    <div style={{ padding: 40, fontFamily: "Inter, system-ui, sans-serif", ...col(28) }}>
      <Head title={title} sub={view === "intro" || view === "question" || status === "ready" ? sub : sub} />
      
      {status === "ready" ? children : (
        <div style={{ maxWidth: 480 }}>
          <StateBlock kind={status} loadingLabel={s.loadingLabel} bones={s.bones}
            emptyTitle={s.emptyTitle} emptyText={s.emptyText} errorTitle={s.errorTitle} errorText={s.errorText}
            action={status === "empty" ? s.emptyAction : s.errorAction} onAction={onStateAction} />
        </div>
      )}
      
      {(view === "results" || view === "review") && <Note>{FOOTER_TEXT}</Note>}
    </div>
  );
}