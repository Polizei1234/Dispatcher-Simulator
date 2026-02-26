// =========================
// INCIDENT NUMBERING SYSTEM
// Generiert Einsatznummern und Zeitstempel
// =========================

const IncidentNumbering = {
    currentYear: new Date().getFullYear(),
    counter: 0,
    prefix: 'RMK',

    initialize() {
        const saved = localStorage.getItem('incident_counter');
        this.counter = saved ? parseInt(saved) : 0;
        
        console.log(`🔢 Incident Numbering initialisiert - Nächste Nummer: ${this.formatNumber(this.counter + 1)}`);
    },

    generateNumber() {
        // Alias für generateIncidentNumber
        return this.generateIncidentNumber();
    },

    generateIncidentNumber() {
        this.counter++;
        localStorage.setItem('incident_counter', this.counter.toString());
        
        const number = this.formatNumber(this.counter);
        console.log(`🆕 Neue Einsatznummer: ${number}`);
        return number;
    },

    formatNumber(count) {
        const paddedCount = count.toString().padStart(6, '0');
        return `${this.prefix}-${this.currentYear}-${paddedCount}`;
    },

    getCurrentTimestamp() {
        // Verwende game.gameTime falls verfügbar
        let date;
        
        if (typeof game !== 'undefined' && game && game.gameTime) {
            date = new Date(game.gameTime);
        } else if (typeof window !== 'undefined' && window.game && window.game.gameTime) {
            date = new Date(window.game.gameTime);
        } else {
            // Fallback: Echte Zeit
            date = new Date();
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    },

    createIncidentBase() {
        const number = this.generateIncidentNumber();
        const timestamp = this.getCurrentTimestamp();

        return {
            id: number,
            nummer: number,
            zeitstempel: timestamp,
            erstelltAm: new Date().toISOString()
        };
    },

    reset() {
        this.counter = 0;
        localStorage.setItem('incident_counter', '0');
        console.log('🔄 Einsatzzähler zurückgesetzt');
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        IncidentNumbering.initialize();
    });
}