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
    # Hoeflighetsform. «Sie» i setningsstart er ogsaa «sie» (hun/de), saa bare
    # forekomster inne i en setning teller — pluss «Ihnen»/«Ihre», som ikke har
    # noen liten motpart midt i en setning.
    (r'(?<=[a-zäöüß,] )(Sie|Ihnen|Ihre[nmrs]?|Ihrem)\b', 'siden bruker «du» — ikke bland inn høflighetsform'),
    (r'\b(the|and|with|from|about|dream|dreams|dreaming|meaning|means|often|when|your|you)\b',
     'engelsk ord staar igjen'),
    (r'\b(interpretation|symbol)s\b', 'engelsk flertall — tysk: Deutungen / Symbole'),
]

# De klassiske falske vennene staar her, ikke i HARD, og grunnen er verdt aa
# skrive ned: «eventuell», «aktuell», «bekommen», «sensibel» og «brav» er ALLE
# helt vanlige, korrekte tyske ord. En falsk venn er bare feil naar den
# misbrukes, og ordet ser likt ut begge veier — et regexfilter kan ikke se
# forskjell. Sju ganger paa tvers av dansk og tysk har en regel som treffer et
# vanlig ord i maalspraaket vist seg aa vaere feil. «aktuelle Beziehung» er
# naavaerende forhold og helt riktig; «Gift» betyr gift.
MYK = [
    (r'\beventuell?(e[nmrs]?)?\b',  'sjekk: eventuell = möglich. «Eventually» er schließlich'),
    (r'\baktuell?(e[nmrs]?)?\b',    'sjekk: aktuell = derzeitig. «Actually» er eigentlich'),
    (r'\bsensibel\b',               'sjekk: sensibel = empfindlich. «Sensible» er vernünftig'),
    (r'\bbrav\b',                   'sjekk: brav = artig. «Brave» er mutig'),
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
        # Titler staar i *kursiv*, "doble", 'enkle' eller «vinkler». Enkle
        # anfoerselstegn er ogsaa apostrof, saa det kreves noe lengde for aa
        # unngaa at et enkeltord blankes ut.
        uten_titler = re.sub(r"\*[^*]+\*|\"[^\"]+\"|«[^»]+»|'[^']{10,}'",
                             lambda x: ' ' * len(x.group(0)), linje)
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
