# 🚑 Dispatcher Simulator - ILS Waiblingen

**Realistische Leitstellensimulation für den Rems-Murr-Kreis**

[![Version](https://img.shields.io/badge/version-6.2.0-green.svg)](https://github.com/Polizei1234/Dispatcher-Simulator)
[![Build System](https://img.shields.io/badge/build-webpack_5-blue.svg)](BUILD_SYSTEM.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- 🗺️ **Realistische Karte** des Rems-Murr-Kreises (OpenStreetMap + Leaflet)
- 🚑 **78 echte Fahrzeuge** aus 35 Wachen (RTW, NEF, KTW, Kdow, GW-San)
- 📞 **KI-generierte Notrufe** via Groq API (LLaMA 3.1)
- 📡 **FMS-Statussystem** mit Nummern 0-9 & Farbcodierung
- 📊 **Echtzeit-Einsätze** mit realistischen Anfahrtszeiten
- 🔊 **Funkverkehr-Simulation** (Fahrzeuge funken bei Status 0 & 5)
- 🎯 **Bewertungssystem** für Performance-Analyse
- 🌟 **Tutorial-Modus** für Einsteiger

---

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone https://github.com/Polizei1234/Dispatcher-Simulator.git
cd Dispatcher-Simulator
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Development Server starten

**Option A: Ohne Build (direkte Source-Dateien)**
```bash
npm run serve
```
➡️ Öffnet http://localhost:8080

**Option B: Mit Webpack Development Build**
```bash
npm run dev      # In Terminal 1 (Watch Mode)
npm run serve    # In Terminal 2 (Dev Server)
```

### 4. Production Build erstellen

```bash
npm run build
```

➡️ Erstellt optimierte Bundles in `dist/`

---

## 📊 Performance: Vorher vs. Nachher

| Metrik | Ohne Webpack | Mit Webpack | Verbesserung |
|--------|--------------|-------------|-------------|
| **HTTP Requests** | 43 | 4 | 🔺 91% |
| **Dateigröße** | 850 KB | 320 KB | 🔺 62% |
| **Ladezeit (3G)** | 8-12s | 2-3s | 🔺 75% |
| **Cache-Effizienz** | Niedrig | Hoch | ✅ |

---

## 🛠️ Build System

### Commands

```bash
npm run dev              # Development Build (Watch Mode)
npm run build            # Production Build (Minified)
npm run build:analyze    # Production + Bundle Analyzer
npm run serve            # Local Dev Server (Port 8080)
```

### Was macht der Production Build?

✅ **Minification** - JavaScript & CSS komprimiert  
✅ **Tree-Shaking** - Ungenutzte Exports entfernt  
✅ **Code Splitting** - Intelligente Bundle-Trennung  
✅ **Content-Hash** - Optimales Browser-Caching  
✅ **Source Maps** - Debugging auch in Production  

➡️ [Detaillierte Build-System Dokumentation](BUILD_SYSTEM.md)

---

## 📁 Projektstruktur

```
Dispatcher-Simulator/
├── css/                    # Styles
│   ├── style.css           # Main Styles
│   ├── styles-bundle.css   # ⭐ Webpack Entry Point
│   └── *.css               # Component Styles
│
├── js/                     # Source Code
│   ├── main-bundle.js      # ⭐ Webpack Entry Point
│   ├── core/               # Game Logic & Config
│   ├── ui/                 # UI Components
│   ├── systems/            # AI, Radio, Movement
│   ├── utils/              # Helper Functions
│   └── data/               # Vehicles, Incidents, Hospitals
│
├── dist/                   # Build Output (⛔ not in Git)
│   ├── js/
│   │   ├── main.[hash].bundle.js
│   │   ├── vendor.[hash].bundle.js
│   │   └── runtime.[hash].bundle.js
│   └── css/
│       └── styles.[hash].css
│
├── index.html              # Main HTML
├── package.json            # Dependencies
├── webpack.config.js       # Webpack Config
├── BUILD_SYSTEM.md         # Build Docs
└── README.md               # This file
```

---

## ⚙️ Konfiguration

### Groq API Key (für KI-Notrufe)

1. Kostenlos registrieren: https://console.groq.com/keys
2. API Key kopieren
3. Im Spiel: **Einstellungen** → **Groq API Key** einfügen

### Spieleinstellungen

- **Spielgeschwindigkeit**: 0.5x - 30x (Standard: 1x Echtzeit)
- **Fahrzeug-Geschwindigkeit**: 0.5x - 2x (Standard: 1x)
- **Einsatzfrequenz**: 30s - 5 Min (Standard: 2 Min)
- **Auto-Zoom**: Automatisch zu neuen Einsätzen zoomen

---

## 🎮 Spielmodi

### ♾️ Freies Spiel

- Alle 78 Fahrzeuge sofort verfügbar
- Unbegrenzte Einsätze
- Perfekt zum Experimentieren

### 🏆 Karrieremodus (Coming Soon!)

- Starte mit wenigen Fahrzeugen
- Schalte neue Wachen frei
- Baue deine Flotte auf
- Reputation & Budget-System

### 🎓 Tutorial

- Schritt-für-Schritt Anleitung
- Lerne FMS-Statussystem
- Übe Einsatz-Disposition
- Perfekt für Einsteiger

---

## 📊 FMS-Statussystem

| Status | Name | Bedeutung | Farbe |
|--------|------|-----------|-------|
| **0** | Einsatzbereit über Funk | Sprechwunsch an Leitstelle | 🟢 Grün |
| **1** | Einsatzbereit auf Wache | Verfügbar für neue Einsätze | 🔵 Blau |
| **2** | Einsatzbereit auf Wache (Höherwertig) | RTW-Status, wenn auf NEF gewartet wird | 🟡 Gelb |
| **3** | Einsatzfahrt | Anfahrt zum Einsatzort | 🟠 Orange |
| **4** | Am Einsatzort | Patientübergabe / Versorgung | 🔴 Rot |
| **5** | Sprechwunsch am Einsatzort | Klinikzuweisung / Verstärkung | 🟣 Lila |
| **6** | Patient aufgenommen | Transportfahrt zur Klinik | 🔵 Hellblau |
| **7** | Am Zielort | Patient übergeben | 🟢 Türkis |
| **8** | Nicht einsatzbereit | Pause / Tankstelle | ⚫ Grau |
| **9** | Außer Dienst | Fahrzeug offline | ⚫ Dunkelgrau |
| **C** | Nicht erreichbar | Fahrzeug außer Reichweite | ⚫ Schwarz |

---

## 📡 Funkverkehr-System

**Fahrzeug-initiierte Funkrufe:**

1. **Status 0** - Einsatzbereit über Funk
   - Fahrzeug meldet sich zurück auf Wache
   - Automatisch nach Einsatzende

2. **Status 5** - Sprechwunsch am Einsatzort
   - Klinikzuweisung anfordern (bei Transporteinsatz)
   - Verstärkung nachfordern (Komplikationen)
   - Zusätzliche Einsatzinfos mitteilen
   - Material nachfordern

**Leitstellen-initiierte Funkrufe:**

- Fahrzeug wählen im Radio-Tab
- Nachricht eingeben
- Fahrzeug antwortet kontextabhängig
- Nur kontaktierbar bei Status 1, 3, 4, 6, 7, 8, 9

---

## 🐛 Debug-Modus

Drücke `D` oder klicke **Debug-Button** im Header:

- 📊 Performance-Metriken
- 🔍 Fahrzeugstatus-Übersicht
- ⚡ Einsatz-Generator Kontrolle
- 🛠️ Game State Inspector

---

## 🚀 Deployment

### 1. Production Build

```bash
npm run build
```

### 2. Upload Dateien

```
✅ index.html (mit dist/ Referenzen)
✅ dist/ Ordner (komplett)
✅ assets/ (falls vorhanden)
❌ node_modules/ (NICHT hochladen!)
```

### 3. Server Config

**Apache (.htaccess)**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
</IfModule>
```

**Nginx**
```nginx
gzip on;
gzip_types text/css application/javascript;

location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📚 Dokumentation

- [Build System Guide](BUILD_SYSTEM.md) - Webpack & Performance
- [API Docs](docs/API.md) - Code-Dokumentation (Coming Soon)
- [Contributing Guide](CONTRIBUTING.md) - Mitarbeit (Coming Soon)

---

## 🛠️ Technologie-Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Map**: Leaflet.js + OpenStreetMap
- **Routing**: Leaflet Routing Machine (OSRM)
- **AI**: Groq API (LLaMA 3.1 70B)
- **Build**: Webpack 5 + Terser
- **Icons**: Font Awesome 6

---

## 🤝 Contributing

Pull Requests sind willkommen! Für größere Änderungen bitte erst ein Issue erstellen.

---

## 📝 Changelog

### v6.2.0 (2026-01-26)
- ➕ Webpack 5 Build System
- ➕ Performance-Optimierungen (60% kleinere Files)
- ➕ Code Splitting & Tree-Shaking
- 🔧 CSS Versionierung vereinheitlicht
- 🔧 Status-Texte aus CONFIG

### v6.1.8 (2026-01-25)
- ➕ Dynamisches Resource Loading
- 🔧 Version Config Fix
- 🔧 Spielgeschwindigkeit-Anzeige Bug

---

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details

---

## 👤 Autor

**Polizei1234**
- GitHub: [@Polizei1234](https://github.com/Polizei1234)
- Repository: [Dispatcher-Simulator](https://github.com/Polizei1234/Dispatcher-Simulator)

---

**⭐ Wenn dir das Projekt gefällt, gib uns einen Star!**

**🚀 Happy Dispatching!**
