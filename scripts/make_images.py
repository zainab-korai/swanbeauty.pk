import os, random
random.seed(7)
OUT = "public/images"
os.makedirs(OUT, exist_ok=True)

SKIN, SKIN2, HAIR, ROBE, LIP = "#e9bd98", "#d9a37c", "#2b1a14", "#fdf8ee", "#c4636a"

DEFS = f"""
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8eed6"/><stop offset="1" stop-color="#e6cfa3"/></linearGradient>
  <radialGradient id="glowL" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#dff04f" stop-opacity=".55"/><stop offset="1" stop-color="#dff04f" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3cfae"/><stop offset="1" stop-color="{SKIN2}"/></linearGradient>
  <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a2f25"/><stop offset="1" stop-color="{HAIR}"/></linearGradient>
  <linearGradient id="gel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9d62c"/><stop offset=".5" stop-color="#e4f45a"/><stop offset="1" stop-color="#a8c823"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d8d8d"/><stop offset=".4" stop-color="#f4f4f4"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
</defs>"""

def star(x, y, s, o=0.9):
    return f'<path d="M{x} {y-s} Q{x} {y} {x+s} {y} Q{x} {y} {x} {y+s} Q{x} {y} {x-s} {y} Q{x} {y} {x} {y-s}Z" fill="#fff" opacity="{o}"><animate attributeName="opacity" values="{o};0.15;{o}" dur="{random.uniform(2,4):.1f}s" repeatCount="indefinite"/></path>'

def bubbles(n, x0, x1, y0, y1, rmax=14, color="#dff04f"):
    s = ""
    for _ in range(n):
        x = random.uniform(x0, x1); y = random.uniform(y0, y1); r = random.uniform(4, rmax)
        d = random.uniform(5, 10)
        s += (f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="{color}" fill-opacity=".22" stroke="#fff" stroke-opacity=".8">'
              f'<animate attributeName="cy" values="{y:.0f};{y-60:.0f};{y:.0f}" dur="{d:.1f}s" repeatCount="indefinite"/></circle>')
    return s

def foam(cx_list):
    s = ""
    for (x, y, r) in cx_list:
        s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity=".95"/><circle cx="{x-r*.3}" cy="{y-r*.3}" r="{r*.35}" fill="#fff"/>'
    return s

def bottle(x, y, sc=1.0, rot=0):
    return f'''<g transform="translate({x} {y}) rotate({rot}) scale({sc})">
  <rect x="-8" y="-150" width="16" height="40" fill="#f6f3ec" stroke="#ddd6c6"/>
  <rect x="-30" y="-158" width="44" height="12" rx="6" fill="#f2efe8" stroke="#d8d2c4"/>
  <rect x="-26" y="-112" width="52" height="30" rx="5" fill="url(#metal)"/>
  <rect x="-46" y="-82" width="92" height="200" rx="18" fill="url(#gel)"/>
  <rect x="-46" y="-82" width="92" height="200" rx="18" fill="#fff" opacity=".12"/>
  <rect x="-40" y="-10" width="80" height="92" rx="5" fill="#fdf8ee" opacity=".95"/>
  <text x="0" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="14" letter-spacing="3" fill="#8a5a2b">SWAN</text>
  <text x="0" y="34" text-anchor="middle" font-family="Georgia,serif" font-size="5" letter-spacing="2" fill="#8a5a2b">BEAUTY ESSENCE</text>
  <line x1="-24" y1="42" x2="24" y2="42" stroke="#8a5a2b" stroke-width=".5"/>
  <text x="0" y="56" text-anchor="middle" font-family="Georgia,serif" font-size="7" fill="#5b3a1a">Cleanser + Facewash</text>
  <text x="0" y="68" text-anchor="middle" font-family="Arial" font-size="4.5" fill="#8a5a2b">ANTI-ACNE BEADS</text>
  <text x="0" y="78" text-anchor="middle" font-family="Arial" font-size="5" fill="#5b3a1a">150 ml</text>
</g>'''

def woman(x=0, y=0, sc=1.0, bun=False, towel=False, foamy=False, hand=False, smile=True, long_hair=True):
    g = f'<g transform="translate({x} {y}) scale({sc})">'
    # back hair
    if towel:
        g += f'<ellipse cx="300" cy="215" rx="150" ry="120" fill="#fdf8ee"/><path d="M160 215 Q300 110 440 215" stroke="#e9dcc0" stroke-width="10" fill="none"/><path d="M175 255 Q300 160 425 255" stroke="#e9dcc0" stroke-width="8" fill="none"/>'
    else:
        if long_hair:
            g += f'<path d="M170 300 C150 480 150 640 175 760 L425 760 C450 640 450 480 430 300 Z" fill="url(#hair)"/>'
        g += f'<ellipse cx="300" cy="300" rx="140" ry="175" fill="url(#hair)"/>'
        if bun:
            g += f'<circle cx="300" cy="140" r="62" fill="url(#hair)"/><circle cx="285" cy="125" r="18" fill="#fff" opacity=".08"/>'
    # robe
    g += f'<path d="M10 820 C30 600 190 545 300 545 C410 545 570 600 590 820 Z" fill="{ROBE}"/>'
    g += '<path d="M10 820 C30 600 190 545 300 545 C410 545 570 600 590 820" fill="none" stroke="#e9dcc0" stroke-width="5"/>'
    g += f'<path d="M222 556 L300 690 L378 556 Q300 530 222 556Z" fill="url(#skin)"/>'
    g += '<path d="M222 556 L300 700 L378 556" fill="none" stroke="#e9dcc0" stroke-width="6"/>'
    # neck
    g += f'<path d="M246 450 L246 570 Q300 605 354 570 L354 450Z" fill="{SKIN2}"/>'
    # ears
    g += f'<ellipse cx="192" cy="345" rx="14" ry="26" fill="{SKIN2}"/><ellipse cx="408" cy="345" rx="14" ry="26" fill="{SKIN2}"/>'
    # face
    g += '<ellipse cx="300" cy="335" rx="110" ry="142" fill="url(#skin)"/>'
    g += '<ellipse cx="260" cy="270" rx="60" ry="70" fill="url(#glowG)" opacity=".5"/>'
    # blush
    g += '<ellipse cx="238" cy="395" rx="32" ry="20" fill="#e98a86" opacity=".28"/><ellipse cx="362" cy="395" rx="32" ry="20" fill="#e98a86" opacity=".28"/>'
    # brows, eyes
    g += '<path d="M222 312 Q250 296 280 310" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M320 310 Q350 296 378 312" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>'
    g += '<path d="M226 345 Q252 366 278 345" stroke="#2b1a14" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M322 345 Q348 366 374 345" stroke="#2b1a14" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
    g += '<path d="M232 354 l-8 8 M246 361 l-3 10 M262 361 l3 10 M274 354 l8 8 M326 354 l-8 8 M338 361 l-3 10 M354 361 l3 10 M368 354 l8 8" stroke="#2b1a14" stroke-width="2.4" stroke-linecap="round"/>'
    # nose
    g += f'<path d="M300 350 Q292 400 284 412 Q300 424 316 412" stroke="{SKIN2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>'
    # lips
    if smile:
        g += f'<path d="M262 438 Q282 432 300 438 Q318 432 338 438 Q320 470 300 470 Q280 470 262 438Z" fill="{LIP}"/><path d="M268 440 Q300 452 332 440" stroke="#fff" stroke-width="3" fill="none" opacity=".75"/>'
    else:
        g += f'<path d="M268 440 Q284 432 300 438 Q316 432 332 440 Q316 458 300 458 Q284 458 268 440Z" fill="{LIP}"/>'
    # fringe
    g += f'<path d="M188 320 C175 170 425 170 412 320 C395 255 340 215 300 212 C255 218 205 255 188 320Z" fill="url(#hair)"/>'
    if towel:
        g += '<path d="M180 300 C175 215 425 215 420 300 L412 285 C400 235 200 235 188 285Z" fill="#fdf8ee"/>'
    # foam
    if foamy:
        g += foam([(232,400,15),(250,420,12),(220,370,10),(368,400,15),(350,420,12),(380,370,10),(300,490,16),(278,485,12),(322,485,12),(300,262,12),(268,268,9),(332,268,9)])
    # hand on cheek
    if hand:
        g += f'<g transform="rotate(-12 175 430)"><rect x="140" y="400" width="62" height="86" rx="30" fill="url(#skin)"/><rect x="146" y="360" width="16" height="56" rx="8" fill="url(#skin)"/><rect x="164" y="352" width="16" height="64" rx="8" fill="url(#skin)"/><rect x="182" y="358" width="16" height="58" rx="8" fill="url(#skin)"/><rect x="132" y="430" width="18" height="46" rx="9" fill="{SKIN2}" transform="rotate(25 140 450)"/></g>'
        g += f'<path d="M110 640 C120 560 150 520 160 480 L205 495 C195 540 180 600 190 700Z" fill="{ROBE}"/>'
    g += '</g>'
    return g

def svg(w, h, body, bg=True):
    b = f'<rect width="{w}" height="{h}" fill="url(#bg)"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice">{DEFS}{b}{body}</svg>'

def save(name, s):
    with open(f"{OUT}/{name}", "w", encoding="utf-8") as f:
        f.write(s)

# 1. About: portrait, glowing skin, hair bun
body = '<circle cx="300" cy="330" r="280" fill="url(#glowL)"/><circle cx="90" cy="150" r="90" fill="#dff04f" opacity=".18"/><circle cx="520" cy="660" r="120" fill="#c9a26a" opacity=".2"/>'
body += woman(bun=True)
body += star(160, 190, 16) + star(450, 230, 22) + star(500, 420, 12) + star(110, 480, 14) + star(420, 120, 10)
body += bubbles(10, 60, 540, 520, 740, 12)
save("about-woman.svg", svg(600, 800, body))

# 2. Ritual: wide scene - woman applying cleanser, bottle on left
body = '<circle cx="560" cy="300" r="330" fill="url(#glowL)"/><circle cx="130" cy="520" r="160" fill="#dff04f" opacity=".16"/>'
body += woman(x=330, y=-30, sc=0.88, foamy=True, hand=True, bun=True)
body += bottle(190, 380, 1.15, -6)
body += bubbles(18, 60, 880, 120, 560, 16)
body += star(120, 120, 18) + star(820, 150, 22) + star(760, 520, 14)
body += '<ellipse cx="190" cy="565" rx="70" ry="10" fill="#5b3a1a" opacity=".18"/>'
save("ritual.svg", svg(900, 700, body))

# 3. Gallery 1: towel on hair, fresh face, droplets
body = '<circle cx="300" cy="360" r="260" fill="url(#glowL)"/>'
body += woman(towel=True, smile=True)
for _ in range(14):
    x = random.uniform(60, 540); y = random.uniform(80, 700); r = random.uniform(5, 11)
    body += f'<path d="M{x:.0f} {y-r*1.6:.0f} Q{x+r:.0f} {y:.0f} {x:.0f} {y+r:.0f} Q{x-r:.0f} {y:.0f} {x:.0f} {y-r*1.6:.0f}Z" fill="#fff" fill-opacity=".75" stroke="#bfe0f0" stroke-width="1"/>'
body += star(120, 160, 16) + star(490, 300, 14)
save("model-1.svg", svg(600, 800, body))

# 4. Gallery 2: holding the bottle
body = '<circle cx="300" cy="360" r="280" fill="url(#glowL)"/>'
body += woman(long_hair=True, smile=True, sc=0.92, x=24, y=30)
body += bottle(470, 520, 1.0, 6)
body += '<g transform="translate(395 625) rotate(6)"><rect x="0" y="0" width="60" height="110" rx="26" fill="url(#skin)"/><rect x="48" y="-34" width="16" height="60" rx="8" fill="url(#skin)"/><rect x="30" y="-40" width="16" height="64" rx="8" fill="url(#skin)"/><rect x="12" y="-30" width="16" height="56" rx="8" fill="url(#skin)"/></g>'
body += star(100, 200, 18) + star(520, 160, 14) + bubbles(8, 40, 560, 500, 760, 12)
save("model-2.svg", svg(600, 800, body))

# 5. Gallery 3: closeup glow
body = '<circle cx="300" cy="330" r="300" fill="url(#glowL)"/><circle cx="300" cy="330" r="200" fill="url(#glowG)" opacity=".5"/>'
body += woman(x=-60, y=-80, sc=1.2, long_hair=False, bun=True, smile=True)
body += star(110, 220, 20) + star(500, 180, 26) + star(470, 460, 16) + star(90, 520, 14) + star(300, 60, 12)
save("model-3.svg", svg(600, 800, body))

# optional: hero helper, small logo mark file (fallback logo)
print("done", os.listdir(OUT))
