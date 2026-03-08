Du arbeitest am Repository "Dispatcher-Simulator".

WICHTIGE GRUNDREGELN:
- Arbeite extrem strukturiert.
- Nichts überstürzt umbauen.
- Keine parallelen, konkurrierenden Architekturen stehen lassen.
- Stabilität vor neuen Features.
- Nach jeder großen Änderung immer erneut testen.
- Dokumentation immer direkt mitpflegen.
- Bestehende Docs lesen und konsolidieren, nicht einfach neue widersprüchliche Docs erzeugen.
- Alles so umsetzen, dass es FRAMEWORK-READY bleibt bzw. wird.
- Keine unnötigen Globals, keine versteckten Kopplungen, keine kaputten Migrationsreste.
- Wenn eine neue Struktur eingeführt wird, müssen alte Pfade/Initialisierungen sauber entfernt oder kompatibel adaptiert werden.
- Wenn du Zweifel hast, entscheide zugunsten von Stabilität, Einfachheit und klarer Architektur.

NICHT VERGESSEN:
Dieses Projekt ist aktuell instabil. Das Spiel lädt im Moment offenbar nicht einmal bis zur Willkommensseite. Das ist der erste und wichtigste Fix.

==================================================
0. ZIELBILD
==================================================

Am Ende muss gelten:

A. Die App startet zuverlässig.
B. Die Willkommensseite ist sichtbar.
C. Ein Spielstart ist möglich.
D. Die Haupt-Tabs funktionieren.
E. Die Karte wird angezeigt.
F. Zentrale Buttons funktionieren.
G. Notrufsystem, Einsatzsystem, Fahrzeugsystem und Funksystem sind wieder verbunden.
H. Die App ist strukturell sauberer und framework-ready.
I. Build-/Hosting-/Pfad-Struktur ist eindeutig.
J. Neue KI-Struktur ist sauber vorbereitet bzw. implementiert:
   - Ollama primär
   - Gemini Fallback
   - lokale Templates letzter Fallback
K. Bestehende und neue Datenstrukturen sind klar und dokumentiert.
L. Datenquellen wie POIs sind so vorbereitet, dass sie später sauber aus Datenbanken kommen können.
M. Alle Änderungen sind dokumentiert.
N. Es gibt einen Abschlussbericht mit Bugs, Fixes, Risiken und nächsten Schritten.

==================================================
1. ZWINGENDE REIHENFOLGE
==================================================

Du MUSST in dieser Reihenfolge arbeiten:

1. App-Boot und Laden reparieren
2. Hosting-/Build-/Ordnerstruktur vereinheitlichen
3. Startfluss und UI-Grundfunktionen reparieren
4. Alle Kernsysteme komplett testen und fixen
5. Systemverknüpfungen prüfen und härten
6. Framework-ready Struktur absichern
7. Neue KI-/Template-/Fallback-Struktur integrieren
8. Datenarchitektur für POIs/Ortsdaten vorbereiten
9. Dokumentation aktualisieren
10. Abschlussprüfung mit Bericht

Wenn ein früherer Schritt nicht stabil ist:
- NICHT mit späteren Schritten weitermachen.
- Erst zurückgehen und stabilisieren.

==================================================
2. PHASE 1 — APP BOOT WIEDERHERSTELLEN
==================================================

Ziel:
Die App muss wieder mindestens bis zur Willkommensseite laden.

Pflichtprüfung:
- index.html
- Script-Reihenfolge
- CSS-Reihenfolge
- DOMContentLoaded / allScriptsLoaded
- main.js
- game.js
- bridge.js
- startup-test.js
- debug-menu.js
- eventuelle neue framework-ready Bootstraps
- globale Abhängigkeiten
- defekte Imports/Exports
- Zugriff auf nicht definierte Variablen
- fehlerhafte DOM-Referenzen
- Syntaxfehler

Prüfe außerdem:
- ob alte direkte Script-Includes und neue modulare Struktur miteinander kollidieren
- ob durch den framework-ready Umbau ein unvollständiger Hybridzustand entstanden ist
- ob Komponenten initialisiert werden, bevor ihre Voraussetzungen geladen sind
- ob neue Dateien erstellt wurden, aber nicht korrekt eingebunden sind
- ob alte Dateien noch referenziert werden, obwohl sie ersetzt wurden

Stop-Kriterium dieser Phase:
- Welcome Screen erscheint
- keine fatalen JS-Startfehler
- mindestens ein Hauptbutton reagiert
- Ursache des Totalausfalls identifiziert und behoben

==================================================
3. PHASE 2 — HOSTING / BUILD / ORDNERSTRUKTUR VEREINHEITLICHEN
==================================================

Aktuell besonders kritisch:
- Root-Struktur existiert
- firebase.json kann auf public zeigen
- webpack kann nach dist bauen
- es darf NICHT mehrere konkurrierende Webroots geben

Deine Aufgabe:
1. Analysiere Root, public, dist vollständig.
2. Entscheide dich für EINE produktive Webroot-Strategie.
3. Entferne oder konsolidiere konkurrierende Strukturen.
4. Vermeide doppelte index-Dateien, doppelte Assets und tote Pfade.
5. Stelle sicher, dass Firebase-Hosting, lokales Serving und Buildflow logisch zusammenpassen.

Regel:
- Wenn das Projekt historisch und praktisch im Root läuft, dann Root bevorzugen.
- Wenn public nur Duplikate enthält, entferne oder konsolidiere sie.
- dist nur als Build-Artefakt nutzen, wenn der Flow sauber ist.
- Nie public, root und dist gleichzeitig als “eigentliche App” behandeln.

Framework-ready Hinweis:
Eine klare, eindeutige Hosting-Struktur ist Pflicht, damit spätere Migrationen auf React/Vue/Firebase Hosting oder Build-Pipelines nicht wieder an Pfadkonflikten scheitern.

Stop-Kriterium:
- eine klar dokumentierte Webroot
- keine unnötigen Duplikate
- keine widersprüchlichen Asset-Pfade
- Hosting-Config passt zur realen App-Struktur

==================================================
4. PHASE 3 — STARTFLUSS UND UI-GRUNDFUNKTIONEN
==================================================

Prüfe und repariere vollständig:
- Welcome Screen
- Freies Spiel
- Tutorial
- Einstellungen
- Pause
- Header-Infos
- Versionsanzeige
- Time/Weather/Speed-Anzeigen
- Tab-Wechsel Karte/Fahrzeuge/Notruf
- Sichtbarkeit der Container
- Buttons allgemein
- Dropdowns
- Modals/Overlays
- Draggable-Elemente
- Radio-Panel öffnen/schließen
- Debug-Menü

Wichtig:
Wenn Buttons nicht funktionieren, prüfe gezielt:
- Inline-onclick vs neue Event-Delegation
- falsche Namensräume
- fehlende globale Referenzen
- Event-Handler-Reihenfolge
- DOM-Element-IDs / class names
- falsch initialisierte Controller

Framework-ready Hinweis:
- Wenn du Event-Handling reparierst, nutze möglichst zentrale oder gekapselte Event-Registrierung.
- Keine neuen Inline-onclicks hinzufügen.
- Nur dort Legacy belassen, wo es für Stabilität vorübergehend zwingend nötig ist; dann dokumentieren.

Stop-Kriterium:
- Welcome Screen komplett benutzbar
- Spielstart möglich
- Tabs funktionieren
- Hauptbuttons reagieren zuverlässig

==================================================
5. PHASE 4 — KARTE, EINSÄTZE, FAHRZEUGE
==================================================

Prüfe und repariere:
A. Karte
- Leaflet lädt
- Map-Container sichtbar
- Karte rendert korrekt
- Zentrieren funktioniert
- Stations-Toggle funktioniert
- Marker sichtbar
- Einsatzmarker korrekt
- Fahrzeugmarker korrekt
- keine JS-Fehler bei fehlenden Positionsdaten
- kein kaputter Resize-/Hidden-Container-Bug nach Tabwechsel

B. Einsätze
- Incident-Liste rendert
- Incident-Details rendert
- Auswahl eines Einsatzes funktioniert
- UI wird bei neuen Einsätzen aktualisiert
- keine Dubletten
- keine Null-Referenzen
- Abschluss-/Statuslogik konsistent

C. Fahrzeuge
- Fahrzeugliste rendert
- Statusanzeige korrekt
- FMS/Farbcodes korrekt
- Auswahl funktioniert
- Disposition funktioniert
- Statuswechsel funktionieren
- Rückkehr / Verfügbarkeit funktioniert
- Verbindung zu Einsatz und Funk korrekt

Prüfe Ende-zu-Ende:
- neuer Einsatz -> Liste -> Detail -> Fahrzeug zuweisen -> Fahrzeugstatus -> Funktrigger -> Folgeänderungen

Framework-ready Hinweis:
- UI-Rendering nach Möglichkeit über klar definierte Render- oder Component-Schichten führen
- State-Änderungen und UI-Updates nicht chaotisch in vielen Dateien duplizieren
- keine versteckten direkten Mutationen ohne nachvollziehbaren Flow

Stop-Kriterium:
- Karte sichtbar
- mindestens ein Einsatz sauber dargestellt
- mindestens ein Fahrzeug sauber disponierbar
- UI aktualisiert sich konsistent

==================================================
6. PHASE 5 — NOTRUF UND FUNK KOMPLETT PRÜFEN
==================================================

Prüfe und repariere vollständig:

Notruf:
- eingehender Call in Sidebar
- Anruf annehmen
- Gesprächsansicht
- Fragenbuttons
- Antwortenanzeige
- Call-History / Call-State
- Auflegen
- kein Überschreiben aktiver Calls
- keine kaputten Queues
- Manual Incident Anbindung
- Übergang vom Call zum Einsatz

Funk:
- Funkpanel öffnen
- Queue
- Badge
- automatische Funksprüche
- manuelle Funksprüche
- Trigger aus EventBridge / Einsatz / Fahrzeugstatus
- Throttling
- kein Spam
- keine doppelten Trigger
- keine verlorenen Events

Ende-zu-Ende-Test:
- Anruf kommt rein
- Gespräch läuft
- Einsatz entsteht
- Fahrzeug wird disponiert
- Funk reagiert
- Statusänderung erzeugt passende Folgekommunikation

Framework-ready Hinweis:
- Call-State, Incident-State und Radio-State müssen klar getrennt, aber sauber verbunden sein
- nicht mehrere konkurrierende State-Quellen pflegen
- Events müssen nachvollziehbar und dokumentiert sein

Stop-Kriterium:
- mindestens ein vollständiger Notruf-zu-Einsatz-zu-Fahrzeug-zu-Funk-Flow funktioniert

==================================================
7. PHASE 6 — SYSTEMVERKNÜPFUNGEN HÄRTEN
==================================================

Jetzt nicht nur Einzelteile prüfen, sondern die Gesamtarchitektur.

Prüfe Verknüpfungen:
- CallSystem <-> ConversationEngine
- CallSystem <-> ManualIncidentUI
- CallSystem <-> Incident-Erstellung
- IncidentManager <-> IncidentComposer
- Vehicle-System <-> Incident-Zuweisung
- VehicleMovement <-> Map
- EventBridge <-> EscalationSystem
- EventBridge <-> RadioSystem
- SettingsManager <-> Runtime-Systeme
- Theme/UI/Tabs <-> aktive Container
- Debug/Startup Tests <-> reale Initialisierung

Wenn alt und neu parallel existieren:
- entscheiden, welches System führend ist
- Adapter bauen, wenn nötig
- Reste der alten Mischarchitektur beseitigen oder sauber markieren

Framework-ready Hinweis:
- lose Kopplung beibehalten
- EventBridge sinnvoll nutzen
- keine impliziten Seiteneffekte
- möglichst klarer Datenfluss
- keine zufälligen window-Abhängigkeiten, wenn vermeidbar

Stop-Kriterium:
- keine kritischen Brüche zwischen Kernsystemen
- klare Verantwortlichkeiten

==================================================
8. PHASE 7 — FRAMEWORK-READY ABSICHERUNG
==================================================

Das Projekt soll framework-ready sein und nicht wieder in einen instabilen Mischzustand rutschen.

Pflichtprinzipien:
- keine neuen Inline-Handler
- Event-Handling möglichst zentral
- möglichst keine unnötigen globalen Variablen
- keine konkurrierenden Entry-Points
- klarer Bootstrap
- klare Modulgrenzen
- UI-Schichten nicht wild mit Business-Logik vermischen
- State möglichst kontrolliert
- Datenstrukturen explizit dokumentieren
- Fehlerbehandlung zentraler und robuster machen

WICHTIG:
Wenn neue framework-ready Dateien vorhanden sind, aber die App blockieren:
- nicht dogmatisch erzwingen
- Stabilität zuerst
- dann sauber integrieren oder temporär adaptieren
- am Ende keine halbfertige Mischlösung hinterlassen

Achte speziell auf:
- State-Management
- Component-/Render-Logik
- Event-System
- modulare Services
- Adapter zwischen Legacy und neuer Struktur

==================================================
9. PHASE 8 — KI-ARCHITEKTUR NEU AUFBAUEN
==================================================

Ziel:
Einsatz- und Gesprächsgenerierung robust, fallback-sicher und erweiterbar machen.

Pflichtreihenfolge:
1. Ollama als primärer Provider
2. Gemini als Fallback
3. lokale Templates als finaler Fallback

Erstelle dafür eine saubere Provider-Abstraktion:
- einheitliches Interface
- Timeouts
- Retries
- Logging
- Validierung
- Fehlerklassifikation
- keine UI-Blockade

Verarbeitung absichern gegen:
- leere Antworten
- kaputte JSON-/Objektantworten
- abgeschnittene Antworten
- falsche Felder
- unlogische Szenarien
- sprachlich unpassende Inhalte
- zu lange Antworten
- unbrauchbare medizinische Fachsprache
- fehlende Pflichtfelder

Wichtig:
Wenn externe KI ausfällt, darf das Spiel NIEMALS stehen bleiben.
Immer lokaler Fallback.

Framework-ready Hinweis:
- KI-Provider nicht direkt tief im UI verankern
- als Service-Schicht kapseln
- Datenschema standardisieren
- keine provider-spezifischen Sonderfälle überall im Code verteilen

==================================================
10. PHASE 9 — TEMPLATE- UND DATENMODELL-BEREINIGUNG
==================================================

Prüfe und bereinige:
- alte Einsatz-Templates
- Call-Templates
- Antwortpools
- Mapper
- Incident-Typen
- Modifier
- Severity-Bases
- KI-Validierungslogik
- Eskalationsdaten
- Funktexte

Suche nach:
- Dubletten
- Widersprüchen
- ungenutzten Dateien
- falschen Feldnamen
- impliziten Magic Strings
- Daten, die nicht mehr zu den aktuellen Flows passen
- unrealistischen oder unstimmigen Vorlagen

Ziel:
Ein sauberes, dokumentiertes, möglichst einheitliches Datenschema.

Framework-ready Hinweis:
Datenmodelle müssen stabil und explizit sein, damit sie später leicht aus APIs, Firestore, JSON-Dateien oder anderen Quellen gespeist werden können.

==================================================
11. PHASE 10 — DATENBANK-/DATENQUELLEN-VORBEREITUNG (POIS, ORTE, ETC.)
==================================================

WICHTIG:
Berücksichtige ausdrücklich, dass wir bereits über Datenbanken für POIs, Orte, Einrichtungen usw. gesprochen haben.

Du sollst jetzt die App so vorbereiten, dass ortsbezogene Daten später sauber aus einer Datenquelle kommen können.

Konkret vorbereiten:
- POIs
- Krankenhäuser
- Wachen
- Orts-/Adressreferenzen
- besondere Einsatzorte
- ggf. relevante geographische Metadaten
- später auch ggf. Kategorien/Regionen/Hotspots

Architekturvorgabe:
1. Trenne statische Logik von Datenquellen
2. Schaffe eine klare Datenzugriffsschicht / Repository / Service-Layer
3. Heute dürfen Daten noch lokal aus JS/JSON kommen
4. Morgen müssen sie austauschbar aus einer Datenbank kommen können

Datenbank-Hinweise:
- Für strukturierte App-Daten ist Firestore grundsätzlich geeignet
- Für geographische Referenzen/POIs kann auch eine kombinierte Lösung sinnvoll sein:
  - lokale Seed-Dateien / JSON
  - Firestore für kuratierte Simulationsdaten
  - externe Quellen oder Import-Pipelines für größere POI-Datensätze
- Architektur jetzt so bauen, dass Datenquelle austauschbar ist:
  - LocalPoiRepository
  - FirestorePoiRepository
  - ggf. ImportedGeoDatasetRepository

Pflicht:
- Kein hart verdrahteter Wildwuchs von Ortsdaten in 20 Dateien
- keine verstreuten Magic Coordinates
- Hotspots sauber kapseln
- Datenmodelle dokumentieren
- klare Repository-/Service-Grenzen

Framework-ready Hinweis:
Saubere Datenzugriffsschichten sind essenziell für spätere Framework-Migration und Backend-/DB-Anbindung.

==================================================
12. PHASE 11 — SELBSTTESTS NACH JEDEM GROSSEN SCHRITT
==================================================

Nach jedem größeren Änderungspaket zwingend testen:

Smoke-Test-Minimum:
1. App lädt
2. Welcome Screen sichtbar
3. Spielstart möglich
4. Tabs schaltbar
5. Karte sichtbar
6. mind. ein Einsatz/Call testbar
7. mind. ein Fahrzeug-Flow testbar
8. Funkpanel öffnet
9. Konsole auf Fehler prüfen

Wenn ein Smoke-Test fehlschlägt:
- sofort Fix
- nicht einfach weitermachen

Wenn sinnvoll:
- kleine technische Smoke-Checks ergänzen
- Startup-Test verbessern
- Debug-Hooks erweitern
Aber:
- keine Produktiv-UI vermüllen
- alles dokumentieren

==================================================
13. PHASE 12 — DOKUMENTATION
==================================================

Bestehende Dokumentation beachten und konsolidieren.
Nicht unnötig zehn neue Dateien anlegen, wenn Aktualisierung sinnvoller ist.

Mindestens dokumentieren:
1. Ursache des Totalausfalls
2. Hosting-/Build-/Webroot-Entscheidung
3. aktuelle Start-/Bootstrap-Architektur
4. Framework-ready Leitlinien
5. KI-Provider-Architektur
6. Template-/Datenschema
7. Datenquellen-/POI-Architektur
8. Test-Checkliste
9. verbleibende Risiken

Wenn nötig neue technische Docs unter docs/technical erstellen.
Bestehende Docs gezielt aktualisieren, wenn sie betroffen sind.

==================================================
14. PHASE 13 — CLEANUP
==================================================

Suche explizit und systematisch nach:
- doppelten Funktionen
- ungenutzten Dateien
- alten Bundles
- konkurrierenden index-Dateien
- kaputten Script-Referenzen
- ungenutzten CSS-Dateien
- Legacy-Dateien ohne Zweck
- ungenutzten KI-Integrationen
- toten Repository-/Service-Entwürfen
- widersprüchlichen Docs
- doppelten Asset-Strukturen (root/public/dist)

Nicht blind löschen.
Nur sicher entfernen oder sauber kennzeichnen.

==================================================
15. ABSCHLUSSBERICHT — PFLICHTFORMAT
==================================================

Am Ende liefere:
1. Executive Summary
2. Liste der kritischen gefixten Bugs
3. Liste der Hosting-/Struktur-Entscheidungen
4. Liste der geänderten Dateien
5. Liste der geprüften Kernfunktionen
6. Liste der framework-ready Verbesserungen
7. Liste der Datenarchitektur-/POI-Vorbereitungen
8. Liste der verbleibenden Risiken
9. Liste der empfohlenen nächsten Schritte

WICHTIG:
Schreibe klar, was wirklich fertig ist und was nur vorbereitet ist.
Nichts beschönigen.
Keine unfertigen Baustellen als “vollständig gelöst” ausgeben.
