// =========================
// KRANKENHAUS-DATENBANK
// Krankenhäuser im Rems-Murr-Kreis und Umgebung
// =========================

const HOSPITALS = [
    // Rems-Murr-Kreis
    {
        id: 'rkh-winnenden',
        name: 'Rems-Murr-Klinikum Winnenden',
        shortName: 'Winnenden',
        location: [48.87438, 9.39862],
        address: 'Am Jakobsweg 1, 71364 Winnenden',
        type: 'Maximalversorgung',
        specialties: [
            'Notfallversorgung',
            'Stroke Unit',
            'Chest Pain Unit',
            'Traumazentrum',
            'Herzkatheterlabor',
            'Neurochirurgie',
            'Gefäßchirurgie'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Groß',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    {
        id: 'rkh-schorndorf',
        name: 'Rems-Murr-Klinikum Schorndorf',
        shortName: 'Schorndorf',
        location: [48.80416, 9.53095],
        address: 'Schlossgasse 100, 73614 Schorndorf',
        type: 'Schwerpunktversorgung',
        specialties: [
            'Notfallversorgung',
            'Innere Medizin',
            'Chirurgie',
            'Gynäkologie',
            'Pädiatrie',
            'Orthopädie'
        ],
        emergencyRoom: true,
        helicopterLanding: false,
        capacity: 'Mittel',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    {
        id: 'rwk-backnang',
        name: 'Rems-Murr-Klinikum Backnang',
        shortName: 'Backnang',
        location: [48.94597, 9.43303],
        address: 'Heininger Weg 24, 71522 Backnang',
        type: 'Schwerpunktversorgung',
        specialties: [
            'Notfallversorgung',
            'Innere Medizin',
            'Chirurgie',
            'Urologie',
            'HNO',
            'Augenheilkunde'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Mittel',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    
    // Stuttgart (Umgebung)
    {
        id: 'katharinen-stuttgart',
        name: 'Katharinenhospital Stuttgart',
        shortName: 'Katharinenhospital',
        location: [48.78232, 9.18110],
        address: 'Kriegsbergstraße 60, 70174 Stuttgart',
        type: 'Maximalversorgung',
        specialties: [
            'Notfallversorgung',
            'Traumazentrum',
            'Stroke Unit',
            'Herzkatheterlabor',
            'Intensivmedizin',
            'Brandverletzten-Zentrum'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Sehr groß',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    {
        id: 'olgahospital-stuttgart',
        name: 'Olgahospital Stuttgart',
        shortName: 'Olgahospital',
        location: [48.78115, 9.18265],
        address: 'Kriegsbergstraße 62, 70174 Stuttgart',
        type: 'Maximalversorgung',
        specialties: [
            'Kinder-Notfallversorgung',
            'Pädiatrie',
            'Kinderchirurgie',
            'Neonatologie',
            'Kinder-Intensivmedizin'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Groß',
        pediatricOnly: true,
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    {
        id: 'rbk-stuttgart',
        name: 'Robert-Bosch-Krankenhaus Stuttgart',
        shortName: 'Robert-Bosch',
        location: [48.75883, 9.15528],
        address: 'Auerbachstraße 110, 70376 Stuttgart',
        type: 'Maximalversorgung',
        specialties: [
            'Notfallversorgung',
            'Stroke Unit',
            'Herzkatheterlabor',
            'Onkologie',
            'Gefäßchirurgie'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Groß',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    
    // Ludwigsburg
    {
        id: 'rkh-ludwigsburg',
        name: 'Klinikum Ludwigsburg',
        shortName: 'Ludwigsburg',
        location: [48.89683, 9.20122],
        address: 'Posilipostraße 4, 71640 Ludwigsburg',
        type: 'Maximalversorgung',
        specialties: [
            'Notfallversorgung',
            'Stroke Unit',
            'Chest Pain Unit',
            'Traumazentrum',
            'Perinatalzentrum'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Sehr groß',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    
    // Waiblingen
    {
        id: 'rkh-waiblingen',
        name: 'Rems-Murr-Klinikum Waiblingen',
        shortName: 'Waiblingen',
        location: [48.82945, 9.31718],
        address: 'Korber Straße 38, 71332 Waiblingen',
        type: 'Schwerpunktversorgung',
        specialties: [
            'Notfallversorgung',
            'Innere Medizin',
            'Chirurgie',
            'Gynäkologie',
            'Orthopädie'
        ],
        emergencyRoom: true,
        helicopterLanding: false,
        capacity: 'Mittel',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    },
    
    // Weitere Spezialkliniken
    {
        id: 'klinik-schwäbisch-hall',
        name: 'Diakoneo Klinik Schwäbisch Hall',
        shortName: 'Schwäbisch Hall',
        location: [49.11195, 9.73583],
        address: 'Diakonieweg 10, 74523 Schwäbisch Hall',
        type: 'Schwerpunktversorgung',
        specialties: [
            'Notfallversorgung',
            'Innere Medizin',
            'Chirurgie',
            'Neurologie'
        ],
        emergencyRoom: true,
        helicopterLanding: true,
        capacity: 'Groß',
        distance: function(from) {
            return this.calculateDistance(from, this.location);
        }
    }
];

// Helper-Funktionen
HOSPITALS.calculateDistance = function(from, to) {
    // Haversine-Formel für Distanzberechnung
    const R = 6371; // Erdradius in km
    const dLat = (to[0] - from[0]) * Math.PI / 180;
    const dLon = (to[1] - from[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

/**
 * Findet nächstes Krankenhaus
 * @param {array} location - [lat, lng]
 * @param {object} options - Filter-Optionen
 * @returns {object} Nächstes Krankenhaus
 */
HOSPITALS.findNearest = function(location, options = {}) {
    let hospitals = [...HOSPITALS];
    
    // Filter nach Optionen
    if (options.emergencyRoom) {
        hospitals = hospitals.filter(h => h.emergencyRoom);
    }
    
    if (options.specialty) {
        hospitals = hospitals.filter(h => 
            h.specialties.some(s => s.toLowerCase().includes(options.specialty.toLowerCase()))
        );
    }
    
    if (options.pediatric) {
        hospitals = hospitals.filter(h => 
            h.pediatricOnly || h.specialties.includes('Pädiatrie')
        );
    }
    
    if (options.helicopterLanding) {
        hospitals = hospitals.filter(h => h.helicopterLanding);
    }
    
    // Berechne Distanzen und sortiere
    hospitals = hospitals.map(h => ({
        ...h,
        distanceKm: this.calculateDistance(location, h.location)
    }));
    
    hospitals.sort((a, b) => a.distanceKm - b.distanceKm);
    
    return hospitals[0] || null;
};

/**
 * Findet alle Krankenhäuser in Radius
 * @param {array} location - [lat, lng]
 * @param {number} radiusKm - Radius in Kilometern
 * @returns {array} Krankenhäuser im Radius
 */
HOSPITALS.findInRadius = function(location, radiusKm = 10) {
    return HOSPITALS
        .map(h => ({
            ...h,
            distanceKm: this.calculateDistance(location, h.location)
        }))
        .filter(h => h.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
};

/**
 * Findet Krankenhaus nach ID
 * @param {string} id - Krankenhaus-ID
 * @returns {object} Krankenhaus oder null
 */
HOSPITALS.findById = function(id) {
    return HOSPITALS.find(h => h.id === id) || null;
};

/**
 * Findet Krankenhaus nach Namen (Kurzname oder voller Name)
 * @param {string} name - Name
 * @returns {object} Krankenhaus oder null
 */
HOSPITALS.findByName = function(name) {
    const nameLower = name.toLowerCase();
    return HOSPITALS.find(h => 
        h.shortName.toLowerCase().includes(nameLower) ||
        h.name.toLowerCase().includes(nameLower)
    ) || null;
};

/**
 * Wählt geeignetes Krankenhaus basierend auf Einsatz-Typ
 * @param {array} location - [lat, lng]
 * @param {string} incidentType - Einsatz-Typ (Herzinfarkt, Schlaganfall, etc.)
 * @returns {object} Empfohlenes Krankenhaus
 */
HOSPITALS.selectForIncident = function(location, incidentType) {
    const incidentLower = incidentType.toLowerCase();
    
    // Spezialisierte Zuweisungen
    if (incidentLower.includes('schlaganfall') || incidentLower.includes('stroke')) {
        return this.findNearest(location, { specialty: 'Stroke Unit' });
    }
    
    if (incidentLower.includes('herzinfarkt') || incidentLower.includes('chest pain')) {
        return this.findNearest(location, { specialty: 'Chest Pain Unit' });
    }
    
    if (incidentLower.includes('kind') || incidentLower.includes('baby')) {
        return this.findNearest(location, { pediatric: true });
    }
    
    if (incidentLower.includes('trauma') || incidentLower.includes('verkehrsunfall')) {
        return this.findNearest(location, { specialty: 'Traumazentrum' });
    }
    
    if (incidentLower.includes('verbrennung') || incidentLower.includes('brand')) {
        return this.findNearest(location, { specialty: 'Brandverletzten' });
    }
    
    // Standard: Nächstes Krankenhaus mit Notaufnahme
    return this.findNearest(location, { emergencyRoom: true });
};

/**
 * Gibt Liste aller Krankenhaus-Namen zurück (für Dropdowns)
 * @returns {array} Namen
 */
HOSPITALS.getNames = function() {
    return HOSPITALS.map(h => h.shortName);
};

/**
 * Gibt zufälliges Krankenhaus zurück
 * @returns {object} Zufälliges Krankenhaus
 */
HOSPITALS.getRandom = function() {
    return HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)];
};

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.HOSPITALS = HOSPITALS;
}

console.log(`✅ Krankenhaus-Datenbank geladen (${HOSPITALS.length} Krankenhäuser)`);
console.log('✅ HOSPITALS.findNearest(), .selectForIncident() verfügbar');