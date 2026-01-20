// =========================
// UI-FUNKTIONEN
// =========================

function startNewGame(mode) {
    CONFIG.GAME_MODE = mode;
    localStorage.setItem('game_mode', mode);
    
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey && game) {
        game.apiKey = savedKey;
    }
    
    // Initialisiere Fahrzeuge basierend auf Modus
    initializeVehicles();
    if (game) {
        game.vehicles = VEHICLES;
        if (mode === 'free') {
            game.money = 999999999;
        }
    }
    
    updateVehicleList();
    addRadioMessage('System', `ILS Waiblingen einsatzbereit. Modus: ${mode === 'career' ? 'Karriere' : 'Frei'}`);
}

function startTutorial() {
    alert('Tutorial folgt in der nächsten Version!');
}

function showSettings() {
    const overlay = document.getElementById('settings-overlay');
    overlay.classList.add('active');
    
    const savedKey = localStorage.getItem('groq_api_key') || '';
    document.getElementById('groq-api-key').value = savedKey;
    
    const savedSpeed = CONFIG.SIMULATION_SPEED;
    document.getElementById('game-speed').value = savedSpeed;
    
    document.getElementById('sound-enabled').checked = CONFIG.SOUND_ENABLED;
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    const apiKey = document.getElementById('groq-api-key').value.trim();
    if (apiKey) {
        localStorage.setItem('groq_api_key', apiKey);
        if (game) game.apiKey = apiKey;
    }
    
    const speed = document.getElementById('game-speed').value;
    CONFIG.SIMULATION_SPEED = parseInt(speed);
    localStorage.setItem('game_speed', speed);
    document.getElementById('game-speed-indicator').textContent = `${speed}x`;
    
    CONFIG.SOUND_ENABLED = document.getElementById('sound-enabled').checked;
    
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

function cycleGameSpeed() {
    const speeds = [1, 2, 5, 10, 30];
    const currentIndex = speeds.indexOf(CONFIG.SIMULATION_SPEED);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    CONFIG.SIMULATION_SPEED = speeds[nextIndex];
    document.getElementById('game-speed-indicator').textContent = `${speeds[nextIndex]}x`;
    
    addRadioMessage('System', `Geschwindigkeit geändert: ${speeds[nextIndex]}x`);
}

function centerMap() {
    if (map) {
        map.setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    }
}

function openShop() {
    document.getElementById('shop-dialog').classList.add('active');
    showShopTab('vehicles');
}

function closeShop() {
    document.getElementById('shop-dialog').classList.remove('active');
}

function showShopTab(tab) {
    document.querySelectorAll('.shop-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('shop-content');
    
    if (tab === 'vehicles') {
        content.innerHTML = '<h4>Fahrzeuge kaufen</h4>';
        VEHICLES.forEach((v, idx) => {
            if (!v.owned && v.cost > 0) {
                const station = STATIONS[v.station];
                content.innerHTML += `
                    <div style="padding: 10px; margin: 10px 0; background: #1e2a38; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${v.icon} ${v.type}</strong><br>
                            <small>${station.name}</small><br>
                            <small style="color: #4a9eff;">${v.callsign}</small>
                        </div>
                        <button class="btn btn-success" onclick="buyVehicle(${idx})">
                            <i class="fas fa-shopping-cart"></i> ${v.cost.toLocaleString()} €
                        </button>
                    </div>
                `;
            }
        });
    } else {
        content.innerHTML = '<h4>Wachen kaufen</h4>';
        Object.values(STATIONS).forEach(station => {
            if (station.cost > 0) {
                const owned = VEHICLES.some(v => v.station === station.id && v.owned);
                if (!owned) {
                    content.innerHTML += `
                        <div style="padding: 10px; margin: 10px 0; background: #1e2a38; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${station.icon} ${station.name}</strong><br>
                                <small>${station.address}</small>
                            </div>
                            <button class="btn btn-success" onclick="buyStation('${station.id}')">
                                <i class="fas fa-building"></i> ${station.cost.toLocaleString()} €
                            </button>
                        </div>
                    `;
                }
            }
        });
    }
}

function buyVehicle(index) {
    if (!game) return;
    const vehicle = VEHICLES[index];
    
    if (game.money >= vehicle.cost) {
        game.money -= vehicle.cost;
        vehicle.owned = true;
        document.getElementById('credits').textContent = game.money.toLocaleString();
        addRadioMessage('System', `✅ ${vehicle.callsign} gekauft!`);
        updateVehicleList();
        showShopTab('vehicles');
    } else {
        alert(`❌ Nicht genug Geld! Benötigt: €${vehicle.cost.toLocaleString()}`);
    }
}

function buyStation(stationId) {
    if (!game) return;
    const station = STATIONS[stationId];
    
    if (game.money >= station.cost) {
        game.money -= station.cost;
        document.getElementById('credits').textContent = game.money.toLocaleString();
        addRadioMessage('System', `✅ ${station.name} gekauft!`);
        showShopTab('stations');
    } else {
        alert(`❌ Nicht genug Geld! Benötigt: €${station.cost.toLocaleString()}`);
    }
}

function minimizeCallDialog() {
    document.getElementById('call-dialog').style.display = 'none';
}