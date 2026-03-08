# 🗑️ FIREBASE STUDIO PROMPT 03: Template-Duplikate Löschen

> **Copy-Paste this prompt into Firebase Studio**

---

## 🎯 PROMPT START

```
ICH BIN EIN DISPATCHER SIMULATOR - WEB-BASIERTES RETTUNGSDIENST-SPIEL.

AKTUELLES PROBLEM:
Duplikate Template-Dateien verschwenden Speicher und erzeugen Verwirrung.
Beispiel: angina-pectoris.js UND angina_pectoris.js existieren beide.

DEINE AUFGABE:
Identifiziere und lösche alle Template-Duplikate. Behalte die korrekte 
Version (mit Bindestrichen statt Unterstrichen) und entferne die falsche.

================================================================================
SCHRITT 1: Duplikate identifizieren
================================================================================

DATEI-STRUKTUR analysieren:
js/data/call-templates/rd/

SUCHE nach Datei-Paaren die fast identisch sind:

BEKANNTE DUPLIKATE:
1. angina-pectoris.js (4.7 KB) ✅ BEHALTEN
   angina_pectoris.js (9.8 KB) ❌ LÖSCHEN

2. hypoglykaemie.js (6.2 KB) ✅ BEHALTEN  
   hypoglykämie.js (43 KB) ❌ LÖSCHEN

REGEL:
- Dateinamen MIT BINDESTRICHEN behalten (angina-pectoris.js)
- Dateinamen MIT UNTERSTRICHEN oder UMLAUTEN löschen
- Kleinere Datei ist oft die korrekte (weniger Bloat)

FINDE weitere Duplikate durch:
- Ähnliche Namen
- Umlaute vs. Umschreibung (ae, oe, ue)
- Unterstriche vs. Bindestriche

================================================================================
SCHRITT 2: Import-References prüfen
================================================================================

VOR dem Löschen: Prüfe welche Dateien die Duplikate importieren!

SUCHE in allen .js Dateien nach:

import { ANGINA_PECTORIS_TEMPLATE } from './call-templates/rd/angina_pectoris.js';

WICHTIG: Finde ALLE Stellen wo die zu löschende Datei importiert wird.

DATEIEN ZU PRÜFEN:
- js/systems/incident-generator.js
- js/systems/incident-manager.js  
- js/data/template-registry.js
- js/core/game.js
- Alle anderen System-Dateien

================================================================================
SCHRITT 3: Imports aktualisieren
================================================================================

Für JEDE gefundene Import-Referenz:

VORHER:
import { ANGINA_PECTORIS_TEMPLATE } from './call-templates/rd/angina_pectoris.js';

NACHHER:
import { ANGINA_PECTORIS_TEMPLATE } from './call-templates/rd/angina-pectoris.js';

BEACHTE:
- Export-Name kann gleich bleiben: ANGINA_PECTORIS_TEMPLATE
- Nur Pfad ändern: _ zu -

PRÜFE in der korrekten Datei (angina-pectoris.js) wie das Template exportiert wird:

export const ANGINA_PECTORIS_TEMPLATE = { ... };

oder

export default { ... };

PASSE Imports entsprechend an!

================================================================================
SCHRITT 4: Template Registry aktualisieren
================================================================================

FALLS eine Datei js/data/template-registry.js existiert:

SUCHE nach Einträgen für die Duplikate:

VORHER:
const templates = {
    'angina_pectoris': () => import('./call-templates/rd/angina_pectoris.js'),
    'angina-pectoris': () => import('./call-templates/rd/angina-pectoris.js'),
    // ...
};

NACHHER:
const templates = {
    'angina-pectoris': () => import('./call-templates/rd/angina-pectoris.js'),
    // Duplikat entfernt!
};

WICHTIG: Lösche nur den Duplikat-Eintrag, nicht beide!

================================================================================
SCHRITT 5: Dateien löschen
================================================================================

LÖSCHE folgende Dateien:

1. js/data/call-templates/rd/angina_pectoris.js
2. js/data/call-templates/rd/hypoglykämie.js
3. Alle weiteren identifizierten Duplikate

KOMMANDO (falls du Terminal-Zugriff hast):
rm js/data/call-templates/rd/angina_pectoris.js
rm js/data/call-templates/rd/hypoglykämie.js

oder manuell über File-Explorer löschen.

================================================================================
SCHRITT 6: Index-Dateien aktualisieren
================================================================================

FALLS eine Datei js/data/call-templates/rd/index.js existiert:

Diese exportiert alle Templates gebundelt.

SUCHE nach:

export { ANGINA_PECTORIS_TEMPLATE } from './angina_pectoris.js';
export { ANGINA_PECTORIS_TEMPLATE } from './angina-pectoris.js'; // Duplikat!

BEHALTE nur:
export { ANGINA_PECTORIS_TEMPLATE } from './angina-pectoris.js';

ENTFERNE alle Export-Zeilen für gelöschte Duplikate.

================================================================================
SCHRITT 7: Weitere Duplikate suchen
================================================================================

SUCHE systematisch nach weiteren Duplikaten:

**Muster 1: Unterstriche vs. Bindestriche**
verkehrs_unfall.js vs. verkehrs-unfall.js
herzstillstand_reanimation.js vs. herzstillstand-reanimation.js

**Muster 2: Umlaute**
schaedel_hirn_trauma.js vs. schaedel-hirn-trauma.js
übelkeit_erbrechen.js vs. uebelkeit-erbrechen.js

**Muster 3: Groß-/Kleinschreibung**
Herzinfarkt.js vs. herzinfarkt.js (BEHALTE kleingeschrieben)

**Muster 4: Versionsnummern**
herzinfarkt-v2.js vs. herzinfarkt.js (BEHALTE ohne Version)

FÜR JEDES gefundene Duplikat:
1. Prüfe welche Version aktueller/besser ist
2. Aktualisiere Imports
3. Lösche die alte Version

================================================================================
SCHRITT 8: Globale Suche nach kaputten Imports
================================================================================

NACHDEM alle Duplikate gelöscht sind:

SUCHE in ALLEN .js Dateien nach:
- import.*angina_pectoris
- import.*hypoglykämie
- require.*angina_pectoris
- require.*hypoglykämie

FALLS du welche findest:
→ Diese wurden in Schritt 3 übersehen!
→ Jetzt korrigieren!

================================================================================
SCHRITT 9: Testing
================================================================================

1. STARTE die App im Browser
2. Öffne Developer Console (F12)
3. PRÜFE auf Fehler wie:
   - "Failed to load module"
   - "Cannot find module 'angina_pectoris'"
   - 404 Errors für gelöschte Dateien

4. TESTE Einsatz-Generierung:
   - Erstelle manuell einen "Angina Pectoris" Einsatz
   - Erstelle manuell einen "Hypoglykämie" Einsatz
   - Prüfe ob Templates korrekt geladen werden

5. PRÜFE Template-Liste:
   - Öffne Einsatz-Generator
   - Sind alle Templates verfügbar?
   - Keine doppelten Einträge?

================================================================================
SCHRITT 10: Dokumentation aktualisieren
================================================================================

ERSTELLE/AKTUALISIERE Datei: docs/CLEANUP_REPORT.md

# Template Cleanup Report

## Gelöschte Duplikate

### 2026-03-08 - Initiale Bereinigung

**Gelöschte Dateien:**
1. `js/data/call-templates/rd/angina_pectoris.js` (9.8 KB)
   - Ersetzt durch: `angina-pectoris.js` (4.7 KB)
   - Grund: Naming-Convention (Unterstriche)
   - Speicher gespart: 5.1 KB

2. `js/data/call-templates/rd/hypoglykämie.js` (43 KB)
   - Ersetzt durch: `hypoglykaemie.js` (6.2 KB)  
   - Grund: Umlaute, aufgeblähter Code
   - Speicher gespart: 36.8 KB

**Gesamt eingesparter Speicher:** 41.9 KB
**Anzahl bereinigter Duplikate:** 2
**Betroffene Import-Statements:** [Anzahl einfügen]

## Prüfliste Abgeschlossen

- [x] Alle Duplikate identifiziert
- [x] Imports aktualisiert
- [x] Dateien gelöscht
- [x] Registry aktualisiert
- [x] Tests bestanden
- [x] Keine Fehler in Console
- [x] Alle Templates funktional

================================================================================
SCHRITT 11: Git Commit
================================================================================

COMMIT die Änderungen mit aussagekräftiger Message:

git add .
git commit -m "chore: Remove template duplicates and fix imports

- Deleted angina_pectoris.js (use angina-pectoris.js)
- Deleted hypoglykämie.js (use hypoglykaemie.js)  
- Updated all import statements
- Updated template registry
- Saved 41.9 KB disk space
- Fixed naming conventions (use hyphens, not underscores)"

git push origin main

================================================================================
SCHRITT 12: Zukünftige Prävention
================================================================================

ERSTELLE Datei: .github/workflows/check-duplicates.yml

# GitHub Action um zukünftige Duplikate zu verhindern

name: Check for Template Duplicates

on:
  pull_request:
    paths:
      - 'js/data/call-templates/**'

jobs:
  check-duplicates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for duplicate templates
        run: |
          cd js/data/call-templates/rd
          
          # Finde Dateien mit Unterstrichen
          UNDERSCORES=$(find . -name '*_*.js' | wc -l)
          
          # Finde Dateien mit Umlauten  
          UMLAUTS=$(find . -name '*[äöüß]*.js' | wc -l)
          
          if [ $UNDERSCORES -gt 0 ] || [ $UMLAUTS -gt 0 ]; then
            echo "ERROR: Found files with underscores or umlauts!"
            echo "Please use hyphens (-) and ASCII characters only."
            exit 1
          fi
          
          echo "OK: No naming convention violations found."

ERSTELLE Datei: docs/TEMPLATE_NAMING_CONVENTION.md

# Template Naming Convention

## Regel

✅ **KORREKT:**
- angina-pectoris.js
- herzinfarkt.js  
- schaedel-hirn-trauma.js
- verkehrsunfall-pkw.js

❌ **FALSCH:**
- angina_pectoris.js (Unterstriche)
- hypoglykämie.js (Umlaute)
- Herzinfarkt.js (Großschreibung)
- verkehrsunfall-v2.js (Versionsnummern)

## Warum?

1. **Konsistenz** - Einheitliche Benennung
2. **Kompatibilität** - Keine Probleme mit verschiedenen OS
3. **Git** - Bessere Darstellung in Diffs
4. **Import** - Einfachere Import-Statements

## Wie umbennen?

```bash
# Einzelne Datei
mv angina_pectoris.js angina-pectoris.js

# Bulk-Umbenennung (alle Unterstriche)
for file in *_*.js; do
  mv "$file" "${file//_/-}"
done

# Umlaute ersetzen
rename 's/ä/ae/g; s/ö/oe/g; s/ü/ue/g; s/ß/ss/g' *.js
```

## Checklist vor Commit

- [ ] Dateiname verwendet nur Kleinbuchstaben
- [ ] Keine Unterstriche (_)
- [ ] Keine Umlaute (äöüß)  
- [ ] Bindestriche (-) für Trennung
- [ ] .js Endung
- [ ] Kein Duplikat vorhanden

================================================================================
ERWARTETES ERGEBNIS:
================================================================================

✅ Keine Template-Duplikate mehr:
   - Nur eine Version pro Einsatztyp
   - Konsistente Namensgebung
   - Keine Unterstriche oder Umlaute

✅ Kleinerer Speicher-Footprint:
   - ~40 KB gespart bei 2 Duplikaten
   - Bei allen Duplikaten: ~100-200 KB weniger

✅ Klarere Code-Struktur:
   - Keine Verwirrung welche Datei die richtige ist
   - Imports eindeutig

✅ Keine Import-Fehler:
   - Alle Imports zeigen auf existierende Dateien
   - Console bleibt sauber

✅ Prävention:
   - GitHub Action prüft zukünftige PRs
   - Dokumentierte Naming-Convention

================================================================================
FEHLER-BEHANDLUNG:
================================================================================

FALLS "Module not found" nach Löschung:
→ Import-Statement wurde übersehen
→ Globale Suche nach Dateinamen
→ Import korrigieren

FALLS Template nicht mehr verfügbar:
→ Falsche Datei gelöscht!
→ Git revert machen
→ Prüfen welche die korrekte war

FALLS Export-Name nicht passt:
→ In beibehaltener Datei prüfen wie exportiert wird
→ Import entsprechend anpassen

FALLS Einsatz nicht generiert wird:
→ Template-Registry checken
→ Korrekter Key verwendet?

================================================================================
VERIFIZIERUNG:
================================================================================

Nach Implementierung prüfen:

1. ✅ Keine Dateien mit Unterstrichen in call-templates/
2. ✅ Keine Dateien mit Umlauten in call-templates/
3. ✅ Alle Imports funktionieren
4. ✅ Keine 404-Errors in Console
5. ✅ Alle Einsatztypen generierbar
6. ✅ docs/CLEANUP_REPORT.md erstellt
7. ✅ docs/TEMPLATE_NAMING_CONVENTION.md erstellt
8. ✅ GitHub Action (optional) eingerichtet
9. ✅ Git Commit gemacht
10. ✅ ~40-200 KB Speicher gespart

================================================================================
```

## 🎯 PROMPT ENDE

---

**Nächster Prompt:** PROMPT_04_STATE_MANAGER.md

**Status:** ✅ Ready to copy-paste