// =========================
// WACHEN & FAHRZEUGE
// Adressen von BOS-Fahrzeuge.info
// =========================

const STATIONS = {
    // RETTUNGSDIENST
    'rw_backnang': {
        id: 'rw_backnang',
        name: 'Rettungswache Backnang',
        organization: 'DRK Rems-Murr',
        address: 'Sulzbacher Str. 90, 71522 Backnang',
        position: [48.9474, 9.4328],  // Korrekte Position laut BOS-Fahrzeuge.info
        icon: '🚑',
        type: 'rescue'
    },
    'rw_waiblingen': {
        id: 'rw_waiblingen',
        name: 'Rettungswache Waiblingen',
        organization: 'DRK Rems-Murr',
        address: 'Mayenner Str. 63, 71332 Waiblingen',
        position: [48.8315, 9.3159],  // Korrekte Position
        icon: '🚑',
        type: 'rescue'
    },
    'rw_schorndorf': {
        id: 'rw_schorndorf',
        name: 'Rettungswache Schorndorf',
        organization: 'DRK Rems-Murr',
        address: 'Rötestr. 9, 73614 Schorndorf',
        position: [48.8047, 9.5314],  // Korrekte Position
        icon: '🚑',
        type: 'rescue'
    },
    'rw_winnenden': {
        id: 'rw_winnenden',
        name: 'Rettungswache Winnenden',
        organization: 'DRK Rems-Murr',
        address: 'Ringstraße 5, 71364 Winnenden',
        position: [48.8758, 9.3991],  // Korrekte Position
        icon: '🚑',
        type: 'rescue'
    },
    
    // FEUERWEHR
    'fw_waiblingen': {
        id: 'fw_waiblingen',
        name: 'Feuerwehr Waiblingen',
        organization: 'Feuerwehr Waiblingen',
        address: 'Fronackerstraße 5, 71332 Waiblingen',
        position: [48.8289, 9.3187],  // Korrekte Position
        icon: '🚒',
        type: 'fire'
    },
    'fw_backnang': {
        id: 'fw_backnang',
        name: 'Feuerwehr Backnang',
        organization: 'Feuerwehr Backnang',
        address: 'Erbställer Str. 1, 71522 Backnang',
        position: [48.9447, 9.4254],  // Korrekte Position
        icon: '🚒',
        type: 'fire'
    },
    'fw_fellbach': {
        id: 'fw_fellbach',
        name: 'Feuerwehr Fellbach',
        organization: 'Feuerwehr Fellbach',
        address: 'Ringstraße 5, 70736 Fellbach',
        position: [48.8109, 9.2758],  // Korrekte Position
        icon: '🚒',
        type: 'fire'
    },
    
    // POLIZEI
    'pr_waiblingen': {
        id: 'pr_waiblingen',
        name: 'Polizeirevier Waiblingen',
        organization: 'Polizei Baden-Württemberg',
        address: 'Fronackerstraße 14, 71332 Waiblingen',
        position: [48.8297, 9.3195],  // Korrekte Position
        icon: '🚓',
        type: 'police'
    },
    'pr_backnang': {
        id: 'pr_backnang',
        name: 'Polizeirevier Backnang',
        organization: 'Polizei Baden-Württemberg',
        address: 'Bahnhofstraße 31, 71522 Backnang',
        position: [48.9461, 9.4321],  // Korrekte Position
        icon: '🚓',
        type: 'police'
    }
};

const VEHICLES = [
    // RETTUNGSWACHE BACKNANG
    { type: 'RTW', station: 'rw_backnang', cost: 0, owned: true },
    { type: 'RTW', station: 'rw_backnang', cost: 120000, owned: false },
    { type: 'NEF', station: 'rw_backnang', cost: 150000, owned: true },
    { type: 'KTW', station: 'rw_backnang', cost: 60000, owned: false },
    
    // RETTUNGSWACHE WAIBLINGEN
    { type: 'RTW', station: 'rw_waiblingen', cost: 120000, owned: false },
    { type: 'RTW', station: 'rw_waiblingen', cost: 120000, owned: false },
    { type: 'NEF', station: 'rw_waiblingen', cost: 150000, owned: false },
    
    // RETTUNGSWACHE SCHORNDORF
    { type: 'RTW', station: 'rw_schorndorf', cost: 120000, owned: false },
    { type: 'NEF', station: 'rw_schorndorf', cost: 150000, owned: false },
    
    // RETTUNGSWACHE WINNENDEN
    { type: 'RTW', station: 'rw_winnenden', cost: 120000, owned: false },
    
    // FEUERWEHR WAIBLINGEN
    { type: 'LF 10', station: 'fw_waiblingen', cost: 0, owned: true },
    { type: 'DLK 23', station: 'fw_waiblingen', cost: 600000, owned: false },
    { type: 'RW', station: 'fw_waiblingen', cost: 250000, owned: false },
    
    // FEUERWEHR BACKNANG
    { type: 'LF 20', station: 'fw_backnang', cost: 350000, owned: false },
    { type: 'TLF 16', station: 'fw_backnang', cost: 400000, owned: false },
    
    // FEUERWEHR FELLBACH
    { type: 'LF 10', station: 'fw_fellbach', cost: 300000, owned: false },
    
    // POLIZEI
    { type: 'FuStW', station: 'pr_waiblingen', cost: 50000, owned: false },
    { type: 'FuStW', station: 'pr_backnang', cost: 50000, owned: false }
];

// Initialisiere Fahrzeuge mit Funkrufnamen
function initializeVehicles() {
    VEHICLES.forEach((vehicle, index) => {
        const station = STATIONS[vehicle.station];
        if (!station) return;
        
        vehicle.id = `vehicle_${index}`;
        vehicle.callsign = generateCallsign(vehicle.type, station.name);
        vehicle.status = 'available';
        vehicle.position = [...station.position];
        vehicle.totalDistance = 0;
    });
}