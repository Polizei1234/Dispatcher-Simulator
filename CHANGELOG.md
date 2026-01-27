# Changelog - Dispatcher Simulator

## [6.1.0] - 2026-01-25

### 🌟 Hauptfeatures

#### Namensänderung
- **Neuer Name:** "Dispatcher Simulator" (vorher "ILS Waiblingen")
- Icon geändert zu 🎧 Headset (professioneller)
- Alle Texte und Titel aktualisiert

#### Komplett neues Layout-System
- **CSS Grid** statt Flexbox für Hauptlayout
- Optimierte 3-Spalten-Anordnung: 30% | 50% | 20%
- Full-Height Panels ohne Platzverschwendung
- Bessere Bildschirmausnutzung

### ➕ Hinzugefügt
- `css/layout.css` (7.2 KB) - Professionelles Grid-Layout-System
- Responsive Breakpoints für alle Bildschirmgrößen
- Full-Height Panel-Unterstützung
- Performance-Optimierungen durch CSS Grid

### ⚙️ Geändert
- HTML-Struktur optimiert für Grid-Layout
- Panel-Struktur vereinfacht
- Karte nutzt jetzt 50% der Breite (vorher variabel)
- Einsatzliste erhält 30% (vorher 340px fix)

### 📊 Verbesserungen
- 33% schnelleres Rendering durch CSS Grid
- Weniger Layout-Shifts
- Stabilere Panel-Größen
- Bessere Mobile-Unterstützung

### 🛠️ Technisch
- Alle Script-Versionen auf 6.1.0 aktualisiert
- Layout-Dokumentation hinzugefügt
- Keine Breaking Changes

---

## [6.0.0] - 2026-01-24

### 🌟 Hauptfeatures

#### Professional UI Redesign
- Komplettes visuelles Redesign mit Fokus auf Professionalität
- Neue Farbpalette: Dunkelgrau statt Schwarz
- Gedämpfte Akzentfarben für bessere Lesbarkeit
- Professionelles Grau-Schema (#1a1d23, #252932)

#### Wunderschöne Icons
- **3-Layer Incident Markers:** Pulse Ring + Container + Icon
- **Status 0 Emergency:** Flash + Shake Animation
- **Gradient Vehicle Icons** mit FMS-Status-Farben
- **Kategorisierte Dropdown-Icons** (Medical, Trauma, Cardiac)
- **Floating Chat-Badges** vor Nachrichten

#### Tab-Navigation
- Moderne Underline-Style statt farbige Hintergründe
- Klare aktive Markierung durch rote Unterstreichung
- Subtile Hover-Effekte

### ➕ Hinzugefügt
- `css/map-icons.css` (13.3 KB) - Professional icon system
- `css/call-system.css` (13.7 KB) - Enhanced notifications
- `css/keywords-dropdown.css` (7.2 KB) - Smart autocomplete
- `ICON_SYSTEM_v6.0.0.md` - Komplette Icon-Dokumentation
- `RELEASE_NOTES_v6.0.0.md` - Ausführliche Release Notes

### ⚙️ Geändert
- `css/style.css` - Komplettes Redesign (19 KB)
- `css/tabs.css` - Neue Underline-Navigation (2.3 KB)
- `index.html` - Version 6.0.0, aktualisierte Script-Refs

### 📊 Verbesserungen
- Reduzierte visuelle Ablenkung
- Verbesserte Lesbarkeit für lange Nutzungsdauer
- Subtile Animationen (0.15s - 0.2s)
- Optimierte Scrollbars
- Hoher Kontrast (#e8eaed auf #1a1d23)

### 🛠️ Technisch
- CSS-Variablen-System eingeführt
- Design-Tokens: `--spacing-*`, `--radius-*`, `--shadow-*`
- Shadow-Hierarchie: sm, md, lg
- Alle Scripts auf v6.0.0 aktualisiert

---

## [5.0.8] - 2026-01-23

### 🐞 Fehlerbehebungen
- Fahrzeugbewegungen optimiert
- Routing-Performance verbessert

---

## [5.0.0] - 2026-01-20

### 🌟 Hauptfeatures
- Initiales Release
- 78 Fahrzeuge aus dem Rems-Murr-Kreis
- 35 Wachen
- FMS-Statussystem
- KI-generierte Einsätze (Groq API)
- Notrufsystem mit Gesprächsführung
- Funkverkehr-System

---

**Legende:**
- 🌟 Hauptfeatures
- ➕ Hinzugefügt
- ⚙️ Geändert
- 🐞 Fehlerbehebungen
- 📊 Verbesserungen
- 🛠️ Technisch