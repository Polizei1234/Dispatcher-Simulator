// =========================
// UI-FUNKTIONEN
// =========================

function startNewGame() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Lade gespeicherten API-Key falls vorhanden
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey && game) {
        game.apiKey = savedKey;
        console.log('✅ Groq API-Key geladen');
    }
    
    addRadioMessage('System', 'ILS Waiblingen einsatzbereit. Dienst beginnt.');
}

function startTutorial() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('tutorial-overlay').classList.add('active');
    loadTutorialStep(0);
}

function showSettings() {
    const overlay = document.getElementById('settings-overlay');
    overlay.classList.add('active');
    
    // Lade aktuelle Einstellungen
    const savedKey = localStorage.getItem('groq_api_key') || '';
    document.getElementById('groq-api-key').value = savedKey;
    
    const savedSpeed = localStorage.getItem('game_speed') || '5';
    document.getElementById('game-speed').value = savedSpeed;
    
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    document.getElementById('sound-enabled').checked = soundEnabled;
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    // Speichere Groq API-Key
    const apiKey = document.getElementById('groq-api-key').value.trim();
    if (apiKey) {
        localStorage.setItem('groq_api_key', apiKey);
        if (game) {
            game.apiKey = apiKey;
        }
        console.log('✅ Groq API-Key gespeichert');
    } else {
        localStorage.removeItem('groq_api_key');
        if (game) {
            game.apiKey = null;
        }
    }
    
    // Speichere Spielgeschwindigkeit
    const speed = document.getElementById('game-speed').value;
    localStorage.setItem('game_speed', speed);
    if (game) {
        CONFIG.SIMULATION_SPEED = parseInt(speed);
    }
    
    // Speichere Sound-Einstellung
    const soundEnabled = document.getElementById('sound-enabled').checked;
    localStorage.setItem('sound_enabled', soundEnabled);
    CONFIG.SOUND_ENABLED = soundEnabled;
    
    alert('✅ Einstellungen gespeichert!');
    closeSettings();
}

function toggleAPIKeyVisibility() {
    const input = document.getElementById('groq-api-key');
    const icon = document.getElementById('api-key-toggle-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function updateGameSpeed() {
    const speed = document.getElementById('game-speed').value;
    document.getElementById('game-speed-indicator').textContent = `${speed}x`;
}

function showVehicleTab(type) {
    // Tab-Buttons aktualisieren
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Fahrzeuge filtern
    updateVehicleList();
}

function centerMap() {
    if (map) {
        map.setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    }
}

function closeDispatchDialog() {
    document.getElementById('dispatch-dialog').classList.remove('active');
}

function closeShopDialog() {
    document.getElementById('shop-dialog').classList.remove('active');
}