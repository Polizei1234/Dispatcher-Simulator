// =========================
// UI HELPERS
// Hilfsfunktionen für UI-Interaktionen
// =========================

const UIHelpers = {

    /**
     * Zeigt Loading Overlay
     */
    showLoading(message = 'Laden...') {
        let overlay = document.getElementById('loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message"></div>
            `;
            document.body.appendChild(overlay);
        }

        const messageEl = overlay.querySelector('.loading-message');
        if (messageEl) messageEl.textContent = message;

        overlay.style.display = 'flex';
    },

    /**
     * Versteckt Loading Overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    /**
     * Formatiert Zeitdauer (Sekunden zu HH:MM:SS)
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Formatiert Distanz
     */
    formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    },

    /**
     * Formatiert Zeitstempel
     */
    formatTimestamp(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleString('de-DE');
    },

    /**
     * Formatiert Uhrzeit
     */
    formatTime(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleTimeString('de-DE');
    },

    /**
     * Formatiert ETA
     */
    formatETA(minutes) {
        if (minutes < 60) {
            return `${minutes} Min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}min`;
    },

    /**
     * Erstellt Confirm Dialog
     */
    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        overlay.innerHTML = `
            <div class="confirm-dialog">
                <div class="confirm-message">${message}</div>
                <div class="confirm-buttons">
                    <button class="btn btn-secondary confirm-no">Abbrechen</button>
                    <button class="btn btn-primary confirm-yes">Bestätigen</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.confirm-yes').addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });

        overlay.querySelector('.confirm-no').addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });
    },

    /**
     * Zeigt Toast-Nachricht
     */
    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Kopiert Text in Zwischenablage
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.toast('In Zwischenablage kopiert', 'success');
        } catch (err) {
            console.error('Clipboard Error:', err);
            this.toast('Fehler beim Kopieren', 'error');
        }
    },

    /**
     * Scrollt zu Element
     */
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const top = element.offsetTop - offset;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    },

    /**
     * Toggle Fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    },

    /**
     * Prüft ob Mobile Device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Generiert eindeutige ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Debounce Function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle Function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Parse Query String
     */
    parseQueryString() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const queries = queryString.split('&');

        queries.forEach(query => {
            const [key, value] = query.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });

        return params;
    },

    /**
     * Download als JSON
     */
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    },

    /**
     * Download als CSV
     */
    downloadCSV(data, filename) {
        const csv = this.arrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    },

    /**
     * Array zu CSV
     */
    arrayToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const rows = data.map(row => 
            headers.map(header => 
                JSON.stringify(row[header] || '')
            ).join(',')
        );

        return [headers.join(','), ...rows].join('\n');
    },

    /**
     * Spielt Sound ab
     */
    playSound(soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play blocked:', e));
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('✅ UI Helpers bereit');
    });
}
