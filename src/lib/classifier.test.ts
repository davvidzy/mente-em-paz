import { describe, expect, it } from "vitest";
import { classify, isComplete, joinPt } from "./classifier";
import { preventiveContent, profiles, questions } from "../config/quiz";

/** Todas as 4×4×4 = 64 combinações possíveis. */
function allCombos(): string[][] {
  return questions.reduce<string[][]>(
    (acc, q) => acc.flatMap((prefix) => q.options.map((o) => [...prefix, o.id])),
    [[]],
  );
}

const combos = allCombos();

describe("classifier", () => {
  it("3 perguntas, 64 combinações", () => {
    expect(questions).toHaveLength(3);
    expect(combos).toHaveLength(64);
  });

  it("toda combinação gera um resultado válido e completo", () => {
    for (const a of combos) {
      const r = classify(a);
      expect(profiles[r.profile]).toBeDefined();
      expect(r.mirrors.length).toBeGreaterThanOrEqual(1);
      expect(r.mirrors.length).toBeLessThanOrEqual(3);
      r.mirrors.forEach((m) => expect(m.trim()).not.toBe(""));
    }
  });

  it("é determinístico", () => {
    for (const a of combos) expect(classify(a)).toEqual(classify([...a]));
  });

  it("não gera resultado com quiz incompleto, inválido ou no formato antigo (5 respostas)", () => {
    expect(isComplete(["A", "A"])).toBe(false);
    expect(() => classify(["A", "A"])).toThrow();
    expect(() => classify(["A", "E", "A"])).toThrow();
    expect(() => classify(["A", undefined, "A"])).toThrow();
    expect(isComplete(["A", "A", "A", "A", "A"])).toBe(false);
  });

  it("respostas positivas não forçam um problema (tom preventivo)", () => {
    for (const a of combos) {
      const r = classify(a);
      const allCalm = a[0] === "D" && a[2] === "D";
      expect(r.preventive).toBe(allCalm);
      if (allCalm) expect(r.profile).toBe("sobrecarga");
    }
  });

  it("cada perfil só aparece quando há respostas que o sustentam", () => {
    for (const a of combos) {
      const r = classify(a);
      if (r.preventive) continue;
      const [q1, q2, q3] = a;
      const supports = {
        pais: q1 === "A" || q2 === "A" || q3 === "B",
        culpa: q3 === "A" || q3 === "B" || q1 === "C",
        pensamentos: q1 === "B" || q2 === "B" || q2 === "D" || q3 === "C",
        sobrecarga: q1 === "C" || q2 === "B" || q2 === "C",
      }[r.profile];
      expect(supports, `${a.join("")} → ${r.profile}`).toBe(true);
    }
  });

  it("todos os 4 perfis são alcançáveis", () => {
    const count: Record<string, number> = {};
    for (const a of combos) count[classify(a).profile] = (count[classify(a).profile] ?? 0) + 1;
    for (const p of Object.keys(profiles)) expect(count[p] ?? 0, p).toBeGreaterThan(5);
  });

  it("casos de referência", () => {
    expect(classify(["A", "A", "B"]).profile).toBe("pais");
    expect(classify(["C", "C", "A"]).profile).toBe("sobrecarga"); // empate 5×5 → causa da Q2 (sobrecarga)
    expect(classify(["D", "C", "A"]).profile).toBe("culpa"); // culpa 4 > sobrecarga 3
    expect(classify(["B", "B", "C"]).profile).toBe("pensamentos");
    expect(classify(["D", "B", "D"]).preventive).toBe(true);
  });

  it("empate é resolvido pela causa escolhida na pergunta 2", () => {
    // Q1 A (pais 3) × Q2 C (sobrecarga 3) × Q3 C (pensamentos 2) → empate pais/sobrecarga → Q2 decide
    expect(classify(["A", "C", "C"]).profile).toBe("sobrecarga");
    // Q1 B (pensamentos 3) × Q2 A (pais 3) × Q3 D → empate → Q2 (pais)
    expect(classify(["B", "A", "D"]).profile).toBe("pais");
  });

  it("frases-espelho são literais às respostas dadas", () => {
    for (const a of combos) {
      const r = classify(a);
      const given = a.map((id, qi) => questions[qi].options.find((o) => o.id === id)!.mirror);
      r.mirrors.forEach((m) => expect(given).toContain(m));
    }
  });

  it("textos do resultado cabem no limite (título ≤ 36, solução ≤ 90 caracteres)", () => {
    for (const c of [...Object.values(profiles), preventiveContent]) {
      expect(c.title.length, c.title).toBeLessThanOrEqual(36);
      expect(c.solution.length, c.solution).toBeLessThanOrEqual(90);
    }
  });

  it("joinPt", () => {
    expect(joinPt(["a"])).toBe("a");
    expect(joinPt(["a", "b"])).toBe("a e que b");
    expect(joinPt(["a", "b", "c"])).toBe("a, que b e que c");
  });
});
