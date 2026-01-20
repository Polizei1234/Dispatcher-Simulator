// =========================
// UI-HILFSFUNKTIONEN
// =========================

// Hilfsfunktionen für UI-Updates und Interaktionen

function formatTime(date) {
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function showNotification(message, type = 'info') {
    // Erstelle Notification Element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Entferne nach 3 Sekunden
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function playSound(soundType) {
    if (!game || !game.soundEnabled) return;
    
    // Hier könnten Sounds abgespielt werden
    // Für jetzt: nur Konsolen-Log
    console.log('Sound:', soundType);
}

// Tastaturkürzel
document.addEventListener('keydown', function(e) {
    if (!game || !game.running) return;
    
    // ESC: Schließe geöffnete Dialoge
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Zahlen 1-5: Wähle Einsatz
    if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        const activeIncidents = game.incidents.filter(i => i.status !== 'completed');
        if (activeIncidents[index]) {
            selectIncident(activeIncidents[index].id);
        }
    }
});

// Animation CSS für Notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export für Spielstand
function exportGameState() {
    if (!game) return;
    
    const state = {
        credits: game.credits,
        gameTime: game.gameTime,
        incidents: game.incidents,
        vehicles: game.vehicles,
        stations: game.stations
    };
    
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dispatcher-spielstand.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Import Spielstand
function importGameState(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const state = JSON.parse(e.target.result);
            
            // Lade Spielstand
            game.credits = state.credits;
            game.gameTime = new Date(state.gameTime);
            game.incidents = state.incidents;
            game.vehicles = state.vehicles;
            game.stations = state.stations;
            
            updateUI();
            updateVehicleList();
            updateIncidentList();
            updateMap();
            
            showNotification('Spielstand geladen!', 'success');
        } catch (error) {
            showNotification('Fehler beim Laden!', 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Hilfsfunktion: Zufällige Position in der Nähe
function getRandomNearbyPosition(center, radiusKm = 5) {
    const radiusInDegrees = radiusKm / 111.32; // Ungefähr 1 Grad = 111.32 km
    
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    
    const newLat = center[0] + x;
    const newLng = center[1] + y;
    
    return [newLat, newLng];
}