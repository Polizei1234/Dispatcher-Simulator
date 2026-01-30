// =========================
// WEATHER SYSTEM v2.0 - ERWEITERT
// Dynamisches Wetter beeinflusst Einsätze
// Integration mit incident-types.js
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
        incidentMultiplier: 1.3,
        durationMultiplier: 1.15,
        speedReduction: 0.85,
        incidentTypes: {
            'VU': 2.0,
            'VU P': 1.8,
            'RD 1': 1.2
        }
    },
    SNOW: {
        id: 'snow',
        name: 'Schnee',
        icon: '❄️',
        probability: 0.10,
        incidentMultiplier: 1.6,
        durationMultiplier: 1.4,
        speedReduction: 0.60,
        incidentTypes: {
            'VU': 3.0,
            'VU P': 2.5,
            'RD 1': 1.5,
            'THL 1': 1.3
        }
    },
    ICE: {
        id: 'ice',
        name: 'Glatteis',
        icon: '🧊',
        probability: 0.05,
        incidentMultiplier: 2.2,
        durationMultiplier: 1.6,
        speedReduction: 0.50,
        incidentTypes: {
            'VU': 3.5,
            'VU P': 3.0,
            'RD 1': 2.0
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
            'THL 1': 4.0,
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
    },
    HEAT: {
        id: 'heat',
        name: 'Hitze',
        icon: '🌡️',
        probability: 0.08,
        incidentMultiplier: 1.4,
        durationMultiplier: 1.1,
        speedReduction: 1.0,
        incidentTypes: {
            'RD 2': 1.5,
            'RD 3': 1.3
        }
    },
    COLD: {
        id: 'cold',
        name: 'Kälte',
        icon: '🥶',
        probability: 0.07,
        incidentMultiplier: 1.2,
        durationMultiplier: 1.15,
        speedReduction: 0.95,
        incidentTypes: {
            'RD 2': 1.4,
            'RD 3': 1.5
        }
    }
};

const TIME_OF_DAY_EFFECTS = {
    NIGHT: {
        id: 'night',
        name: 'Nacht',
        hours: [22, 23, 0, 1, 2, 3, 4, 5],
        incidentMultiplier: 0.7,
        incidentTypes: {
            'RD 2': 1.4,
            'RD 3': 1.5,
            'VU': 0.6,
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
        this.season = 'spring';
    }
    
    initialize() {
        this.selectRandomWeather();
        this.startWeatherCycle();
        console.log(`🌦️ Wetter initialisiert: ${this.currentWeather.name}`);
    }
    
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
    
    startWeatherCycle() {
        this.weatherChangeInterval = setInterval(() => {
            this.selectRandomWeather();
            console.log(`🌦️ Wetter geändert: ${this.currentWeather.icon} ${this.currentWeather.name}`);
            this.updateUI();
        }, (30 + Math.random() * 60) * 60 * 1000);
    }
    
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
    
    setSeason(month) {
        if (month >= 3 && month <= 5) this.season = 'spring';
        else if (month >= 6 && month <= 8) this.season = 'summer';
        else if (month >= 9 && month <= 11) this.season = 'autumn';
        else this.season = 'winter';
        
        console.log(`📅 Jahreszeit: ${this.season}`);
    }
    
    getIncidentMultiplier(keyword) {
        let multiplier = 1.0;
        
        multiplier *= this.currentWeather.incidentMultiplier;
        if (this.currentWeather.incidentTypes && this.currentWeather.incidentTypes[keyword]) {
            multiplier *= this.currentWeather.incidentTypes[keyword];
        }
        
        multiplier *= this.currentTimeOfDay.incidentMultiplier;
        if (this.currentTimeOfDay.incidentTypes && this.currentTimeOfDay.incidentTypes[keyword]) {
            multiplier *= this.currentTimeOfDay.incidentTypes[keyword];
        }
        
        return multiplier;
    }
    
    // 🆕 v2.0: Getter für incident-types.js Integration
    getWeatherCondition() {
        return this.currentWeather.id;
    }
    
    getCurrentHour() {
        if (!window.GameTimer) return 12;
        return window.GameTimer.getCurrentHour();
    }
    
    getSeason() {
        return this.season;
    }
    
    getDurationMultiplier() {
        return this.currentWeather.durationMultiplier;
    }
    
    getSpeedMultiplier() {
        return this.currentWeather.speedReduction;
    }
    
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    getCurrentTimeOfDay() {
        return this.currentTimeOfDay;
    }
    
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
    
    stop() {
        if (this.weatherChangeInterval) {
            clearInterval(this.weatherChangeInterval);
        }
    }
}

window.WeatherSystem = WeatherSystem;
window.WEATHER_CONDITIONS = WEATHER_CONDITIONS;
window.TIME_OF_DAY_EFFECTS = TIME_OF_DAY_EFFECTS;

console.log('🌦️ Weather System v2.0 geladen (Integration mit incident-types.js)');