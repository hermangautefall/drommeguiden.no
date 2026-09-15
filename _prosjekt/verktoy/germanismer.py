#!/usr/bin/env python3
"""
Skann for tyske artikler oversatt fra engelsk.

Norsk→dansk hadde én dominerende feil: omstaving i stedet for oversettelse.
Engelsk→tysk har helt andre. De tre som faktisk skjer:

  1. Tiltaleform glipper. Siden bruker «du». Ett «Sie» eller «Ihnen» midt i en
     tekst er umiddelbart synlig for en tysk leser.
  2. Engelske ord blir staaende, eller anglisismer sniker seg inn der tysk har
     et eget ord.
  3. Falske venner. «eventuell» betyr ikke eventually, «aktuell» ikke actually,
     «bekommen» ikke become. De er grammatisk korrekte og derfor usynlige.

HARD = entydig feil. MYK = verdt et blikk.

Bruk:  python3 _prosjekt/verktoy/germanismer.py src/content/drommer-de/*.md
"""
import re, sys, pathlib

# Frontmatter-felt som med vilje beholder engelsk/norsk form
TEKNISKE_FELT = re.compile(r'^\s*(nb_slug|en_slug|de_slug|bilde|slug|dato|oppdatert|author|kategori)\s*:')

HARD = [
    (r'\b(Sie|Ihnen|Ihre[nmrs]?|Ihr)\b(?! *[a-zäöüß])', 'siden bruker «du» — ikke bland inn høflighetsform'),
    (r'\beventuell?(e[nmrs]?)?\b',  'falsk venn: eventuell = «möglich», ikke «eventually» (= schließlich)'),
    (r'\baktuell?(e[nmrs]?)?\b',    'falsk venn: aktuell = «derzeitig», ikke «actually» (= eigentlich)'),
    (r'\bbekommen\b(?= to )',       'falsk venn: bekommen = erhalten, ikke «to become» (= werden)'),
    (r'\bsensibel\b',               'falsk venn: sensibel = empfindlich, ikke «sensible» (= vernünftig)'),
    (r'\bbrav\b',                   'falsk venn: brav = artig, ikke «brave» (= mutig)'),
    (r'\bGift\b',                   'falsk venn: Gift = poison. Gave = Geschenk'),
    # engelske ord som ofte blir staaende
    (r'\b(the|and|with|from|about|dream|dreams|dreaming|meaning|means|often|when|your|you)\b',
     'engelsk ord staar igjen'),
    (r'\b(interpretation|symbol)s\b', 'engelsk flertall — tysk: Deutungen / Symbole'),
]

MYK = [
    (r'\bmachen Sinn\b',   'anglisisme: «Sinn ergeben» er tysk, «Sinn machen» er oversatt make sense'),
    (r'\bin 20\d\d\b',     'anglisisme: tysk skriver «20XX» eller «im Jahr 20XX», ikke «in 20XX»'),
    (r'\brealisieren\b',   'anglisisme naar det betyr «erkennen»'),
    (r'\bkontrollieren\b', 'anglisisme naar det betyr «überprüfen»'),
    (r'\bAppartement\b',   'tysk: Wohnung'),
    (r'\bsupporten?\b',    'tysk: unterstützen'),
    (r'\bTeenager\b',      'ok, men sjekk om «Jugendliche» passer bedre'),
]

def skann(sti):
    tekst = pathlib.Path(sti).read_text()
    h, m = [], []
    i_kode = False
    for lnr, linje in enumerate(tekst.split('\n'), 1):
        if TEKNISKE_FELT.match(linje):
            continue
        if linje.strip().startswith('```'):
            i_kode = not i_kode
            continue
        if i_kode:
            continue
        # Bok- og tidsskrifttitler siteres uoversatt og staar i *kursiv* eller
        # "anfoerselstegn" — «The Nature and Functions of Dreaming» og
        # «Behavioral and Brain Sciences» SKAL vaere engelske. Regelen om
        # engelske restord maa derfor ikke lese inni dem.
        uten_titler = re.sub(r'\*[^*]+\*|"[^"]+"|«[^»]+»', lambda x: ' ' * len(x.group(0)), linje)
        for regler, ut in ((HARD, h), (MYK, m)):
            for moenster, forkl in regler:
                maal = uten_titler if 'engelsk ord' in forkl or 'engelsk flertall' in forkl else linje
                for t in re.finditer(moenster, maal):
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
