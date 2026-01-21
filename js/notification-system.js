// =========================
// NOTIFICATION SYSTEM
// Zeigt Benachrichtigungen für Disponenten
// =========================

const NotificationSystem = {
    notifications: [],
    soundEnabled: true,
    maxNotifications: 5,

    /**
     * Initialisiert Notification System
     */
    initialize() {
        console.log('🔔 Notification System initialisiert');
        this.createNotificationContainer();
    },

    /**
     * Erstellt Container für Notifications
     */
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    },

    /**
     * Zeigt neue Benachrichtigung
     */
    show(message, type = 'info', duration = 5000) {
        console.log(`🔔 Notification (${type}): ${message}`);

        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };

        this.notifications.push(notification);

        // Render
        this.renderNotification(notification, duration);

        // Sound abspielen
        if (this.soundEnabled) {
            this.playNotificationSound(type);
        }

        // Alte Notifications entfernen
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }
    },

    /**
     * Rendert einzelne Notification
     */
    renderNotification(notification, duration) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.dataset.id = notification.id;

        const icon = this.getIcon(notification.type);
        const timestamp = notification.timestamp.toLocaleTimeString('de-DE');

        element.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${timestamp}</div>
            </div>
            <button class="notification-close" onclick="NotificationSystem.close(${notification.id})">&times;</button>
        `;

        container.appendChild(element);

        // Animation
        setTimeout(() => element.classList.add('show'), 10);

        // Auto-Remove
        if (duration > 0) {
            setTimeout(() => this.close(notification.id), duration);
        }
    },

    /**
     * Icon je nach Typ
     */
    getIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'alarm': '🚨',
            'call': '📞',
            'fms': '📡'
        };
        return icons[type] || '🔔';
    },

    /**
     * Schließt Notification
     */
    close(id) {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (!element) return;

        element.classList.remove('show');
        setTimeout(() => element.remove(), 300);

        // Aus Array entfernen
        this.notifications = this.notifications.filter(n => n.id !== id);
    },

    /**
     * Spielt Notification-Sound ab
     */
    playNotificationSound(type) {
        // TODO: Sounds hinzufügen
        // Verschiedene Sounds je nach Typ:
        // - 'call': Telefon-Klingeln
        // - 'alarm': Alarm-Ton
        // - 'fms': FMS-Piep
        // - 'warning': Warnung
    },

    /**
     * Toggle Sound
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        console.log(`🔊 Sound ${this.soundEnabled ? 'aktiviert' : 'deaktiviert'}`);
        return this.soundEnabled;
    },

    /**
     * Spezial-Methoden für häufige Events
     */
    newCall(callerName) {
        this.show(`📞 Eingehender Notruf von ${callerName}`, 'call', 0);
    },

    vehicleDispatched(vehicleName, incident) {
        this.show(`🚨 ${vehicleName} alarmiert zu Einsatz ${incident}`, 'alarm', 5000);
    },

    fmsUpdate(vehicleName, oldStatus, newStatus) {
        const statusText = this.getFMSStatusText(newStatus);
        this.show(`📡 ${vehicleName}: Status ${newStatus} - ${statusText}`, 'fms', 4000);
    },

    incidentCompleted(incidentNumber) {
        this.show(`✅ Einsatz ${incidentNumber} abgeschlossen`, 'success', 5000);
    },

    /**
     * FMS-Status Text
     */
    getFMSStatusText(status) {
        const texts = {
            '1': 'Einsatzbereit über Funk',
            '2': 'Einsatzbereit auf Wache',
            '3': 'Einsatzauftrag übernommen',
            '4': 'Am Einsatzort',
            '5': 'Sprechwunsch',
            '6': 'Nicht einsatzbereit',
            '7': 'Patient aufgenommen',
            '8': 'Am Standort',
            'E': 'Einsatz abgeschlossen'
        };
        return texts[status] || 'Unbekannt';
    },

    /**
     * Löscht alle Notifications
     */
    clearAll() {
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
        this.notifications = [];
        console.log('🧹 Alle Notifications gelöscht');
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        NotificationSystem.initialize();
    });
}
