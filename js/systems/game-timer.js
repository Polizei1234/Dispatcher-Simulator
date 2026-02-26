// =========================
// GAME TIMER v1.0
// Spiel-Zeit-System für realistische Tag/Nacht-Zyklen
// Integration mit Weather-System und Incident-Types
// =========================

class GameTimer {
    constructor() {
        // Start: 08:00 Uhr
        this.currentHour = 8;
        this.currentMinute = 0;
        this.currentDay = 1;
        this.currentMonth = 6; // Juni (Sommer)
        this.currentYear = 2024;
        
        // Zeitfaktor: 1 Echtzeit-Minute = X Spiel-Minuten
        this.timeAcceleration = 10; // 1 Echtzeit-Min = 10 Spiel-Min
        
        this.interval = null;
        this.listeners = [];
    }
    
    /**
     * Startet Game-Timer
     */
    start() {
        if (this.interval) return;
        
        // Jede Sekunde = ~10 Spiel-Sekunden (bei acceleration=10)
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
        
        console.log(`⏰ Game Timer gestartet: ${this.getTimeString()}`);
        this.updateUI();
    }
    
    /**
     * Tick: Erhöht Zeit um 1 Echtzeit-Sekunde = timeAcceleration * Spiel-Sekunden
     */
    tick() {
        // timeAcceleration * 1 Sekunde = X Spiel-Sekunden
        const secondsToAdd = this.timeAcceleration;
        
        this.currentMinute += Math.floor(secondsToAdd / 60);
        
        if (this.currentMinute >= 60) {
            this.currentHour += Math.floor(this.currentMinute / 60);
            this.currentMinute = this.currentMinute % 60;
            
            this.onHourChange();
        }
        
        if (this.currentHour >= 24) {
            this.currentDay++;
            this.currentHour = this.currentHour % 24;
            
            this.onDayChange();
        }
        
        this.updateUI();
        this.notifyListeners();
    }
    
    /**
     * Event: Stunde hat sich geändert
     */
    onHourChange() {
        console.log(`⏰ Stunde: ${this.getTimeString()}`);
        
        // Update Weather-System
        if (window.weatherSystem) {
            window.weatherSystem.updateTimeOfDay(this.currentHour);
        }
    }
    
    /**
     * Event: Tag hat sich geändert
     */
    onDayChange() {
        console.log(`📅 Tag ${this.currentDay}`);
        
        // Jeden 30. Tag = neuer Monat
        if (this.currentDay > 30) {
            this.currentMonth++;
            this.currentDay = 1;
            
            if (this.currentMonth > 12) {
                this.currentMonth = 1;
                this.currentYear++;
            }
            
            // Update Season im Weather-System
            if (window.weatherSystem) {
                window.weatherSystem.setSeason(this.currentMonth);
            }
        }
    }
    
    /**
     * Listener registrieren
     */
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * Benachrichtige alle Listener
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback({
            hour: this.currentHour,
            minute: this.currentMinute,
            day: this.currentDay,
            month: this.currentMonth,
            year: this.currentYear
        }));
    }
    
    /**
     * Getter
     */
    getCurrentHour() {
        return this.currentHour;
    }
    
    getCurrentMinute() {
        return this.currentMinute;
    }
    
    getCurrentMonth() {
        return this.currentMonth;
    }
    
    getTimeString() {
        const h = String(this.currentHour).padStart(2, '0');
        const m = String(this.currentMinute).padStart(2, '0');
        return `${h}:${m}`;
    }
    
    getDateString() {
        return `${this.currentDay}.${this.currentMonth}.${this.currentYear}`;
    }
    
    getFullString() {
        return `${this.getDateString()} ${this.getTimeString()} Uhr`;
    }
    
    /**
     * Setter für Zeitbeschleunigung
     */
    setTimeAcceleration(factor) {
        this.timeAcceleration = Math.max(1, Math.min(60, factor));
        console.log(`⏰ Zeitbeschleunigung: ${this.timeAcceleration}x`);
    }
    
    /**
     * Zeit manuell setzen
     */
    setTime(hour, minute = 0) {
        this.currentHour = Math.max(0, Math.min(23, hour));
        this.currentMinute = Math.max(0, Math.min(59, minute));
        
        this.updateUI();
        this.onHourChange();
    }
    
    /**
     * Monat manuell setzen (für Saisontest)
     */
    setMonth(month) {
        this.currentMonth = Math.max(1, Math.min(12, month));
        
        if (window.weatherSystem) {
            window.weatherSystem.setSeason(this.currentMonth);
        }
    }
    
    /**
     * UI aktualisieren
     */
    updateUI() {
        const timeEl = document.getElementById('game-time');
        if (timeEl) {
            timeEl.textContent = this.getTimeString();
        }
        
        const dateEl = document.getElementById('game-date');
        if (dateEl) {
            dateEl.textContent = this.getDateString();
        }
    }
    
    /**
     * Stoppen
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    /**
     * Pausieren/Fortsetzen
     */
    toggle() {
        if (this.interval) {
            this.stop();
            console.log('⏰ Game Timer pausiert');
        } else {
            this.start();
            console.log('⏰ Game Timer fortgesetzt');
        }
    }
}

// Globale Instanz
window.GameTimer = GameTimer;

console.log('⏰ Game Timer v1.0 geladen');