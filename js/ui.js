// =========================
// UI-FUNKTIONEN
// =========================

function startNewGame(mode) {
    CONFIG.GAME_MODE = mode;
    
    // Verstecke Welcome Screen
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Initialisiere Spiel
    initializeVehicles();
    game = new Game();
    
    // Initialisiere Karte NACH dem Container sichtbar ist
    setTimeout(() => {
        if (typeof initMap === 'function') {
            initMap();
            console.log('✅ Karte initialisiert');
            
            // Erzwinge Leaflet Neuzeichnung
            setTimeout(() => {
                if (map) {
                    map.invalidateSize();
                    console.log('✅ Karte neu gezeichnet');
                }
            }, 100);
        }
    }, 50);
    
    // Starte Uhr
    updateClock();
    if (window.clockInterval) clearInterval(window.clockInterval);
    window.clockInterval = setInterval(updateClock, 1000);
    
    // Update-Loop
    if (window.gameLoop) clearInterval(window.gameLoop);
    window.gameLoop = setInterval(() => {
        if (game) {
            game.update();
            updateIncidentList();
            updateVehicleList();
            if (typeof updateMap === 'function') {
                updateMap();
            }
        }
    }, 2000);
    
    // Initiales UI-Update
    document.getElementById('credits').textContent = game.money.toLocaleString();
    updateVehicleList();
    
    console.log(`🎮 Spiel gestartet im ${mode}-Modus`);
}

function showSettings() {
    document.getElementById('settings-overlay').classList.add('active');
    
    // Lade gespeicherte Einstellungen
    const apiKey = localStorage.getItem('groq_api_key');
    if (apiKey) {
        document.getElementById('groq-api-key').value = apiKey;
    }
    
    const speed = localStorage.getItem('game_speed') || '5';
    document.getElementById('game-speed').value = speed;
    
    const sound = localStorage.getItem('sound_enabled') !== 'false';
    document.getElementById('sound-enabled').checked = sound;
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    const apiKey = document.getElementById('groq-api-key').value;
    const speed = document.getElementById('game-speed').value;
    const sound = document.getElementById('sound-enabled').checked;
    
    localStorage.setItem('groq_api_key', apiKey);
    localStorage.setItem('game_speed', speed);
    localStorage.setItem('sound_enabled', sound);
    
    CONFIG.SIMULATION_SPEED = parseInt(speed);
    CONFIG.SOUND_ENABLED = sound;
    
    if (game) {
        game.apiKey = apiKey;
    }
    
    document.getElementById('game-speed-indicator').textContent = `${speed}x`;
    
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
    localStorage.setItem('game_speed', speeds[nextIndex]);
}

function showIncomingCallNotification(incident) {
    const callList = document.getElementById('call-list');
    if (!callList) return;
    
    callList.innerHTML = `
        <div class="incoming-call blinking" onclick="game.acceptCall('${incident.id}')" style="cursor: pointer; padding: 15px; background: rgba(220, 53, 69, 0.2); border: 2px solid #dc3545; border-radius: 8px; text-align: center;">
            <h3 style="margin: 0; color: #dc3545;">📡 NOTRUF 112</h3>
            <p style="margin: 10px 0 0 0; font-size: 0.9em;">Eingehender Anruf...</p>
            <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #a0a0a0;">Klicken zum Annehmen</p>
        </div>
    `;
    
    playSound('incoming-call');
}

function getFMSStatusNumber(vehicle) {
    const statusMap = {
        'available': 2,
        'dispatched': 3,
        'on-scene': 4,
        'transporting': 7,
        'at-hospital': 8,
        'returning': 1,
        'unavailable': 6
    };
    return statusMap[vehicle.status] || 2;
}

function updateVehicleList() {
    if (!game) return;
    
    const vehicleList = document.getElementById('vehicle-list');
    if (!vehicleList) return;
    
    const ownedVehicles = game.vehicles.filter(v => v.owned);
    
    // Update Header-Counter
    const totalVehicles = document.getElementById('total-vehicles');
    const activeVehicles = document.getElementById('active-vehicles');
    if (totalVehicles) totalVehicles.textContent = ownedVehicles.length;
    if (activeVehicles) activeVehicles.textContent = ownedVehicles.filter(v => v.status !== 'available').length;
    
    if (ownedVehicles.length === 0) {
        vehicleList.innerHTML = '<p class="no-data">Keine Fahrzeuge verfügbar</p>';
        return;
    }
    
    vehicleList.innerHTML = ownedVehicles.map(v => {
        const fms = getFMSStatus(v);
        const fmsNumber = getFMSStatusNumber(v);
        const station = STATIONS[v.station];
        
        return `
            <div class="vehicle-item" style="margin-bottom: 10px; padding: 10px; background: #2d3748; border-radius: 8px; border-left: 4px solid ${fms.color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <strong style="font-size: 0.95em;">${getVehicleIcon(v.type)} ${v.callsign}</strong>
                        <div style="font-size: 0.75em; color: #a0a0a0; margin-top: 2px;">
                            ${station ? station.name : 'Unbekannt'}
                        </div>
                        <div style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 0.9em;">${fms.icon}</span>
                            <span style="font-size: 0.8em; color: ${fms.color}; font-weight: 600;">Status ${fmsNumber}</span>
                            <span style="font-size: 0.8em; color: ${fms.color};">| ${fms.name}</span>
                        </div>
                    </div>
                    ${v.status === 'available' ? `
                        <button class="btn btn-small btn-primary" onclick="selectVehicleForIncident('${v.id}')" style="font-size: 0.8em;">
                            Alarmieren
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function openShop() {
    const modal = document.getElementById('shop-dialog');
    modal.classList.add('active');
    showShopTab('vehicles');
}

function closeShop() {
    document.getElementById('shop-dialog').classList.remove('active');
}

function showShopTab(tab) {
    const content = document.getElementById('shop-content');
    
    // Update Tab-Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (tab === 'vehicles') {
        const availableVehicles = VEHICLES_CATALOG.filter(v => !game.vehicles.find(gv => gv.id === v.id && gv.owned));
        
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; padding: 20px;">
                ${availableVehicles.map(v => {
                    const station = STATIONS[v.station];
                    return `
                        <div class="shop-item" style="background: #1e2a38; padding: 15px; border-radius: 8px; border: 2px solid #2d3748;">
                            <h4>${getVehicleIcon(v.type)} ${v.name}</h4>
                            <p style="color: #a0a0a0; font-size: 0.9em; margin: 10px 0;">
                                <strong>Typ:</strong> ${v.type}<br>
                                <strong>Wache:</strong> ${station ? station.name : 'Unbekannt'}
                            </p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                                <span style="font-size: 1.2em; font-weight: 700; color: #ffc107;">${v.cost.toLocaleString()} €</span>
                                <button class="btn btn-success btn-small" onclick="buyVehicle('${v.id}')" ${game.money < v.cost ? 'disabled' : ''}>
                                    <i class="fas fa-shopping-cart"></i> Kaufen
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (tab === 'stations') {
        const availableStations = Object.values(STATIONS).filter(s => s.cost > 0);
        
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; padding: 20px;">
                ${availableStations.map(s => `
                    <div class="shop-item" style="background: #1e2a38; padding: 15px; border-radius: 8px; border: 2px solid #2d3748;">
                        <h4>${getStationIcon(s.category)} ${s.name}</h4>
                        <p style="color: #a0a0a0; font-size: 0.9em; margin: 10px 0;">
                            <strong>Typ:</strong> ${s.category}<br>
                            <strong>Ort:</strong> ${s.address}
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <span style="font-size: 1.2em; font-weight: 700; color: #ffc107;">${s.cost.toLocaleString()} €</span>
                            <button class="btn btn-success btn-small" disabled>
                                <i class="fas fa-lock"></i> Bald verfügbar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function buyVehicle(vehicleId) {
    const template = VEHICLES_CATALOG.find(v => v.id === vehicleId);
    if (!template) return;
    
    if (game.money < template.cost) {
        alert('❌ Nicht genug Geld!');
        return;
    }
    
    game.money -= template.cost;
    document.getElementById('credits').textContent = game.money.toLocaleString();
    
    const vehicle = game.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
        vehicle.owned = true;
        alert(`✅ ${vehicle.name} gekauft!`);
        updateVehicleList();
        closeShop();
    }
}