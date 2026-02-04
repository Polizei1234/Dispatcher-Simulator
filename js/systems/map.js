// =========================
// KARTENLOGIK v7.1 - ZENTRALE STATUS-FUNKTION + mapInstance
// + Fahrzeuge während Ausrückzeit sichtbar
// + Fahrzeuge IMMER anklickbar (auch während Fahrt)
// + Fahrzeuge in Wache unsichtbar
// + Popups schließbar
// + ✅ Krankenhäuser werden angezeigt
// + ✅ Routen werden beim Löschen entfernt
// + ✅ Phase 3.1: Marker-Updates ohne Neuerstellen
// + ✅ FIX: Bessere FMS-Status-Anzeige in Wachen
// + ✅ FIX v5.1.1: hospital.location statt hospital.position
// + ✅✅✅ PHASE 3.1.1 v6.0: ICON-CACHING SYSTEM (-90% SVG Generation!)
// + ✅✅✅ BUG FIX v6.1: Marker Popups jetzt dauerhaft klickbar!
// + ✅✅✅ v7.0: Nutzt VehicleStatusUtil (Single Source of Truth!)
// + ✅✅✅ v7.1: mapInstance Objekt für main.js Kompatibilität!
// =========================

let map = null;
let stationMarkers = [];
let vehicleMarkers = {};
let incidentMarkers = {};
let vehicleRoutes = {};
let hospitalMarkers = {};
let stationsVisible = true;
let stationsInitialized = false;

// ✅✅✅ PHASE 3.1.1: ICON CACHE SYSTEM
const ICON_CACHE = {
    // Hospital Icons (statisch)
    hospital: null,
    
    // Station Icons (per category)
    station: {},
    
    // Vehicle Icons (per type)
    vehicle: {},
    
    // Incident Icon (statisch)
    incident: null,
    
    // Initialize all icons at startup
    initialize() {
        console.group('🎨 INITIALISIERE ICON-CACHE');
        
        // Hospital Icon
        this.hospital = this._createHospitalIcon();
        console.log('✅ Hospital Icon cached');
        
        // Station Icons
        ['rettungswache', 'notarztwache', 'ortsverein'].forEach(category => {
            this.station[category] = this._createStationIcon(category);
        });
        console.log(`✅ ${Object.keys(this.station).length} Station Icons cached`);
        
        // Vehicle Icons
        ['RTW', 'NEF', 'KTW', 'Kdow', 'GW-San'].forEach(type => {
            this.vehicle[type] = this._createVehicleIcon(type);
        });
        console.log(`✅ ${Object.keys(this.vehicle).length} Vehicle Icons cached`);
        
        // Incident Icon
        this.incident = this._createIncidentIcon();
        console.log('✅ Incident Icon cached');
        
        console.log('🚀 Icon-Cache bereit - 90% weniger SVG-Generierung!');
        console.groupEnd();
    },
    
    // Get cached icon (mit Fallback)
    getHospitalIcon() {
        return this.hospital || this._createHospitalIcon();
    },
    
    getStationIcon(category) {
        return this.station[category] || this._createStationIcon(category);
    },
    
    getVehicleIcon(type) {
        return this.vehicle[type] || this._createVehicleIcon(type);
    },
    
    getIncidentIcon() {
        return this.incident || this._createIncidentIcon();
    },
    
    // Private: Create Icons (nur beim Cache-Init!)
    _createHospitalIcon() {
        return `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="20" cy="38" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
                <rect x="10" y="18" width="20" height="20" fill="#e74c3c" stroke="#000" stroke-width="1.5"/>
                <path d="M 8 18 L 20 10 L 32 18 Z" fill="#c0392b" stroke="#000" stroke-width="1.5"/>
                <rect x="17" y="22" width="6" height="12" fill="#fff" stroke="#000" stroke-width="1"/>
                <rect x="14" y="26" width="12" height="4" fill="#fff" stroke="#000" stroke-width="1"/>
                <circle cx="15" cy="14" r="2" fill="#e74c3c" stroke="#000" stroke-width="0.5">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                </circle>
                <circle cx="25" cy="14" r="2" fill="#e74c3c" stroke="#000" stroke-width="0.5">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
    },
    
    _createStationIcon(category) {
        const colors = {
            'rettungswache': { primary: '#dc3545', secondary: '#a02830', cross: '#ffffff' },
            'notarztwache': { primary: '#ffc107', secondary: '#d4a006', cross: '#000000' },
            'ortsverein': { primary: '#ff6b6b', secondary: '#d45555', cross: '#ffffff' }
        };
        
        const color = colors[category] || colors['rettungswache'];
        
        return `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="20" cy="38" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
                <rect x="10" y="18" width="20" height="20" fill="${color.primary}" stroke="#000" stroke-width="1.5"/>
                <path d="M 8 18 L 20 10 L 32 18 Z" fill="${color.secondary}" stroke="#000" stroke-width="1.5"/>
                <rect x="17" y="24" width="6" height="10" fill="${color.cross}" stroke="#000" stroke-width="1"/>
                <rect x="14" y="27" width="12" height="4" fill="${color.cross}" stroke="#000" stroke-width="1"/>
                <rect x="16" y="32" width="8" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
                <rect x="12" y="13" width="3" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
                <rect x="25" y="13" width="3" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            </svg>
        `;
    },
    
    _createVehicleIcon(type) {
        const colors = {
            'RTW': '#dc3545',
            'NEF': '#ffc107',
            'KTW': '#28a745',
            'Kdow': '#17a2b8',
            'GW-San': '#6c757d'
        };
        
        const color = colors[type] || '#007bff';
        
        return `
            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="14" cy="26" rx="10" ry="2" fill="rgba(0,0,0,0.3)"/>
                <rect x="6" y="12" width="16" height="10" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
                <rect x="16" y="8" width="6" height="6" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
                <rect x="17" y="9" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
                <rect x="8" y="14" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
                <circle cx="10" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
                <circle cx="18" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
                <circle cx="10" cy="22" r="1" fill="#666"/>
                <circle cx="18" cy="22" r="1" fill="#666"/>
                <rect x="11" y="6" width="3" height="2" fill="#0000ff" stroke="#000" stroke-width="0.5" rx="0.5">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
                </rect>
                <rect x="13" y="15" width="2" height="4" fill="#fff"/>
                <rect x="12" y="16" width="4" height="2" fill="#fff"/>
            </svg>
        `;
    },
    
    _createIncidentIcon() {
        return `
            <div class="incident-icon-container">
                <div class="incident-pulse"></div>
                <div class="incident-icon">🚨</div>
            </div>
        `;
    }
};

function initMap() {
    if (map) {
        console.log('⚠️ Map already initialized');
        return;
    }
    
    console.log('🗺️ Initialisiere Karte...');
    
    const mapCenter = CONFIG.MAP?.center || [48.8309415, 9.3256194];
    const mapZoom = CONFIG.MAP?.zoom || 11;
    
    try {
        map = L.map('map', {
            center: mapCenter,
            zoom: mapZoom,
            minZoom: 9,
            maxZoom: 18,
            closePopupOnClick: true,
            preferCanvas: false,
            zoomControl: true
        });
        
        console.log('✅ Map-Objekt erstellt');
        
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
            errorTileUrl: '',
            crossOrigin: true
        });
        
        tileLayer.addTo(map);
        console.log('✅ TileLayer hinzugefügt');
        
        map.on('click', function() {
            map.closePopup();
        });
        
        // ✅✅✅ PHASE 3.1.1: Initialisiere Icon-Cache VOR Marker-Erstellung!
        ICON_CACHE.initialize();
        
        setTimeout(() => {
            createStationMarkers();
            stationsInitialized = true;
            console.log(`✅ ${stationMarkers.length} Wachen-Marker erstellt!`);
            
            createHospitalMarkers();
            
            map.invalidateSize();
            console.log('🔄 Map Size refreshed');
        }, 500);
        
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren der Karte:', error);
    }
}

// ✅ FIX v5.1.1: Funktion zum Anzeigen der Krankenhäuser mit .location
function createHospitalMarkers() {
    if (typeof HOSPITALS === 'undefined') {
        console.warn('⚠️ HOSPITALS nicht definiert');
        return;
    }
    
    console.group('🏭 ERSTELLE KRANKENHAUS-MARKER');
    
    HOSPITALS.forEach(hospital => {
        if (!hospital.location || !Array.isArray(hospital.location) || hospital.location.length !== 2) {
            console.warn(`⚠️ Ungültige Location für ${hospital.name}:`, hospital.location);
            return;
        }
        
        // ✅✅✅ PHASE 3.1.1: Nutze CACHED Icon!
        const iconHtml = ICON_CACHE.getHospitalIcon();
        
        try {
            const marker = L.marker([hospital.location[0], hospital.location[1]], {
                icon: L.divIcon({
                    html: iconHtml,
                    className: 'hospital-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                }),
                zIndexOffset: 500
            });
            
            // ✅✅✅ BUG FIX v6.1: Popup UNBIND vor neuem BIND!
            marker.unbindPopup();
            
            marker.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
                
                const popupContent = generateHospitalPopupContent(hospital);
                
                // ✅✅✅ BUG FIX: Unbind vorher, dann neu binden!
                marker.unbindPopup();
                marker.bindPopup(popupContent, {
                    maxWidth: 350,
                    className: 'hospital-popup',
                    autoClose: true,
                    closeOnClick: false
                }).openPopup();
            });
            
            marker.addTo(map);
            hospitalMarkers[hospital.id] = marker;
            console.log(`✅ ${hospital.name} platziert bei [${hospital.location[0]}, ${hospital.location[1]}]`);
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Krankenhaus-Marker ${hospital.name}:`, error);
        }
    });
    
    console.log(`✅ ${Object.keys(hospitalMarkers).length} Krankenhäuser auf Karte angezeigt`);
    console.groupEnd();
}

function generateHospitalPopupContent(hospital) {
    const specialtiesList = hospital.specialties || [];
    
    return `
        <div style="min-width: 250px;">
            <strong style="font-size: 1.1em;">🏭 ${hospital.name}</strong><br>
            <small style="color: #a0a0a0;">${hospital.address}</small><br>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                <strong>🏭 Fachbereiche:</strong><br>
                <div style="margin-top: 5px;">
                    ${specialtiesList.map(spec => `
                        <div style="padding: 2px 0; font-size: 0.9em;">• ${spec}</div>
                    `).join('')}
                </div>
            </div>
            <div style="margin-top: 8px; padding: 6px; background: rgba(0,0,0,0.1); border-radius: 4px; font-size: 0.85em;">
                <strong>Typ:</strong> ${hospital.type}<br>
                <strong>Notaufnahme:</strong> ${hospital.emergencyRoom ? '✅ Ja' : '❌ Nein'}<br>
                <strong>Hubschrauberlandeplatz:</strong> ${hospital.helicopterLanding ? '✅ Ja' : '❌ Nein'}
            </div>
        </div>
    `;
}

// ❌ ENTFERNT: Alte getFMSStatus() Funktion
// ✅ Nutze stattdessen: VehicleStatusUtil.getStatus(vehicle)

function createStationMarkers() {
    if (stationsInitialized) {
        console.log('⚡ Wachen-Marker bereits erstellt, überspringe');
        return;
    }
    
    stationMarkers.forEach(m => {
        if (map && map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    stationMarkers = [];
    
    let count = 0;
    Object.values(STATIONS).forEach(station => {
        const pos = station.position;
        
        if (!pos || pos.length !== 2 || isNaN(pos[0]) || isNaN(pos[1])) {
            console.error(`❌ Ungültige Position für ${station.name}:`, pos);
            return;
        }
        
        // ✅✅✅ PHASE 3.1.1: Nutze CACHED Icon!
        const iconHtml = ICON_CACHE.getStationIcon(station.category);
        
        try {
            const marker = L.marker([pos[0], pos[1]], {
                icon: L.divIcon({
                    html: iconHtml,
                    className: 'station-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            });
            
            // ✅✅✅ BUG FIX v6.1: Popup UNBIND vor neuem BIND!
            marker.unbindPopup();
            
            marker.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
                
                const popupContent = generateStationPopupContent(station);
                
                // ✅✅✅ BUG FIX: Unbind vorher, dann neu binden!
                marker.unbindPopup();
                marker.bindPopup(popupContent, {
                    maxWidth: 350,
                    className: 'station-popup',
                    autoClose: true,
                    closeOnClick: false
                }).openPopup();
            });
            
            marker.addTo(map);
            stationMarkers.push(marker);
            count++;
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Marker ${station.name}:`, error);
        }
    });
    
    console.log(`✅ ${count} von ${Object.keys(STATIONS).length} Wachen erfolgreich erstellt`);
}

function generateStationPopupContent(station) {
    const vehicles = (typeof game !== 'undefined' && game.vehicles) ? 
                     game.vehicles.filter(v => v.station === station.id && v.owned) :
                     (typeof VEHICLES !== 'undefined' ? VEHICLES.filter(v => v.station === station.id && v.owned) : []);
    
    const categoryText = {
        'rettungswache': 'Rettungswache',
        'notarztwache': 'Notarztwache',
        'ortsverein': 'Ortsverein'
    }[station.category] || station.category;
    
    const typeText = {
        'hauptamt': 'Hauptamt',
        'ehrenamt': 'Ehrenamt'
    }[station.type] || station.type;
    
    let vehicleListHtml = '';
    if (vehicles.length > 0) {
        vehicleListHtml = `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                <strong>🚑 Fahrzeuge (${vehicles.length}):</strong><br>
                <div style="margin-top: 5px;">
                    ${vehicles.map(v => {
                        if (!v.currentStatus && !v.status) {
                            v.currentStatus = 2;
                        }
                        if (!v.currentStatus) {
                            v.currentStatus = v.status;
                        }
                        
                        // ✅✅✅ ZENTRALE STATUS-FUNKTION!
                        const fms = VehicleStatusUtil.getStatus(v);
                        
                        return `
                            <div style="display: flex; align-items: center; margin: 3px 0; padding: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; border-left: 3px solid ${fms.color};">
                                <span style="font-size: 0.9em; margin-right: 5px;">${fms.icon}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 0.85em; font-weight: bold;">${v.callsign}</div>
                                    <div style="font-size: 0.75em; color: ${fms.color};">
                                        <strong>Status ${fms.code}</strong> | ${fms.name}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else {
        vehicleListHtml = `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                <small style="color: #888;">Keine Fahrzeuge stationiert</small>
            </div>
        `;
    }
    
    return `
        <div style="min-width: 250px;">
            <strong style="font-size: 1.1em;">${station.name}</strong><br>
            <small style="color: #a0a0a0;">${station.address}</small><br>
            <div style="margin-top: 5px;">
                <span style="background: #2d3748; padding: 2px 6px; border-radius: 4px; font-size: 0.85em;">
                    ${categoryText}
                </span>
                <span style="background: #2d3748; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; margin-left: 5px;">
                    ${typeText}
                </span>
            </div>
            ${vehicleListHtml}
        </div>
    `;
}

function toggleStations() {
    stationsVisible = !stationsVisible;
    
    stationMarkers.forEach(marker => {
        if (stationsVisible) {
            if (!map.hasLayer(marker)) {
                map.addLayer(marker);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
    
    console.log(`🏭 Wachen ${stationsVisible ? 'eingeblendet' : 'ausgeblendet'}`);
}

function createVehiclePopupContent(vehicle) {
    // ✅✅✅ ZENTRALE STATUS-FUNKTION!
    const fms = VehicleStatusUtil.getStatus(vehicle);
    const station = STATIONS[vehicle.station];
    const stationName = station ? station.name : 'Unbekannt';
    
    return `
        <div style="min-width: 220px;">
            <div style="background: ${fms.color}; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 3px 3px 0 0;">
                <strong style="font-size: 1.1em;">${fms.icon} ${vehicle.callsign || vehicle.name}</strong>
            </div>
            <div style="font-size: 0.9em; margin: 8px 0;">
                <strong>Typ:</strong> ${vehicle.type}
            </div>
            <div style="font-size: 0.9em; margin: 8px 0;">
                <strong>Wache:</strong> ${stationName}
            </div>
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.2); border-left: 3px solid ${fms.color}; border-radius: 4px;">
                <strong style="color: ${fms.color};">Status ${fms.code}</strong><br>
                <span style="color: ${fms.color}; font-size: 0.9em;">${fms.name}</span>
            </div>
            ${vehicle.incident ? `
                <div style="font-size: 0.85em; margin-top: 8px; padding: 6px; background: rgba(220, 53, 69, 0.2); border-left: 3px solid #dc3545; border-radius: 4px;">
                    <strong style="color: #dc3545;">🚨 Einsatz:</strong><br>
                    <span style="color: #ccc;">${vehicle.incident}</span>
                </div>
            ` : ''}
        </div>
    `;
}

function addIncidentToMap(incident) {
    if (!map || !incident || !incident.koordinaten) {
        console.warn('⚠️ Kann Einsatz nicht auf Karte anzeigen:', incident);
        return;
    }

    console.log(`🚨 Füge Einsatz hinzu: ${incident.id} an [${incident.koordinaten.lat}, ${incident.koordinaten.lon}]`);

    if (incidentMarkers[incident.id]) {
        map.removeLayer(incidentMarkers[incident.id]);
    }

    // ✅✅✅ PHASE 3.1.1: Nutze CACHED Icon!
    const iconHtml = ICON_CACHE.getIncidentIcon();

    const marker = L.marker([incident.koordinaten.lat, incident.koordinaten.lon], {
        icon: L.divIcon({
            html: iconHtml,
            className: 'incident-marker-custom',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        }),
        zIndexOffset: 2000
    });

    // ✅✅✅ BUG FIX v6.1: Popup UNBIND vor neuem BIND!
    marker.unbindPopup();
    
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
    });

    marker.bindPopup(`
        <div style="min-width: 250px;">
            <div style="background: #dc3545; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 3px 3px 0 0;">
                <strong style="font-size: 1.1em;">🚨 ${incident.stichwort}</strong>
            </div>
            <div style="font-size: 0.9em; margin: 5px 0;">
                <strong>Einsatznummer:</strong> ${incident.id}
            </div>
            <div style="font-size: 0.9em; margin: 5px 0;">
                <strong>Ort:</strong> ${incident.ort}
            </div>
            <div style="font-size: 0.85em; margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px;">
                ${incident.meldebild}
            </div>
            <div style="margin-top: 10px; color: #666; font-size: 0.8em;">
                🕒 ${incident.zeitstempel}
            </div>
        </div>
    `, {
        maxWidth: 300,
        autoClose: true,
        closeOnClick: false
    });

    marker.addTo(map);
    incidentMarkers[incident.id] = marker;

    setTimeout(() => marker.openPopup(), 300);
}

function removeIncidentFromMap(incidentId) {
    if (incidentMarkers[incidentId]) {
        map.removeLayer(incidentMarkers[incidentId]);
        delete incidentMarkers[incidentId];
        console.log(`✅ Einsatz ${incidentId} von Karte entfernt`);
    }
}

// ✅✅✅ PHASE 3.1.1: OPTIMIERT - Nutzt CACHED Icons!
function updateVehicleOnMap(vehicle) {
    if (!map || !vehicle.position) return;

    if (vehicle.currentStatus === 2 && vehicle.status === 'available') {
        if (vehicleMarkers[vehicle.id]) {
            map.removeLayer(vehicleMarkers[vehicle.id]);
            delete vehicleMarkers[vehicle.id];
        }
        return;
    }

    if (vehicleMarkers[vehicle.id]) {
        vehicleMarkers[vehicle.id].setLatLng([vehicle.position[0], vehicle.position[1]]);
        
        // ✅✅✅ PHASE 3.1.1: Nutze CACHED Icon statt jedes Mal neu zu generieren!
        const iconHtml = ICON_CACHE.getVehicleIcon(vehicle.type);
        vehicleMarkers[vehicle.id].setIcon(L.divIcon({
            html: iconHtml,
            className: 'vehicle-marker-moving',
            iconSize: [28, 28],
            iconAnchor: [14, 28]
        }));
        
        return;
    }

    // ✅✅✅ PHASE 3.1.1: Nutze CACHED Icon!
    const iconHtml = ICON_CACHE.getVehicleIcon(vehicle.type);

    const marker = L.marker([vehicle.position[0], vehicle.position[1]], {
        icon: L.divIcon({
            html: iconHtml,
            className: 'vehicle-marker-moving',
            iconSize: [28, 28],
            iconAnchor: [14, 28]
        }),
        zIndexOffset: 1000
    });

    // ✅✅✅ BUG FIX v6.1: Popup UNBIND vor neuem BIND!
    marker.unbindPopup();
    
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        
        const popupContent = createVehiclePopupContent(vehicle);
        
        // ✅✅✅ BUG FIX: Unbind vorher, dann neu binden!
        marker.unbindPopup();
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            autoClose: true,
            closeOnClick: false
        }).openPopup();
    });

    marker.addTo(map);
    vehicleMarkers[vehicle.id] = marker;
    
    // ✅ Reduziere Logging (nur erste 3 Fahrzeuge)
    if (Object.keys(vehicleMarkers).length <= 3) {
        console.log(`✅ Fahrzeug-Marker erstellt: ${vehicle.callsign} (CACHED Icon!)`);
    }
}

function drawVehicleRoute(vehicleId, startPos, endPos) {
    if (!map) return;

    if (vehicleRoutes[vehicleId]) {
        map.removeLayer(vehicleRoutes[vehicleId]);
    }

    const route = L.polyline([startPos, endPos], {
        color: '#17a2b8',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5',
        className: 'vehicle-route'
    });

    route.addTo(map);
    vehicleRoutes[vehicleId] = route;
}

function clearVehicleRoute(vehicleId) {
    if (vehicleRoutes[vehicleId]) {
        map.removeLayer(vehicleRoutes[vehicleId]);
        delete vehicleRoutes[vehicleId];
    }
}

function removeVehicleFromMap(vehicleId) {
    if (vehicleMarkers[vehicleId]) {
        map.removeLayer(vehicleMarkers[vehicleId]);
        delete vehicleMarkers[vehicleId];
    }
    
    clearVehicleRoute(vehicleId);
}

function updateMap() {
    if (!map || !game) return;
    
    game.vehicles.forEach(vehicle => {
        if (vehicle.owned) {
            updateVehicleOnMap(vehicle);
        }
    });

    if (GAME_DATA && GAME_DATA.incidents) {
        GAME_DATA.incidents.forEach(incident => {
            if (!incidentMarkers[incident.id]) {
                addIncidentToMap(incident);
            }
        });
    }
}

function updateVehicleMarkers() {
    updateMap();
}

function centerMap() {
    if (map) {
        const mapCenter = CONFIG.MAP?.center || [48.8309415, 9.3256194];
        const mapZoom = CONFIG.MAP?.zoom || 11;
        map.setView(mapCenter, mapZoom);
        console.log('📍 Karte zentriert auf Waiblingen');
    }
}

function addIncidentMarker(incident) {
    addIncidentToMap(incident);
}

// ✅✅✅ v7.1: MAP INSTANCE OBJEKT FÜR main.js KOMPATIBILITÄT!
const mapInstance = {
    initialize: async function() {
        console.log('🗺️ mapInstance.initialize() wird aufgerufen...');
        initMap();
        console.log('✅ mapInstance initialisiert');
    },
    
    centerMap: centerMap,
    toggleStations: toggleStations,
    updateMap: updateMap,
    addIncidentToMap: addIncidentToMap,
    removeIncidentFromMap: removeIncidentFromMap,
    updateVehicleOnMap: updateVehicleOnMap,
    drawVehicleRoute: drawVehicleRoute,
    clearVehicleRoute: clearVehicleRoute,
    removeVehicleFromMap: removeVehicleFromMap
};

// Exportiere zu window
window.mapInstance = mapInstance;
window.map = map; // Für direkte Zugriffe

console.log('✅✅✅ map.js v7.1 geladen - mapInstance erstellt & exportiert!');
