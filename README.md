# 🚨 Leitstellensimulator - ILS Waiblingen

Ein realistisches browserbasiertes Dispatcher-Spiel für die Integrierte Leitstelle Waiblingen im Rems-Murr-Kreis.

## ✨ Features

### Spielmechanik
- **Realistische Einsätze** basierend auf dem Baden-Württemberg Stichwort-System (RD, B, THL, etc.)
- **KI-gestützte Notrufgespräche** mit Perplexity AI
- **Echte Karte** mit OpenStreetMap und realistischen Fahrzeiten
- **Wirtschaftssystem** - Verdiene Credits und kaufe neue Fahrzeuge
- **Zeitsteuerung** - Wähle zwischen 1x bis 60x Zeitraffer
- **Tutorial-System** für Einsteiger

### Realistisches Einsatzgebiet
- Über **60 echte Wachen** im Rems-Murr-Kreis
- **Rettungsdienst**: DRK Wachen in Waiblingen, Backnang, Winnenden, Schorndorf, Fellbach, Welzheim
- **Feuerwehr**: Städtische Feuerwehren mit realistischen Fahrzeugen
- **Polizei**: Polizeireviere mit Funkstreifenwagen
- **THW**: Ortsverbände Waiblingen und Backnang

### Fahrzeuge
- **Rettungsdienst**: RTW, NEF, KTW, NAW, ITW
- **Feuerwehr**: LF 20, LF 16, DLK 23, RW, TLF, SW, GW-L, GW-A/S
- **Polizei**: FuStW, VKW, GruKW
- **THW**: GKW, MzKW, MLW

### Kommunikation
- **Notrufgespräche** mit KI-generierten Anrufern
- **Schnellantworten** für Disponenten
- **Funkverkehr** mit Fahrzeugen
- **Einsatzprotokoll** mit allen Ereignissen

## 🚀 Installation & Start

### Voraussetzungen
- **Node.js** (Version 14 oder höher) - [Download](https://nodejs.org/)
- Einen modernen Webbrowser (Chrome, Firefox, Edge, Safari)
- Optional: Perplexity AI API-Key für KI-Funktionen

### Schritt 1: Repository klonen
```bash
git clone https://github.com/Polizei1234/Dispatcher-Simulator.git
cd Dispatcher-Simulator
```

### Schritt 2: Abhängigkeiten installieren
```bash
npm install
```

### Schritt 3: Spiel starten
```bash
npm start
```

Das Spiel öffnet sich automatisch im Browser unter `http://localhost:8080`

Alternativ kannst du die `index.html` direkt in einem Browser öffnen (eingeschränkte Funktionalität).

## 🔑 Perplexity AI API einrichten

Für realistische KI-generierte Notrufgespräche benötigst du einen Perplexity API-Key:

1. Gehe zu [https://www.perplexity.ai/](https://www.perplexity.ai/)
2. Erstelle einen Account und erhalte deinen API-Key
3. Öffne die Datei `js/ai.js`
4. Füge deinen API-Key ein:
   ```javascript
   this.apiKey = 'DEIN_API_KEY_HIER';
   ```

**Wichtig**: Der API-Key wird im Code gespeichert. Publiziere das Repository NICHT mit deinem persönlichen API-Key!

### Alternative ohne API-Key
Das Spiel funktioniert auch ohne API-Key mit vordefinierten Textbausteinen.

## 🎮 Spielanleitung

### Spielstart
1. Du startest mit der **DRK Rettungswache Backnang**
2. Drei Fahrzeuge stehen dir zur Verfügung: **1x RTW, 1x NEF, 1x KTW**
3. Startkapital: **10.000 €**

### Einsatz abarbeiten
1. **Notruf annehmen**: Klicke auf einen neuen Einsatz (orange markiert)
2. **Gespräch führen**: Stelle Fragen mit den Schnellantworten
3. **Fahrzeuge alarmieren**: Wähle passende Fahrzeuge basierend auf dem Stichwort
4. **Einsatz beobachten**: Verfolge die Fahrzeuge auf der Karte
5. **Abschluss**: Nach Einsatzende erhältst du Credits

### Fahrzeuge kaufen
- Verdiene Credits durch erfolgreiche Einsätze
- Kaufe neue Fahrzeuge über den Shop (Button in Entwicklung)
- Erweitere dein Netzwerk im ganzen Rems-Murr-Kreis

### Stichwort-System verstehen
- **RD 1**: Lebensbedrohlich → RTW + NEF
- **RD 2**: Dringend → RTW
- **RD 3**: Nicht dringend → KTW
- **B 1-4**: Brände (1=klein, 4=groß)
- **THL 1-3**: Technische Hilfeleistung
- **VU 1-3**: Verkehrsunfälle

## 🛠️ Erweiterungsmöglichkeiten

### Weitere Leitstellen hinzufügen
Das Spiel ist vorbereitet für die Erweiterung auf andere Leitstellen:
1. Füge neue Wachen in `data/stations.json` hinzu
2. Passe die Startposition in `js/game.js` an
3. Erweitere die Einsatzgenerierung auf das neue Gebiet

### Multiplayer (geplant)
- Gemeinsames Disponieren mit Freunden
- Wettbewerb um schnellste Einsatzzeiten
- Chat-Funktion zwischen Disponenten

### Weitere Features (geplant)
- Echtzeit-Wetterdaten
- Tages-/Nachtzyklen mit angepassten Einsätzen
- Statistiken und Ranglisten
- Ausbildungsmodus für echte Disponenten
- Voice-Integration für Notrufgespräche

## 📝 Projektstruktur

```
Dispatcher-Simulator/
├── index.html          # Hauptseite
├── css/
│   └── style.css       # Alle Styles
├── js/
│   ├── game.js         # Hauptspiellogik
│   ├── map.js          # Kartenverwaltung & Routing
│   ├── ai.js           # Perplexity AI Integration
│   └── incidents.js    # Einsatzgenerierung
├── data/
│   ├── stations.json   # Alle Wachen im Rems-Murr-Kreis
│   ├── vehicles.json   # Fahrzeugtypen mit Specs
│   └── keywords.json   # BW Stichwort-System
├── package.json      # NPM Konfiguration
└── README.md         # Diese Datei
```

## ❓ Häufige Fragen (FAQ)

### Das Spiel lädt nicht
- Stelle sicher, dass alle Dateien korrekt heruntergeladen wurden
- Prüfe die Browser-Console (F12) auf Fehler
- Verwende `npm start` statt direktem Öffnen der HTML-Datei

### KI-Gespräche funktionieren nicht
- Prüfe ob dein API-Key korrekt eingetragen ist
- Das Spiel funktioniert auch ohne API-Key mit Templates

### Fahrzeuge bewegen sich nicht
- Die Routenberechnung ist vereinfacht
- Für echtes Routing würde OpenRouteService API benötigt

### Kann ich eigene Einsätze erstellen?
- Ja! Bearbeite `js/incidents.js` und füge eigene Szenarien hinzu

## 👥 Mitwirken

Du möchtest das Projekt verbessern? Super!

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

## 🚑 Danksagungen

- **OpenStreetMap** für die Kartendaten
- **Leaflet.js** für die Kartenbibliothek
- **Perplexity AI** für die KI-Integration
- **BOS-Fahrzeuge.info** für Fahrzeuginformationen
- Allen Einsatzkräften im Rems-Murr-Kreis 💙

## 📧 Kontakt

Bei Fragen oder Problemen:
- GitHub Issues: [https://github.com/Polizei1234/Dispatcher-Simulator/issues](https://github.com/Polizei1234/Dispatcher-Simulator/issues)

---

**Viel Spaß beim Disponieren!** 🚨🚑🚒🚓
