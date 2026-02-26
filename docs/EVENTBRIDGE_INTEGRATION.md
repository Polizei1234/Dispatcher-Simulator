# 🌉 EventBridge - Bidirektionale System-Kommunikation

## Übersicht

Die **EventBridge** ermöglicht bidirektionale Kommunikation zwischen allen Systemen im Dispatcher-Simulator. Jedes System kann Events feuern, die automatisch Funksprüche, UI-Updates und andere Aktionen triggern.

---

## 🎯 Features

### ✅ **Vollständig implementiert:**

1. **Event-basierte Architektur**
   - Systeme kommunizieren über Events, nicht direkt
   - Lose Kopplung zwischen Modulen
   - Einfach erweiterbar

2. **Automatische Funksprüche**
   - Jedes kritische Event triggert automatisch Funkspruch
   - KI-generiert oder Fallback-Templates
   - Realistische Funkkommunikation

3. **Alle Event-Typen unterstützt:**
   - Escalation Events (NEF, Backup, Kritisch)
   - Medical Events (Patient kritisch, Reanimation, Stabilisiert)
   - Incident Events (Komplikation, Abbruch)
   - Vehicle Events (bereits in VehicleMovement)

---

## 🛣️ Architektur

```
EscalationSystem          VehicleMovement          Andere Systeme
       |                         |                         |
       v                         v                         v
   [Event]                   [Event]                   [Event]
       |                         |                         |
       +-------------------------+-------------------------+
                                 |
                                 v
                         🌉 EventBridge
                                 |
                   +-------------+-------------+
                   |             |             |
                   v             v             v
              RadioSystem    UI Updates    Statistiken
                   |
                   v
            Automatischer
             Funkspruch
```

---

## 📡 Event-Typen

### 1️⃣ **ESCALATION EVENTS**

#### `escalation:started`
**Wann:** Einsatz eskaliert (MINOR → MODERATE → CRITICAL)

```javascript
window.eventBridge.emit('escalation:started', {
    incident: incident,
    vehicle: vehicle,
    oldSeverity: 'MINOR',
    newSeverity: 'MODERATE',
    reason: 'Patientenzustand verschlechtert'
});
```

**Triggert:** Funkspruch mit Eskalationsmeldung

---

#### `escalation:nef_required`
**Wann:** NEF wird dringend benötigt

```javascript
window.eventBridge.emit('escalation:nef_required', {
    incident: incident,
    vehicle: vehicle,
    reason: 'Patient kritisch',
    urgency: 'high'
});
```

**Funkspruch-Beispiel:**
> *"RTW 12/83-1 an Leitstelle, fordern dringend NEF nach, Patient kritisch, kommen"*

---

#### `escalation:backup_required`
**Wann:** Zusätzliche Fahrzeuge werden benötigt

```javascript
window.eventBridge.emit('escalation:backup_required', {
    incident: incident,
    vehicle: vehicle,
    reason: 'Weitere Patienten vor Ort',
    vehicleType: 'RTW' // oder 'KTW'
});
```

**Funkspruch-Beispiel:**
> *"RTW 45/1 an Leitstelle, fordern RTW zur Verstärkung nach, weitere Patienten vor Ort, kommen"*

---

#### `escalation:critical`
**Wann:** Einsatz wird CRITICAL

```javascript
window.eventBridge.emit('escalation:critical', {
    incident: incident,
    vehicle: vehicle,
    oldSeverity: 'MODERATE',
    newSeverity: 'CRITICAL'
});
```

**Funkspruch-Beispiel:**
> *"NEF 71/1 an Leitstelle, Lageverschlechterung, Einsatz eskaliert auf kritisch, kommen"*

---

### 2️⃣ **MEDICAL EVENTS**

#### `medical:patient_critical`
**Wann:** Patient ist in kritischem Zustand

```javascript
window.eventBridge.emit('medical:patient_critical', {
    incident: incident,
    vehicle: vehicle,
    symptoms: 'Bewusstlosigkeit, Atemnot'
});
```

**Funkspruch-Beispiel:**
> *"RTW 23/1 an Leitstelle, Patient kritisch, Bewusstlosigkeit und Atemnot, benötigen Notarzt, kommen"*

---

#### `medical:resuscitation`
**Wann:** Reanimation läuft

```javascript
window.eventBridge.emit('medical:resuscitation', {
    incident: incident,
    vehicle: vehicle
});
```

**Funkspruch-Beispiel:**
> *"RTW 12/83-1 an Leitstelle, beginnen mit Reanimation, Notarzt dringend erforderlich, kommen"*

---

#### `medical:patient_stabilized`
**Wann:** Patient wurde erfolgreich stabilisiert

```javascript
window.eventBridge.emit('medical:patient_stabilized', {
    incident: incident,
    vehicle: vehicle
});
```

**Funkspruch-Beispiel:**
> *"NEF 71/1 an Leitstelle, Patient stabilisiert, Vitalparameter im Normbereich, kommen"*

---

### 3️⃣ **INCIDENT EVENTS**

#### `incident:complication`
**Wann:** Komplikation am Einsatzort

```javascript
window.eventBridge.emit('incident:complication', {
    incident: incident,
    vehicle: vehicle,
    complication: {
        type: 'additional_patient',
        effect: 'Zweiter Patient angetroffen'
    }
});
```

**Funkspruch-Beispiel:**
> *"RTW 45/1 an Leitstelle, Komplikation vor Ort, zweiter Patient angetroffen, kommen"*

---

#### `incident:canceled`
**Wann:** Einsatz wird abgebrochen

```javascript
window.eventBridge.emit('incident:canceled', {
    incident: incident,
    vehicle: vehicle,
    reason: 'Fehlalarm'
});
```

**Funkspruch-Beispiel:**
> *"RTW 23/1 an Leitstelle, Einsatz abgebrochen, Fehlalarm, rücken ein, kommen"*

---

### 4️⃣ **VEHICLE EVENTS**

*(Bereits in VehicleMovement implementiert)*

- `vehicle:dispatch` - Fahrzeug alarmiert
- `vehicle:arrival` - Am Einsatzort
- `vehicle:departure` - Verlässt Einsatzort
- `vehicle:hospital_arrival` - Am Krankenhaus
- `vehicle:back_available` - Einsatzbereit
- `vehicle:technical_problem` - Technisches Problem

---

## 🛠️ Verwendung

### Event feuern:

```javascript
// Im EscalationSystem, VehicleMovement, etc.
if (window.eventBridge) {
    window.eventBridge.emit('escalation:nef_required', {
        incident: myIncident,
        vehicle: myVehicle,
        reason: 'Kritischer Patientenzustand',
        urgency: 'high'
    });
}
```

### Event abhören:

```javascript
// Falls du eigene Listener brauchst
window.eventBridge.on('escalation:nef_required', (event) => {
    console.log('NEF angefordert:', event.data);
    // Deine Custom-Logik
});
```

### Event-Log abrufen:

```javascript
// Alle Events
const allEvents = window.eventBridge.getEventLog();

// Gefiltert
const escalationEvents = window.eventBridge.getEventLog({
    type: 'escalation:nef_required',
    since: Date.now() - 3600000 // Letzte Stunde
});
```

### Statistiken:

```javascript
const stats = window.eventBridge.getStatistics();
console.log(`
    Total Events: ${stats.totalEvents}
    Radio Messages: ${stats.radioMessagesTriggered}
    Active Listeners: ${stats.activeListeners}
`);
```

---

## 🔄 Workflow-Beispiel

### Szenario: **Patient verschlechtert sich, NEF wird benötigt**

```
1. EscalationSystem erkennt Verschlechterung
   ↓
2. Re-komponiert Schema mit Severity CRITICAL
   ↓
3. Prüft: NEF erforderlich? → JA
   ↓
4. Feuert Event:
   eventBridge.emit('escalation:nef_required', {...})
   ↓
5. EventBridge empfängt Event
   ↓
6. Ruft handleNefRequest() auf
   ↓
7. RadioSystem.sendAutomaticMessage(vehicle, 'nef_requested', ...)
   ↓
8. RadioGroq generiert KI-Funkspruch:
   "RTW 12/83-1 an Leitstelle, fordern dringend NEF nach,
    Patient kritisch, kommen"
   ↓
9. Funkspruch erscheint in Radio-UI
   ↓
10. Leitstelle disponiert NEF
```

---

## ⚙️ Konfiguration

### Automatische Funksp rüche aktivieren/deaktivieren:

**Datei:** `js/data/automatic-radio-config.json`

```json
{
  "enabled": true,
  "triggers": {
    "nef_requested": {
      "enabled": true,
      "delay_ms": 500,
      "urgency": "high"
    },
    "backup_requested": {
      "enabled": true,
      "delay_ms": 500
    },
    "patient_critical": {
      "enabled": true,
      "delay_ms": 500,
      "urgency": "critical"
    }
  }
}
```

---

## 🐛 Debugging

### Event-Log in Console:

```javascript
// Live-Events anzeigen
window.addEventListener('game:event', (e) => {
    console.log('EVENT:', e.detail);
});

// Alle Events seit Start
console.table(window.eventBridge.getEventLog());

// Event-Statistiken
console.log(window.eventBridge.getStatistics());
```

### Prüfe ob EventBridge verfügbar:

```javascript
if (window.eventBridge) {
    console.log('✅ EventBridge verfügbar');
} else {
    console.error('❌ EventBridge nicht geladen!');
}
```

---

## 📊 Vorteile

### ✅ **Lose Kopplung**
- Systeme kennen sich nicht direkt
- Änderungen an einem System beeinflussen andere nicht
- Einfach neue Events hinzufügen

### ✅ **Skalierbarkeit**
- Beliebig viele Listener pro Event
- Events können von mehreren Systemen verarbeitet werden
- Neue Systeme einfach integrierbar

### ✅ **Realismus**
- Automatische Funksprüche bei kritischen Situationen
- Keine manuellen Triggers nötig
- Leitstelle erfährt automatisch von Problemen

### ✅ **Debugging**
- Event-Log zeigt alle Ereignisse
- Statistiken über Events & Funksp rüche
- Einfach nachvollziehbar was passiert ist

---

## 🛠️ Erweiterung

### Neues Event hinzufügen:

**1. Event in EventBridge registrieren:**

```javascript
// In event-bridge.js
this.on('my_custom_event', (event) => {
    this.handleMyCustomEvent(event);
});
```

**2. Handler implementieren:**

```javascript
handleMyCustomEvent(event) {
    const { incident, vehicle, data } = event.data;
    
    if (!window.RadioSystem) return;
    
    window.RadioSystem.sendAutomaticMessage(vehicle, 'my_trigger', {
        incident: incident,
        customData: data
    });
}
```

**3. Trigger in RadioGroq hinzufügen:**

```javascript
// In radio-groq.js buildAutomaticPrompt()
case 'my_trigger':
    triggerInstructions = `
EVENT: Beschreibung des Events
FUNKSPRUCH: Was soll gefunkt werden
BEISPIEL: "..."`;
    break;
```

**4. Config updaten:**

```json
// In automatic-radio-config.json
"my_trigger": {
  "enabled": true,
  "delay_ms": 1000,
  "vehicle_types": ["RTW"],
  "urgency": "normal"
}
```

**5. Event feuern:**

```javascript
window.eventBridge.emit('my_custom_event', {
    incident: incident,
    vehicle: vehicle,
    data: { ... }
});
```

---

## 🎯 Zusammenfassung

**JA**, Funk- und Einsatzsystem können jetzt **bidirektional in beide Richtungen** kommunizieren:

✅ **Einsatz → Funk:**
- Eskalationen triggern automatisch Funksprüche
- Komplikationen werden automatisch gefunkt
- NEF/Verstärkung wird automatisch angefordert
- Kritische Patientenzustände werden gemeldet

✅ **Funk → Einsatz:**
- Leitstelle kann auf Funksp rüche reagieren
- Fahrzeuge können Updates senden
- Statusmeldungen beeinflussen Einsatzlogik

✅ **Nicht nur Verstärkung:**
- NEF-Anforderung
- Patient kritisch
- Reanimation
- Komplikationen
- Einsatzabbruch
- Technische Probleme
- Und beliebig erweiterbar!

---

**Version:** 1.0  
**Erstellt:** 2026-01-30  
**Autor:** Polizei1234 + AI Assistant
