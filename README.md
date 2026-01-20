# 🚑 ILS Waiblingen - Leitstellensimulator

**Dispatcher-Simulator für den Rems-Murr-Kreis**

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📍 Über das Projekt

Ein realistischer Leitstellensimulator mit **echten Daten** aus dem Rems-Murr-Kreis:

- ✅ **35 echte Wachen** (Rettungswachen, Notarztwachen, Ortsvereine)
- ✅ **90+ echte Fahrzeuge** (RTW, NEF, KTW, Kdow, GW-San)
- ✅ **Korrekte Funkrufnamen** nach Digitalfunkatlas BW 2023
- ✅ **Pixel-Art Icons** für alle Wachen und Fahrzeuge auf der Karte
- ✅ **KI-generierte Einsätze** mit Groq API (Llama 3.3)
- ✅ **Draggable Telefonfenster** für realistische Notrufabfrage

## 🗺️ Wachen im Rems-Murr-Kreis

### Hauptamtliche Rettungswachen (7)

| ID | Name | Ort | Fahrzeuge |
|----|------|-----|----------|
| RW1 | Rettungswache Waiblingen | Waiblingen | 8 (Kdow, NEF, 2x RTW, 4x KTW) |
| RW2 | Rettungswache Backnang | Backnang | 7 (Kdow, NEF, 2x RTW, 3x KTW) |
| RW3 | Rettungswache Fellbach | Fellbach | 1 (RTW) |
| RW4 | Rettungswache Murrhardt | Murrhardt | 1 (RTW) |
| RW5 | Rettungswache Schorndorf | Schorndorf | 7 (NEF, 2x RTW, 4x KTW) |
| RW6 | Rettungswache Welzheim | Welzheim | 3 (NEF, 2x RTW) |
| RW7 | Rettungswache Winnenden | Winnenden | 1 (RTW) |

### Notarztwachen (2)

- **Klinikum Winnenden** - 2 NEF
- **Murrhardt** - 2 NEF

### Privatanbieter (10)

- RW10: Saniteam Winkler Fellbach
- RW11: ASB Waiblingen
- RW13: Rems Murr Ambulanz
- RW14+20: SAG/Brüder
- RW15: Ambulanz Schütt
- RW16: MHD Sulzbach
- RW17: MHD Hertmannsweiler
- RW19: JUH Aspach
- RW20: JUH Schorndorf
- RW21: DECEBA

### Ortsvereine (17)

- Aspach, Backnang, Burgstetten, Kernen, Oppenweiler, Plüderhausen
- Remshalden, Rudersberg, Schorndorf, Urbach, Waiblingen
- Weinstadt, Wieslauftal, Winnenden, Winterbach, MHD Winnenden

## 🚗 Fahrzeugtypen

| Typ | Anzahl | Funkkennung | Farbe (Pixel Art) |
|-----|--------|-------------|-------------------|
| **RTW** | ~25 | 83/X | Rot (#dc3545) |
| **NEF** | ~10 | 82/X | Gelb (#ffc107) |
| **KTW** | ~50 | 85/X oder 25/X | Grün (#28a745) |
| **Kdow** | 3 | 10/X | Türkis (#17a2b8) |
| **GW-San** | 1 | 28/X | Grau (#6c757d) |

## 🎮 Spielmodi

### 🏆 Karrieremodus

- **Startkapital**: 50.000 €
- **Startfahrzeuge**: 6 Fahrzeuge in Waiblingen/OV Waiblingen
  - 1x Kdow (RW1)
  - 1x NEF (Klinikum Winnenden)
  - 2x RTW (RW1)
  - 1x KTW (OV Waiblingen)
- **Ziel**: Geld verdienen durch Einsätze, neue Wachen und Fahrzeuge kaufen

### ♾️ Freimodus

- **Alle 90+ Fahrzeuge** sofort verfügbar
- **Unbegrenztes Geld**
- Perfekt zum Experimentieren!

## 🤖 KI-Features

### Groq API Integration

- **Modell**: Llama 3.3 70B Versatile
- **Einsatzgenerierung**: Jeder Einsatz wird dynamisch mit KI erstellt
- **Notrufgespräche**: Realistische Dialoge mit aufgeregten Anrufern
- **API-Key**: Kostenlos auf [console.groq.com](https://console.groq.com/keys)

### Beispiel-Notruf

```
Disponent: "Notruf 112, wo genau ist der Notfall?"
Anrufer: "Hilfe! Mein Vater liegt am Boden und atmet kaum noch!"
Disponent: "Wo befinden Sie sich genau?"
Anrufer: "Bahnhofstraße 15 in Waiblingen!"
[...]
```

## 🗺️ Pixel-Art Icons

### Wachen-Icons

- **Rettungswache** (Rot): Gebäude mit weißem Kreuz
- **Notarztwache** (Gelb): Gebäude mit Kreuz
- **Ortsverein** (Rot): Kleineres Gebäude

### Fahrzeug-Icons

- **RTW/NEF**: Rettungswagen mit Blaulicht (Rot/Gelb)
- **KTW**: Kleinerer Transporter (Grün)
- **Kdow**: PKW-Form (Türkis)
- **GW-San**: Großes Fahrzeug (Grau)

Alle Icons sind **animiert** und haben **Hover-Effekte**!

## 🛠️ Installation

```bash
# Repository klonen
git clone https://github.com/Polizei1234/Dispatcher-Simulator.git
cd Dispatcher-Simulator

# Mit Live Server öffnen (VSCode Extension)
# ODER einfach index.html im Browser öffnen
```

## ⚙️ Einstellungen

- **Spielgeschwindigkeit**: 1x - 30x (Klick auf "5x" im Header)
- **Groq API-Key**: Für KI-Einsätze
- **Sound**: Ein/Aus

## 🎯 Steuerung

1. **Notruf annehmen**: Auf blinkenden Anruf klicken
2. **Telefonieren**: Fragen stellen, Adresse ermitteln
3. **Protokoll schreiben**: Während Telefonat möglich!
4. **Fahrzeuge alarmieren**: Checkboxen auswählen → Alarmieren
5. **Karte**: Wachen-Button zum Ein/Ausblenden der Standorte

## 📊 Technische Details

- **Framework**: Vanilla JavaScript (ES6+)
- **Karte**: Leaflet.js + OpenStreetMap
- **KI**: Groq API (Llama 3.3)
- **Icons**: Pixel-Art SVG (32x32 / 24x24)
- **Daten**: `stations.json` + `vehicles.json`

## 📝 Funkrufnamen (Digitalfunkatlas BW)

### DRK Rettungswachen
```
Rotkreuz Rems Murr [Wache]/[Kennung]-[Nummer]

Beispiele:
- Rotkreuz Rems Murr 1/82-2    (NEF RW1)
- Rotkreuz Rems Murr 1/83-2    (RTW RW1)
- Rotkreuz Rems Murr 1/85-2    (KTW RW1)
- Rotkreuz Rems Murr 1/10-1    (Kdow RW1)
```

### Andere Organisationen
```
- Sama Rems Murr 11/83-1       (ASB RTW)
- Johannes Rems Murr 16/83-1   (MHD RTW)
- Akkon Rems Murr 19/83-1      (JUH RTW)
- Sani Team 10/85-1            (Saniteam KTW)
```

### Ortsvereine (Ehrenamt)
```
- KTW [ORT]/25-[Nummer]

Beispiele:
- KTW WN/25-1     (OV Waiblingen)
- KTW PLÜ/25-1    (OV Plüderhausen)
- KTW OPP/25-1    (OV Oppenweiler)
```

## 🚀 Roadmap

- [ ] OpenStreetMap Routing für Fahrzeuge
- [ ] Echtzeit-Uhr mit Schichtsystem
- [ ] Statistiken & Highscores
- [ ] Multiplayer-Modus
- [ ] Feuerwehr & Polizei Integration
- [ ] Mobile Version (PWA)

## 📜 Lizenz

MIT License - Siehe [LICENSE](LICENSE)

## 🙏 Credits

- **Daten**: Rems-Murr-Kreis, [BOS-Fahrzeuge.info](https://www.bos-fahrzeuge.info)
- **Funkrufnamen**: Digitalfunkatlas Baden-Württemberg 2023
- **KI**: Groq API (Llama 3.3)
- **Karte**: OpenStreetMap, Leaflet.js

---

**Entwickelt mit ❤️ für den Rems-Murr-Kreis**