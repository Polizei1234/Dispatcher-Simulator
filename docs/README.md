# 📚 Dispatcher-Simulator Dokumentation

> Vollständige Dokumentation für den Dispatcher-Simulator

---

## 📖 Schnellstart

- [Haupt-README](../README.md) - Projekt-Übersicht und Installation
- [Changelog](../CHANGELOG.md) - Versionshistorie
- [Roadmap](../ROADMAP.md) - Geplante Features

---

## 🏗️ Technische Dokumentation

### Architektur & Systeme
- [**Architektur-Übersicht**](technical/ARCHITECTURE.md) - Gesamtsystem-Architektur
- [**Build-System**](technical/BUILD_SYSTEM.md) - Webpack & Build-Prozess
- [**Cache-Clearing**](technical/CACHE_CLEAR.md) - Cache-Management
- [**Unified Status System**](technical/UNIFIED_STATUS_SYSTEM.md) - FMS-Status-Verwaltung

### System-Komponenten
- [**Icon-System v6.0.0**](systems/ICON_SYSTEM_v6.0.0.md) - Karten-Icons & Marker
- [**Radio-System**](systems/RADIO_SYSTEM_COMPLETE.md) - Funkverkehr & Kommunikation
- [**Phase 2 Dokumentation**](systems/PHASE_2_DOCUMENTATION.md) - Entwicklungsphase 2

---

## 📘 Anleitungen

- [**Integration Guide**](guides/INTEGRATION_GUIDE.md) - Integration neuer Systeme
- [**Migration Guide**](guides/MIGRATION_GUIDE.md) - Migrations-Anleitungen

---

## 🐛 Bugfixes & Fehlerbehebung

- [**Bugfixes**](bugfixes/BUGFIXES.md) - Behobene Bugs
- [**Kritische Bugfixes**](bugfixes/CRITICAL_BUGFIXES.md) - Kritische Fehlerbehebungen

---

## 📦 Release-Informationen

### Version 6.x
- [Release Notes v6.3.0](releases/RELEASE_NOTES_v6.3.0.md)
- [Release Notes v6.2.0](releases/RELEASE_NOTES_v6.2.0.md) | [Commits](releases/COMMITS_v6.2.0.md)
- [Release Notes v6.1.0](releases/RELEASE_NOTES_v6.1.0.md)
- [Release Notes v6.0.0](releases/RELEASE_NOTES_v6.0.0.md)

### Version 5.x
- [Final Status v5.0.0](releases/FINAL_STATUS_v5.0.0.md)

---

## 🔧 Für Entwickler

### Code-Struktur
```
js/
├── core/          # Kernfunktionalität (Game Loop, Config)
├── systems/       # Systeme (Radio, Notifications, Bewegung)
├── ui/            # UI-Komponenten (Tabs, Dropdowns, Formulare)
├── data/          # Daten (Incidents, FMS-Codes, Templates)
└── utils/         # Hilfsfunktionen (Scoring, Location-Generator)
```

### Module-Übersicht

#### Core (`js/core/`)
- `main.js` - Haupt-Einstiegspunkt
- `game.js` - Game Loop & Spiellogik
- `bridge.js` - Kommunikation zwischen Modulen
- `config.js` - Konfigurationsverwaltung
- `incident-manager.js` - Einsatz-Verwaltung
- `incident-composer.js` - Einsatz-Generierung

#### Systems (`js/systems/`)
- `vehicle-movement.js` - Fahrzeug-Bewegung & Routing
- `unified-status-system.js` - FMS-Status-Verwaltung
- `radio-system.js` - Funkverkehr
- `call-system.js` - Anruf-System
- `notification-system.js` - Benachrichtigungen
- `ai-incident-generator.js` - KI-Einsatzgenerierung

#### UI (`js/ui/`)
- `ui.js` - Haupt-UI-Controller
- `tabs.js` - Tab-Verwaltung
- `manual-incident.js` - Manuelle Einsatzerstellung
- `assignment-ui.js` - Fahrzeugzuweisungs-UI
- `radio-feed.js` - Funkfeed-Anzeige

---

## 📝 Dokumentations-Konventionen

### Dateinamen
- `UPPERCASE.md` - Haupt-Dokumentation
- `lowercase.md` - Modul-spezifische Docs
- Versionsnummern im Format: `v{MAJOR}.{MINOR}.{PATCH}`

### Struktur
- Jedes System sollte eine eigene Dokumentation haben
- Release Notes immer mit Datum versehen
- Bugfixes mit Issue-Nummern verknüpfen (falls vorhanden)

---

## 🤝 Beiträge zur Dokumentation

Bei Änderungen an der Dokumentation:
1. Prüfe, ob die Änderung in die richtige Kategorie passt
2. Aktualisiere diesen Index bei neuen Dokumenten
3. Verwende klare, beschreibende Commit-Messages
4. Verlinke verwandte Dokumente

---

**Letzte Aktualisierung:** 27. Januar 2026  
**Version:** 7.5.0