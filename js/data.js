// =========================
// WACHEN & FAHRZEUGE
// Korrekte Adressen für Rems-Murr-Kreis
// =========================

const STATIONS = {
    // RETTUNGSDIENST - Alle DRK Rems-Murr
    'rw_waiblingen': {
        id: 'rw_waiblingen',
        name: 'Rettungswache Waiblingen',
        organization: 'DRK',
        address: 'Mayenner Straße 63, 71332 Waiblingen',
        position: [48.8315, 9.3159],
        icon: '🚑',
        type: 'rescue',
        cost: 0 // Startwache
    },
    'rw_backnang': {
        id: 'rw_backnang',
        name: 'Rettungswache Backnang',
        organization: 'DRK',
        address: 'Sulzbacher Straße 90, 71522 Backnang',
        position: [48.9474, 9.4328],
        icon: '🚑',
        type: 'rescue',
        cost: 500000
    },
    'rw_winnenden': {
        id: 'rw_winnenden',
        name: 'Rettungswache Winnenden',
        organization: 'DRK',
        address: 'Ringstraße 5, 71364 Winnenden',
        position: [48.8758, 9.3991],
        icon: '🚑',
        type: 'rescue',
        cost: 500000
    },
    'rw_schorndorf': {
        id: 'rw_schorndorf',
        name: 'Rettungswache Schorndorf',
        organization: 'DRK',
        address: 'Rötestraße 9, 73614 Schorndorf',
        position: [48.8047, 9.5314],
        icon: '🚑',
        type: 'rescue',
        cost: 500000
    },
    
    // FEUERWEHR
    'fw_waiblingen': {
        id: 'fw_waiblingen',
        name: 'Feuerwehr Waiblingen',
        organization: 'FW',
        address: 'Fronackerstraße 5, 71332 Waiblingen',
        position: [48.8289, 9.3187],
        icon: '🚒',
        type: 'fire',
        cost: 0 // Startwache
    },
    'fw_backnang': {
        id: 'fw_backnang',
        name: 'Feuerwehr Backnang',
        organization: 'FW',
        address: 'Erbställer Straße 1, 71522 Backnang',
        position: [48.9447, 9.4254],
        icon: '🚒',
        type: 'fire',
        cost: 800000
    },
    'fw_fellbach': {
        id: 'fw_fellbach',
        name: 'Feuerwehr Fellbach',
        organization: 'FW',
        address: 'Ringstraße 5, 70736 Fellbach',
        position: [48.8109, 9.2758],
        icon: '🚒',
        type: 'fire',
        cost: 800000
    },
    
    // POLIZEI
    'pr_waiblingen': {
        id: 'pr_waiblingen',
        name: 'Polizeirevier Waiblingen',
        organization: 'POL',
        address: 'Fronackerstraße 14, 71332 Waiblingen',
        position: [48.8297, 9.3195],
        icon: '🚓',
        type: 'police',
        cost: 0 // Startwache
    }
};

const VEHICLES_CATALOG = [
    // === WAIBLINGEN START (alle Organisationen) ===
    // Rettungsdienst Waiblingen
    { type: 'RTW', station: 'rw_waiblingen', cost: 0, owned: true },  // START
    { type: 'RTW', station: 'rw_waiblingen', cost: 0, owned: true },  // START
    { type: 'NEF', station: 'rw_waiblingen', cost: 0, owned: true },  // START
    { type: 'KTW', station: 'rw_waiblingen', cost: 60000, owned: false },
    
    // Feuerwehr Waiblingen
    { type: 'LF 10', station: 'fw_waiblingen', cost: 0, owned: true },  // START
    { type: 'LF 20', station: 'fw_waiblingen', cost: 0, owned: true },  // START
    { type: 'DLK 23', station: 'fw_waiblingen', cost: 600000, owned: false },
    { type: 'RW', station: 'fw_waiblingen', cost: 250000, owned: false },
    { type: 'TLF 16', station: 'fw_waiblingen', cost: 400000, owned: false },
    
    // Polizei Waiblingen
    { type: 'FuStW', station: 'pr_waiblingen', cost: 0, owned: true },  // START
    { type: 'FuStW', station: 'pr_waiblingen', cost: 50000, owned: false },
    
    // === BACKNANG (kaufbar) ===
    { type: 'RTW', station: 'rw_backnang', cost: 120000, owned: false },
    { type: 'NEF', station: 'rw_backnang', cost: 150000, owned: false },
    { type: 'LF 20', station: 'fw_backnang', cost: 350000, owned: false },
    
    // === WINNENDEN (kaufbar) ===
    { type: 'RTW', station: 'rw_winnenden', cost: 120000, owned: false },
    
    // === SCHORNDORF (kaufbar) ===
    { type: 'RTW', station: 'rw_schorndorf', cost: 120000, owned: false },
    
    // === FELLBACH (kaufbar) ===
    { type: 'LF 10', station: 'fw_fellbach', cost: 300000, owned: false }
];

let VEHICLES = [];

function initializeVehicles() {
    VEHICLES = [];
    
    VEHICLES_CATALOG.forEach((template, index) => {
        const station = STATIONS[template.station];
        if (!station) return;
        
        const vehicle = {
            id: `vehicle_${index}`,
            type: template.type,
            station: template.station,
            cost: template.cost,
            owned: CONFIG.GAME_MODE === 'free' ? true : template.owned,
            callsign: generateCallsign(template.type, station.name, station.organization),
            status: 'available',
            position: [...station.position],
            organization: station.organization,
            icon: getVehicleIcon(template.type),
            totalDistance: 0
        };
        
        VEHICLES.push(vehicle);
    });
}

function getVehicleIcon(type) {
    const icons = {
        'RTW': '🚑',
        'NEF': '🚑',
        'KTW': '🚐',
        'NAW': '🚑',
        'LF 10': '🚒',
        'LF 20': '🚒',
        'DLK 23': '🚒',
        'TLF 16': '🚒',
        'RW': '🚒',
        'ELW': '🚗',
        'FuStW': '🚓'
    };
    return icons[type] || '🚗';
}