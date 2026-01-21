// =========================
// SCORING SYSTEM
// Bewertet Disponenten-Performance
// =========================

const ScoringSystem = {
    currentScore: 0,
    stats: {
        einsaetze_gesamt: 0,
        einsaetze_korrekt: 0,
        einsaetze_unterdimensioniert: 0,
        einsaetze_ueberdimensioniert: 0,
        durchschnitt_eta: 0,
        durchschnitt_response_time: 0,
        anrufe_gesamt: 0,
        anrufe_beantwortet: 0,
        anrufe_verpasst: 0
    },
    multiplier: 1.0,

    /**
     * Initialisiert Scoring System
     */
    initialize() {
        console.log('🎯 Scoring System initialisiert');
        this.loadStats();
        this.updateDisplay();
    },

    /**
     * Lädt gespeicherte Stats
     */
    loadStats() {
        const saved = localStorage.getItem('scoring_stats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }

        const savedScore = localStorage.getItem('current_score');
        if (savedScore) {
            this.currentScore = parseInt(savedScore);
        }
    },

    /**
     * Speichert Stats
     */
    saveStats() {
        localStorage.setItem('scoring_stats', JSON.stringify(this.stats));
        localStorage.setItem('current_score', this.currentScore.toString());
    },

    /**
     * Bewertet Einsatz-Alarmierung
     */
    scoreIncident(incident, assignedVehicles, validation) {
        console.group('🎯 SCORING INCIDENT');
        console.log('🚨 Einsatz:', incident.nummer);

        let points = 0;
        let breakdown = [];

        // Basis-Punkte für Einsatz-Abschluss
        points += 100;
        breakdown.push({ reason: 'Einsatz bearbeitet', points: 100 });

        // Bewertung basierend auf Groq-Validierung
        if (validation) {
            if (validation.bewertung === 'vollstaendig') {
                points += 200;
                breakdown.push({ reason: 'Korrekte Alarmierung', points: 200 });
                this.stats.einsaetze_korrekt++;
            } else if (validation.bewertung === 'unvollstaendig') {
                points -= 100;
                breakdown.push({ reason: 'Unterdimensioniert', points: -100 });
                this.stats.einsaetze_unterdimensioniert++;
            } else if (validation.bewertung === 'ueberdimensioniert') {
                points -= 50;
                breakdown.push({ reason: 'Überdimensioniert', points: -50 });
                this.stats.einsaetze_ueberdimensioniert++;
            }
        }

        // Schnelle Alarmierung (< 3 Min Response Time)
        const responseTime = this.calculateResponseTime(incident);
        if (responseTime < 180) { // 3 Minuten
            points += 50;
            breakdown.push({ reason: 'Schnelle Reaktion', points: 50 });
        }

        // Multiplier anwenden
        points = Math.round(points * this.multiplier);

        // Update Stats
        this.stats.einsaetze_gesamt++;
        this.addPoints(points);

        console.log('🎯 Punkte-Breakdown:', breakdown);
        console.log('📊 Gesamt-Punkte:', points);
        console.groupEnd();

        // Zeige Punkte-Animation
        this.showPointsAnimation(points, breakdown);

        return points;
    },

    /**
     * Berechnet Response Time (von Anruf bis Alarmierung)
     */
    calculateResponseTime(incident) {
        // TODO: Echte Zeit-Berechnung aus Timestamps
        return 120; // Placeholder: 2 Minuten
    },

    /**
     * Bewertet Anruf
     */
    scoreCall(answered, responseTime) {
        this.stats.anrufe_gesamt++;

        if (answered) {
            this.stats.anrufe_beantwortet++;
            
            // Schnell abgenommen?
            if (responseTime < 10) { // < 10 Sekunden
                this.addPoints(10);
            }
        } else {
            this.stats.anrufe_verpasst++;
            this.addPoints(-50); // Strafe für verpassten Anruf
        }

        this.saveStats();
    },

    /**
     * Fügt Punkte hinzu
     */
    addPoints(points) {
        this.currentScore += points;
        this.saveStats();
        this.updateDisplay();
    },

    /**
     * Update Score-Display
     */
    updateDisplay() {
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = this.currentScore.toLocaleString('de-DE');
        }

        const rankElement = document.getElementById('current-rank');
        if (rankElement) {
            rankElement.textContent = this.getRank();
        }
    },

    /**
     * Ermittelt Rang basierend auf Punkten
     */
    getRank() {
        if (this.currentScore < 500) return 'Azubi';
        if (this.currentScore < 2000) return 'Disponent';
        if (this.currentScore < 5000) return 'Erfahrener Disponent';
        if (this.currentScore < 10000) return 'Leitstellenleiter';
        return 'Experte';
    },

    /**
     * Zeigt Punkte-Animation
     */
    showPointsAnimation(points, breakdown) {
        const container = document.getElementById('points-animation-container');
        if (!container) return;

        const popup = document.createElement('div');
        popup.className = 'points-popup';

        const sign = points >= 0 ? '+' : '';
        const color = points >= 0 ? 'green' : 'red';

        let html = `
            <div class="points-total" style="color: ${color}">
                ${sign}${points} Punkte
            </div>
            <div class="points-breakdown">
        `;

        breakdown.forEach(item => {
            const itemSign = item.points >= 0 ? '+' : '';
            html += `
                <div class="breakdown-item">
                    <span>${item.reason}</span>
                    <span>${itemSign}${item.points}</span>
                </div>
            `;
        });

        html += '</div>';
        popup.innerHTML = html;

        container.appendChild(popup);

        // Animation
        setTimeout(() => popup.classList.add('show'), 10);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    },

    /**
     * Zeigt Statistiken
     */
    showStats() {
        console.group('📊 STATISTIKEN');
        console.log('Punkte:', this.currentScore);
        console.log('Rang:', this.getRank());
        console.log('Einsätze gesamt:', this.stats.einsaetze_gesamt);
        console.log('Korrekt:', this.stats.einsaetze_korrekt);
        console.log('Unterdimensioniert:', this.stats.einsaetze_unterdimensioniert);
        console.log('Überdimensioniert:', this.stats.einsaetze_ueberdimensioniert);
        
        if (this.stats.einsaetze_gesamt > 0) {
            const accuracy = (this.stats.einsaetze_korrekt / this.stats.einsaetze_gesamt * 100).toFixed(1);
            console.log('Genauigkeit:', accuracy + '%');
        }
        
        console.log('Anrufe beantwortet:', this.stats.anrufe_beantwortet, '/', this.stats.anrufe_gesamt);
        console.groupEnd();

        return this.stats;
    },

    /**
     * Exportiert Stats als JSON
     */
    exportStats() {
        return {
            score: this.currentScore,
            rank: this.getRank(),
            stats: this.stats,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Reset Stats
     */
    reset() {
        if (!confirm('Möchten Sie wirklich alle Statistiken zurücksetzen?')) {
            return;
        }

        this.currentScore = 0;
        this.stats = {
            einsaetze_gesamt: 0,
            einsaetze_korrekt: 0,
            einsaetze_unterdimensioniert: 0,
            einsaetze_ueberdimensioniert: 0,
            durchschnitt_eta: 0,
            durchschnitt_response_time: 0,
            anrufe_gesamt: 0,
            anrufe_beantwortet: 0,
            anrufe_verpasst: 0
        };

        this.saveStats();
        this.updateDisplay();

        console.log('🔄 Statistiken zurückgesetzt');
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        ScoringSystem.initialize();
    });
}
