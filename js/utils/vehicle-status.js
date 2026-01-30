// =========================
// VEHICLE STATUS UTILITY v1.0.0
// ✅ ZENTRALE Status-Abfrage - Single Source of Truth!
// ✅ Eliminiert doppelte getFMSStatus() Funktionen
// ✅ Fallback-Logik für fehlende Configs
// ✅ XSS-sicher
// =========================

/**
 * 🎯 ZENTRALE STATUS-FUNKTION
 * 
 * Diese Funktion ist DIE einzige Stelle im gesamten Projekt,
 * die FMS-Status-Daten abruft und formatiert.
 * 
 * Vorteile:
 * - Single Source of Truth (keine Inkonsistenzen)
 * - Weniger Bugs durch doppelten Code
 * - Einfachere Wartung
 * - Fallback-Logik zentral definiert
 * 
 * @param {Object} vehicle - Das Fahrzeug-Objekt
 * @returns {Object} Status-Objekt mit { name, color, icon, code }
 */
const VehicleStatusUtil = {
    
    /**
     * Hauptfunktion: Holt FMS-Status für ein Fahrzeug
     */
    getStatus(vehicle) {
        if (!vehicle) {
            console.warn('⚠️ VehicleStatusUtil.getStatus: Fahrzeug ist undefined');
            return this.getFallbackStatus(null);
        }
        
        // 🎯 Priorität 1: vehicle.currentStatus (neue Standard-Property)
        const fmsCode = vehicle.currentStatus !== undefined ? 
                        vehicle.currentStatus : 
                        // Fallback: vehicle.status (veraltet, aber noch unterstützt)
                        (vehicle.status !== undefined ? vehicle.status : 2);
        
        // Hole Status aus CONFIG oder Fallback
        return this.getStatusByCode(fmsCode);
    },
    
    /**
     * Holt Status basierend auf FMS-Code
     */
    getStatusByCode(fmsCode) {
        // Versuche CONFIG.FMS_STATUS
        if (typeof CONFIG !== 'undefined' && 
            CONFIG.FMS_STATUS && 
            CONFIG.FMS_STATUS[fmsCode]) {
            return {
                ...CONFIG.FMS_STATUS[fmsCode],
                code: fmsCode
            };
        }
        
        // Fallback auf interne Definition
        return this.getFallbackStatus(fmsCode);
    },
    
    /**
     * Fallback-Status-Definitionen
     * (falls CONFIG nicht verfügbar)
     */
    getFallbackStatus(fmsCode) {
        const fallbackStatuses = {
            0: { name: 'Notruf/Hilferuf', color: '#dc3545', icon: '⚠️' },
            1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
            2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🟢' },
            3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🟡' },
            4: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠' },
            5: { name: 'Ankunft Einsatzstelle', color: '#dc3545', icon: '🔴' },
            6: { name: 'Sprechwunsch', color: '#6c757d', icon: '⚪' },
            7: { name: 'Patient aufgenommen', color: '#17a2b8', icon: '🔵' },
            8: { name: 'Anfahrt Krankenhaus', color: '#007bff', icon: '🔵' },
            9: { name: 'Ankunft Krankenhaus', color: '#6f42c1', icon: '🟣' },
            'C': { name: 'Status C', color: '#dc3545', icon: '🛑' }
        };
        
        if (fmsCode !== null && fallbackStatuses[fmsCode]) {
            return {
                ...fallbackStatuses[fmsCode],
                code: fmsCode
            };
        }
        
        // Absoluter Fallback
        return {
            name: 'Unbekannt',
            color: '#6c757d',
            icon: '❓',
            code: fmsCode !== null ? fmsCode : '?'
        };
    },
    
    /**
     * 🎯 Hilfsfunktion: Prüft ob Fahrzeug einsatzbereit ist
     */
    isAvailable(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code === 1 || status.code === 2;
    },
    
    /**
     * 🎯 Hilfsfunktion: Prüft ob Fahrzeug im Einsatz ist
     */
    isOnMission(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code >= 3 && status.code <= 9;
    },
    
    /**
     * 🎯 Hilfsfunktion: Prüft ob Fahrzeug fährt
     */
    isDriving(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code === 3 || status.code === 4 || status.code === 8;
    },
    
    /**
     * 🎯 Hilfsfunktion: Formatiert Status als String
     */
    formatStatusText(vehicle, includeIcon = true) {
        const status = this.getStatus(vehicle);
        const icon = includeIcon ? `${status.icon} ` : '';
        return `${icon}Status ${status.code} - ${status.name}`;
    },
    
    /**
     * 🎯 Hilfsfunktion: Holt alle verfügbaren Status-Codes
     */
    getAllStatusCodes() {
        if (typeof CONFIG !== 'undefined' && CONFIG.FMS_STATUS) {
            return Object.keys(CONFIG.FMS_STATUS).map(Number);
        }
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    },
    
    /**
     * 🎯 Hilfsfunktion: Escaping für XSS-Schutz
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },
    
    /**
     * 🎯 Hilfsfunktion: Generiert Status-Chip HTML (safe!)
     */
    generateStatusChipHTML(vehicle, options = {}) {
        const {
            showIcon = true,
            showCode = true,
            showName = true,
            customClass = '',
            style = 'border-left'
        } = options;
        
        const status = this.getStatus(vehicle);
        
        let content = '';
        if (showIcon) content += `${status.icon} `;
        if (showCode) content += `Status ${status.code}`;
        if (showName) content += ` - ${this.escapeHtml(status.name)}`;
        
        const borderStyle = style === 'border-left' ? 
            `border-left: 3px solid ${status.color};` : 
            `border: 2px solid ${status.color};`;
        
        return `
            <span class="vehicle-status-chip ${customClass}" 
                  style="background: ${status.color}20; 
                         ${borderStyle}
                         padding: 4px 8px; 
                         border-radius: 4px; 
                         display: inline-block; 
                         font-size: 0.85em;">
                ${content}
            </span>
        `.trim();
    }
};

// ✅ Global verfügbar machen
if (typeof window !== 'undefined') {
    window.VehicleStatusUtil = VehicleStatusUtil;
}

console.log('✅ VehicleStatusUtil v1.0.0 geladen - Zentrale Status-Verwaltung aktiv!');
