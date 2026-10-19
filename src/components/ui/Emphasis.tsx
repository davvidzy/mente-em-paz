import { splitEmphasis } from "../../lib/format";

/** Renderiza texto de configuração com trechos **em destaque**. */
export function Emphasis({ text, markClass = "em-mark" }: { text: string; markClass?: string }) {
  return (
    <>
      {splitEmphasis(text).map((s, i) =>
        s.em ? (
          <span key={i} className={markClass}>
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}
