# ⏱️ PROMPT 06: API Rate Limiter

> **Firebase Studio Prompt - Copy & Paste Ready**

**Priorität:** 🟡 HOCH  
**Geschätzte Zeit:** 2 Stunden  
**Dateien:** 2 (neu: `api-rate-limiter.js`, update: `radio-groq.js`)

---

## 🎯 ZIEL

**Implementiere ein intelligentes Rate-Limiting-System für Groq API-Calls, um Überlastung zu verhindern und Kosten zu kontrollieren.**

**Warum wichtig:**
- Verhindert API-Überlastung
- Kontrolliert Kosten
- Batch-Processing für Effizienz
- Queue-System für Request-Management
- Vorbereitung für AI-Incident-System

---

## 📋 AUFGABEN

1. ✅ Erstelle `js/utils/api-rate-limiter.js`
2. ✅ Implementiere Request-Queue
3. ✅ Implementiere Batch-Processing
4. ✅ Implementiere Rate-Limit-Tracking
5. ✅ Integration mit RadioGroq
6. ✅ Fallback-Handling

---

## 🔧 SCHRITT 1: API Rate Limiter Klasse erstellen

**Erstelle neue Datei:** `js/utils/api-rate-limiter.js`

```javascript
/**
 * APIRateLimiter v1.0.0
 * Intelligentes Rate-Limiting für API-Calls
 * 
 * Features:
 * - Request-Queue mit Batch-Processing
 * - Automatisches Rate-Limit-Tracking
 * - Retry-Logic bei Fehlern
 * - Statistiken & Monitoring
 * 
 * @class APIRateLimiter
 */
class APIRateLimiter {
    /**
     * @param {Object} config - Konfiguration
     * @param {number} config.maxRequestsPerMinute - Max. Requests pro Minute (default: 20)
     * @param {number} config.batchSize - Anzahl paralleler Requests (default: 3)
     * @param {number} config.retryAttempts - Retry-Versuche bei Fehler (default: 2)
     * @param {number} config.retryDelay - Wartezeit zwischen Retries in ms (default: 1000)
     */
    constructor(config = {}) {
        this.config = {
            maxRequestsPerMinute: config.maxRequestsPerMinute || 20,
            batchSize: config.batchSize || 3,
            retryAttempts: config.retryAttempts || 2,
            retryDelay: config.retryDelay || 1000
        };
        
        // Request Queue
        this.queue = [];
        this.processing = false;
        
        // Rate-Limit-Tracking
        this.requestTimestamps = [];
        
        // Statistiken
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            retriedRequests: 0,
            queuedRequests: 0,
            avgResponseTime: 0,
            responseTimes: []
        };
        
        console.log('⏱️ APIRateLimiter initialisiert:', this.config);
    }
    
    /**
     * API-Request zur Queue hinzufügen
     * @param {string} endpoint - API-Endpoint URL
     * @param {Object} data - Request-Daten
     * @param {Object} options - Zusätzliche Optionen
     * @returns {Promise} - Resolved mit API-Response
     */
    async request(endpoint, data, options = {}) {
        return new Promise((resolve, reject) => {
            const requestItem = {
                id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                endpoint,
                data,
                options,
                resolve,
                reject,
                retryCount: 0,
                timestamp: Date.now()
            };
            
            this.queue.push(requestItem);
            this.stats.queuedRequests++;
            
            console.log(`📝 Request zur Queue hinzugefügt: ${requestItem.id} (Queue: ${this.queue.length})`);
            
            // Queue-Processing starten (falls nicht bereits aktiv)
            this.processQueue();
        });
    }
    
    /**
     * Queue abarbeiten
     */
    async processQueue() {
        // Bereits am Verarbeiten?
        if (this.processing || this.queue.length === 0) {
            return;
        }
        
        this.processing = true;
        
        // Rate-Limit prüfen
        const canProceed = this.checkRateLimit();
        if (!canProceed) {
            const waitTime = this.getWaitTime();
            console.warn(`⏳ Rate-Limit erreicht. Warte ${waitTime}ms...`);
            
            setTimeout(() => {
                this.processing = false;
                this.processQueue();
            }, waitTime);
            return;
        }
        
        // Nächsten Batch holen
        const batch = this.queue.splice(0, this.config.batchSize);
        console.log(`🚀 Verarbeite Batch von ${batch.length} Requests...`);
        
        // Batch parallel verarbeiten
        try {
            const results = await Promise.allSettled(
                batch.map(item => this.executeRequest(item))
            );
            
            // Ergebnisse verarbeiten
            results.forEach((result, index) => {
                const item = batch[index];
                
                if (result.status === 'fulfilled') {
                    item.resolve(result.value);
                    this.stats.successfulRequests++;
                } else {
                    // Retry oder Reject
                    if (item.retryCount < this.config.retryAttempts) {
                        console.warn(`↻ Request ${item.id} fehlgeschlagen. Retry ${item.retryCount + 1}/${this.config.retryAttempts}`);
                        item.retryCount++;
                        this.stats.retriedRequests++;
                        this.queue.unshift(item); // Zurück in Queue (Prio)
                    } else {
                        console.error(`❌ Request ${item.id} endgültig fehlgeschlagen:`, result.reason);
                        item.reject(result.reason);
                        this.stats.failedRequests++;
                    }
                }
            });
            
            // Timestamp für Rate-Limit
            this.requestTimestamps.push(Date.now());
            
        } catch (error) {
            console.error('❌ Batch-Processing Fehler:', error);
        }
        
        this.processing = false;
        
        // Weiter verarbeiten falls Queue nicht leer
        if (this.queue.length > 0) {
            setTimeout(() => this.processQueue(), 100);
        }
    }
    
    /**
     * Einzelnen Request ausführen
     * @param {Object} item - Request-Item aus Queue
     */
    async executeRequest(item) {
        const startTime = Date.now();
        
        try {
            console.log(`🔌 Request ${item.id} wird ausgeführt...`);
            
            const response = await fetch(item.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...item.options.headers
                },
                body: JSON.stringify(item.data)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Response-Time tracken
            const responseTime = Date.now() - startTime;
            this.updateResponseTimeStats(responseTime);
            
            console.log(`✅ Request ${item.id} erfolgreich (${responseTime}ms)`);
            this.stats.totalRequests++;
            
            return result;
            
        } catch (error) {
            console.error(`❌ Request ${item.id} fehlgeschlagen:`, error.message);
            throw error;
        }
    }
    
    /**
     * Rate-Limit prüfen
     * @returns {boolean} - true wenn Request erlaubt, false wenn Limit erreicht
     */
    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Alte Timestamps entfernen
        this.requestTimestamps = this.requestTimestamps.filter(
            timestamp => timestamp > oneMinuteAgo
        );
        
        // Limit prüfen
        return this.requestTimestamps.length < this.config.maxRequestsPerMinute;
    }
    
    /**
     * Wartezeit bis nächster Request berechnen
     * @returns {number} - Wartezeit in ms
     */
    getWaitTime() {
        if (this.requestTimestamps.length === 0) return 0;
        
        const oldestTimestamp = Math.min(...this.requestTimestamps);
        const timeSinceOldest = Date.now() - oldestTimestamp;
        const waitTime = 60000 - timeSinceOldest;
        
        return Math.max(waitTime, 0);
    }
    
    /**
     * Response-Time Statistiken aktualisieren
     */
    updateResponseTimeStats(responseTime) {
        this.stats.responseTimes.push(responseTime);
        
        // Nur letzte 100 behalten
        if (this.stats.responseTimes.length > 100) {
            this.stats.responseTimes.shift();
        }
        
        // Durchschnitt neu berechnen
        const sum = this.stats.responseTimes.reduce((a, b) => a + b, 0);
        this.stats.avgResponseTime = Math.round(sum / this.stats.responseTimes.length);
    }
    
    /**
     * Statistiken abrufen
     */
    getStats() {
        const requestsPerMinute = this.requestTimestamps.length;
        const queueSize = this.queue.length;
        const successRate = this.stats.totalRequests > 0 
            ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(1)
            : 0;
        
        return {
            ...this.stats,
            requestsPerMinute,
            queueSize,
            successRate: `${successRate}%`,
            rateLimitUsage: `${requestsPerMinute}/${this.config.maxRequestsPerMinute}`,
            isProcessing: this.processing
        };
    }
    
    /**
     * Statistiken in Console ausgeben
     */
    printStats() {
        const stats = this.getStats();
        
        console.log('%c⏱️ API RATE LIMITER STATS', 'font-size: 14px; font-weight: bold;');
        console.log('===================================');
        console.log(`Total Requests: ${stats.totalRequests}`);
        console.log(`Successful: ${stats.successfulRequests}`);
        console.log(`Failed: ${stats.failedRequests}`);
        console.log(`Retried: ${stats.retriedRequests}`);
        console.log(`Success Rate: ${stats.successRate}`);
        console.log(`---`);
        console.log(`Queue Size: ${stats.queueSize}`);
        console.log(`Requests/Min: ${stats.rateLimitUsage}`);
        console.log(`Avg Response Time: ${stats.avgResponseTime}ms`);
        console.log(`Processing: ${stats.isProcessing ? 'Ja' : 'Nein'}`);
        console.log('===================================');
    }
    
    /**
     * Statistiken zurücksetzen
     */
    resetStats() {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            retriedRequests: 0,
            queuedRequests: 0,
            avgResponseTime: 0,
            responseTimes: []
        };
        console.log('🔄 Rate-Limiter Stats zurückgesetzt');
    }
}

// Singleton für Groq API
const groqLimiter = new APIRateLimiter({
    maxRequestsPerMinute: 20,  // Groq Free-Tier Limit
    batchSize: 3,               // Max 3 parallele Requests
    retryAttempts: 2,           // 2 Retry-Versuche
    retryDelay: 1000            // 1s zwischen Retries
});

// Global verfügbar machen
window.groqLimiter = groqLimiter;

console.log('✅ Groq Rate Limiter bereit');
```

---

## 🔧 SCHRITT 2: Integration mit RadioGroq

**Datei:** `js/integrations/radio-groq.js`

**Finde die `generateMessage()` Methode und ersetze den direkten Fetch-Call:**

**VORHER:**
```javascript
async generateMessage(vehicle, trigger, context) {
    try {
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: { /* ... */ },
            body: JSON.stringify({ /* ... */ })
        });
        
        // ...
    }
}
```

**NACHHER:**
```javascript
async generateMessage(vehicle, trigger, context) {
    try {
        console.log(`🤖 Groq AI: Generiere Funkspruch für ${trigger}...`);
        
        // Prompt erstellen
        const prompt = this.buildPrompt(vehicle, trigger, context);
        
        // 🎯 NEU: Nutze Rate-Limiter statt direktem Fetch
        const result = await window.groqLimiter.request(
            this.config.apiEndpoint,
            {
                model: this.config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Response verarbeiten
        if (result.choices && result.choices[0]) {
            const message = result.choices[0].message.content.trim();
            console.log(`✅ Groq AI: Funkspruch generiert (${message.length} Zeichen)`);
            return message;
        }
        
        throw new Error('Keine valide Response von Groq AI');
        
    } catch (error) {
        console.error(`❌ Groq AI Fehler:`, error);
        
        // Fallback zu Template
        console.log(`🔄 Fallback zu Template für ${trigger}`);
        return this.getFallbackMessage(trigger, context);
    }
}
```

---

## 🔧 SCHRITT 3: Debug-Menü Integration (Optional)

**Datei:** `js/ui/debug-menu.js`

**Füge neue Sektion hinzu:**

```javascript
// Rate Limiter Sektion
const rateLimitSection = document.createElement('div');
rateLimitSection.className = 'debug-section';
rateLimitSection.innerHTML = `
    <h3>⏱️ API Rate Limiter</h3>
    <button id="rate-limiter-stats" class="debug-btn">Stats anzeigen</button>
    <button id="rate-limiter-reset" class="debug-btn">Reset</button>
    <div id="rate-limiter-info" class="info-box">
        <div>Queue: <span id="rl-queue">0</span></div>
        <div>Requests/Min: <span id="rl-rpm">0/20</span></div>
        <div>Success Rate: <span id="rl-success">-</span></div>
    </div>
`;

// Event Listener
rateLimitSection.querySelector('#rate-limiter-stats').addEventListener('click', () => {
    window.groqLimiter.printStats();
});

rateLimitSection.querySelector('#rate-limiter-reset').addEventListener('click', () => {
    if (confirm('Rate-Limiter Stats zurücksetzen?')) {
        window.groqLimiter.resetStats();
    }
});

// Live-Update
setInterval(() => {
    const stats = window.groqLimiter.getStats();
    document.getElementById('rl-queue').textContent = stats.queueSize;
    document.getElementById('rl-rpm').textContent = stats.rateLimitUsage;
    document.getElementById('rl-success').textContent = stats.successRate;
}, 2000);
```

---

## 🔧 SCHRITT 4: In index.html einbinden

**Datei:** `index.html`

**Füge Script-Tag hinzu (VOR radio-groq.js!):**

```html
<!-- API Rate Limiting -->
<script src="js/utils/api-rate-limiter.js"></script>
```

---

## 🧪 TESTING

### Test 1: Rate-Limiter initialisiert

**Browser Console prüfen:**
```
⏱️ APIRateLimiter initialisiert: {maxRequestsPerMinute: 20, batchSize: 3, ...}
✅ Groq Rate Limiter bereit
```

---

### Test 2: Einzelner Request funktioniert

**In Console testen:**
```javascript
window.groqLimiter.request('https://api.groq.com/openai/v1/chat/completions', {
    model: 'mixtral-8x7b-32768',
    messages: [{ role: 'user', content: 'Test' }]
}, {
    headers: { 'Authorization': 'Bearer YOUR_KEY' }
}).then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

✅ Request sollte erfolgreich sein

---

### Test 3: Queue-System funktioniert

**Mehrere Requests gleichzeitig:**
```javascript
for (let i = 0; i < 10; i++) {
    window.groqLimiter.request('test-endpoint', { test: i });
}

// Prüfe Queue:
window.groqLimiter.getStats().queueSize
// Sollte 10 sein (oder weniger wenn schon verarbeitet)
```

---

### Test 4: Rate-Limit wird eingehalten

**Stress-Test:**
```javascript
// 30 Requests (mehr als Limit von 20/min)
for (let i = 0; i < 30; i++) {
    window.groqLimiter.request('test', { id: i });
}

// Console sollte zeigen:
// "⏳ Rate-Limit erreicht. Warte XXXms..."
```

---

### Test 5: Retry bei Fehler

**Simuliere Fehler:**
```javascript
// Request zu ungültigem Endpoint
window.groqLimiter.request('https://invalid-endpoint.com', {})
    .catch(error => console.log('Expected error:', error));

// Console sollte zeigen:
// "↻ Request req_XXX fehlgeschlagen. Retry 1/2"
// "↻ Request req_XXX fehlgeschlagen. Retry 2/2"
// "❌ Request req_XXX endgültig fehlgeschlagen"
```

---

### Test 6: Statistiken funktionieren

**Nach einigen Requests:**
```javascript
window.groqLimiter.printStats();
```

**Erwartete Ausgabe:**
```
⏱️ API RATE LIMITER STATS
===================================
Total Requests: 15
Successful: 12
Failed: 3
Retried: 5
Success Rate: 80.0%
---
Queue Size: 2
Requests/Min: 15/20
Avg Response Time: 850ms
Processing: Ja
===================================
```

---

### Test 7: Integration mit RadioGroq

**Teste automatischen Funkspruch:**

1. Starte Einsatz
2. Disponiere Fahrzeug
3. Löse Event aus (z.B. Eskalation)
4. Console prüfen:

```
🤖 Groq AI: Generiere Funkspruch für escalation_started...
📝 Request zur Queue hinzugefügt: req_XXX (Queue: 1)
🚀 Verarbeite Batch von 1 Requests...
🔌 Request req_XXX wird ausgeführt...
✅ Request req_XXX erfolgreich (752ms)
✅ Groq AI: Funkspruch generiert (234 Zeichen)
```

✅ Funkspruch erscheint im Radio-Panel

---

## ✅ ERFOLGSKRITERIEN

- ✅ APIRateLimiter startet automatisch
- ✅ Request-Queue funktioniert
- ✅ Batch-Processing (max 3 parallel)
- ✅ Rate-Limit wird eingehalten (20/min)
- ✅ Retry-Logic funktioniert (2 Versuche)
- ✅ Statistiken werden getrackt
- ✅ Integration mit RadioGroq erfolgreich
- ✅ Fallback bei Fehler funktioniert

---

## 🐛 TROUBLESHOOTING

### Problem: "groqLimiter is not defined"

**Lösung:**  
Stelle sicher `api-rate-limiter.js` VOR `radio-groq.js` geladen wird

---

### Problem: Requests werden nicht verarbeitet

**Debug:**
```javascript
window.groqLimiter.getStats()
// Prüfe: queueSize > 0, isProcessing = true
```

**Fix:** Rufe manuell `processQueue()` auf

---

### Problem: Zu langsam

**Tuning:**
```javascript
// In api-rate-limiter.js
const groqLimiter = new APIRateLimiter({
    batchSize: 5,  // Erhöhe Batch-Size
    maxRequestsPerMinute: 30  // Falls höheres Tier
});
```

---

## 🚀 COMMIT MESSAGE

```
⏱️ FEAT: API Rate Limiter v1.0.0 implementiert

- Neue Datei: js/utils/api-rate-limiter.js
- Request-Queue mit Batch-Processing
- Rate-Limit-Tracking (20 req/min)
- Retry-Logic (2 Versuche)
- Statistiken & Monitoring
- Integration mit RadioGroq
- Fallback bei Überlastung

Dateien:
- js/utils/api-rate-limiter.js (NEU)
- js/integrations/radio-groq.js
- js/ui/debug-menu.js (optional)
- index.html

Testing:
- ✅ Queue-System funktioniert
- ✅ Rate-Limit wird eingehalten
- ✅ Retry bei Fehler
- ✅ Integration mit RadioGroq
- ✅ Statistiken tracken

Vorbereitung für AI-Incident-System!
```

---

**Status:** 📋 Bereit zur Implementierung  
**Geschätzte Zeit:** 2 Stunden  
**Priorität:** 🟡 HOCH  
**Blockiert von:** Keine  
**Blockiert:** AI-Incident-System (braucht Rate-Limiting!)
