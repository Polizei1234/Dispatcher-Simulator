# 🚑 ILS Waiblingen - Leitstellensimulator

**Realistischer Dispatcher-Simulator für den Rems-Murr-Kreis**

## ✨ Features

### 📍 **Echte Daten aus dem Rems-Murr-Kreis**
- **35 Wachen**: 7 Hauptamtliche Rettungswachen, 2 Notarztwachen, 17 Ortsvereine
- **90+ Fahrzeuge**: RTW, NEF, KTW, Kommandowagen, GW-San
- **Realistische Funkrufnamen**: Nach Digitalfunkatlas Baden-Württemberg
- **Pixel-Art Icons**: Hand-gezeichnete Fahrzeug- und Wachen-Icons

### 📱 **v3.0: Tab-Navigation**
- **🗺️ Karte**: Interaktive Karte mit allen Wachen und Einsatzfahrzeugen
- **🚑 Fahrzeuge**: Übersichtliche Darstellung nach Kategorien & Wachen
  - Rettungsdienst, Katastrophenschutz, Krankentransport
  - Aufklappbare Wachen-Gruppen
  - FMS-Status mit Zahlen/Buchstaben-Badges
- **📝 Einsätze**: Alle aktiven Einsätze auf einen Blick
- **📡 Funkverkehr**: Vollständiger Funkverlauf

### 🚨 **Funkmeldesystem (FMS)**
- **Status 0-9**: Offizielle FMS-Codes für Feuerwehr & Rettungsdienst
- **Farbcodierung**: Jeder Status hat eigene Farbe
- **Live-Updates**: Status ändert sich in Echtzeit
- **Statusnummern**: `Status 3` statt nur Farbe

### 🎮 **Spielmodi**
- **🏆 Karrieremodus**: Starte mit 6 Fahrzeugen, verdiene Geld, kaufe mehr
- **♾️ Freies Spiel**: Alle 90+ Fahrzeuge sofort verfügbar

### 🤖 **KI-Features** (Optional mit Groq API)
- **Dynamische Einsätze**: KI generiert realistische Notfälle
- **Telefon-Simulationen**: Echte Gespräche mit Anrufern
- **Kostenlos**: API-Key unter [console.groq.com/keys](https://console.groq.com/keys)

### ⏱️ **Weitere Features**
- **Zeitraffer**: 1x - 30x Spielgeschwindigkeit
- **Shop-System**: Kaufe neue Fahrzeuge für deine Flotte
- **Realistische Fahrzeiten**: Berechnung nach echter Entfernung
- **Funkverkehr**: Live-Log aller Funkmeldungen

## 🚀 Installation

### Option 1: GitHub Pages (Empfohlen)
1. Repository forken
2. In den Settings unter "Pages" aktivieren
3. Source: `main` Branch auswählen
4. Unter `https://[username].github.io/Dispatcher-Simulator/` spielen

### Option 2: Lokal spielen
```bash
git clone https://github.com/Polizei1234/Dispatcher-Simulator.git
cd Dispatcher-Simulator
python -m http.server 8000
```
Dann im Browser: `http://localhost:8000`

## 📚 FMS-Statusübersicht

### Fahrzeug → Leitstelle
| Code | Status | Bedeutung |
|------|--------|----------|
| 0 | Sprechwunsch (priorisiert) | Fahrzeug möchte dringend sprechen |
| 1 | Einsatzbereit über Funk | Unterwegs, erreichbar |
| 2 | Einsatzbereit auf Wache | Auf Wache bereit |
| 3 | Einsatzauftrag übernommen | Fährt zum Einsatz |
| 4 | Ankunft am Einsatzort | Vor Ort |
| 5 | Sprechwunsch (normal) | Normale Meldung |
| 6 | Ankunft am Zielort | Z.B. Krankenhaus |
| 7 | Patient aufgenommen | Transportbeginn |
| 8 | Am Standort | Bestimmter Ort |
| 9 | Notfall/Sondersignal | Mit Blaulicht |
| C | Lagemeldung | Infos übermitteln |
| E | Nicht einsatzbereit | Pause/Wartung |

### Leitstelle → Fahrzeug
| Code | Status | Bedeutung |
|------|--------|----------|
| 0 | Sammelruf | Alle melden sich |
| A | Alarm | Alarmierung |
| B | Bereitstellung | Anfahrt Bereitstellungsraum |
| C | Durchsage | Wichtige Info |
| D | Dringender Auftrag | Eilauftrag |
| E | Anweisung | Besondere Anweisung |
| F | Über Telefon melden | Anruf erwünscht |
| G | Über Funk melden | Funkmeldung |
| H | Wache anfahren | Rückkehr zur Wache |
| I | Sonstige Anweisungen | Weitere Infos folgen |

## 🛠️ Technologie
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Karte**: Leaflet.js + OpenStreetMap
- **KI**: Groq API (Llama 3.3 70B)
- **Icons**: Font Awesome + Custom Pixel Art

## 📝 Changelog

### v3.0 (21.01.2026)
- ✨ **Tab-Navigation**: Karte, Fahrzeuge, Einsätze, Funkverkehr
- 🚑 **Fahrzeug-Übersicht**: Sortiert nach Kategorie & Wache
- 🏷️ **Status-Badges**: Zahlen/Buchstaben statt nur Farbe
- 📂 **Aufklappbare Gruppen**: Wachen ein-/ausblenden
- 🎨 **Verbessertes Design**: Moderne Tab-Navigation

### v2.9 (21.01.2026)
- 🔢 **FMS mit Nummer**: "Status 3" statt nur Farbe
- 📍 **Persistente Popups**: Bleiben offen bis wegklicken

### v2.8 (21.01.2026)
- 🎨 **Angepasste FMS-Farben**: Nach Nutzerwunsch
- ⚫ **Status 6 Schwarz**: Nicht einsatzbereit

### v2.7 (21.01.2026)
- 🚨 **FMS-Statussystem**: Offizielle Codes implementiert
- 🎨 **Farbcodierung**: Jeder Status eigene Farbe

## 👥 Credits
- **Entwicklung**: Polizei1234 + AI Assistant
- **Daten**: Rems-Murr-Kreis, Digitalfunkatlas BW
- **FMS-Codes**: [rettungsdienst.net](http://www.rettungsdienst.net/technik/bos/bo-fms)

## 📜 Lizenz
MIT License - Siehe LICENSE Datei

---

**🚑 Viel Spaß beim Disponieren! 🚑**