import { describe, expect, it } from "vitest";
import { classify, isComplete, joinPt } from "./classifier";
import { profiles, questions, desires } from "../config/quiz";

/** Todas as 4×4×3×4×4 = 768 combinações possíveis. */
function allCombos(): string[][] {
  return questions.reduce<string[][]>(
    (acc, q) => acc.flatMap((prefix) => q.options.map((o) => [...prefix, o.id])),
    [[]],
  );
}

const combos = allCombos();

describe("classifier", () => {
  it("cobre as 768 combinações", () => {
    expect(questions).toHaveLength(5);
    expect(combos).toHaveLength(768);
  });

  it("toda combinação gera um resultado válido e completo", () => {
    for (const a of combos) {
      const r = classify(a);
      expect(profiles[r.profile]).toBeDefined();
      expect(desires[r.desire]).toBeDefined();
      expect(r.mirrors.length).toBeGreaterThanOrEqual(1);
      expect(r.mirrors.length).toBeLessThanOrEqual(3);
      r.mirrors.forEach((m) => expect(m.trim()).not.toBe(""));
    }
  });

  it("é determinístico", () => {
    for (const a of combos) expect(classify(a)).toEqual(classify([...a]));
  });

  it("não gera resultado com quiz incompleto ou inválido", () => {
    expect(isComplete(["A", "A", "A", "A"])).toBe(false);
    expect(() => classify(["A", "A", "A", "A"])).toThrow();
    expect(() => classify(["A", "A", "D", "A", "A"])).toThrow(); // Q3 só tem A–C
    expect(() => classify(["A", "A", undefined, "A", "A"])).toThrow();
  });

  it("o desejo vem sempre da pergunta 5", () => {
    const map = { A: "fiz_o_possivel", B: "menos_pensamentos", C: "sem_culpa", D: "rotina_leve" };
    for (const a of combos) expect(classify(a).desire).toBe(map[a[4] as keyof typeof map]);
  });

  it("respostas positivas não forçam um problema (tom preventivo)", () => {
    for (const a of combos) {
      if (a[0] === "D" && a[2] === "C" && a[3] === "D") {
        const r = classify(a);
        expect(r.preventive).toBe(true);
        expect(r.profile).toBe("sobrecarga");
      }
    }
  });

  it("cada perfil só aparece quando há respostas que o sustentam", () => {
    for (const a of combos) {
      const r = classify(a);
      if (r.preventive) continue;
      const [q1, q2, , q4, q5] = a;
      const supports = {
        pais: q1 === "A" || q2 === "A" || q4 === "B",
        culpa: q4 === "A" || q4 === "B" || q1 === "C" || q5 === "C",
        pensamentos: q1 === "B" || q2 === "B" || q2 === "D" || q4 === "C",
        sobrecarga: q1 === "C" || q2 === "B" || q2 === "C" || q5 === "D",
      }[r.profile];
      expect(supports, `${a.join("")} → ${r.profile}`).toBe(true);
    }
  });

  it("todos os 4 perfis são alcançáveis e a distribuição não é degenerada", () => {
    const count: Record<string, number> = {};
    for (const a of combos) count[classify(a).profile] = (count[classify(a).profile] ?? 0) + 1;
    for (const p of Object.keys(profiles)) expect(count[p] ?? 0).toBeGreaterThan(40);
  });

  it("casos de referência", () => {
    expect(classify(["A", "A", "A", "B", "A"]).profile).toBe("pais");
    expect(classify(["C", "C", "B", "A", "C"]).profile).toBe("culpa");
    expect(classify(["B", "B", "A", "C", "B"]).profile).toBe("pensamentos");
    expect(classify(["C", "C", "B", "D", "D"]).profile).toBe("sobrecarga");
    expect(classify(["D", "D", "C", "D", "B"]).preventive).toBe(true);
  });

  it("empate é resolvido pelo desejo da pergunta 5", () => {
    // Q1 A (pais 3) × Q4 A (culpa 3); Q2 C (sobrecarga 3); Q5 decide entre os empatados
    expect(classify(["A", "C", "B", "A", "C"]).profile).toBe("culpa"); // culpa 4 vence
    const r = classify(["A", "C", "B", "A", "D"]); // pais 3, culpa 3, sobrecarga 4
    expect(r.profile).toBe("sobrecarga");
    // empate triplo pais/culpa/sobrecarga = 3; desejo (pensamentos) não está no empate → prioridade fixa
    expect(classify(["A", "C", "B", "A", "B"]).profile).toBe("pais");
  });

  it("frases-espelho são literais às respostas dadas", () => {
    for (const a of combos.slice(0, 200)) {
      const r = classify(a);
      const given = a.slice(0, 4).map((id, qi) => questions[qi].options.find((o) => o.id === id)!.mirror);
      r.mirrors.forEach((m) => expect(given).toContain(m));
    }
  });

  it("joinPt", () => {
    expect(joinPt(["a"])).toBe("a");
    expect(joinPt(["a", "b"])).toBe("a e que b");
    expect(joinPt(["a", "b", "c"])).toBe("a, que b e que c");
  });
});
