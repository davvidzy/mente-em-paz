import { useEffect, useRef } from "react";

/** Executa `fn` uma vez quando o elemento fica visível. */
export function useInView<T extends HTMLElement>(fn: () => void, threshold = 0.3) {
  const ref = useRef<T>(null);
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cb.current();
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
