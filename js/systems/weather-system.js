// =========================
// WEATHER SYSTEM v1.0
// Dynamisches Wetter beeinflusst Einsätze
// =========================

const WEATHER_CONDITIONS = {
    CLEAR: {
        id: 'clear',
        name: 'Trocken',
        icon: '☀️',
        probability: 0.50,
        incidentMultiplier: 1.0,
        durationMultiplier: 1.0,
        speedReduction: 1.0
    },
    RAIN: {
        id: 'rain',
        name: 'Regen',
        icon: '🌧️',
        probability: 0.25,
        incidentMultiplier: 1.3, // 30% mehr Einsätze
        durationMultiplier: 1.15, // 15% länger
        speedReduction: 0.85, // 15% langsamer
        incidentTypes: {
            'VU': 2.0,  // Doppelt so viele Unfälle
            'VU P': 1.8,
            'RD 1': 1.2 // Mehr Stürze
        }
    },
    SNOW: {
        id: 'snow',
        name: 'Schnee',
        icon: '❄️',
        probability: 0.10,
        incidentMultiplier: 1.6,
        durationMultiplier: 1.4,
        speedReduction: 0.60, // 40% langsamer
        incidentTypes: {
            'VU': 3.0,
            'VU P': 2.5,
            'RD 1': 1.5,
            'THL 1': 1.3
        }
    },
    STORM: {
        id: 'storm',
        name: 'Sturm',
        icon: '🌪️',
        probability: 0.08,
        incidentMultiplier: 1.8,
        durationMultiplier: 1.25,
        speedReduction: 0.75,
        incidentTypes: {
            'THL 1': 4.0, // Viele technische Hilfeleistungen
            'THL 2': 3.0,
            'B 1': 1.5,
            'VU': 1.6
        }
    },
    FOG: {
        id: 'fog',
        name: 'Nebel',
        icon: '🌫️',
        probability: 0.07,
        incidentMultiplier: 1.25,
        durationMultiplier: 1.3,
        speedReduction: 0.70,
        incidentTypes: {
            'VU': 2.2,
            'VU P': 1.9
        }
    }
};

const TIME_OF_DAY_EFFECTS = {
    NIGHT: {
        id: 'night',
        name: 'Nacht',
        hours: [22, 23, 0, 1, 2, 3, 4, 5],
        incidentMultiplier: 0.7, // Weniger Einsätze nachts
        incidentTypes: {
            'RD 2': 1.4, // Mehr medizinische Notfälle
            'RD 3': 1.5,
            'VU': 0.6, // Weniger Verkehr
            'B 1': 0.5,
            'B 2': 0.4
        }
    },
    RUSH_HOUR: {
        id: 'rush_hour',
        name: 'Stoßzeit',
        hours: [7, 8, 17, 18],
        incidentMultiplier: 1.5,
        incidentTypes: {
            'VU': 2.5,
            'VU P': 2.0,
            'RD 1': 1.2
        }
    },
    DAY: {
        id: 'day',
        name: 'Tag',
        hours: [9, 10, 11, 12, 13, 14, 15, 16],
        incidentMultiplier: 1.0,
        incidentTypes: {}
    },
    EVENING: {
        id: 'evening',
        name: 'Abend',
        hours: [19, 20, 21],
        incidentMultiplier: 1.1,
        incidentTypes: {
            'B 1': 1.3,
            'B 2': 1.2
        }
    }
};

class WeatherSystem {
    constructor() {
        this.currentWeather = WEATHER_CONDITIONS.CLEAR;
        this.currentTimeOfDay = TIME_OF_DAY_EFFECTS.DAY;
        this.weatherChangeInterval = null;
    }
    
    /**
     * Initialisiert Wettersystem
     */
    initialize() {
        this.selectRandomWeather();
        this.startWeatherCycle();
        console.log(`🌦️ Wetter initialisiert: ${this.currentWeather.name}`);
    }
    
    /**
     * Wählt zufälliges Wetter basierend auf Wahrscheinlichkeiten
     */
    selectRandomWeather() {
        const random = Math.random();
        let cumulative = 0;
        
        for (const weather of Object.values(WEATHER_CONDITIONS)) {
            cumulative += weather.probability;
            if (random <= cumulative) {
                this.currentWeather = weather;
                return;
            }
        }
        
        this.currentWeather = WEATHER_CONDITIONS.CLEAR;
    }
    
    /**
     * Startet automatischen Wetterwechsel
     */
    startWeatherCycle() {
        // Wetter ändert sich alle 30-90 Minuten (Spielzeit)
        this.weatherChangeInterval = setInterval(() => {
            this.selectRandomWeather();
            console.log(`🌦️ Wetter geändert: ${this.currentWeather.icon} ${this.currentWeather.name}`);
            this.updateUI();
        }, (30 + Math.random() * 60) * 60 * 1000); // 30-90 Min
    }
    
    /**
     * Aktualisiert Tageszeit basierend auf Spielzeit
     */
    updateTimeOfDay(currentHour) {
        for (const period of Object.values(TIME_OF_DAY_EFFECTS)) {
            if (period.hours.includes(currentHour)) {
                if (this.currentTimeOfDay.id !== period.id) {
                    this.currentTimeOfDay = period;
                    console.log(`🕰️ Tageszeit: ${period.name}`);
                }
                break;
            }
        }
    }
    
    /**
     * Berechnet Einsatz-Multiplikator für spezifisches Stichwort
     */
    getIncidentMultiplier(keyword) {
        let multiplier = 1.0;
        
        // Wetter-Einfluss
        multiplier *= this.currentWeather.incidentMultiplier;
        if (this.currentWeather.incidentTypes && this.currentWeather.incidentTypes[keyword]) {
            multiplier *= this.currentWeather.incidentTypes[keyword];
        }
        
        // Tageszeit-Einfluss
        multiplier *= this.currentTimeOfDay.incidentMultiplier;
        if (this.currentTimeOfDay.incidentTypes && this.currentTimeOfDay.incidentTypes[keyword]) {
            multiplier *= this.currentTimeOfDay.incidentTypes[keyword];
        }
        
        return multiplier;
    }
    
    /**
     * Berechnet Einsatzdauer-Multiplikator
     */
    getDurationMultiplier() {
        return this.currentWeather.durationMultiplier;
    }
    
    /**
     * Berechnet Geschwindigkeits-Reduktion für Fahrzeuge
     */
    getSpeedMultiplier() {
        return this.currentWeather.speedReduction;
    }
    
    /**
     * Gibt aktuelles Wetter zurück
     */
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    /**
     * Gibt aktuelle Tageszeit zurück
     */
    getCurrentTimeOfDay() {
        return this.currentTimeOfDay;
    }
    
    /**
     * Aktualisiert Wetter-UI
     */
    updateUI() {
        const weatherEl = document.getElementById('current-weather');
        if (weatherEl) {
            weatherEl.innerHTML = `${this.currentWeather.icon} ${this.currentWeather.name}`;
        }
        
        const timeOfDayEl = document.getElementById('time-of-day');
        if (timeOfDayEl) {
            timeOfDayEl.textContent = this.currentTimeOfDay.name;
        }
    }
    
    /**
     * Stoppt Wettersystem
     */
    stop() {
        if (this.weatherChangeInterval) {
            clearInterval(this.weatherChangeInterval);
        }
    }
}

// Globale Instanz
window.WeatherSystem = WeatherSystem;
window.WEATHER_CONDITIONS = WEATHER_CONDITIONS;
window.TIME_OF_DAY_EFFECTS = TIME_OF_DAY_EFFECTS;

console.log('🌦️ Weather System geladen');