// =========================
// VEHICLE STATUS UTILITY v1.0.0
// ✅ ZENTRALE Status-Abfrage - Single Source of Truth!
// ✅ Eliminiert doppelte getFMSStatus() Funktionen
// ✅ Fallback-Logik für fehlende Configs
// ✅ XSS-sicher
// =========================

const VehicleStatusUtil = {
    getStatus(vehicle) {
        if (!vehicle) {
            console.warn('⚠️ VehicleStatusUtil.getStatus: Fahrzeug ist undefined');
            return this.getFallbackStatus(null);
        }
        
        const fmsCode = vehicle.currentStatus !== undefined ? 
                        vehicle.currentStatus : 
                        (vehicle.status !== undefined ? vehicle.status : 2);
        
        return this.getStatusByCode(fmsCode);
    },

    getStatusByCode(fmsCode) {
        if (typeof CONFIG !== 'undefined' && CONFIG.FMS_STATUS && CONFIG.FMS_STATUS[fmsCode]) {
            return { ...CONFIG.FMS_STATUS[fmsCode], code: fmsCode };
        }
        return this.getFallbackStatus(fmsCode);
    },

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
            return { ...fallbackStatuses[fmsCode], code: fmsCode };
        }
        return {
            name: 'Unbekannt',
            color: '#6c757d',
            icon: '❓',
            code: fmsCode !== null ? fmsCode : '?'
        };
    },

    isAvailable(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code === 1 || status.code === 2;
    },

    isOnMission(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code >= 3 && status.code <= 9;
    },

    isDriving(vehicle) {
        if (!vehicle) return false;
        const status = this.getStatus(vehicle);
        return status.code === 3 || status.code === 4 || status.code === 8;
    },

    formatStatusText(vehicle, includeIcon = true) {
        const status = this.getStatus(vehicle);
        const icon = includeIcon ? `${status.icon} ` : '';
        return `${icon}Status ${status.code} - ${status.name}`;
    },

    getAllStatusCodes() {
        if (typeof CONFIG !== 'undefined' && CONFIG.FMS_STATUS) {
            return Object.keys(CONFIG.FMS_STATUS).map(Number);
        }
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    },

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"'/]/g, m => map[m]);
    },

    generateStatusChipHTML(vehicle, options = {}) {
        const { showIcon = true, showCode = true, showName = true, customClass = '', style = 'border-left' } = options;
        const status = this.getStatus(vehicle);
        let content = '';
        if (showIcon) content += `${status.icon} `;
        if (showCode) content += `Status ${status.code}`;
        if (showName) content += ` - ${this.escapeHtml(status.name)}`;
        const borderStyle = style === 'border-left' ? `border-left: 3px solid ${status.color};` : `border: 2px solid ${status.color};`;
        return `<span class="vehicle-status-chip ${customClass}" style="background: ${status.color}20; ${borderStyle} padding: 4px 8px; border-radius: 4px; display: inline-block; font-size: 0.85em;">${content}</span>`.trim();
    }
};

// ✅ Bereinigt: Globale Zuweisung entfernt und durch ES6-Export ersetzt.
export default VehicleStatusUtil;
