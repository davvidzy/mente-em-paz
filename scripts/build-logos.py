"""
Gera os SVGs oficiais do Mente em Paz a partir de geometria limpa + Lora 600 em curvas.

Uso:  python scripts/build-logos.py <caminho-para-Lora[wght].ttf>
Saída: src/assets/brand/*.svg e public/favicon.svg

O símbolo é uma reconstrução vetorial do conceito aprovado (lua crescente + "+"
arredondado + curva orgânica), desenhado num grid de 128 × 128.
O texto é convertido em curvas para não depender da fonte instalada.
"""

import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "brand"
PUBLIC = ROOT / "public"

# Tokens do design system (Refúgio Sereno)
BRAND = "#253E43"  # brand-900 · verde-petróleo
SAGE = "#A5B9A9"  # sage-300 · verde-sálvia
LOGO_SAGE = "#7D947C"  # sálvia da arte aprovada da logo (uso exclusivo do símbolo; não é token de UI)
CANVAS = "#F8F5EF"
WHITE = "#FFFFFF"

# ── Símbolo (grid 128) ──────────────────────────────────────────────
# Lua: círculo externo C1(64,64,r54) menos círculo interno C2(76,54,r44).
# Pontas calculadas pela interseção dos círculos.
MOON = "M70.31 10.38A54 54 0 1 0 117.89 67.46A44 44 0 1 1 70.31 10.38Z"
# Curva orgânica: borda inferior acompanha o círculo interno (r39 → respiro de 5),
# borda superior em S suave terminando em ponta.
LEAF = (
    "M39.84 68.61"
    "C47.5 79.5 61 82.2 72 82.6"
    "C82.5 83 90.6 84.2 96.67 87.07"
    "A39 39 0 0 1 39.84 68.61Z"
)
# "+" arredondado (traço com pontas redondas)
PLUS_CX, PLUS_CY, PLUS_ARM, PLUS_W = 74, 49, 12.5, 12.5


def plus_path(cx=PLUS_CX, cy=PLUS_CY, arm=PLUS_ARM):
    return f"M{cx} {cy - arm}V{cy + arm}M{cx - arm} {cy}H{cx + arm}"


def symbol_group(moon, accent, simplified=False, tx=0.0, ty=0.0, scale=1.0):
    plus_w = PLUS_W * (1.25 if simplified else 1)
    parts = [
        f'<g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})">',
        f'<path d="{MOON}" fill="{moon}"/>',
    ]
    if not simplified:
        parts.append(f'<path d="{LEAF}" fill="{accent}"/>')
    parts.append(
        f'<path d="{plus_path(arm=PLUS_ARM * (1.12 if simplified else 1))}" '
        f'stroke="{accent}" stroke-width="{plus_w}" stroke-linecap="round" fill="none"/>'
    )
    parts.append("</g>")
    return "".join(parts)


SYMBOL_BOX = (10, 10, 118, 118)  # bbox visual do símbolo no grid 128


# ── Texto em curvas ─────────────────────────────────────────────────
def load_font(path):
    font = TTFont(path)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": 500}, inplace=False)
    return font


def kern_pairs(font):
    """Lê pares de kerning simples (PairPos format 1 e 2) da GPOS."""
    pairs = {}
    if "GPOS" not in font:
        return lambda a, b: 0
    gpos = font["GPOS"].table
    for lookup in gpos.LookupList.Lookup:
        if lookup.LookupType not in (2, 9):
            continue
        for sub in lookup.SubTable:
            if lookup.LookupType == 9:
                if sub.ExtensionLookupType != 2:
                    continue
                sub = sub.ExtSubTable
            cov = sub.Coverage.glyphs
            if sub.Format == 1:
                for i, first in enumerate(cov):
                    for pvr in sub.PairSet[i].PairValueRecord:
                        v = getattr(pvr.Value1, "XAdvance", 0) or 0
                        pairs.setdefault((first, pvr.SecondGlyph), v)
            elif sub.Format == 2:
                cd1, cd2 = sub.ClassDef1.classDefs, sub.ClassDef2.classDefs
                sub._mp = (cov, cd1, cd2, sub.Class1Record)
    class_subs = []
    for lookup in gpos.LookupList.Lookup:
        for sub in lookup.SubTable:
            s = sub.ExtSubTable if lookup.LookupType == 9 else sub
            if getattr(s, "_mp", None):
                class_subs.append(s._mp)

    def kern(a, b):
        if (a, b) in pairs:
            return pairs[(a, b)]
        for cov, cd1, cd2, recs in class_subs:
            if a in cov:
                c1, c2 = cd1.get(a, 0), cd2.get(b, 0)
                v = getattr(recs[c1].Class2Record[c2].Value1, "XAdvance", 0) or 0
                if v:
                    return v
        return 0

    return kern


def text_path(font, text, size, x0, baseline):
    """Retorna (d, largura) do texto renderizado em curvas."""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    kern = kern_pairs(font)
    s = size / upm
    x = 0.0
    ds = []
    names = [cmap[ord(ch)] for ch in text]
    for i, name in enumerate(names):
        pen = SVGPathPen(gs)
        tpen = TransformPen(pen, (s, 0, 0, -s, x0 + x * s, baseline))
        gs[name].draw(tpen)
        d = pen.getCommands()
        if d:
            ds.append(d)
        x += gs[name].width * (0.72 if name == "space" else 1)
        if i + 1 < len(names):
            x += kern(name, names[i + 1])
    return " ".join(ds), x * s


def fmt(d):
    # reduz precisão para arquivos menores
    import re

    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), d)


def svg(w, h, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
        f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{body}</svg>\n"
    )


def build(font_path):
    font = load_font(font_path)
    upm = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight / upm

    OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    palettes = {
        "": (BRAND, LOGO_SAGE, BRAND),  # positivo (sobre creme/branco)
        "-inverse": (CANVAS, SAGE, CANVAS),  # negativo (sobre petróleo)
        "-mono": (BRAND, BRAND, BRAND),  # monocromático
    }

    sx0, sy0, sx1, sy1 = SYMBOL_BOX
    sym_size = sy1 - sy0  # 108

    for suffix, (moon, accent, ink) in palettes.items():
        # Símbolo isolado (com área de proteção mínima de 10 unidades)
        body = symbol_group(moon, accent)
        (OUT / f"logo-symbol{suffix}.svg").write_text(
            svg(128, 128, body, "Mente em Paz"), encoding="utf-8"
        )

        # Horizontal: símbolo com altura H, texto com cap height = 0.45 H
        H = 120.0
        scale = H / sym_size
        pad = 4.0
        gap = H * 0.16
        size = (H * 0.45) / cap
        baseline = pad + H / 2 + (cap * size) / 2
        text_x = pad + H * (sx1 - sx0) / sym_size + gap
        d, tw = text_path(font, "Mente em Paz", size, text_x, baseline)
        W = text_x + tw + pad
        body = symbol_group(moon, accent, tx=pad - sx0 * scale, ty=pad - sy0 * scale, scale=scale)
        body += f'<path d="{fmt(d)}" fill="{ink}"/>'
        (OUT / f"logo-horizontal{suffix}.svg").write_text(
            svg(W, H + 2 * pad, body, "Mente em Paz"), encoding="utf-8"
        )

        # Vertical: símbolo acima, nome em duas linhas centralizadas
        Hs = 200.0
        scale = Hs / sym_size
        _, w1 = text_path(font, "Mente", 100, 0, 0)
        _, w2 = text_path(font, "em Paz", 100, 0, 0)
        size = 100 * (Hs * 1.08) / max(w1, w2)
        w1, w2 = w1 * size / 100, w2 * size / 100
        line_gap = size * 1.0
        W = max(w1, w2, Hs) + 2 * pad
        sym_w = Hs * (sx1 - sx0) / sym_size
        top_text = pad + Hs + Hs * 0.16
        b1 = top_text + cap * size
        b2 = b1 + line_gap
        d1, _ = text_path(font, "Mente", size, (W - w1) / 2, b1)
        d2, _ = text_path(font, "em Paz", size, (W - w2) / 2, b2)
        desc = size * 0.05
        Htot = b2 + desc + pad
        body = symbol_group(
            moon, accent, tx=(W - sym_w) / 2 - sx0 * scale, ty=pad - sy0 * scale, scale=scale
        )
        body += f'<path d="{fmt(d1)} {fmt(d2)}" fill="{ink}"/>'
        (OUT / f"logo-vertical{suffix}.svg").write_text(
            svg(W, Htot, body, "Mente em Paz"), encoding="utf-8"
        )

    # Favicon: versão simplificada (sem a curva, "+" mais robusto), fundo creme arredondado
    fav = (
        f'<rect width="128" height="128" rx="28" fill="{CANVAS}"/>'
        + symbol_group(BRAND, LOGO_SAGE, simplified=True, tx=4, ty=4, scale=120 / 128)
    )
    (PUBLIC / "favicon.svg").write_text(svg(128, 128, fav, "Mente em Paz"), encoding="utf-8")
    (OUT / "logo-symbol-simple.svg").write_text(
        svg(128, 128, symbol_group(BRAND, LOGO_SAGE, simplified=True), "Mente em Paz"),
        encoding="utf-8",
    )
    print("SVGs gerados em", OUT)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Uso: python scripts/build-logos.py <Lora[wght].ttf>")
    build(sys.argv[1])
