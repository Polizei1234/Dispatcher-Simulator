# 🚨 PROMPT 01: RadioSystem EventBridge Fix (KRITISCH!)

> **Firebase Studio Prompt - Copy & Paste Ready**

**Priorität:** 🔴 **BLOCKING ISSUE**  
**Geschätzte Zeit:** 30 Minuten  
**Dateien:** 1 (`js/systems/radio-system.js`)

---

## 🎯 PROBLEM

**Das RadioSystem hört NICHT auf EventBridge Events!**

Aktuell:
- ✅ EscalationSystem feuert Events über EventBridge
- ❌ **RadioSystem empfängt diese Events NICHT**
- ❌ **Keine automatischen Funksprüche bei Eskalationen!**

**Quelle:** `docs/CRITICAL_MISSING_INTEGRATION.md`

---

## 📋 AUFGABE

**Implementiere EventBridge-Listener in RadioSystem, damit automatische Funksprüche bei allen Events funktionieren.**

---

## 🔧 SCHRITT-FÜR-SCHRITT ANLEITUNG

### **Schritt 1: Neue Methode hinzufügen**

**Datei:** `js/systems/radio-system.js`

**Füge diese komplette Methode zur RadioSystem-Klasse hinzu:**

```javascript
/**
 * 🎯 v2.2.0: Registriert EventBridge-Listener für automatische Funksprüche
 * 
 * Diese Methode verbindet das RadioSystem mit dem EventBridge.
 * Wenn Events gefeuert werden (z.B. von EscalationSystem), 
 * reagiert RadioSystem automatisch mit passenden Funksprüchen.
 */
setupEventBridgeListeners() {
    // Safety-Check: EventBridge verfügbar?
    if (!window.eventBridge) {
        console.warn('⚠️ RadioSystem: EventBridge nicht verfügbar - Listener nicht registriert');
        return;
    }
    
    console.log('🌉 RadioSystem: Registriere EventBridge-Listener...');
    
    // === 1. DISPATCH EVENTS ===
    window.eventBridge.on('dispatch:vehicle_dispatched', (data) => {
        console.log('📡 RadioSystem: vehicle_dispatched Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'dispatch', {
            incident: data.incident,
            urgency: data.urgency
        });
    });
    
    // === 2. ARRIVAL EVENTS ===
    window.eventBridge.on('dispatch:vehicle_arrived', (data) => {
        console.log('📡 RadioSystem: vehicle_arrived Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'arrival', {
            incident: data.incident
        });
    });
    
    // === 3. ESKALATIONS-EVENTS ===
    window.eventBridge.on('escalation:started', (data) => {
        console.log('📡 RadioSystem: escalation_started Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'escalation_started', {
            incident: data.incident,
            oldSeverity: data.oldSeverity,
            newSeverity: data.newSeverity,
            reason: data.reason
        });
    });
    
    window.eventBridge.on('escalation:nef_required', (data) => {
        console.log('📡 RadioSystem: nef_required Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'request_nef', {
            incident: data.incident,
            urgency: data.urgency,
            needs_nef: true
        });
    });
    
    window.eventBridge.on('escalation:status_worsened', (data) => {
        console.log('📡 RadioSystem: status_worsened Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
            incident: data.incident,
            oldStatus: data.oldStatus,
            newStatus: data.newStatus
        });
    });
    
    window.eventBridge.on('escalation:critical', (data) => {
        console.log('📡 RadioSystem: escalation_critical Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
            incident: data.incident,
            severity: data.newSeverity
        });
    });
    
    // === 4. KOMPLIKATIONS-EVENTS ===
    window.eventBridge.on('incident:complication', (data) => {
        console.log('📡 RadioSystem: complication Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'patient_complications', {
            incident: data.incident,
            complication: data.complication
        });
    });
    
    window.eventBridge.on('medical:patient_critical', (data) => {
        console.log('📡 RadioSystem: patient_critical Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
            incident: data.incident,
            symptoms: data.symptoms
        });
    });
    
    window.eventBridge.on('medical:resuscitation', (data) => {
        console.log('📡 RadioSystem: resuscitation Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
            incident: data.incident,
            resuscitation: true
        });
    });
    
    // === 5. TRANSPORT-EVENTS ===
    window.eventBridge.on('transport:patient_loaded', (data) => {
        console.log('📡 RadioSystem: patient_loaded Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'patient_loaded', {
            incident: data.incident
        });
    });
    
    window.eventBridge.on('transport:hospital_arrival', (data) => {
        console.log('📡 RadioSystem: hospital_arrival Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'hospital_arrival', {
            incident: data.incident,
            hospital: data.hospital
        });
    });
    
    window.eventBridge.on('transport:delayed', (data) => {
        console.log('📡 RadioSystem: transport_delayed Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'transport_delay', {
            incident: data.incident,
            reason: data.reason
        });
    });
    
    // === 6. VEHICLE-EVENTS ===
    window.eventBridge.on('vehicle:back_available', (data) => {
        console.log('📡 RadioSystem: back_available Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'back_available', {
            previousIncident: data.previousIncident
        });
    });
    
    window.eventBridge.on('vehicle:break_start', (data) => {
        console.log('📡 RadioSystem: break_start Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'break_start', {
            duration: data.duration
        });
    });
    
    window.eventBridge.on('vehicle:shift_end', (data) => {
        console.log('📡 RadioSystem: shift_end Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'shift_end', {});
    });
    
    window.eventBridge.on('vehicle:maintenance_needed', (data) => {
        console.log('📡 RadioSystem: maintenance_needed Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'maintenance_needed', {
            reason: data.reason
        });
    });
    
    // === 7. DELAY-EVENTS ===
    window.eventBridge.on('incident:on_scene_delay', (data) => {
        console.log('📡 RadioSystem: on_scene_delay Event empfangen', data);
        this.sendAutomaticMessage(data.vehicle, 'on_scene_delay', {
            incident: data.incident,
            duration: data.duration
        });
    });
    
    console.log('✅ RadioSystem: EventBridge-Listener registriert (15 Event-Typen)');
}
```

---

### **Schritt 2: Methode in initialize() aufrufen**

**Datei:** `js/systems/radio-system.js`

**Finde die `initialize()` Methode und füge NACH dem Laden der Config hinzu:**

```javascript
async initialize() {
    try {
        console.log('🎙️ RadioSystem wird initialisiert...');
        
        // Config laden
        await this.loadConfig();
        console.log('✅ RadioSystem Config geladen');
        
        // 🎯 NEU: EventBridge-Listener registrieren
        this.setupEventBridgeListeners();
        
        // ... rest of existing code ...
        
        this.initialized = true;
        console.log('✅ RadioSystem erfolgreich initialisiert');
    } catch (error) {
        console.error('❌ RadioSystem Initialisierung fehlgeschlagen:', error);
        throw error;
    }
}
```

**⚠️ WICHTIG:** Rufe `setupEventBridgeListeners()` NACH `loadConfig()` auf, aber VOR allem anderen!

---

### **Schritt 3: Version-Update**

**Datei:** `js/systems/radio-system.js`

**Finde die Klassen-Kopfzeile und update die Version:**

```javascript
/**
 * RadioSystem v2.2.0
 * Verwaltet automatische Funksprüche mit KI-Integration
 * 
 * CHANGELOG v2.2.0:
 * - ✅ EventBridge-Listener implementiert (15 Event-Typen)
 * - ✅ Bidirektionale Kommunikation komplett
 * - ✅ Automatische Funksprüche bei allen Events
 * 
 * @class RadioSystem
 */
class RadioSystem {
    // ... existing code ...
}
```

---

## 🧪 TESTING

### **Test 1: EventBridge-Listener registriert?**

**Browser Console öffnen und prüfen:**

```javascript
// Nach App-Start sollte erscheinen:
"🌉 RadioSystem: Registriere EventBridge-Listener..."
"✅ RadioSystem: EventBridge-Listener registriert (15 Event-Typen)"
```

✅ **Erwartetes Ergebnis:** Beide Meldungen erscheinen

---

### **Test 2: Eskalation triggert Funkspruch?**

**Teste manuell:**

1. Starte neuen Einsatz
2. Disponiere RTW
3. Warte bis RTW vor Ort
4. Löse Eskalation aus (z.B. Patient verschlechtert sich)

**Browser Console prüfen:**
```javascript
"📡 RadioSystem: escalation_started Event empfangen"
"🎙️ Automatischer Funkspruch wird generiert..."
```

✅ **Erwartetes Ergebnis:** Funkspruch erscheint automatisch im Radio-Panel

---

### **Test 3: NEF-Anforderung automatisch?**

**Teste:**

1. Einsatz mit kritischem Patient
2. System erkennt: NEF benötigt
3. EventBridge feuert: `escalation:nef_required`

**Browser Console prüfen:**
```javascript
"📡 RadioSystem: nef_required Event empfangen"
"🎙️ Automatischer Funkspruch: request_nef"
```

✅ **Erwartetes Ergebnis:** RTW meldet automatisch NEF-Anforderung

---

### **Test 4: Alle 15 Event-Typen funktionieren?**

**Debug-Test in Console:**

```javascript
// Teste alle Events manuell
const testEvents = [
    'dispatch:vehicle_dispatched',
    'dispatch:vehicle_arrived',
    'escalation:started',
    'escalation:nef_required',
    'escalation:status_worsened',
    'escalation:critical',
    'incident:complication',
    'medical:patient_critical',
    'medical:resuscitation',
    'transport:patient_loaded',
    'transport:hospital_arrival',
    'transport:delayed',
    'vehicle:back_available',
    'vehicle:break_start',
    'vehicle:shift_end',
    'vehicle:maintenance_needed',
    'incident:on_scene_delay'
];

testEvents.forEach(event => {
    window.eventBridge.emit(event, {
        vehicle: 'RTW 46/83-1',
        incident: { id: 'test-123' }
    });
});

// Prüfe Console: Für jeden Event sollte erscheinen:
// "📡 RadioSystem: [event] Event empfangen"
```

✅ **Erwartetes Ergebnis:** 15 Console-Meldungen + 15 Funksprüche generiert

---

## ✅ ERFOLGSKRITERIEN

### **MUSS funktionieren:**

- ✅ `setupEventBridgeListeners()` wird in `initialize()` aufgerufen
- ✅ Keine Console-Errors beim App-Start
- ✅ Meldung "EventBridge-Listener registriert" erscheint
- ✅ Eskalationen triggern automatisch Funksprüche
- ✅ NEF-Anforderungen werden automatisch gemeldet
- ✅ Alle 15 Event-Typen haben einen Listener

### **DARF NICHT passieren:**

- ❌ "EventBridge nicht verfügbar" Warning
- ❌ Events werden gefeuert, aber RadioSystem reagiert nicht
- ❌ Funksprüche fehlen bei Eskalationen
- ❌ Console-Errors beim Event-Handling

---

## 🐛 TROUBLESHOOTING

### Problem: "EventBridge nicht verfügbar"

**Lösung:**
```javascript
// Prüfe in Browser Console:
window.eventBridge

// Sollte ein Objekt sein, nicht undefined
// Falls undefined: EventBridge lädt zu spät
```

**Fix:** Stelle sicher `event-bridge.js` VOR `radio-system.js` geladen wird

---

### Problem: Events werden nicht empfangen

**Debug:**
```javascript
// Teste EventBridge direkt:
window.eventBridge.on('test:event', (data) => {
    console.log('Test Event empfangen!', data);
});

window.eventBridge.emit('test:event', { test: 'data' });

// Sollte in Console erscheinen!
```

**Wenn das funktioniert:** RadioSystem-Listener sind falsch registriert  
**Wenn das NICHT funktioniert:** EventBridge selbst ist kaputt

---

### Problem: Funksprüche werden nicht generiert

**Prüfe:**
```javascript
// RadioSystem vorhanden?
window.radioSystem

// sendAutomaticMessage Methode existiert?
typeof window.radioSystem.sendAutomaticMessage === 'function'

// Config geladen?
window.radioSystem.config
```

**Wenn eine Prüfung fehlschlägt:** Initialisierungs-Reihenfolge falsch!

---

## 📝 DOKUMENTATION UPDATE

### Nach erfolgreichem Fix:

**Datei:** `docs/CRITICAL_MISSING_INTEGRATION.md`

**Füge am Ende hinzu:**

```markdown
---

## ✅ FIX IMPLEMENTIERT (v2.2.0)

**Datum:** [DATUM]
**Version:** RadioSystem v2.2.0
**Status:** ✅ BEHOBEN

### Was implementiert wurde:

1. ✅ `setupEventBridgeListeners()` Methode hinzugefügt
2. ✅ 15 Event-Listener registriert
3. ✅ Integration in `initialize()` erfolgt
4. ✅ Alle Tests bestanden

### Test-Ergebnisse:

- ✅ EventBridge-Listener werden registriert
- ✅ Eskalationen triggern automatisch Funksprüche
- ✅ NEF-Anforderungen funktionieren
- ✅ Keine Console-Errors

**Phase 9 ist nun WIRKLICH fertig! 🎉**
```

---

## 📊 IMPACT

### Vorher (v2.1.0):
- ❌ Automatische Funksprüche NUR bei FMS-Status
- ❌ EventBridge Events verpuffen wirkungslos
- ❌ Feature technisch kaputt

### Nachher (v2.2.0):
- ✅ Automatische Funksprüche bei ALLEN Events
- ✅ Bidirektionale Kommunikation komplett
- ✅ EscalationSystem → EventBridge → RadioSystem funktioniert
- ✅ **Feature funktioniert wie designed!**

---

## 🚀 COMMIT MESSAGE

```
🔧 FIX: RadioSystem v2.2.0 - EventBridge Integration implementiert

- Neue Methode: setupEventBridgeListeners()
- Registriert 15 Event-Listener für automatische Funksprüche
- Integration in initialize() erfolgt
- Behebt kritischen Bug aus CRITICAL_MISSING_INTEGRATION.md

Phase 9 ist nun vollständig!

Dateien:
- js/systems/radio-system.js

Testing:
- ✅ EventBridge-Listener registriert
- ✅ Eskalationen triggern Funksprüche
- ✅ NEF-Anforderungen funktionieren
- ✅ Alle 15 Event-Typen getestet

Closes #[ISSUE_NUMBER]
```

---

## ⏰ TIMELINE

| Schritt | Zeit | Status |
|---------|------|---------|
| Methode hinzufügen | 10 Min | ⏳ |
| initialize() anpassen | 2 Min | ⏳ |
| Version updaten | 1 Min | ⏳ |
| Testing | 15 Min | ⏳ |
| Dokumentation | 2 Min | ⏳ |
| **GESAMT** | **30 Min** | ⏳ |

---

**Status:** 📋 Bereit zur Implementierung  
**Priorität:** 🔴 KRITISCH  
**Nach diesem Fix:** Phase 9 ist wirklich fertig! 🎉
