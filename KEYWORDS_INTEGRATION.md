# Keywords-Dropdown Integration - Anleitung

## ✅ Erfolgreich erstellt:

1. **`data/priority-keywords.json`** - 10 Prioritätsstufen (RD0-RD3, MANV1-5, MANV/MANE)
2. **`data/detail-keywords.json`** - 100 detaillierte medizinische Stichwörter
3. **`js/keywords-dropdown.js`** - Dropdown-System mit Autocomplete-Funktion
4. **`css/keywords-dropdown.css`** - Styling für die Dropdowns
5. **`js/manual-incident.js`** - Aktualisiert mit Dropdown-Integration (v2.0)
6. **`js/protocol-form.js`** - Aktualisiert mit Dropdown-Integration (v2.0)

---

## 📦 Integration in index.html

Fügen Sie folgende Zeilen in Ihre `index.html` ein:

### 1. CSS im `<head>`-Bereich:

```html
<!-- Keywords Dropdown Styles -->
<link rel="stylesheet" href="css/keywords-dropdown.css">
```

### 2. JavaScript vor dem schließenden `</body>`-Tag:

```html
<!-- Keywords System (muss VOR protocol-form und manual-incident geladen werden!) -->
<script src="js/keywords-dropdown.js"></script>

<!-- Protocol Form (benötigt keywords-dropdown.js) -->
<script src="js/protocol-form.js"></script>

<!-- Manual Incident (benötigt keywords-dropdown.js) -->
<script src="js/manual-incident.js"></script>
```

---

## 📢 Wichtige Reihenfolge:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- ... andere CSS-Dateien ... -->
    <link rel="stylesheet" href="css/keywords-dropdown.css">
</head>
<body>
    <!-- ... HTML Content ... -->
    
    <!-- JavaScript in dieser Reihenfolge: -->
    <script src="js/config.js"></script>
    <script src="js/data.js"></script>
    <script src="js/incident-numbering.js"></script>
    <!-- ... andere JS-Dateien ... -->
    
    <!-- KRITISCH: Keywords MUSS zuerst geladen werden! -->
    <script src="js/keywords-dropdown.js"></script>
    
    <!-- Diese beiden benötigen keywords-dropdown.js -->
    <script src="js/protocol-form.js"></script>
    <script src="js/manual-incident.js"></script>
    
    <!-- ... weitere JS-Dateien ... -->
    <script src="js/main.js"></script>
</body>
</html>
```

---

## 🎯 Features

### Wo werden die Dropdowns verwendet?

1. **📞 Einsatzprotokoll (Notruf-Tab)**
   - Beim Annehmen eines Notrufs
   - Zwei Felder: Priorität + Detail-Stichwort
   - Automatisches Ausfüllen aus Anruf-Daten möglich

2. **➕ Manueller Einsatz**
   - Beim manuellen Erstellen eines Einsatzes
   - Zwei Felder: Priorität + Detail-Stichwort
   - Automatische Fahrzeugvorschläge

### Prioritäts-Dropdown:
- **RD 0** - Krankentransport/Fehlalarm (Grün)
- **RD 1** - Kleine Notfälle (Hellgrün)
- **RD 2** - Standard Notfälle (Gelb)
- **RD 3** - Lebensbedrohliche Notfälle (Orange)
- **MANV 1** bis **MANV 5** - Massenanfall von Verletzten (Rot)
- **MANV/MANE** - Mit Erkrankten (Rot)
- Automatische Fahrzeugvorschläge basierend auf Priorität
- Farbcodierung im Dropdown

### Detail-Dropdown:
- **100+ medizinische Stichwörter**
- **15 Kategorien:**
  - ❤️ Herz/Kreislauf
  - 👨 Atmung
  - 🧠 Neurologie
  - 🩹 Trauma/Verletzungen
  - 🚗 Unfälle
  - 🤰 Gynäkologie/Geburt
  - ☠️ Intoxikationen
  - 🧘 Psychiatrie
  - 🚨 Sonderlagen
  - und mehr...
- Durchsuchbar nach Keyword, Kategorie oder Beschreibung

### Autocomplete-Funktionen:
- **Live-Suche** während der Eingabe
- **Filterung** nach Stichwort, Kategorie und Beschreibung
- **Tastatur-Navigation** (Pfeiltasten, Enter, ESC)
- **Click-Outside** zum Schließen
- **Max. 10 Ergebnisse** gleichzeitig angezeigt
- **Keine Ergebnisse**-Meldung wenn nichts gefunden

---

## 🔧 Verwendung

### Im Einsatzprotokoll (Notruf):

1. **Notruf annehmen** (grüner Button)
2. **Durchführen Sie das Notruf-Gespräch**
3. **Im Protokoll-Formular:**
   - **Prioritätsstufe**: Tippen Sie z.B. "RD" oder "MANV"
   - **Detail-Stichwort**: Tippen Sie z.B. "Herz", "VU" oder "Geburt"
   - Wählen Sie aus der Dropdown-Liste
4. **Rest des Formulars ausfüllen**
5. **"Einsatz erstellen & Alarmieren"** klicken

### Im Manual Incident Modal:

1. **Öffnen Sie das Modal** für manuelle Einsatzerstellung
2. **Prioritätsstufe eingeben**: Tippen Sie z.B. "RD" oder "MANV"
3. **Detail-Stichwort eingeben**: Tippen Sie z.B. "VU", "Herzinfarkt" oder "Geburt"
4. **Wählen Sie aus der Dropdown-Liste**
5. Fahrzeuge werden basierend auf Priorität automatisch vorgeschlagen
6. **Alarmieren!**

---

## 📝 Beispiele

### Beispiel 1: Verkehrsunfall
- **Priorität**: RD 2 (Standard-Notfall)
- **Detail**: VU Person eingeklemmt
- **Kombiniertes Stichwort**: `RD 2 - VU Person eingeklemmt`
- **Vorgeschlagene Fahrzeuge**: RTW, NEF

### Beispiel 2: MANV
- **Priorität**: MANV 1 (5-9 Verletzte)
- **Detail**: Großbrand mit Verletzten
- **Kombiniertes Stichwort**: `MANV 1 - Großbrand mit Verletzten`
- **Vorgeschlagene Fahrzeuge**: RTW x2, NEF, Kdow, GW-San

### Beispiel 3: Herzinfarkt
- **Priorität**: RD 2
- **Detail**: Herzinfarkt / ACS
- **Kombiniertes Stichwort**: `RD 2 - Herzinfarkt / ACS`
- **Vorgeschlagene Fahrzeuge**: RTW, NEF

### Beispiel 4: Geburt
- **Priorität**: RD 2
- **Detail**: Geburt / Entbindung
- **Kombiniertes Stichwort**: `RD 2 - Geburt / Entbindung`
- **Vorgeschlagene Fahrzeuge**: RTW, NEF

---

## ⚙️ Anpassungen

### Neue Keywords hinzufügen:

#### In `data/priority-keywords.json`:
```json
{
  "keyword": "RD 4",
  "category": "Rettungsdienst",
  "description": "Sonderlage mit erhöhtem Ressourcenbedarf",
  "suggestedVehicles": ["RTW", "RTW", "NEF", "Kdow"]
}
```

#### In `data/detail-keywords.json`:
```json
{
  "keyword": "Neue Erkrankung",
  "category": "Kategorie",
  "description": "Beschreibung der Erkrankung"
}
```

---

## 🐞 Troubleshooting

### Dropdown erscheint nicht:
- ✅ Prüfen Sie die Browser-Konsole (F12)
- ✅ Stellen Sie sicher, dass `keywords-dropdown.js` **vor** `protocol-form.js` und `manual-incident.js` geladen wird
- ✅ Überprüfen Sie, ob die JSON-Dateien im `data/` Ordner existieren
- ✅ Fehlermeldung: `KeywordsDropdown nicht geladen!` bedeutet falsche Ladereihenfolge

### Fehler in Konsole: `404 (File not found) js/keywords.json`
- ✅ **BEHOBEN**: Die alte `js/keywords.json` wird nicht mehr verwendet
- ✅ Stellen Sie sicher, dass Sie die neueste Version von `protocol-form.js` verwenden (v2.0)

### Keine Ergebnisse:
- ✅ Die JSON-Dateien enthalten valide Daten
- ✅ Suchbegriff ist mindestens 1 Zeichen lang
- ✅ Prüfen Sie Schreibweise (case-insensitive Suche)

### Styling-Probleme:
- ✅ Stellen Sie sicher, dass `keywords-dropdown.css` geladen ist
- ✅ CSS-Variablen sind in Ihrer Haupt-CSS definiert:
  - `--bg-secondary`
  - `--border-color`
  - `--accent-color`
  - `--text-primary`
  - `--text-secondary`

---

## 🚀 Nächste Schritte

1. ✅ Integration in `index.html` durchführen
2. ✅ Browser neu laden (Hard Refresh: Ctrl+Shift+R)
3. ✅ Testen im Einsatzprotokoll (Notruf annehmen)
4. ✅ Testen im Manual Incident Modal
5. 🔲 (Optional) Weitere Keywords ergänzen
6. 🔲 (Optional) Fahrzeugvorschläge anpassen
7. 🔲 (Optional) Custom Styling anpassen

---

## 📊 Statistik

- **10** Prioritätsstufen
- **100** Detail-Stichwörter
- **15** Kategorien
- **2** Einsatzorte (Einsatzprotokoll + Manueller Einsatz)
- **Autocomplete** mit Live-Suche
- **Mobile-responsive** Design
- **Farbcodierung** für Prioritäten

---

## ❗ Wichtige Hinweise

1. **Alte Dateien gelöscht:**
   - `data/keywords.json` ❌ (ersetzt durch neue Dateien)
   - `js/keywords.json` ❌ (ersetzt durch neue Dateien)

2. **Neue Dateien:**
   - `data/priority-keywords.json` ✅
   - `data/detail-keywords.json` ✅
   - `js/keywords-dropdown.js` ✅
   - `css/keywords-dropdown.css` ✅

3. **Aktualisierte Dateien:**
   - `js/protocol-form.js` ✅ (v2.0)
   - `js/manual-incident.js` ✅ (v2.0)

---

**Erstellt am:** 2026-01-22  
**Version:** 2.0  
**Status:** ✅ Einsatzbereit (Einsatzprotokoll + Manueller Einsatz)