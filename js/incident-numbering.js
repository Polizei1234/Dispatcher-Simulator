// =========================
// INCIDENT NUMBERING SYSTEM
// Generiert Einsatznummern und Zeitstempel
// =========================

const IncidentNumbering = {
    currentYear: new Date().getFullYear(),
    counter: 0,
    prefix: 'RMK',

    /**
     * Initialisiert Zähler
     */
    initialize() {
        // Lade gespeicherten Zähler (falls vorhanden)
        const saved = localStorage.getItem('incident_counter');
        this.counter = saved ? parseInt(saved) : 0;
        
        console.log(`🔢 Incident Numbering initialisiert - Nächste Nummer: ${this.formatNumber(this.counter + 1)}`);
    },

    /**
     * Generiert nächste Einsatznummer
     * Format: RMK-YYYY-NNNNNN
     */
    generateIncidentNumber() {
        this.counter++;
        
        // Speichere Zähler
        localStorage.setItem('incident_counter', this.counter.toString());
        
        const number = this.formatNumber(this.counter);
        
        console.log(`🆕 Neue Einsatznummer generiert: ${number}`);
        return number;
    },

    /**
     * Formatiert Nummer im Format RMK-YYYY-NNNNNN
     */
    formatNumber(count) {
        const paddedCount = count.toString().padStart(6, '0');
        return `${this.prefix}-${this.currentYear}-${paddedCount}`;
    },

    /**
     * Gibt aktuelle Spielzeit zurück (HH:MM:SS)
     */
    getCurrentTimestamp() {
        // Verwende Spielzeit falls vorhanden, sonst echte Zeit
        let date;
        
        if (typeof GAME_STATE !== 'undefined' && GAME_STATE.gameTime) {
            date = new Date(GAME_STATE.gameTime);
        } else {
            date = new Date();
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    },

    /**
     * Erstellt vollständiges Einsatz-Basis-Objekt
     */
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

    /**
     * Reset Zähler (für neues Spiel)
     */
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
