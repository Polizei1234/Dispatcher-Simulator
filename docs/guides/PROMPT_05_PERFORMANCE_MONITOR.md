# 📊 PROMPT 05: Performance Monitor

> **Firebase Studio Prompt - Copy & Paste Ready**

**Priorität:** 🟡 HOCH  
**Geschätzte Zeit:** 3 Stunden  
**Dateien:** 2 (neu: `performance-monitor.js`, update: `debug-menu.js`)

---

## 🎯 ZIEL

**Implementiere ein systematisches Performance-Monitoring-System, das kontinuierlich FPS, Memory, CPU-Last und Long Tasks trackt.**

**Warum wichtig:**
- Erkenne Performance-Regressions früh
- Messe Impact von neuen Features
- Finde Memory Leaks automatisch
- Optimiere basierend auf echten Daten

---

## 📋 AUFGABEN

1. ✅ Erstelle `js/utils/performance-monitor.js`
2. ✅ Implementiere FPS-Tracking
3. ✅ Implementiere Memory-Monitoring
4. ✅ Implementiere Long-Task-Detection
5. ✅ Integration ins Debug-Menü
6. ✅ Performance-Reports generieren

---

## 🔧 SCHRITT 1: Performance Monitor Klasse erstellen

**Erstelle neue Datei:** `js/utils/performance-monitor.js`

```javascript
/**
 * PerformanceMonitor v1.0.0
 * Systematisches Performance-Tracking für Dispatcher Simulator
 * 
 * Tracked:
 * - FPS (Frames per Second)
 * - Memory Usage (Heap Size)
 * - CPU Load (Long Tasks)
 * - Render Times
 * 
 * @class PerformanceMonitor
 */
class PerformanceMonitor {
    constructor() {
        this.enabled = false;
        this.metrics = {
            fps: [],
            memory: [],
            longTasks: [],
            renderTimes: []
        };
        
        // Limits für Warnings
        this.thresholds = {
            minFPS: 30,
            maxMemoryMB: 200,
            maxTaskDuration: 50 // ms
        };
        
        // Monitoring-State
        this.isMonitoring = false;
        this.fpsInterval = null;
        this.memoryInterval = null;
        this.longTaskObserver = null;
        
        // Stats
        this.stats = {
            totalWarnings: 0,
            fpsWarnings: 0,
            memoryWarnings: 0,
            longTaskWarnings: 0
        };
        
        console.log('📊 PerformanceMonitor initialisiert');
    }
    
    /**
     * Startet das Performance-Monitoring
     */
    start() {
        if (this.isMonitoring) {
            console.warn('⚠️ PerformanceMonitor läuft bereits');
            return;
        }
        
        console.log('🚀 PerformanceMonitor gestartet');
        this.isMonitoring = true;
        this.enabled = true;
        
        // Start FPS Monitoring
        this.startFPSMonitoring();
        
        // Start Memory Monitoring (nur wenn API verfügbar)
        if (performance.memory) {
            this.startMemoryMonitoring();
        } else {
            console.warn('⚠️ Memory API nicht verfügbar (nur Chrome/Edge)');
        }
        
        // Start Long Task Monitoring
        this.startLongTaskMonitoring();
    }
    
    /**
     * Stoppt das Performance-Monitoring
     */
    stop() {
        if (!this.isMonitoring) return;
        
        console.log('🛑 PerformanceMonitor gestoppt');
        this.isMonitoring = false;
        
        // Stop alle Intervals
        if (this.fpsInterval) clearInterval(this.fpsInterval);
        if (this.memoryInterval) clearInterval(this.memoryInterval);
        
        // Stop Observer
        if (this.longTaskObserver) {
            this.longTaskObserver.disconnect();
        }
    }
    
    /**
     * FPS (Frames Per Second) Monitoring
     */
    startFPSMonitoring() {
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = () => {
            if (!this.isMonitoring) return;
            
            frames++;
            const currentTime = performance.now();
            
            // Alle 1 Sekunde FPS berechnen
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                // Speichern (max 60 Werte = 1 Minute)
                this.metrics.fps.push({
                    timestamp: Date.now(),
                    value: fps
                });
                if (this.metrics.fps.length > 60) {
                    this.metrics.fps.shift();
                }
                
                // Warning bei niedrigem FPS
                if (fps < this.thresholds.minFPS) {
                    this.logWarning('FPS', `Niedrig: ${fps} FPS (< ${this.thresholds.minFPS})`);
                    this.stats.fpsWarnings++;
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
        console.log('🎬 FPS-Monitoring aktiv');
    }
    
    /**
     * Memory Usage Monitoring
     */
    startMemoryMonitoring() {
        this.memoryInterval = setInterval(() => {
            if (!this.isMonitoring) return;
            
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1048576;
            const totalMB = memory.totalJSHeapSize / 1048576;
            const limitMB = memory.jsHeapSizeLimit / 1048576;
            
            // Speichern (max 120 Werte = 10 Minuten)
            this.metrics.memory.push({
                timestamp: Date.now(),
                used: usedMB,
                total: totalMB,
                limit: limitMB
            });
            if (this.metrics.memory.length > 120) {
                this.metrics.memory.shift();
            }
            
            // Warning bei hoher Memory-Nutzung
            if (usedMB > this.thresholds.maxMemoryMB) {
                this.logWarning('Memory', `Hoch: ${usedMB.toFixed(2)} MB (> ${this.thresholds.maxMemoryMB} MB)`);
                this.stats.memoryWarnings++;
            }
            
            // Critical Warning bei 80% Limit
            const usagePercent = (usedMB / limitMB) * 100;
            if (usagePercent > 80) {
                this.logWarning('Memory', `KRITISCH: ${usagePercent.toFixed(1)}% vom Limit!`, 'error');
            }
            
        }, 5000); // Alle 5 Sekunden
        
        console.log('🧠 Memory-Monitoring aktiv');
    }
    
    /**
     * Long Task Detection (Tasks > 50ms blockieren UI)
     */
    startLongTaskMonitoring() {
        try {
            this.longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const duration = entry.duration;
                    
                    // Speichern
                    this.metrics.longTasks.push({
                        timestamp: Date.now(),
                        duration: duration,
                        name: entry.name,
                        startTime: entry.startTime
                    });
                    if (this.metrics.longTasks.length > 100) {
                        this.metrics.longTasks.shift();
                    }
                    
                    // Warning bei langen Tasks
                    if (duration > this.thresholds.maxTaskDuration) {
                        this.logWarning('Long Task', `${duration.toFixed(2)}ms (> ${this.thresholds.maxTaskDuration}ms)`);
                        this.stats.longTaskWarnings++;
                    }
                }
            });
            
            this.longTaskObserver.observe({ entryTypes: ['longtask'] });
            console.log('⏱️ Long-Task-Monitoring aktiv');
            
        } catch (error) {
            console.warn('⚠️ Long Task API nicht verfügbar:', error.message);
        }
    }
    
    /**
     * Warning loggen
     */
    logWarning(type, message, level = 'warn') {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `⚠️ [${timestamp}] ${type}: ${message}`;
        
        if (level === 'error') {
            console.error(logMessage);
        } else {
            console.warn(logMessage);
        }
        
        this.stats.totalWarnings++;
    }
    
    /**
     * Performance Report generieren
     */
    getReport() {
        if (this.metrics.fps.length === 0 && this.metrics.memory.length === 0) {
            return {
                error: 'Keine Daten verfügbar. Monitoring läuft nicht oder wurde gerade gestartet.'
            };
        }
        
        return {
            fps: this.calculateFPSStats(),
            memory: this.calculateMemoryStats(),
            longTasks: this.calculateLongTaskStats(),
            warnings: this.stats,
            uptime: this.isMonitoring ? 'Aktiv' : 'Gestoppt'
        };
    }
    
    /**
     * FPS Statistiken berechnen
     */
    calculateFPSStats() {
        if (this.metrics.fps.length === 0) return null;
        
        const values = this.metrics.fps.map(m => m.value);
        return {
            current: values[values.length - 1],
            avg: this.average(values),
            min: Math.min(...values),
            max: Math.max(...values),
            samples: values.length
        };
    }
    
    /**
     * Memory Statistiken berechnen
     */
    calculateMemoryStats() {
        if (this.metrics.memory.length === 0) return null;
        
        const values = this.metrics.memory.map(m => m.used);
        const latest = this.metrics.memory[this.metrics.memory.length - 1];
        
        return {
            currentMB: latest.used.toFixed(2),
            avgMB: this.average(values).toFixed(2),
            minMB: Math.min(...values).toFixed(2),
            maxMB: Math.max(...values).toFixed(2),
            limitMB: latest.limit.toFixed(2),
            usagePercent: ((latest.used / latest.limit) * 100).toFixed(1),
            samples: values.length
        };
    }
    
    /**
     * Long Task Statistiken berechnen
     */
    calculateLongTaskStats() {
        if (this.metrics.longTasks.length === 0) {
            return { count: 0, message: 'Keine Long Tasks erkannt ✅' };
        }
        
        const durations = this.metrics.longTasks.map(t => t.duration);
        return {
            count: this.metrics.longTasks.length,
            avgDuration: this.average(durations).toFixed(2),
            maxDuration: Math.max(...durations).toFixed(2),
            recent: this.metrics.longTasks.slice(-5) // Letzte 5
        };
    }
    
    /**
     * Durchschnitt berechnen
     */
    average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    /**
     * Metriken zurücksetzen
     */
    reset() {
        this.metrics = {
            fps: [],
            memory: [],
            longTasks: [],
            renderTimes: []
        };
        this.stats = {
            totalWarnings: 0,
            fpsWarnings: 0,
            memoryWarnings: 0,
            longTaskWarnings: 0
        };
        console.log('🔄 Performance-Metriken zurückgesetzt');
    }
    
    /**
     * Report in Console ausgeben (formatiert)
     */
    printReport() {
        const report = this.getReport();
        
        if (report.error) {
            console.log(report.error);
            return;
        }
        
        console.log('%c📊 PERFORMANCE REPORT', 'font-size: 16px; font-weight: bold;');
        console.log('=====================================');
        
        if (report.fps) {
            console.log('%cFPS:', 'font-weight: bold;');
            console.log(`  Aktuell: ${report.fps.current} FPS`);
            console.log(`  Durchschnitt: ${report.fps.avg.toFixed(1)} FPS`);
            console.log(`  Min/Max: ${report.fps.min} / ${report.fps.max} FPS`);
        }
        
        if (report.memory) {
            console.log('%cMemory:', 'font-weight: bold;');
            console.log(`  Aktuell: ${report.memory.currentMB} MB (${report.memory.usagePercent}%)`);
            console.log(`  Durchschnitt: ${report.memory.avgMB} MB`);
            console.log(`  Min/Max: ${report.memory.minMB} / ${report.memory.maxMB} MB`);
            console.log(`  Limit: ${report.memory.limitMB} MB`);
        }
        
        if (report.longTasks) {
            console.log('%cLong Tasks:', 'font-weight: bold;');
            if (report.longTasks.count === 0) {
                console.log('  ' + report.longTasks.message);
            } else {
                console.log(`  Anzahl: ${report.longTasks.count}`);
                console.log(`  Durchschnitt: ${report.longTasks.avgDuration} ms`);
                console.log(`  Maximum: ${report.longTasks.maxDuration} ms`);
            }
        }
        
        console.log('%cWarnings:', 'font-weight: bold;');
        console.log(`  Gesamt: ${report.warnings.totalWarnings}`);
        console.log(`  FPS: ${report.warnings.fpsWarnings}`);
        console.log(`  Memory: ${report.warnings.memoryWarnings}`);
        console.log(`  Long Tasks: ${report.warnings.longTaskWarnings}`);
        
        console.log('=====================================');
    }
}

// Singleton Instance
const performanceMonitor = new PerformanceMonitor();

// Global verfügbar machen
window.performanceMonitor = performanceMonitor;

// Automatisch starten (kann in Settings deaktiviert werden)
if (localStorage.getItem('performanceMonitoring') !== 'false') {
    performanceMonitor.start();
}
```

---

## 🔧 SCHRITT 2: Integration ins Debug-Menü

**Datei:** `js/ui/debug-menu.js`

**Füge neue Sektion hinzu:**

```javascript
// In createDebugUI() oder ähnlicher Methode:

// Performance Monitor Sektion
const perfSection = document.createElement('div');
perfSection.className = 'debug-section';
perfSection.innerHTML = `
    <h3>📊 Performance Monitor</h3>
    <div class="perf-controls">
        <button id="perf-toggle" class="debug-btn">Stop</button>
        <button id="perf-report" class="debug-btn">Report anzeigen</button>
        <button id="perf-reset" class="debug-btn">Reset</button>
    </div>
    <div id="perf-stats" class="perf-stats">
        <div class="stat-item">
            <span class="stat-label">FPS:</span>
            <span id="stat-fps" class="stat-value">--</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Memory:</span>
            <span id="stat-memory" class="stat-value">--</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Warnings:</span>
            <span id="stat-warnings" class="stat-value">0</span>
        </div>
    </div>
`;

// Event Listener
const toggleBtn = perfSection.querySelector('#perf-toggle');
const reportBtn = perfSection.querySelector('#perf-report');
const resetBtn = perfSection.querySelector('#perf-reset');

toggleBtn.addEventListener('click', () => {
    if (window.performanceMonitor.isMonitoring) {
        window.performanceMonitor.stop();
        toggleBtn.textContent = 'Start';
        toggleBtn.classList.add('inactive');
    } else {
        window.performanceMonitor.start();
        toggleBtn.textContent = 'Stop';
        toggleBtn.classList.remove('inactive');
    }
});

reportBtn.addEventListener('click', () => {
    window.performanceMonitor.printReport();
});

resetBtn.addEventListener('click', () => {
    if (confirm('Performance-Metriken zurücksetzen?')) {
        window.performanceMonitor.reset();
    }
});

// Live-Update der Stats (alle 2 Sekunden)
setInterval(() => {
    const report = window.performanceMonitor.getReport();
    if (report.error) return;
    
    // FPS
    if (report.fps) {
        const fpsEl = document.getElementById('stat-fps');
        if (fpsEl) {
            fpsEl.textContent = `${report.fps.current} (avg: ${report.fps.avg.toFixed(1)})`;
            fpsEl.className = report.fps.current < 30 ? 'stat-value warning' : 'stat-value';
        }
    }
    
    // Memory
    if (report.memory) {
        const memEl = document.getElementById('stat-memory');
        if (memEl) {
            memEl.textContent = `${report.memory.currentMB} MB (${report.memory.usagePercent}%)`;
            memEl.className = parseFloat(report.memory.usagePercent) > 80 ? 'stat-value warning' : 'stat-value';
        }
    }
    
    // Warnings
    const warnEl = document.getElementById('stat-warnings');
    if (warnEl) {
        warnEl.textContent = report.warnings.totalWarnings;
        warnEl.className = report.warnings.totalWarnings > 0 ? 'stat-value warning' : 'stat-value';
    }
}, 2000);
```

---

## 🔧 SCHRITT 3: Stylesheet hinzufügen

**Datei:** `css/debug-menu.css` (oder in `style.css`)

```css
/* Performance Monitor Styles */
.perf-controls {
    display: flex;
    gap: 8px;
    margin: 10px 0;
}

.perf-stats {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-label {
    color: #aaa;
    font-size: 12px;
}

.stat-value {
    color: #0f0;
    font-family: 'Courier New', monospace;
    font-weight: bold;
}

.stat-value.warning {
    color: #f00;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.5; }
}

.debug-btn.inactive {
    background: #555;
}
```

---

## 🔧 SCHRITT 4: In index.html einbinden

**Datei:** `index.html`

**Füge Script-Tag hinzu (NACH core-scripts, VOR main.js):**

```html
<!-- Performance Monitoring -->
<script src="js/utils/performance-monitor.js"></script>
```

---

## 🧪 TESTING

### Test 1: Monitor startet automatisch

**Browser Console prüfen nach App-Start:**
```
📊 PerformanceMonitor initialisiert
🚀 PerformanceMonitor gestartet
🎬 FPS-Monitoring aktiv
🧠 Memory-Monitoring aktiv
⏱️ Long-Task-Monitoring aktiv
```

✅ Alle 3-5 Meldungen müssen erscheinen

---

### Test 2: FPS-Tracking funktioniert

**Nach 10 Sekunden in Console:**
```javascript
window.performanceMonitor.getReport().fps
```

**Erwartetes Ergebnis:**
```javascript
{
  current: 60,
  avg: 58.5,
  min: 55,
  max: 60,
  samples: 10
}
```

---

### Test 3: Memory-Tracking funktioniert

**In Console:**
```javascript
window.performanceMonitor.getReport().memory
```

**Erwartetes Ergebnis:**
```javascript
{
  currentMB: "125.45",
  avgMB: "120.30",
  minMB: "115.20",
  maxMB: "130.50",
  limitMB: "2048.00",
  usagePercent: "6.1",
  samples: 6
}
```

---

### Test 4: Long Task Detection

**Teste mit absichtlichem Freeze:**
```javascript
// In Console ausführen:
const start = Date.now();
while (Date.now() - start < 100) {} // 100ms Block

// Danach prüfen:
window.performanceMonitor.getReport().longTasks
```

**Erwartetes Ergebnis:**
```javascript
{
  count: 1,
  avgDuration: "102.50",
  maxDuration: "102.50",
  recent: [{ duration: 102.5, ... }]
}
```

---

### Test 5: Debug-Menü Integration

1. Öffne Debug-Menü
2. Scrolle zu "Performance Monitor"
3. Prüfe:
   - ✅ FPS-Wert wird angezeigt
   - ✅ Memory-Wert wird angezeigt
   - ✅ Warnings-Zähler funktioniert
   - ✅ Buttons funktionieren

---

### Test 6: Report in Console

**Klicke im Debug-Menü auf "Report anzeigen"**

**Erwartetes Ergebnis in Console:**
```
📊 PERFORMANCE REPORT
=====================================
FPS:
  Aktuell: 60 FPS
  Durchschnitt: 58.5 FPS
  Min/Max: 50 / 60 FPS
Memory:
  Aktuell: 125.45 MB (6.1%)
  Durchschnitt: 120.30 MB
  Min/Max: 115.20 / 130.50 MB
  Limit: 2048.00 MB
Long Tasks:
  Keine Long Tasks erkannt ✅
Warnings:
  Gesamt: 0
  FPS: 0
  Memory: 0
  Long Tasks: 0
=====================================
```

---

## ✅ ERFOLGSKRITERIEN

- ✅ PerformanceMonitor startet automatisch
- ✅ FPS wird sekunden-genau getrackt
- ✅ Memory wird alle 5s gemessen
- ✅ Long Tasks werden erkannt
- ✅ Warnings erscheinen bei Problemen
- ✅ Debug-Menü zeigt Live-Stats
- ✅ Report-Funktion funktioniert
- ✅ Start/Stop/Reset-Buttons funktionieren

---

## 🚀 COMMIT MESSAGE

```
📊 FEAT: Performance Monitor v1.0.0 implementiert

- Neue Datei: js/utils/performance-monitor.js
- FPS-Tracking (sekunden-genau)
- Memory-Monitoring (alle 5s)
- Long-Task-Detection (>50ms)
- Integration ins Debug-Menü
- Live-Stats-Anzeige
- Report-Funktion
- Automatische Warnings bei Problemen

Dateien:
- js/utils/performance-monitor.js (NEU)
- js/ui/debug-menu.js
- css/debug-menu.css
- index.html

Testing:
- ✅ FPS-Tracking funktioniert
- ✅ Memory-Monitoring aktiv
- ✅ Long Tasks werden erkannt
- ✅ Debug-Menü zeigt Live-Stats
```

---

**Status:** 📋 Bereit zur Implementierung  
**Geschätzte Zeit:** 3 Stunden  
**Priorität:** 🟡 HOCH
