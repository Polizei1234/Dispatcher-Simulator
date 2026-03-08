# 🚀 Optimization Strategy - Dispatcher Simulator

> **Umfassende Strategie für Performance, Skalierbarkeit und Code-Qualität**

**Erstellt:** 08.03.2026  
**Status:** 🟡 In Planung  
**Priorität:** ⭐⭐⭐⭐⭐ HOCH

---

## 📋 Inhaltsverzeichnis

1. [Performance-Monitoring](#performance-monitoring)
2. [State-Management](#state-management)
3. [API-Integration & Rate-Limiting](#api-integration)
4. [Template-System Migration](#template-system-migration)
5. [Öffentliche Datenquellen](#öffentliche-datenquellen)
6. [Firebase Integration](#firebase-integration)
7. [Worker-Thread Architektur](#worker-threads)
8. [PWA Implementation](#pwa-implementation)
9. [Erkannte Probleme](#erkannte-probleme)

---

## 🎯 Performance-Monitoring

### Aktuelle Situation
- ✅ Phase 3.1 Performance-Optimierungen abgeschlossen
- ✅ CPU-Last reduziert (Idle: -75%, Aktiv: -58%)
- ❌ Kein systematisches Monitoring implementiert
- ❌ Keine Metriken-Erfassung für Regressions-Erkennung

### Strategie: Performance Observer API

```javascript
// js/utils/performance-monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      cpu: [],
      memory: [],
      renderTime: []
    };
    this.setupObservers();
  }

  setupObservers() {
    // FPS Monitoring
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        if (fps < 30) console.warn(`⚠️ Low FPS: ${fps}`);
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };
    measureFPS();

    // Memory Monitoring (wenn verfügbar)
    if (performance.memory) {
      setInterval(() => {
        const used = performance.memory.usedJSHeapSize / 1048576;
        this.metrics.memory.push(used);
        if (used > 200) console.warn(`⚠️ High Memory: ${used.toFixed(2)} MB`);
      }, 5000);
    }

    // Long Tasks API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long Task detected: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  }

  getReport() {
    return {
      avgFPS: this.average(this.metrics.fps),
      avgMemory: this.average(this.metrics.memory),
      minFPS: Math.min(...this.metrics.fps),
      maxMemory: Math.max(...this.metrics.memory)
    };
  }

  average(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }
}
```

### Integration
```javascript
// In main.js
const perfMonitor = new PerformanceMonitor();

// Debug-Menü Eintrag
setInterval(() => {
  const report = perfMonitor.getReport();
  console.log('📊 Performance Report:', report);
}, 30000); // Alle 30s
```

---

## 🗂️ State-Management

### Aktuelles Problem
- ❌ State verteilt über viele globale Variablen
- ❌ Keine Single Source of Truth
- ❌ Schwierig zu debuggen und testen
- ❌ Race Conditions bei asynchronen Updates

### Strategie: Zentraler State Store

```javascript
// js/core/state-manager.js
class StateManager {
  constructor() {
    this.state = {
      vehicles: new Map(),
      incidents: new Map(),
      gameTime: {
        current: new Date(),
        speed: 1,
        isPaused: false
      },
      weather: {
        condition: 'clear',
        temperature: 20,
        visibility: 10
      },
      settings: {
        maxConcurrentIncidents: 5,
        autoDispatch: false,
        soundEnabled: true
      },
      statistics: {
        totalIncidents: 0,
        completedIncidents: 0,
        avgResponseTime: 0
      }
    };
    
    this.listeners = new Map();
    this.history = []; // Für Time-Travel Debugging
    this.maxHistorySize = 50;
  }

  // Immutable State Updates
  setState(path, value, action = 'UPDATE') {
    const oldState = JSON.parse(JSON.stringify(this.state));
    
    // Update State
    this.setNestedProperty(this.state, path, value);
    
    // History für Debugging
    this.history.push({
      timestamp: Date.now(),
      action,
      path,
      oldValue: this.getNestedProperty(oldState, path),
      newValue: value
    });
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    
    // Notify Listeners
    this.notifyListeners(path, value, oldState);
  }

  getState(path) {
    return this.getNestedProperty(this.state, path);
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    this.listeners.get(path).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(path);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    };
  }

  notifyListeners(path, value, oldState) {
    // Notify exact path listeners
    if (this.listeners.has(path)) {
      this.listeners.get(path).forEach(cb => cb(value, oldState));
    }
    
    // Notify wildcard listeners (e.g., 'vehicles.*')
    const pathParts = path.split('.');
    for (let i = pathParts.length; i > 0; i--) {
      const wildcardPath = pathParts.slice(0, i).join('.') + '.*';
      if (this.listeners.has(wildcardPath)) {
        this.listeners.get(wildcardPath).forEach(cb => cb(value, oldState));
      }
    }
  }

  // Helper: Nested Property Access
  getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => acc[part], obj);
    target[last] = value;
  }

  // Debugging
  getHistory() {
    return this.history;
  }

  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  importState(jsonState) {
    this.state = JSON.parse(jsonState);
    this.notifyListeners('*', this.state, {});
  }
}

// Singleton Instance
const gameState = new StateManager();
export default gameState;
```

### Migration Beispiel

**Vorher (global variables):**
```javascript
let vehicles = [];
let incidents = [];

function addIncident(incident) {
  incidents.push(incident);
  updateUI();
}
```

**Nachher (State Manager):**
```javascript
import gameState from './core/state-manager.js';

function addIncident(incident) {
  const incidents = gameState.getState('incidents');
  incidents.set(incident.id, incident);
  gameState.setState('incidents', incidents, 'ADD_INCIDENT');
}

// UI reagiert automatisch
gameState.subscribe('incidents.*', (incidents) => {
  updateIncidentList(incidents);
});
```

---

## 🌐 API-Integration & Rate-Limiting

### Aktuelles Problem
- ❌ Groq API wird für jeden Einsatz einzeln aufgerufen
- ❌ Kein Rate-Limiting implementiert
- ❌ Keine Fehlerbehandlung bei API-Überlastung
- ❌ Hohe API-Kosten

### Strategie: Request Queue + Batch Processing

```javascript
// js/utils/api-rate-limiter.js
class APIRateLimiter {
  constructor(config) {
    this.maxRequestsPerMinute = config.maxRequestsPerMinute || 20;
    this.batchSize = config.batchSize || 5;
    this.queue = [];
    this.requestTimestamps = [];
    this.processing = false;
  }

  async request(endpoint, data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ endpoint, data, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    // Check Rate Limit
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      t => now - t < 60000
    );
    
    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.requestTimestamps);
      const waitTime = 60000 - (now - oldestRequest);
      console.warn(`⏳ Rate limit reached. Waiting ${waitTime}ms`);
      setTimeout(() => {
        this.processing = false;
        this.processQueue();
      }, waitTime);
      return;
    }
    
    // Process Batch
    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      const results = await Promise.all(
        batch.map(item => this.executeRequest(item))
      );
      
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
    
    this.requestTimestamps.push(Date.now());
    this.processing = false;
    
    // Continue if queue not empty
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  async executeRequest({ endpoint, data }) {
    // Implement actual API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Singleton
const groqLimiter = new APIRateLimiter({
  maxRequestsPerMinute: 20,
  batchSize: 3
});

export default groqLimiter;
```

### Integration mit Groq AI

```javascript
// Vorher
async function generateIncident() {
  const response = await fetch(GROQ_ENDPOINT, {...});
  return await response.json();
}

// Nachher
import groqLimiter from './utils/api-rate-limiter.js';

async function generateIncident() {
  try {
    return await groqLimiter.request(GROQ_ENDPOINT, incidentData);
  } catch (error) {
    console.error('Failed to generate incident:', error);
    // Fallback zu lokalem Template
    return generateLocalIncident();
  }
}
```

---

## 📝 Template-System Migration

### Problem-Analyse

**Aktueller Zustand:**
- 📦 **~1.3 MB Templates**: 65+ JS-Dateien
- 🐌 **Langsamer Load**: Alle Templates müssen geparsed werden
- 🔄 **Duplikate**: `angina-pectoris.js` + `angina_pectoris.js`
- 💾 **Memory**: Alle bleiben im Speicher
- 🔧 **Wartung**: 65 Dateien manuell pflegen

### Migrations-Plan

**⚠️ WICHTIG: Erst mit detailliertem Plan fortfahren!**

Siehe separates Dokument: `docs/technical/INCIDENT_SYSTEM_REDESIGN.md`

---

## 🌍 Öffentliche Datenquellen

### OpenStreetMap (Overpass API)

**Use Case:** Realistische POIs und Orte

```javascript
// js/services/osm-service.js
class OSMService {
  constructor() {
    this.overpassURL = 'https://overpass-api.de/api/interpreter';
    this.cache = new Map();
    this.cacheDuration = 7 * 24 * 60 * 60 * 1000; // 7 Tage
  }

  async getHospitals(bbox) {
    const cacheKey = `hospitals_${bbox.join('_')}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const query = `
      [out:json];
      (
        node["amenity"="hospital"](${bbox.join(',')});
        way["amenity"="hospital"](${bbox.join(',')});
      );
      out center;
    `;

    const response = await fetch(this.overpassURL, {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    const hospitals = this.parseOSMData(data);
    
    this.setCache(cacheKey, hospitals);
    return hospitals;
  }

  async getPOIs(type, bbox) {
    const types = {
      'schools': 'amenity=school',
      'nursing_homes': 'amenity=nursing_home',
      'industrial': 'landuse=industrial',
      'residential': 'landuse=residential'
    };

    const query = `
      [out:json];
      node["${types[type]}"](${bbox.join(',')});
      out center;
    `;

    const response = await fetch(this.overpassURL, {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    return this.parseOSMData(data);
  }

  parseOSMData(data) {
    return data.elements.map(el => ({
      id: el.id,
      name: el.tags?.name || 'Unbenannt',
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      tags: el.tags
    }));
  }

  // Cache Management
  getFromCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export default new OSMService();
```

### OpenWeatherMap API

**Use Case:** Echtes Wetter für Waiblingen

```javascript
// js/services/weather-service.js
class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.location = { lat: 48.8295, lon: 9.3169 }; // Waiblingen
  }

  async getCurrentWeather() {
    const url = `${this.baseURL}/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${this.apiKey}&units=metric&lang=de`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      condition: this.mapCondition(data.weather[0].main),
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      visibility: data.visibility / 1000, // km
      description: data.weather[0].description
    };
  }

  mapCondition(owmCondition) {
    const mapping = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Snow': 'snow',
      'Thunderstorm': 'storm',
      'Fog': 'fog'
    };
    return mapping[owmCondition] || 'clear';
  }

  // Einfluss auf Gameplay
  getGameplayModifiers(weather) {
    const modifiers = {
      drivingSpeedMultiplier: 1.0,
      incidentProbabilityMultiplier: 1.0,
      incidentTypes: []
    };

    switch (weather.condition) {
      case 'rain':
        modifiers.drivingSpeedMultiplier = 0.8; // 20% langsamer
        modifiers.incidentProbabilityMultiplier = 1.3; // 30% mehr Unfälle
        modifiers.incidentTypes.push('verkehrsunfall');
        break;
      
      case 'snow':
        modifiers.drivingSpeedMultiplier = 0.6;
        modifiers.incidentProbabilityMultiplier = 1.5;
        modifiers.incidentTypes.push('verkehrsunfall', 'unterkuehlung');
        break;
      
      case 'storm':
        modifiers.drivingSpeedMultiplier = 0.7;
        modifiers.incidentProbabilityMultiplier = 1.4;
        modifiers.incidentTypes.push('verletzung', 'sturz');
        break;

      default:
        // Hitze
        if (weather.temperature > 30) {
          modifiers.incidentTypes.push('hitzschlag', 'kreislaufkollaps');
          modifiers.incidentProbabilityMultiplier = 1.2;
        }
    }

    return modifiers;
  }
}

export default WeatherService;
```

### Nominatim (Geocoding)

```javascript
// js/services/geocoding-service.js
class GeocodingService {
  constructor() {
    this.baseURL = 'https://nominatim.openstreetmap.org';
    this.cache = new Map();
  }

  async reverseGeocode(lat, lon) {
    const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const url = `${this.baseURL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Dispatcher-Simulator/2.0'
      }
    });
    
    const data = await response.json();
    const address = this.parseAddress(data);
    
    this.cache.set(cacheKey, address);
    return address;
  }

  parseAddress(data) {
    const addr = data.address;
    return {
      street: addr.road || addr.pedestrian || '',
      houseNumber: addr.house_number || '',
      postcode: addr.postcode || '',
      city: addr.city || addr.town || addr.village || '',
      district: addr.suburb || addr.neighbourhood || '',
      formatted: data.display_name
    };
  }
}

export default new GeocodingService();
```

---

## 🔥 Firebase Integration

### Warum Firebase?
- ✅ Echtzeit-Datenbank für Multiplayer
- ✅ Cloud Storage für Saves
- ✅ Authentication für User-Accounts
- ✅ Offline-Persistenz built-in
- ✅ Kostenlos für kleine Projekte

### Setup Guide

**1. Firebase Projekt erstellen**
```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Login
firebase login

# Projekt initialisieren
firebase init
# Wähle: Firestore, Hosting, Storage
```

**2. Firebase Config**
```javascript
// js/core/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dispatcher-sim.firebaseapp.com",
  projectId: "dispatcher-sim",
  storageBucket: "dispatcher-sim.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

**3. Firestore Schema**
```
/users/{userId}
  - username: string
  - email: string
  - createdAt: timestamp
  - stats: {
      totalIncidents: number,
      avgResponseTime: number,
      level: number
    }

/saves/{saveId}
  - userId: string
  - name: string
  - timestamp: timestamp
  - gameState: {
      vehicles: array,
      incidents: array,
      gameTime: object
    }

/incidents_pool/{incidentId}
  - type: string
  - template: object
  - aiGenerated: boolean
  - usageCount: number
  - rating: number

/leaderboards/global
  - rankings: array[{
      userId: string,
      score: number,
      avgResponseTime: number
    }]
```

**4. Save/Load System**
```javascript
// js/services/firebase-save-service.js
import { db, auth } from '../core/firebase-config.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  query,
  where,
  getDocs 
} from 'firebase/firestore';

class FirebaseSaveService {
  async saveGame(saveName) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const gameState = this.captureGameState();
    const saveId = `${user.uid}_${Date.now()}`;

    await setDoc(doc(db, 'saves', saveId), {
      userId: user.uid,
      name: saveName,
      timestamp: new Date(),
      gameState: gameState
    });

    console.log('✅ Game saved to cloud:', saveId);
    return saveId;
  }

  async loadGame(saveId) {
    const docRef = doc(db, 'saves', saveId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Save not found');
    }

    const data = docSnap.data();
    this.restoreGameState(data.gameState);
    console.log('✅ Game loaded from cloud:', saveId);
  }

  async listSaves() {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, 'saves'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  captureGameState() {
    return {
      vehicles: Array.from(gameState.getState('vehicles').values()),
      incidents: Array.from(gameState.getState('incidents').values()),
      gameTime: gameState.getState('gameTime'),
      statistics: gameState.getState('statistics'),
      settings: gameState.getState('settings')
    };
  }

  restoreGameState(state) {
    gameState.setState('vehicles', new Map(state.vehicles.map(v => [v.id, v])));
    gameState.setState('incidents', new Map(state.incidents.map(i => [i.id, i])));
    gameState.setState('gameTime', state.gameTime);
    gameState.setState('statistics', state.statistics);
    gameState.setState('settings', state.settings);
  }
}

export default new FirebaseSaveService();
```

---

## 👷 Worker-Thread Architektur

### Use Cases
- 🗺️ Route-Berechnungen (OSRM API)
- 🤖 AI-Verarbeitung (Groq)
- 📊 Statistik-Auswertungen
- 📦 Große JSON-Operationen

### Implementation

```javascript
// js/workers/route-worker.js
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'CALCULATE_ROUTE':
      const route = await calculateRoute(data.from, data.to);
      self.postMessage({ type: 'ROUTE_RESULT', data: route });
      break;

    case 'BATCH_ROUTES':
      const routes = await Promise.all(
        data.routes.map(r => calculateRoute(r.from, r.to))
      );
      self.postMessage({ type: 'BATCH_RESULT', data: routes });
      break;
  }
});

async function calculateRoute(from, to) {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
  );
  return await response.json();
}
```

```javascript
// js/services/route-service.js
class RouteService {
  constructor() {
    this.worker = new Worker('js/workers/route-worker.js');
    this.pendingRequests = new Map();
    this.requestId = 0;

    this.worker.addEventListener('message', (e) => {
      const { type, data, requestId } = e.data;
      const resolver = this.pendingRequests.get(requestId);
      
      if (resolver) {
        resolver(data);
        this.pendingRequests.delete(requestId);
      }
    });
  }

  async calculateRoute(from, to) {
    const requestId = this.requestId++;
    
    return new Promise((resolve) => {
      this.pendingRequests.set(requestId, resolve);
      this.worker.postMessage({
        type: 'CALCULATE_ROUTE',
        requestId,
        data: { from, to }
      });
    });
  }
}

export default new RouteService();
```

---

## 📱 PWA Implementation

### Service Worker

```javascript
// service-worker.js
const CACHE_NAME = 'dispatcher-sim-v2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main-bundle.js',
  // ... weitere Assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});
```

### Manifest

```json
// manifest.json
{
  "name": "Dispatcher Simulator",
  "short_name": "DispatchSim",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#0f3460",
  "orientation": "landscape",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🐛 Erkannte Probleme

### Kritisch (Sofort beheben)
1. ❌ **Memory Leaks**: Event-Listener ohne Cleanup
2. ❌ **Race Conditions**: Asynchrone Groq-Calls ohne Locking
3. ❌ **Keine Error Boundaries**: Ein Crash stoppt alles
4. ❌ **State Inkonsistenz**: Verteilter State ohne SSOT
5. ❌ **Template Duplikate**: `angina-pectoris.js` + `angina_pectoris.js`

### Hoch (Nächste 2 Wochen)
1. ⚠️ **Fehlende Rate Limits**: API kann überlastet werden
2. ⚠️ **Keine Routen-Cache-TTL**: Memory wächst unbegrenzt
3. ⚠️ **Config-Dateien Überschneidung**: `config.js` + `version-config.js`
4. ⚠️ **Zwei Timer-Systeme**: `game-timer.js` + `mission-timer.js`
5. ⚠️ **Debug-Menu Production**: 26KB sollten in Dev-Build ausgelagert werden

### Mittel (Nächste 4 Wochen)
1. 📋 **Call-Template-Mapper**: Nur teilweise integriert
2. 📋 **Weather-System**: Framework da, aber nicht im Gameplay
3. 📋 **IndexedDB statt LocalStorage**: Mehr Speicher nötig
4. 📋 **Code-Splitting**: Reduce bundle size
5. 📋 **Lazy Loading**: Sounds erst bei Aktivierung

### Niedrig (Nice-to-have)
1. 💡 **Image Sprites**: Icons in Sprite-Sheet
2. 💡 **Compression**: Gzip/Brotli aktivieren
3. 💡 **Debouncing**: UI-Updates mit 16ms cap

---

## 📊 Migrations-Prioritäten

### Phase 1: Fundament (2 Wochen)
1. ✅ State-Manager implementieren
2. ✅ Performance-Monitor setup
3. ✅ API Rate-Limiter implementieren
4. ✅ Memory Leaks fixen

### Phase 2: Cloud-Ready (3 Wochen)
1. 🔄 Firebase Integration
2. 🔄 PWA Setup
3. 🔄 Save/Load Cloud

### Phase 3: Performance (2 Wochen)
1. ⏳ Worker-Threads
2. ⏳ Code-Splitting
3. ⏳ Route-Cache TTL

### Phase 4: Features (4 Wochen)
1. ⏳ Öffentliche APIs (OSM, Weather)
2. ⏳ Incident-System Redesign
3. ⏳ Template Migration

---

## 🎯 Erfolgskriterien

- ✅ FPS konstant > 55
- ✅ Memory < 150 MB
- ✅ Load Time < 2s
- ✅ API Costs < 50% reduziert
- ✅ Bundle Size < 500 KB
- ✅ Offline-fähig

---

**Nächste Schritte:**
1. Detailplanung Incident-System (siehe `INCIDENT_SYSTEM_REDESIGN.md`)
2. State-Manager Prototype
3. Performance-Monitor Integration

**Letzte Aktualisierung:** 08.03.2026  
**Maintainer:** @Polizei1234