// =========================
// HOSPITALS v2.1
// Krankenhäuser im Rems-Murr-Kreis
// + Korrekte Koordinaten
// + Karten-Symbole
// + ✅ FIXED: Schorndorf Position korrigiert
// =========================

const HOSPITALS = {
    WINNENDEN: {
        id: 'kh_winnenden',
        name: 'Rems-Murr-Klinikum Winnenden',
        shortName: 'Winnenden',
        address: 'Am Jakobsweg 1, 71364 Winnenden',
        position: [48.8700, 9.3922], // ✅ KORRIGIERT: 48°52'12"N, 9°23'32"E
        departments: [
            'Notaufnahme',
            'Innere Medizin',
            'Chirurgie',
            'Neurologie',
            'Kardiologie',
            'Unfallchirurgie'
        ],
        capabilities: {
            trauma: true,
            cardiology: true,
            neurology: true,
            pediatrics: true,
            stroke_unit: true
        }
    },
    SCHORNDORF: {
        id: 'kh_schorndorf',
        name: 'Rems-Murr-Klinik Schorndorf',
        shortName: 'Schorndorf',
        address: 'Schlichtener Straße 105, 73614 Schorndorf',
        position: [48.7967, 9.5295], // ✅ FIXED: 48°47'48"N, 9°31'46"E (offiziell LBA)
        departments: [
            'Notaufnahme',
            'Innere Medizin',
            'Unfallchirurgie',
            'Kardiologie',
            'Gynäkologie'
        ],
        capabilities: {
            trauma: true,
            cardiology: true,
            neurology: false,
            pediatrics: true,
            stroke_unit: false
        }
    }
};

class HospitalService {
    constructor() {
        this.hospitals = HOSPITALS;
        this.markers = {};
    }
    
    /**
     * Berechnet Distanz zwischen zwei Koordinaten (Haversine)
     */
    calculateDistance(pos1, pos2) {
        const R = 6371; // Erdradius in km
        const lat1 = pos1[0] * Math.PI / 180;
        const lat2 = pos2[0] * Math.PI / 180;
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance;
    }
    
    /**
     * Wählt nächstes Krankenhaus basierend auf Einsatzort
     */
    selectNearestHospital(incidentPosition) {
        const distWinnenden = this.calculateDistance(incidentPosition, HOSPITALS.WINNENDEN.position);
        const distSchorndorf = this.calculateDistance(incidentPosition, HOSPITALS.SCHORNDORF.position);
        
        console.log(`🏥 Distanzen: Winnenden ${distWinnenden.toFixed(1)}km, Schorndorf ${distSchorndorf.toFixed(1)}km`);
        
        if (distWinnenden < distSchorndorf) {
            return HOSPITALS.WINNENDEN;
        } else {
            return HOSPITALS.SCHORNDORF;
        }
    }
    
    /**
     * Wählt Krankenhaus basierend auf Einsatztyp und Fähigkeiten
     */
    selectHospitalByIncidentType(incidentPosition, incidentType, patientCondition) {
        // Bei Schlaganfall immer Winnenden (hat Stroke Unit)
        if (incidentType.toLowerCase().includes('schlaganfall') || 
            patientCondition?.neurologicalDeficit) {
            console.log('🧠 Neurologischer Notfall → Winnenden (Stroke Unit)');
            return HOSPITALS.WINNENDEN;
        }
        
        // Bei schwerem Trauma prüfe nächstes Traumazentrum
        if (incidentType.includes('VU P') || patientCondition?.severeTrauma) {
            return this.selectNearestHospital(incidentPosition);
        }
        
        // Standard: Nächstes Krankenhaus
        return this.selectNearestHospital(incidentPosition);
    }
    
    /**
     * Gibt alle Krankenhäuser zurück
     */
    getAllHospitals() {
        return Object.values(this.hospitals);
    }
    
    /**
     * Gibt Krankenhaus-Info für UI zurück
     */
    getHospitalInfo(hospitalId) {
        for (const hospital of Object.values(this.hospitals)) {
            if (hospital.id === hospitalId) {
                return hospital;
            }
        }
        return null;
    }
    
    /**
     * 🆕 NEU: Zeigt Krankenhäuser auf der Karte
     */
    showOnMap() {
        if (typeof map === 'undefined' || !map) {
            console.warn('⚠️ Karte nicht verfügbar');
            return;
        }
        
        console.group('🏥 ZEIGE KRANKENHÄUSER AUF KARTE');
        
        // Custom Icon für Krankenhäuser
        const hospitalIcon = L.divIcon({
            className: 'hospital-marker',
            html: `<div style="
                background: #e74c3c;
                border: 3px solid #fff;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.5);
            ">🏥</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        for (const hospital of Object.values(this.hospitals)) {
            const marker = L.marker(
                hospital.position,
                { icon: hospitalIcon, zIndexOffset: 1000 }
            ).addTo(map);
            
            marker.bindPopup(`
                <div style="min-width: 220px;">
                    <h3 style="margin: 0 0 10px 0; color: #e74c3c;">🏥 ${hospital.name}</h3>
                    <p style="margin: 5px 0; font-size: 0.9em;"><strong>📍 Adresse:</strong><br>${hospital.address}</p>
                    <p style="margin: 5px 0; font-size: 0.9em;"><strong>🏥 Abteilungen:</strong><br>${hospital.departments.slice(0, 3).join('<br>')}</p>
                </div>
            `);
            
            this.markers[hospital.id] = marker;
            console.log(`✅ ${hospital.name} platziert bei [${hospital.position[0]}, ${hospital.position[1]}]`);
        }
        
        console.groupEnd();
    }
}

// Globale Instanz
window.HospitalService = HospitalService;
window.HOSPITALS = HOSPITALS;

// Automatisch auf Karte anzeigen wenn verfügbar
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (typeof map !== 'undefined' && map) {
                const service = new HospitalService();
                service.showOnMap();
            }
        }, 2500); // Warte bis Karte initialisiert
    });
}

console.log('✅ Hospital Service v2.1 initialisiert: Winnenden & Schorndorf (mit korrigierten Koordinaten)');
console.log('🏥 Winnenden: [48.8700, 9.3922]');
console.log('🏥 Schorndorf: [48.7967, 9.5295] - KORRIGIERT');