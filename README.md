# ILS Waiblingen - Leitstellensimulator

## 🚑 Über das Spiel

Ein realistischer Dispatcher-Simulator für die **Integrierte Leitstelle Waiblingen** im Rems-Murr-Kreis, Baden-Württemberg.

### Features

✅ **Realistische Einsatzgebiete**
- Kompletter Rems-Murr-Kreis mit allen Städten und Gemeinden
- OpenStreetMap Integration für echte Karten
- Realistische Fahrzeiten mit Sondersignalberechnung

✅ **Alle BOS-Organisationen**
- Rettungsdienst (DRK, Malteser, ASB, JUH)
- Feuerwehr (Berufsfeuerwehr & Freiwillige Feuerwehren)
- Polizei (Polizeipräsidium Aalen - Reviere im Rems-Murr-Kreis)
- Sonstige (THW, etc.)

✅ **Realistische Fahrzeuge**
- Alle echten Fahrzeuge der Wachen im Rems-Murr-Kreis
- RTW, NEF, KTW, Feuerwehrfahrzeuge, Polizeifahrzeuge
- Basierend auf Daten von [BOS-Fahrzeuge.info](https://bos-fahrzeuge.info)

✅ **Baden-Württemberg Stichwort-System**
- RD 1, RD 2 (Rettungsdienst)
- B 1-6 (Brand)
- THL 1-4 (Technische Hilfeleistung)
- Weitere Einsatzstichwörter nach DV 100

✅ **KI-Integration (Perplexity AI)**
- Realistische Einsatzgenerierung
- Dynamische Telefongespräche mit Anrufern
- Einsatzentwicklungen und Nachforderungen
- Funkverkehr-Simulation

✅ **Spielmechanik**
- Wirtschaftssystem: Fahrzeuge kaufen mit Credits
- Einsätze bearbeiten und Credits verdienen
- Start mit einer kleinen Wache (z.B. DRK Backnang)
- Erweiterbar auf andere Leitstellen

✅ **Tutorial-System**
- Interaktives Tutorial für Einsteiger
- Vorgefertigte Textbausteine für Dispatcher
- Funkverkehr mit Textbausteinen

## 🎮 Installation & Spielen

### Lokal spielen

1. Repository klonen oder herunterladen:
   ```bash
   git clone https://github.com/Polizei1234/Dispatcher-Simulator.git
   cd Dispatcher-Simulator
   ```

2. `index.html` im Browser öffnen:
   - Doppelklick auf `index.html`
   - Oder mit lokalem Webserver (empfohlen):
     ```bash
     # Python 3
     python -m http.server 8000
     # Dann im Browser: http://localhost:8000
     ```

3. **Optional**: Perplexity API Key eintragen
   - In den Einstellungen API Key eingeben
   - Für KI-generierte Einsätze und Telefongespräche

## ⚙️ Konfiguration

### Spielgeschwindigkeit
- Echtzeit (1:1)
- 2x, 5x, 10x, 30x beschleunigt
- Einstellbar im Einstellungsmenü

### API Integration

Für KI-Features (optional):
1. Perplexity API Key bei [Perplexity.ai](https://www.perplexity.ai) erstellen
2. Im Spiel unter Einstellungen eintragen
3. Modell: `sonar`

**Hinweis**: Ohne API Key funktioniert das Spiel mit vordefinierten Einsätzen.

## 📋 Spielanleitung

### Spielstart
1. **Neues Spiel** starten oder **Tutorial** durchspielen
2. Du startest mit einer kleinen Wache (z.B. DRK Backnang)
3. Startkapital: 50.000 €
4. Erste Fahrzeuge: 1 RTW, 1 NEF

### Einsätze bearbeiten
1. **Notruf annehmen**: Telefongespräch führen
2. **Stichwort vergeben**: Nach BW-System (z.B. RD 2, B 3)
3. **Fahrzeuge alarmieren**: Passende Einsatzmittel auswählen
4. **Einsatz überwachen**: Status verfolgen
5. **Nachforderungen**: Bei Bedarf weitere Kräfte alarmieren

### Fahrzeuge kaufen
- Im Shop nur **reale Fahrzeuge** der Wachen kaufbar
- Fahrzeuge kosten je nach Typ:
  - RTW: ~195.000 €
  - NEF: ~120.000 €
  - KTW: ~80.000 €
  - Feuerwehr: variabel

### Credits verdienen
- Pro abgeschlossenem Einsatz
- Bonus für schnelle Reaktion
- Bonus für korrekte Disposition

## 🗺️ Einsatzgebiet

**Rems-Murr-Kreis** - Alle Städte und Gemeinden:
- Waiblingen, Winnenden, Schorndorf, Backnang
- Fellbach, Weinstadt, Kernen, Korb
- Murrhardt, Welzheim, Rudersberg
- Und alle weiteren 31 Gemeinden

## 🏥 Rettungswachen (DRK)

1. **RW Waiblingen** (Lehrrettungswache)
   - 1 NEF 24/7
   - 1 RTW 24/7 + 1 RTW 12h
   - 4 KTW

2. **RW Backnang** (Lehrrettungswache)
   - 1 NEF 24/7
   - 1 RTW 24/7 + 1 RTW 12h

3. **RW Winnenden**
   - 1 RTW 24/7

4. **RW Schorndorf**
   - 1 RTW 24/7
   - KTW

5. **RW Fellbach**
   - 2 RTW 24/7

6. **RW Murrhardt**
   - 1 RTW 24/7

7. **RW Rudersberg**
   - 1 RTW

8. Weitere Wachen in Weinstadt, Welzheim, etc.

## 🚒 Feuerwehren

Alle Freiwilligen Feuerwehren im Rems-Murr-Kreis mit realistischen Fahrzeugen:
- LF 10, LF 16, LF 20
- DLK 23, TLF 16/25, TLF 20/40
- RW, GW-L, KdoW

## 🚓 Polizei

Polizeipräsidium Aalen - Dienststellen im Rems-Murr-Kreis:
- Polizeirevier Backnang
- Polizeirevier Waiblingen
- Polizeirevier Winnenden
- Polizeiposten

## 🎯 Geplante Features

- [ ] Multiplayer-Modus
- [ ] Weitere Leitstellen (ILS Stuttgart, ILS Ludwigsburg)
- [ ] Statistiken und Auswertungen
- [ ] Ereignislog exportieren
- [ ] Erweiterte KI-Funktionen (Voice)
- [ ] MANV-Szenarien (Massenanfall von Verletzten)
- [ ] Katastrophenschutz-Einsätze

## 🛠️ Technologie

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Karte**: Leaflet.js + OpenStreetMap
- **Routing**: OpenRouteService API
- **KI**: Perplexity AI (sonar)
- **Daten**: JSON-basiert

## 📝 Lizenz

Dieses Projekt ist für private, nicht-kommerzielle Nutzung bestimmt.

## 🙏 Danksagungen

- [BOS-Fahrzeuge.info](https://bos-fahrzeuge.info) für Fahrzeugdaten
- DRK Rems-Murr e.V. für öffentliche Informationen
- OpenStreetMap Contributors
- Perplexity AI

## 📧 Kontakt

Bei Fragen oder Problemen: GitHub Issues erstellen

---

**Viel Erfolg beim Disponieren! 🚑🚒🚓**