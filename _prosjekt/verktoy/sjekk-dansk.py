#!/usr/bin/env python3
"""
Kvalitetsport for danske artikler.

Kjoeres paa hele drommer-da etter hver pulje. Alt her er ting som gaar galt
UTEN at bygget feiler — derfor maa de sjekkes hver gang, ikke bare naar noe
ser rart ut.

Bruk:  python3 _prosjekt/verktoy/sjekk-dansk.py
"""
import re, sys, pathlib, collections

DA = pathlib.Path('src/content/drommer-da')
NB = pathlib.Path('src/content/drommer')
KATEGORIER = {'dyr','vand','krop','steder','haendelser','mennesker','natur','genstande','aandeligt'}
KART = dict(l.split('\t') for l in pathlib.Path('_prosjekt/slugkart-dansk.tsv').read_text().strip().split('\n'))

def fm(tekst):
    m = re.match(r'^---\n(.*?)\n---\n', tekst, re.S)
    return m.group(1) if m else ''

def felt(f, navn):
    m = re.search(rf'^{navn}: *(.+)$', f, re.M)
    return m.group(1).strip().strip('"') if m else None

def liste(f, navn):
    m = re.search(rf'^{navn}:\n((?:  - .+\n)+)', f, re.M)
    return [l.strip()[2:].strip().strip('"') for l in m.group(1).strip().split('\n')] if m else []

feil = collections.defaultdict(list)
filer = sorted(DA.glob('*.md'))
slugger = {f.stem for f in filer}
h2_eier = {}

for f in filer:
    t = f.read_text(); front = fm(t); n = f.name

    slug = felt(front, 'slug')
    if slug != f.stem:
        feil['slug ≠ filnavn'].append(f"{n}: slug={slug}")

    nb = felt(front, 'nb_slug')
    if not nb:
        feil['mangler nb_slug'].append(n)
    elif not (NB / f'{nb}.md').exists():
        feil['nb_slug peker paa ingenting'].append(f"{n} → {nb}")
    elif nb in KART and KART[nb] != f.stem:
        feil['slug avviker fra slugkartet'].append(f"{n}: kartet sier {KART[nb]}")

    kat = felt(front, 'kategori')
    if kat not in KATEGORIER:
        feil['ugyldig kategori'].append(f"{n}: {kat}")
    elif nb and (NB / f'{nb}.md').exists():
        nbkat = felt(fm((NB / f'{nb}.md').read_text()), 'kategori')
        forventet = {'dyr':'dyr','vann':'vand','kropp':'krop','steder':'steder','hendelser':'haendelser',
                     'mennesker':'mennesker','natur':'natur','gjenstander':'genstande','aandelig':'aandeligt'}.get(nbkat)
        if forventet and kat != forventet:
            feil['kategori matcher ikke den norske'].append(f"{n}: {kat}, norsk har {nbkat} → {forventet}")

    kb = felt(front, 'kortbeskrivelse')
    if not kb:
        feil['mangler kortbeskrivelse'].append(n)
    elif not 134 <= len(kb) <= 160:
        feil['kortbeskrivelse utenfor 134–160'].append(f"{n}: {len(kb)} tegn")

    tit = felt(front, 'tittel')
    if not tit:
        feil['mangler tittel'].append(n)
    elif not re.search(r' — [^—]*\?$', tit):
        feil['tittel mangler « — …?»-hale'].append(f"{n}: {tit}")

    for r in liste(front, 'relaterte'):
        if r not in slugger:
            if r in KART.values():
                feil['relaterte peker paa slug som ikke er skrevet ennaa'].append(f"{n} → {r}")
            else:
                feil['relaterte peker paa ukjent slug'].append(f"{n} → {r}")

    if not felt(front, 'bilde') and nb and (NB / f'{nb}.md').exists():
        if felt(fm((NB / f'{nb}.md').read_text()), 'bilde'):
            feil['mangler bilde som den norske har'].append(n)

    tk = liste(front, 'tolkninger_kort')
    if len(tk) < 3:
        feil['faerre enn tre tolkninger_kort'].append(f"{n}: {len(tk)}")

    for h2 in re.findall(r'^## (.+)$', t, re.M):
        if h2.strip() == 'Kilder og videre læsning':
            continue
        if h2 in h2_eier:
            feil['gjenbrukt H2'].append(f"«{h2}» i {n} og {h2_eier[h2]}")
        else:
            h2_eier[h2] = n

    if '## Kilder og videre læsning' not in t:
        feil['mangler kildeseksjon'].append(n)

    # Foerste H2 skal vaere soekefrasen. Svensk har den paa 238 av 241 og
    # engelsk paa 237 — den erstatter kildens egen foerste overskrift, den
    # legges ikke over den. Fire filer slapp gjennom uten, og én fikk begge.
    kropp = re.sub(r'^---.*?\n---\n', '', t, flags=re.S).lstrip('\n')
    forste = re.match(r'## (.+)', kropp)
    if not forste:
        feil['starter ikke med en H2'].append(n)
    elif not forste.group(1).startswith('Hvad betyder det at drømme om'):
        feil['foerste H2 er ikke soekefrasen'].append(f"{n}: {forste.group(1)[:44]}")

# Aa peke paa en slug som er planlagt men ikke skrevet ennaa er ikke en feil:
# finnes-symbol.ts dropper den stille, saa det blir aldri en doed lenke, og
# brikken dukker opp av seg selv naar artikkelen lander. Den skal synes, men
# den skal ikke felle porten.
VARSEL = {'relaterte peker paa slug som ikke er skrevet ennaa'}

print(f"  {len(filer)} danske artikler sjekket\n")
ekte = {k: v for k, v in feil.items() if k not in VARSEL}
varsler = {k: v for k, v in feil.items() if k in VARSEL}

for k in sorted(ekte):
    v = ekte[k]
    print(f"  ✗ {k}  ({len(v)})")
    for x in v[:8]:
        print(f"      {x}")
    if len(v) > 8:
        print(f"      … og {len(v)-8} til")
for k in sorted(varsler):
    v = varsler[k]
    print(f"  · {k}  ({len(v)})  — venter paa at artikkelen skrives")
    for x in v[:6]:
        print(f"      {x}")
if not ekte:
    print("\n  ✓ ingen feil")
sys.exit(1 if ekte else 0)
