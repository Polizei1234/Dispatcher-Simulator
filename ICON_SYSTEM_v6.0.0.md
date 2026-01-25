# 🎨 Icon System v6.0.0 - Professional Edition

## Übersicht

Version 6.0.0 bringt ein komplett überarbeitetes Icon-System mit Fokus auf Schönheit, Funktionalität und Professionalität. Alle Icons wurden mit modernen CSS-Techniken optimiert für ein realistisches Leitstellenerlebnis.

---

## 🗺️ Karten-Icons (map-icons.css)

### Station Markers - Wachen

**Design-Merkmale:**
- Kreisförmige Container mit farbigen Rändern
- Drop-Shadow-Effekte für Tiefe
- Hover-Vergrößerung (Scale 1.15)
- Farbkodierung nach Wachentyp

**Stationstypen:**

| Typ | Farbe | Icon | Box-Shadow |
|-----|-------|------|------------|
| RTW | Rot (#d32f2f) | 🚑 | rgba(211, 47, 47, 0.4) |
| NEF | Orange (#f57c00) | 🚁 | rgba(245, 124, 0, 0.4) |
| KTW | Grün (#388e3c) | 🚐 | rgba(56, 142, 60, 0.4) |
| Standard | Blau (#1976d2) | 🏥 | rgba(25, 118, 210, 0.4) |

**CSS-Features:**
```css
.station-icon-container {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid;
    box-shadow: 0 2px 8px;
}
```

---

### Vehicle Markers - Fahrzeuge

**Design-Merkmale:**
- Abgerundete Rechtecke (8px Radius)
- Gradient-Hintergründe je nach Status
- Pulse-Animation für Aufmerksamkeit
- Drop-Shadow für 3D-Effekt

**FMS-Status-Farbcodierung:**

#### Status 2 - Auf Wache 🟢
```css
border-color: #4caf50;
background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
```

#### Status 3/4 - Einsatzfahrt 🟠
```css
border-color: #ff9800;
background: linear-gradient(135deg, #e65100 0%, #f57c00 100%);
animation: statusActivePulse 1.5s infinite;
```

#### Status 5 - Sprechwunsch 🔵
```css
border-color: #2196f3;
background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
```

#### Status 0 - NOTFALL 🔴
```css
border-color: #f44336;
background: linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%);
animation: emergencyFlash 0.5s infinite;
box-shadow: 0 4px 20px rgba(244, 67, 54, 0.9);
```

**Spezial-Animationen:**

**Emergency Flash:**
```css
@keyframes emergencyFlash {
    0%, 100% {
        border-color: #f44336;
    }
    50% {
        border-color: #ffffff;
    }
}
```

**Emergency Shake:**
```css
@keyframes emergencyShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}
```

---

### Incident Markers - Einsätze

**Design-Philosophie:**
Maximale Aufmerksamkeit durch mehrschichtige Effekte

**Layer-Struktur:**
1. **Pulse Ring** (äußerer Ring)
   - Radial Gradient
   - 2s Animation
   - Scale 0.8 → 1.8

2. **Icon Container** (mittlere Ebene)
   - Gradient-Hintergrund
   - 3px weißer Border
   - Bounce-Animation

3. **Icon** (Zentrum)
   - Font Awesome Icon
   - Weiß (#ffffff)
   - 20px Größe

**Standard Incident:**
```css
.incident-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 16px rgba(211, 47, 47, 0.8);
    animation: incidentBounce 1.5s infinite;
}
```

**High Priority (dringlich):**
```css
.incident-priority-high .incident-icon {
    animation: incidentUrgent 0.8s infinite;
    border-color: #ffc107;
    box-shadow: 0 4px 20px rgba(255, 193, 7, 0.9);
}
```

---

## 📞 Notrufsystem-Icons (call-system.css)

### Chat-Nachrichten

**Dispatcher-Nachricht:**
- Blauer Gradient-Hintergrund
- Linker Border: 3px blau
- Icon: 📡 (vor der Nachricht, Position absolute)
- Slide-In Animation

```css
.msg-dispatcher::before {
    content: '\f3cd'; /* Radio Icon */
    background: var(--secondary-blue);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
}
```

**Anrufer-Nachricht:**
- Oranger Gradient-Hintergrund
- Linker Border: 3px orange
- Icon: 📞 (vor der Nachricht)
- Slide-In Animation

### Frage-Buttons

**Design:**
- Linker Border: 3px cyan
- Hover: Transform translateX(4px)
- Icons vor jedem Button
- Collapsible Categories

```css
.q-btn {
    border-left: 3px solid var(--info-cyan);
}

.q-btn:hover {
    border-left-color: var(--primary-red);
    transform: translateX(4px);
}
```

### Modal-Fenster

**Animations:**
- Fade-In für Overlay
- Slide-Up für Content
- Rotation für Close-Button

```css
@keyframes modalSlideUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

---

## 🔽 Dropdown-Icons (keywords-dropdown.css)

### Keyword-Items

**Icon-System nach Kategorie:**

| Kategorie | Icon | Farbe |
|-----------|------|-------|
| Medical | 🏥 (f0f0) | Rot |
| Trauma | 🤕 (f7f9) | Orange |
| Cardiac | ❤️ (f21e) | Dunkelrot |
| Respiratory | 🫁 (f5dc) | Cyan |
| Neurological | 🧠 (f5ce) | Blau |
| Pediatric | 👶 (f77c) | Lila |

**CSS-Implementation:**
```css
.stichwort-item[data-type="medical"]::before {
    content: '\f0f0';
    color: var(--danger-red);
}
```

### Prioritäts-Badges

**High Priority:**
```css
background: rgba(211, 47, 47, 0.2);
color: var(--danger-red);
border: 1px solid rgba(211, 47, 47, 0.4);
```

**Medium Priority:**
```css
background: rgba(245, 124, 0, 0.2);
color: var(--warning-orange);
```

**Low Priority:**
```css
background: rgba(56, 142, 60, 0.2);
color: var(--success-green);
```

### Interaktive States

**Hover:**
- Background: var(--bg-dark)
- Transform: translateX(4px)

**Active/Selected:**
- Left Border: 3px cyan
- Gradient-Hintergrund

**Keyboard-Navigation:**
- Zusätzliches Icon rechts: ⏎
- Pulse-Animation

---

## ✨ Spezial-Effekte

### Glow-Effekte

**Verfügbare Klassen:**
```css
.icon-glow-red { filter: drop-shadow(0 0 8px rgba(211, 47, 47, 0.6)); }
.icon-glow-blue { filter: drop-shadow(0 0 8px rgba(25, 118, 210, 0.6)); }
.icon-glow-green { filter: drop-shadow(0 0 8px rgba(56, 142, 60, 0.6)); }
.icon-glow-orange { filter: drop-shadow(0 0 8px rgba(245, 124, 0, 0.6)); }
```

### Pulse-Animationen

**Vehicle Pulse (subtil):**
```css
@keyframes vehiclePulse {
    0%, 100% { box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5); }
    50% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7); }
}
```

**Incident Pulse (auffällig):**
```css
@keyframes incidentPulse {
    0% { transform: scale(0.8); opacity: 1; }
    50% { transform: scale(1.8); opacity: 0.3; }
    100% { transform: scale(0.8); opacity: 1; }
}
```

---

## 🎯 Best Practices

### Performance
- Transform statt Position/Margin für Animationen
- Will-change nur für aktive Animationen
- GPU-beschleunigte Eigenschaften bevorzugen

### Accessibility
- Ausreichender Kontrast für alle Icons
- Hover-States für alle interaktiven Elemente
- Keyboard-Navigation unterstützt

### Konsistenz
- Einheitliche Border-Radius: 50% (rund), 8px (Fahrzeuge)
- Einheitliche Shadow-Stufen: 0.3, 0.4, 0.6, 0.9
- Einheitliche Animation-Zeiten: 0.2s (schnell), 1.5s (mittel), 2s (langsam)

---

## 📱 Responsive Verhalten

### Breakpoints

**1024px:**
- Icons bleiben gleich groß
- Abstände reduziert

**768px:**
- Font-Size auf 16px (verhindert iOS-Zoom)
- Padding reduziert
- Dropdown-Höhe angepasst

---

## 🔧 Technische Details

### CSS-Variablen verwendet
```css
var(--primary-red)
var(--secondary-blue)
var(--success-green)
var(--warning-orange)
var(--danger-red)
var(--info-cyan)
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
```

### Font Awesome 6 Free
Alle Icons nutzen Font Awesome 6 Free:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

### Browser-Kompatibilität
- Chrome/Edge: ✅ Vollständig
- Firefox: ✅ Vollständig
- Safari: ✅ Vollständig (mit Vendor-Präfixen)
- Mobile: ✅ Optimiert

---

## 🎨 Farbpalette Übersicht

```css
/* Primärfarben */
--primary-red: #d32f2f
--secondary-blue: #1976d2
--success-green: #388e3c
--warning-orange: #f57c00
--danger-red: #c62828
--info-cyan: #0288d1

/* Graustufen */
--bg-darkest: #1a1d23
--bg-dark: #252932
--panel-bg: #2a2f3a
--panel-header: #1f2329
--input-bg: #1e2128

/* Borders */
--border-light: #3a3f4b
--border-medium: #4a5160
--border-strong: #5a6270
```

---

**Erstellt für Version 6.0.0 - Professional Edition**  
**Datum:** 25. Januar 2026  
**Autor:** Polizei1234