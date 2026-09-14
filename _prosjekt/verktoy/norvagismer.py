#!/usr/bin/env python3
"""
Norvagisme-skann for danske artikler.

Norsk bokmaal og dansk ligger saa taett at en oversettelse kan se ferdig ut
mens den fortsatt er norsk med dansk staving. Det er naerheten som gjoer det
vanskelig aa se for oeyet — og lett aa se for et regexfilter.

HARD = finnes ikke paa dansk, eller er entydig feil. Skal alltid vaere null.
MYK  = kan vaere riktig, men er ofte et spor av norsk. Leses av et menneske.

Kalibrert mot de ti haandskrevne danske artiklene (null harde treff) og mot
norske artikler (skal gi mange). Falske positiver som ble luket ut i foerste
runde: «gjorde/gjort» og «gjald-» er ekte dansk, «naa» betyr aa naa frem til,
og «selv om» er tillatt ved siden av «selvom».
"""
import re, sys, pathlib

HARD = [
    (r'\bgj(?!ald|ord|ort)(?=[aeiouyæøå])', 'gjennom→gennem, gjøre→gøre, gjerne→gerne (gjorde/gjort er ekte dansk)'),
    (r'\bkj(?!ole|ortel|eltring|ove)(?=[aeiouyæøå])', 'kjenne→kende, kjøpe→købe, kjære→kære (kjole/kjortel/kjeltring/kjove er ekte dansk)'),
    (r'øy',                       'øy finnes ikke: øye→øje, høyre→højre, støy→støj'),
    (r'\bskj(?=[eæø])',           'skje→ske, skjønne→forstå, skjebne→skæbne (skjule/skjorte/skjold er ekte dansk)'),
    (r'\boss\b',                  'oss → os'),
    (r'\b(deg|meg|seg)\b',        'deg/meg/seg → dig/mig/sig'),
    (r'\bnoe\b',                  'noe → noget'),
    (r'\bmye\b',                  'mye → meget'),
    (r'\bveldig\b',               'veldig → meget / virkelig'),
    (r'\better\b',                'etter → efter'),
    (r'\bmellom\b',               'mellom → mellem'),
    (r'\buten\b',                 'uten → uden'),
    (r'\bigjen\b',                'igjen → igen'),
    (r'\benn\b',                  'enn → end'),
    (r'\b(blir|gir|tar|sier|drar|ligger an)\b', 'norsk kortform → bliver/giver/tager/siger'),
    (r'\bvann\b',                 'vann → vand'),
    (r'\bnatt\b',                 'natt → nat'),
    (r'\balltid\b',               'alltid → altid'),
    (r'\blitt\b',                 'litt → lidt'),
    (r'\bhverandre\b',            'hverandre → hinanden'),
    (r'\bsjelden\b',              'sjelden → sjælden'),
    (r'\bå (?=[a-zæøå]{3,})',     'infinitivsmerket er «at», ikke «å»'),
    (r'sjon(er|en|ene)?\b',       '-sjon → -tion: situasjon→situation'),
    (r'\bsånn\b',                 'sånn → sådan'),
    (r'\bhjelp',                  'hjelpe → hjælpe'),
    (r'\bfortell',                'fortelle → fortælle'),
    (r'\bviktig',                 'viktig → vigtig'),
    (r'\bmåte\b',                 'måte → måde'),
    (r'\bgate\b',                 'gate → gade'),
    (r'\bbok\b',                  'bok → bog'),
    (r'\bsitt(e|er)\b',           'sitte/sitter → sidde/sidder'),
    (r'\btenner\b',               'tenner → tænder'),
    (r'\bjente',                  'jente → pige'),
    (r'\bgutt',                   'gutt → dreng'),
    (r'\bsau\b',                  'sau → får'),
    (r'\bmørke?t? rom\b',         'rom → rum'),
    (r'\bhvit',                   'hvit → hvid'),
    (r'\bsvart\b',                'svart → sort'),
    (r'\bfarge',                  'farge → farve'),
    (r'\bspørre\b',               'spørre → spørge'),
    (r'\bsyk(dom)?\b',            'syk → syg'),
    (r'\btrygg\b',                 'trygg → tryg (trygge/trygt er ekte dansk)'),
    (r'\bvekk\b',                 'vekk → væk'),
]

MYK = [
    (r'\bnå\b',        'norsk «nå»=nu? dansk «nå»=naa frem til — sjekk betydningen'),
    (r'\bmot\b',       'mot → mod (med mindre det er substantivet «mod»)'),
    (r'\but\b',        'ut → ud'),
    (r'\binn\b',       'inn → ind'),
    (r'\bmat\b',       'mat → mad'),
    (r'\brett\b',      'rett → ret'),
    (r'\bfortsatt\b',  'fortsatt → stadig / stadigvæk'),
    (r'\bennå\b',      'ennå → endnu'),
    (r'\bslik\b',      'slik → sådan'),
    (r'\brom\b',       'rom → rum'),
]

# Felter som med vilje beholder den norske formen: nb_slug er koblingen til
# den norske filen, og bilde peker paa en fil med norsk navn paa disk. Begge
# SKAL staa uendret, saa de skal ikke leses som broedtekst.
NORSKE_FELT = re.compile(r'^\s*(nb_slug|bilde|slug|dato|oppdatert|author|da_slug|kategori)\s*:')

def skann(sti):
    tekst = pathlib.Path(sti).read_text()
    h, m = [], []
    for lnr, linje in enumerate(tekst.split('\n'), 1):
        if NORSKE_FELT.match(linje):
            continue
        for regler, ut in ((HARD, h), (MYK, m)):
            for moenster, forkl in regler:
                for t in re.finditer(moenster, linje, re.I):
                    ut.append((lnr, t.group(0), forkl,
                               linje[max(0, t.start()-32):t.end()+32].strip()))
    return h, m

if __name__ == '__main__':
    vis_myk = '--myk' in sys.argv
    filer = [a for a in sys.argv[1:] if not a.startswith('--')]
    th = tm = 0
    for f in filer:
        h, m = skann(f)
        th += len(h); tm += len(m)
        if h or (vis_myk and m):
            print(f"\n  {f}   HARD {len(h)}   myk {len(m)}")
        for lnr, o, forkl, bit in h[:10]:
            print(f"    HARD {lnr:>4}  «{o}»  {forkl}\n              …{bit}…")
        if len(h) > 10: print(f"    … og {len(h)-10} harde til")
        if vis_myk:
            for lnr, o, forkl, bit in m[:6]:
                print(f"    myk  {lnr:>4}  «{o}»  {forkl}")
    print(f"\n  {len(filer)} filer:  HARD {th}   myk {tm}")
    sys.exit(1 if th else 0)
