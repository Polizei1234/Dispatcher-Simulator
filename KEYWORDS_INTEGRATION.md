# Keywords-Dropdown Integration - Anleitung

## ✅ Erfolgreich erstellt:

1. **`data/priority-keywords.json`** - 10 Prioritätsstufen (RD0-RD3, MANV1-5, MANV/MANE)
2. **`data/detail-keywords.json`** - 100 detaillierte medizinische Stichwörter
3. **`js/keywords-dropdown.js`** - Dropdown-System mit Autocomplete-Funktion
4. **`css/keywords-dropdown.css`** - Styling für die Dropdowns
5. **`js/manual-incident.js`** - Aktualisiert mit Dropdown-Integration (v2.0)

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
<!-- Keywords System -->
<script src="js/keywords-dropdown.js"></script>

<!-- Manual Incident (muss NACH keywords-dropdown.js geladen werden) -->
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
    <!-- ... andere JS-Dateien ... -->
    
    <!-- Keywords MUSS vor manual-incident geladen werden! -->
    <script src="js/keywords-dropdown.js"></script>
    <script src="js/manual-incident.js"></script>
    
    <script src="js/main.js"></script>
</body>
</html>
```

---

## 🎯 Features

### Prioritäts-Dropdown:
- **RD 0** bis **RD 3** - Standard Rettungsdienst-Einsätze
- **MANV 1** bis **MANV 5** - Massenanfall von Verletzten
- **MANV/MANE** - Massenanfall mit Erkrankten
- Automatische Fahrzeugvorschläge basierend auf Priorität
- Farbcodierung: Grün (RD0) → Rot (MANV)

### Detail-Dropdown:
- 100+ medizinische Stichwörter
- Kategorien: Herz/Kreislauf, Atmung, Neurologie, Trauma, uvm.
- Durchsuchbar nach Keyword, Kategorie oder Beschreibung

### Autocomplete-Funktionen:
- **Live-Suche** während der Eingabe
- **Filterung** nach Stichwort, Kategorie und Beschreibung
- **Tastatur-Navigation** (Pfeiltasten, Enter, ESC)
- **Click-Outside** zum Schließen
- **Max. 10 Ergebnisse** gleichzeitig angezeigt

---

## 🔧 Verwendung

### Im Manual Incident Modal:

1. **Öffnen Sie das Modal** für manuelle Einsatzerstellung
2. **Prioritätsstufe eingeben**: Tippen Sie z.B. "RD" oder "MANV"
3. **Detail-Stichwort eingeben**: Tippen Sie z.B. "Herz", "VU" oder "Geburt"
4. **Wählen Sie aus der Dropdown-Liste**
5. Fahrzeuge werden basierend auf Priorität automatisch vorgeschlagen
6. **Alarmieren!**

---

## 📝 Beispiele

### Beispiel 1: Verkehrsunfall
- **Priorität**: RD 2 (Standard-Notfall)
- **Detail**: VU Person eingeklemmt
- **Ergebnis**: `RD 2 - VU Person eingeklemmt`
- **Vorgeschlagene Fahrzeuge**: RTW, NEF

### Beispiel 2: MANV
- **Priorität**: MANV 1 (5-9 Verletzte)
- **Detail**: Großbrand mit Verletzten
- **Ergebnis**: `MANV 1 - Großbrand mit Verletzten`
- **Vorgeschlagene Fahrzeuge**: RTW x2, NEF, Kdow, GW-San

### Beispiel 3: Herzinfarkt
- **Priorität**: RD 2
- **Detail**: Herzinfarkt / ACS
- **Ergebnis**: `RD 2 - Herzinfarkt / ACS`
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
- Prüfen Sie die Browser-Konsole (F12)
- Stellen Sie sicher, dass `keywords-dropdown.js` **vor** `manual-incident.js` geladen wird
- Überprüfen Sie, ob die JSON-Dateien im `data/` Ordner existieren

### Keine Ergebnisse:
- Die JSON-Dateien enthalten valide Daten
- Suchbegriff ist mindestens 1 Zeichen lang
- Prüfen Sie Schreibweise (case-insensitive)

### Styling-Probleme:
- Stellen Sie sicher, dass `keywords-dropdown.css` geladen ist
- CSS-Variablen sind in Ihrer Haupt-CSS definiert:
  - `--bg-secondary`
  - `--border-color`
  - `--accent-color`
  - `--text-primary`
  - `--text-secondary`

---

## 🚀 Nächste Schritte

1. ✅ Integration in `index.html` durchführen
2. ✅ Testen der Dropdown-Funktionalität
3. 🔲 (Optional) Weitere Keywords ergänzen
4. 🔲 (Optional) Fahrzeugvorschläge anpassen
5. 🔲 (Optional) Custom Styling anpassen

---

## 📊 Statistik

- **10** Prioritätsstufen
- **100** Detail-Stichwörter
- **15** Kategorien
- **Autocomplete** mit Live-Suche
- **Mobile-responsive** Design

---

**Erstellt am:** 2026-01-22  
**Version:** 1.0  
**Status:** ✅ Einsatzbereit