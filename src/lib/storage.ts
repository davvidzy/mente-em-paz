/** Acesso seguro ao storage (pode falhar em aba anônima / bloqueio de cookies). */
type Kind = "session" | "local";

function store(kind: Kind): Storage | null {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function read<T>(key: string, kind: Kind = "session"): T | null {
  try {
    const raw = store(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function write(key: string, value: unknown, kind: Kind = "session"): void {
  try {
    store(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* sem storage: segue só em memória */
  }
}

export function remove(key: string, kind: Kind = "session"): void {
  try {
    store(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}
