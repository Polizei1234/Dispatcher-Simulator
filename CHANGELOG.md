# Changelog - ILS Waiblingen Dispatcher Simulator

## [6.0.0] - 2026-01-25
### 🎨 MAJOR UPDATE: Professional UI Redesign

#### Komplett überarbeitetes Design
- **Professionelles Farbschema**: Realistische Leitstellenoptik mit gedämpften Grautönen
- **Cleanes Layout**: Reduzierte visuelle Ablenkung, Fokus auf Funktionalität
- **Optimierte Lesbarkeit**: Höherer Kontrast, bessere Typografie für lange Schichten
- **Subtile Animationen**: Professionelle Übergänge ohne übertriebene Effekte

#### Design-Prinzipien v6.0.0
- Realistische Leitstellensoftware als Vorbild
- Ausgewogenes Layout (Karte, Listen, Details)
- Farbige Icons für schnelle Orientierung beibehalten
- Leichte Abrundungen (4-6px) statt starker Rundungen
- Flachere Buttons ohne starke Gradienten

#### UI-Komponenten
- **Header**: Kompakter (60px statt 70px), klarere Struktur
- **Panels**: Subtile Hintergründe mit dünnen Rahmen
- **Buttons**: Professioneller Look mit sanften Hover-Effekten
- **Tab-Navigation**: Moderne Unterstrich-Indikatoren
- **Karten & Listen**: Einheitliches Grid-System

#### Farbpalette v6.0.0
```css
--primary-red: #d32f2f        /* Notfälle */
--secondary-blue: #1976d2     /* Primär-Aktionen */
--success-green: #388e3c      /* Erfolg */
--warning-orange: #f57c00     /* Warnungen */
--bg-darkest: #1a1d23         /* Haupthintergrund */
--panel-bg: #2a2f3a           /* Panels */
--text-primary: #e8eaed       /* Haupttext */
```

#### Technische Verbesserungen
- CSS-Variablen für konsistente Abstände und Farben
- Optimierte Scrollbars (8px, subtil)
- Verbesserte Shadow-Hierarchie
- Monospace-Fonts für technische Daten

---

## [5.0.8] - 2026-01-XX
### ✨ Features
- **Funkverkehr-Tab**: Komplett überarbeitet mit schönerem UI
- **Fahrzeug anfunken**: Neue Dropdown-Auswahl für Fahrzeuge
- **Auto-Antworten**: Fahrzeuge antworten kontextabhängig auf Funksprüche
- **Status 0 & 5**: Fahrzeuge funken automatisch bei Notfall/Sprechwunsch

### 🐛 Bugfixes
- Funkverkehr-Log scrollt automatisch nach unten
- Verbesserte Darstellung von Funksprüchen

---

## [5.0.7] - 2026-01-XX
### ✨ Features
- **Notruf-Tab Split View**: Links Chat, rechts Manual Incident Formular
- **Verbesserte Call-UI**: Übersichtlichere Darstellung von Gesprächen
- **Fixed Footer Button**: "Gespräch beenden" immer sichtbar

---

## [5.0.6] - 2026-01-XX
### ✨ Features
- **Groq API Integration**: KI-generierte Einsätze und Telefonate
- **Verbesserte Einstellungen**: API Key Eingabe mit Sichtbarkeits-Toggle
- **Tutorial-System**: Erste Schritte für neue Benutzer

---

## [5.0.5] - 2026-01-XX
### 🐛 Bugfixes
- Performance-Optimierungen bei vielen aktiven Fahrzeugen
- Speicherverwaltung verbessert
- Cache-Probleme behoben

---

## [5.0.0] - 2025-12-XX
### 🎉 MAJOR UPDATE: Komplett-Überarbeitung

#### Neue Features
- **78 Fahrzeuge** aus dem Rems-Murr-Kreis
- **35 Wachen** (7 Hauptamtliche, 2 NEF, 17 Ortsvereine, 9 KTW-Stationen)
- **FMS-Statussystem** mit 9 Status (0-8)
- **Echtzeit-Routing** mit Leaflet Routing Machine
- **Kategorisierung**: Rettungsdienst, Katastrophenschutz, KTW
- **Nach Wachen gruppiert**: Fahrzeuge übersichtlich nach Standort

#### Technische Basis
- Vanilla JavaScript (kein Framework)
- Leaflet.js für Karte
- Modular strukturierter Code
- LocalStorage für Spielstände

---

## [4.0.0] - 2025-11-XX
### Legacy Version
- Grundlegende Simulator-Funktionen
- Weniger Fahrzeuge und Wachen
- Einfacheres UI

---

## Versionsschema
- **Major (X.0.0)**: Große Änderungen, Breaking Changes
- **Minor (0.X.0)**: Neue Features, keine Breaking Changes  
- **Patch (0.0.X)**: Bugfixes, kleine Verbesserungen