import cleanupManager from '../core/cleanup-manager.js';

// =========================
// NOTIFICATION SYSTEM v1.0
// Browser-Benachrichtigungen & In-App Notifications
// =========================

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.notificationDuration = 5000; // 5 Sekunden
        this.browserNotificationsEnabled = false;
        
        this.initializeSystem();
        console.log('🔔 Notification System initialisiert');
    }
    
    /**
     * Initialisiert das System
     */
    async initializeSystem() {
        // Erstelle Container für In-App Notifications
        this.createNotificationContainer();
        
        // Frage nach Browser-Benachrichtigungs-Erlaubnis
        await this.requestBrowserPermission();
    }
    
    /**
     * Erstellt Notification Container
     */
    createNotificationContainer() {
        let container = document.getElementById('notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        return container;
    }
    
    /**
     * Fragt nach Browser-Notification Permission
     */
    async requestBrowserPermission() {
        if (!('Notification' in window)) {
            console.warn('⚠️ Browser unterstützt keine Benachrichtigungen');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            this.browserNotificationsEnabled = true;
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            try {
                const permission = await Notification.requestPermission();
                this.browserNotificationsEnabled = permission === 'granted';
                return this.browserNotificationsEnabled;
            } catch (err) {
                console.warn('⚠️ Notification Permission abgelehnt:', err);
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * Zeigt Benachrichtigung an
     * @param {string} title - Titel
     * @param {string} message - Nachricht
     * @param {string} type - Typ: 'info', 'success', 'warning', 'error'
     * @param {object} options - Zusätzliche Optionen
     */
    show(title, message, type = 'info', options = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            title: title,
            message: message,
            type: type,
            timestamp: new Date(),
            ...options
        };
        
        // In-App Notification
        this.showInAppNotification(notification);
        
        // Browser Notification (nur für wichtige)
        if (type === 'error' || type === 'warning' || options.forceBrowser) {
            this.showBrowserNotification(notification);
        }
        
        // Sound abspielen
        if (options.sound !== false) {
            this.playNotificationSound(type);
        }
        
        return notification;
    }
    
    /**
     * Zeigt In-App Notification
     */
    showInAppNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        // Begrenze Anzahl gleichzeitiger Notifications
        const existingNotifications = container.querySelectorAll('.notification-toast');
        if (existingNotifications.length >= this.maxNotifications) {
            // Entferne älteste
            existingNotifications[0]?.remove();
        }
        
        // Erstelle Notification Element
        const toast = document.createElement('div');
        toast.className = `notification-toast notification-${notification.type}`;
        toast.dataset.notificationId = notification.id;
        
        const icon = this.getIcon(notification.type);
        
        toast.innerHTML = `
            <div class=\"notification-icon\">${icon}</div>
            <div class=\"notification-content\">
                <div class=\"notification-title\">${this.escapeHtml(notification.title)}</div>
                <div class=\"notification-message\">${this.escapeHtml(notification.message)}</div>
            </div>
            <button class=\"notification-close\" onclick=\"notificationSystem.dismiss('${notification.id}')\">×</button>
        `;
        
        container.appendChild(toast);
        
        // Animiere Einblendung
        cleanupManager.setTimeout('notification-system',() => toast.classList.add('visible'), 10);
        
        // Auto-Dismiss nach Duration
        const duration = notification.duration || this.notificationDuration;
        cleanupManager.setTimeout('notification-system',() => this.dismiss(notification.id), duration);
        
        // Click-Handler (falls action definiert)
        if (notification.onClick) {
            toast.style.cursor = 'pointer';
            cleanupManager.addEventListener('notification-system', toast, 'click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    notification.onClick();
                    this.dismiss(notification.id);
                }
            });
        }
        
        this.notifications.push(notification);
    }
    
    /**
     * Zeigt Browser Notification
     */
    showBrowserNotification(notification) {
        if (!this.browserNotificationsEnabled) return;
        
        try {
            const icon = this.getBrowserIcon(notification.type);
            
            const browserNotif = new Notification(notification.title, {
                body: notification.message,
                icon: icon,
                badge: '/favicon.ico',
                tag: 'dispatcher-' + notification.id,
                requireInteraction: notification.type === 'error',
                silent: false
            });
            
            // Click-Handler
            browserNotif.onclick = () => {
                window.focus();
                if (notification.onClick) {
                    notification.onClick();
                }
                browserNotif.close();
            };
            
            // Auto-Close
            cleanupManager.setTimeout('notification-system',() => browserNotif.close(), notification.duration || this.notificationDuration);
            
        } catch (err) {
            console.warn('⚠️ Browser Notification fehlgeschlagen:', err);
        }
    }
    
    /**
     * Entfernt Notification
     */
    dismiss(notificationId) {
        const toast = document.querySelector(`[data-notification-id=\"${notificationId}\"]`);
        if (toast) {
            toast.classList.remove('visible');
            toast.classList.add('hiding');
            cleanupManager.setTimeout('notification-system',() => toast.remove(), 300);
        }
        
        // Entferne aus Array
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }
    
    /**
     * Entfernt alle Notifications
     */
    dismissAll() {
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
        this.notifications = [];
    }
    
    /**
     * Hole Icon für Notification-Typ
     */
    getIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || '🔔';
    }
    
    /**
     * Hole Browser-Icon
     */
    getBrowserIcon(type) {
        // Optional: Verschiedene Icons für verschiedene Typen
        return '/favicon.ico';
    }
    
    /**
     * Spielt Notification Sound
     */
    playNotificationSound(type) {
        try {
            const soundMap = {
                'info': 'sounds/notification-info.mp3',
                'success': 'sounds/notification-success.mp3',
                'warning': 'sounds/notification-warning.mp3',
                'error': 'sounds/notification-error.mp3'
            };
            
            const soundFile = soundMap[type] || soundMap['info'];
            const audio = new Audio(soundFile);
            audio.volume = 0.4;
            audio.play().catch(err => {
                console.debug('Sound konnte nicht abgespielt werden:', err);
            });
        } catch (err) {
            console.debug('Sound-System nicht verfügbar:', err);
        }
    }
    
    /**
     * Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Shortcut-Methoden
     */
    info(title, message, options = {}) {
        return this.show(title, message, 'info', options);
    }
    
    success(title, message, options = {}) {
        return this.show(title, message, 'success', options);
    }
    
    warning(title, message, options = {}) {
        return this.show(title, message, 'warning', options);
    }
    
    error(title, message, options = {}) {
        return this.show(title, message, 'error', options);
    }
    
    /**
     * Zeigt Einsatz-Notification
     */
    showIncidentNotification(incident) {
        const priorityEmoji = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🔴'
        };
        
        return this.show(
            `${priorityEmoji[incident.priority] || '🟡'} Neuer Einsatz`,
            `${incident.keyword} - ${incident.location}`,
            incident.priority === 'high' ? 'error' : 'warning',
            {
                duration: 8000,
                onClick: () => {
                    // Fokussiere Einsatz in UI
                    if (typeof focusIncident !== 'undefined') {
                        focusIncident(incident.id);
                    }
                },
                forceBrowser: incident.priority === 'high'
            }
        );
    }
    
    /**
     * Zeigt Fahrzeug-Notfall-Notification
     */
    showEmergencyNotification(vehicle, message) {
        return this.show(
            `🚨 NOTFALL: ${vehicle.callsign}`,
            message,
            'error',
            {
                duration: 15000,
                onClick: () => {
                    // Fokussiere Fahrzeug auf Karte
                    if (typeof focusVehicle !== 'undefined') {
                        focusVehicle(vehicle.id);
                    }
                },
                forceBrowser: true,
                sound: true
            }
        );
    }
    
    /**
     * Zeigt Fahrzeug-Status-Änderungs-Notification
     */
    showStatusChangeNotification(vehicle, newStatus) {
        const statusInfo = CONFIG.getFMSStatus(newStatus);
        
        // Nur wichtige Status-Änderungen anzeigen
        const importantStatus = [0, 4, 6, 8];
        if (!importantStatus.includes(newStatus)) return;
        
        return this.show(
            `${vehicle.callsign} - Status ${newStatus}`,
            statusInfo.name,
            'info',
            {
                duration: 3000,
                sound: false
            }
        );
    }
    
    /**
     * Cleanup
     */
    cleanup() {
        this.dismissAll();
        console.log('🧹 Notification System cleanup');
    }

    destroy() {
        cleanupManager.cleanup('notification-system');
        console.log('✅ NotificationSystem cleaned up');
    }
}

// CSS Styles direkt einfügen (falls noch nicht vorhanden)
const notificationStyles = `
<style id=\"notification-styles\">
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.notification-toast {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 320px;
    max-width: 400px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    opacity: 0;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.notification-toast.visible {
    opacity: 1;
    transform: translateX(0);
}

.notification-toast.hiding {
    opacity: 0;
    transform: translateX(400px);
}

.notification-info {
    border-left: 4px solid #007bff;
}

.notification-success {
    border-left: 4px solid #28a745;
}

.notification-warning {
    border-left: 4px solid #ffc107;
}

.notification-error {
    border-left: 4px solid #dc3545;
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.notification-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.notification-content {
    flex: 1;
}

.notification-title {
    font-weight: 600;
    font-size: 14px;
    color: #212529;
    margin-bottom: 4px;
}

.notification-message {
    font-size: 13px;
    color: #6c757d;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
}

.notification-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #212529;
}

@media (max-width: 768px) {
    .notification-container {
        left: 10px;
        right: 10px;
        top: 10px;
    }
    
    .notification-toast {
        min-width: auto;
        max-width: none;
    }
}
</style>
`;

// Styles einfügen falls nicht vorhanden
if (!document.getElementById('notification-styles')) {
    document.head.insertAdjacentHTML('beforeend', notificationStyles);
}

// Globale Instanz
const notificationSystem = new NotificationSystem();

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.notificationSystem = notificationSystem;
    window.NotificationSystem = notificationSystem;
    
    // Cleanup
    cleanupManager.addEventListener('notification-system', window, 'beforeunload', () => {
        if (notificationSystem) notificationSystem.cleanup();
    });
}

console.log('✅ Notification System geladen');
console.log('✅ NotificationSystem.show() global verfügbar');
