# 🗺️ Implementierungs-Roadmap

**Feature Branch:** `feature/zentrale-status-funksprueche`  
**Erstellt:** 30.01.2026  
**Ziel:** Zentrale Status-Verwaltung + Realistische automatische Funksprüche

---

## 🎯 Ziele

### 1️⃣ **Zentrale Status-Funktion**

**Problem:**
- `getFMSStatus()` existiert 3x (ui.js, map.js, tabs.js)
- Duplizierter Code → Fehleranfällig
- Fallback-Logik inkonsistent

**Lösung:**
```
js/utils/vehicle-status.js (NEU!)
  └─ VehicleStatusUtil.getStatus(vehicle)
     └─ SINGLE SOURCE OF TRUTH
```

**Status:** ✅ **FERTIG** (bereits committed)

---

### 2️⃣ **Automatische Funksprüche bei Einsatzevents**

**Konzept:**
Fahrzeuge senden automatisch realistische Funksprüche bei:

| Event | Trigger | Beispiel-Funkspruch |
|-------|---------|---------------------|
| **Einsatzalarmierung** | Fahrzeug wird alarmiert | "🚑 RTW 12/83-1 an Leitstelle, Einsatz übernommen, rücken aus, kommen" |
| **Am Einsatzort** | FMS 4 (nach X Sekunden) | "📍 RTW 12/83-1 an Leitstelle, am Einsatzort, beginnen Patientenversorgung, kommen" |
| **Lagemeldung** | Bei kritischen Einsätzen | "🚨 RTW 12/83-1, Lage kritisch, Patient bewusstlos, Reanimation läuft, NEF benötigt, kommen" |
| **Patient aufgenommen** | FMS 7 | "🤕 RTW 12/83-1, Patient aufgenommen, Transport ins Klinikum, kommen" |
| **Am Krankenhaus** | FMS 9 | "🏥 RTW 12/83-1, am Klinikum, Patient übergeben, Ende" |
| **Einsatzbereit** | FMS 2 | "🟢 RTW 12/83-1, zurück auf Wache, einsatzbereit, kommen" |

**Umsetzung:**
```javascript
// RadioSystem erweitern:
RadioSystem.sendAutomaticMessage(vehicle, trigger, context)

// Integration in VehicleMovement:
VehicleMovement.dispatchVehicle() → RadioSystem.sendAutomaticMessage()
VehicleMovement.handleArrival() → RadioSystem.sendAutomaticMessage()
VehicleMovement.completeTreatment() → RadioSystem.sendAutomaticMessage()
```

---

## 📝 Implementierungsschritte

### Phase 1: Zentrale Status-Funktion ✅ **FERTIG**

- [x] `js/utils/vehicle-status.js` erstellt
- [ ] Refactoring: `ui.js` nutzt `VehicleStatusUtil`
- [ ] Refactoring: `map.js` nutzt `VehicleStatusUtil`
- [ ] Refactoring: `tabs.js` nutzt `VehicleStatusUtil`
- [ ] Alte `getFMSStatus()` Funktionen entfernen

---

### Phase 2: RadioSystem erweitern

#### **2.1 Neue Funktion: `sendAutomaticMessage()`**

```javascript
RadioSystem.sendAutomaticMessage(vehicle, trigger, options = {}) {
    // trigger: 'dispatch', 'arrival', 'on_scene_delay', 'patient_loaded', etc.
    
    const context = this.buildContext(vehicle, trigger);
    
    // Generiere KI-Funkspruch mit spezifischem Kontext
    const message = await RadioGroq.generateAutomaticMessage(vehicle, {
        trigger: trigger,
        incident: context.incident,
        fmsCode: vehicle.currentStatus,
        options: options // z.B. { urgency: 'high', needs_nef: true }
    });
    
    // Füge zum Log
    this.addLogEntry({
        type: 'vehicle_to_dispatch',
        vehicle: vehicle,
        message: message,
        direction: 'vehicle_to_dispatch',
        ai_generated: true,
        automatic: true // NEU: Kennzeichnung als automatisch
    });
}
```

#### **2.2 RadioGroq erweitern**

```javascript
RadioGroq.generateAutomaticMessage(vehicle, context) {
    const prompts = {
        'dispatch': `Du bist ${vehicle.callsign}. Du wurdest alarmiert zu: ${context.incident.stichwort}.
Melde dich bei der Leitstelle, dass du den Einsatz übernommen hast und ausrückst.`,
        
        'arrival': `Du bist ${vehicle.callsign} und bist gerade am Einsatzort angekommen: ${context.incident.stichwort}.
Melde die Ankunft und dass du mit der Patientenversorgung beginnst.`,
        
        'on_scene_delay': `Du bist ${vehicle.callsign} am Einsatzort seit 3 Minuten. Einsatz: ${context.incident.stichwort}.
Gib eine kurze Lagemeldung über den Patientenzustand.`,
        
        'patient_loaded': `Du bist ${vehicle.callsign}. Patient ist aufgenommen, Einsatz: ${context.incident.stichwort}.
Melde dass du mit dem Transport ins Krankenhaus beginnst.`,
        
        'hospital_arrival': `Du bist ${vehicle.callsign} am Krankenhaus angekommen.
Melde die Ankunft und Patientenübergabe.`,
        
        'back_available': `Du bist ${vehicle.callsign} zurück auf der Wache.
Melde dass du wieder einsatzbereit bist.`
    };
    
    // API-Call mit spezifischem Prompt
    // ...
}
```

---

### Phase 3: VehicleMovement Integration

#### **3.1 Bei Alarmierung**

```javascript
// In dispatchVehicle()
if (phase === 'to_scene') {
    console.log(`⏱️ ${vehicle.callsign} - Ausrückzeit 10s...`);
    this.setVehicleStatus(vehicle, 3);
    
    // 🎯 NEU: Automatischer Funkspruch
    if (typeof RadioSystem !== 'undefined' && !skipRadio) {
        await RadioSystem.sendAutomaticMessage(vehicle, 'dispatch', {
            incident: GAME_DATA.incidents.find(i => i.id === incidentId)
        });
    }
    
    // ...
}
```

#### **3.2 Bei Ankunft am Einsatzort**

```javascript
// In handleArrival() bei phase === 'to_scene'
this.setVehicleStatus(vehicle, 4);

// 🎯 NEU: Automatischer Funkspruch
if (typeof RadioSystem !== 'undefined') {
    await RadioSystem.sendAutomaticMessage(vehicle, 'arrival');
    
    // Nach 3 Minuten: Lagemeldung
    setTimeout(async () => {
        await RadioSystem.sendAutomaticMessage(vehicle, 'on_scene_delay');
    }, 180000); // 3 Minuten
}
```

#### **3.3 Patient aufgenommen**

```javascript
// In completeTreatment() für RTW
if (vehicle.type === 'RTW') {
    this.setVehicleStatus(vehicle, 7);
    
    // 🎯 NEU: Automatischer Funkspruch
    if (typeof RadioSystem !== 'undefined') {
        await RadioSystem.sendAutomaticMessage(vehicle, 'patient_loaded');
    }
    
    this.startTransport(vehicleId);
}
```

#### **3.4 Am Krankenhaus**

```javascript
// In handleArrival() bei phase === 'to_hospital'
this.setVehicleStatus(vehicle, 8);

// 🎯 NEU: Automatischer Funkspruch
if (typeof RadioSystem !== 'undefined') {
    await RadioSystem.sendAutomaticMessage(vehicle, 'hospital_arrival');
}
```

#### **3.5 Wieder einsatzbereit**

```javascript
// In handleArrival() bei phase === 'returning'
this.setVehicleStatus(vehicle, 2);

// 🎯 NEU: Automatischer Funkspruch
if (typeof RadioSystem !== 'undefined') {
    await RadioSystem.sendAutomaticMessage(vehicle, 'back_available');
}
```

---

### Phase 4: Konfigurierbarkeit

**Neue Config:** `js/data/automatic-radio-config.json`

```json
{
  "automatic_messages": {
    "enabled": true,
    "triggers": {
      "dispatch": {
        "enabled": true,
        "delay_ms": 0
      },
      "arrival": {
        "enabled": true,
        "delay_ms": 2000
      },
      "on_scene_delay": {
        "enabled": true,
        "delay_ms": 180000,
        "only_critical": true
      },
      "patient_loaded": {
        "enabled": true,
        "delay_ms": 1000
      },
      "hospital_arrival": {
        "enabled": true,
        "delay_ms": 2000
      },
      "back_available": {
        "enabled": true,
        "delay_ms": 1000
      }
    },
    "vehicle_types": {
      "RTW": {
        "triggers": ["dispatch", "arrival", "on_scene_delay", "patient_loaded", "hospital_arrival", "back_available"]
      },
      "NEF": {
        "triggers": ["dispatch", "arrival", "on_scene_delay", "back_available"]
      },
      "KTW": {
        "triggers": ["dispatch", "arrival", "patient_loaded", "hospital_arrival", "back_available"]
      }
    }
  }
}
```

---

## 🧪 Tests

### Test 1: Zentrale Status-Funktion

```javascript
// Console-Test:
const vehicle = GAME_DATA.vehicles[0];
vehicle.currentStatus = 4;

const status = VehicleStatusUtil.getStatus(vehicle);
console.log(status);
// Erwartung: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠', code: 4 }

// Test Fallback:
const status2 = VehicleStatusUtil.getStatusByCode(999);
console.log(status2);
// Erwartung: { name: 'Unbekannt', color: '#6c757d', icon: '❓', code: 999 }
```

### Test 2: Automatische Funksprüche

```javascript
// Test-Einsatz erstellen:
const testIncident = {
    id: 'TEST_001',
    stichwort: 'Herzinfarkt',
    meldebild: 'Patient 65J, Thoraxschmerz, bewusstlos'
};
GAME_DATA.incidents.push(testIncident);

// Fahrzeug alarmieren:
const vehicle = GAME_DATA.vehicles.find(v => v.type === 'RTW');
VehicleMovement.dispatchVehicle(vehicle.id, testIncident.koordinaten, testIncident.id);

// Erwartung:
// 1. Nach 10s (Ausrückzeit): Funkspruch "RTW 12/83-1 an Leitstelle, Einsatz übernommen..."
// 2. Bei Ankunft: "RTW 12/83-1, am Einsatzort, beginnen Versorgung..."
// 3. Nach 3 Min: "RTW 12/83-1, Lage..."
```

---

## ⚠️ Zu beachten

### Performance

- **Throttling:** Nicht mehr als 1 automatischer Funkspruch pro 2 Sekunden
- **KI-Limits:** Groq API Rate Limits beachten (max. 30 Requests/Minute)
- **Fallback:** Bei API-Fehler generische Funksprüche verwenden

### UX

- **Notification-Spam vermeiden:** Max. 3 Notifications gleichzeitig
- **Kanal-Überblick:** Zeige in UI wie viele automatische Meldungen kommen
- **Deaktivierbar:** User kann automatische Funksprüche in Settings deaktivieren

### Debugging

- Alle automatischen Funksprüche mit `[AUTO]` Tag im Log
- Console-Logging mit eigenem Emoji: 🤖
- Statistik: Wie viele automatische vs. manuelle Funksprüche?

---

## 📊 Erfolgskriterien

✅ **Single Source of Truth:** Nur noch 1x `getStatus()` im gesamten Code  
✅ **Realistische Funksprüche:** Min. 6 verschiedene Trigger-Typen  
✅ **KI-Integration:** Groq AI generiert kontextbezogene Meldungen  
✅ **Konfigurierbar:** Settings zum An/Ausschalten pro Trigger  
✅ **Performance:** < 50ms Overhead pro Funkspruch  
✅ **Keine Fehler:** Funktioniert auch ohne Groq API Key  

---

## 🛠️ Technische Schulden bereinigen

### 🗑️ Code-Cleanup

- [ ] `vehicle.status` (veraltet) komplett entfernen
- [ ] Doppelte `getFMSStatus()` in ui.js, map.js, tabs.js entfernen
- [ ] `handleFMSStatusChange()` in RadioSystem (deprecated) entfernen
- [ ] Ungenutzte FMS-Listener aufräumen

### 🔄 Zentralisierung

- [ ] FMS-Status-Config nur in CONFIG.FMS_STATUS (nicht dupliziert)
- [ ] Fallback-Logik nur in VehicleStatusUtil

---

## 📝 Nächste Schritte

1. **Phase 1 abschließen:** Alle Dateien auf `VehicleStatusUtil` umstellen
2. **Phase 2 starten:** `RadioSystem.sendAutomaticMessage()` implementieren
3. **Tests schreiben:** Manuelle Console-Tests + automatisierte Tests
4. **Merge nach main:** Nach erfolgreichem Testing
5. **Doku aktualisieren:** `FUNKSYSTEM_KOMPLETT.md` erweitern

---

**Status:** 🟡 **IN ARBEIT**  
**Branch:** [feature/zentrale-status-funksprueche](https://github.com/Polizei1234/Dispatcher-Simulator/tree/feature/zentrale-status-funksprueche)  
**Verantwortlich:** Team  
**Deadline:** Keine (Feature-Branch bleibt offen)
