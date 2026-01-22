// =========================
// HOSPITALS v1.0
// Krankenhäuser im Rems-Murr-Kreis
// =========================

const HOSPITALS = {
    WINNENDEN: {
        id: 'kh_winnenden',
        name: 'Rems-Murr-Klinikum Winnenden',
        shortName: 'Winnenden',
        address: 'Am Jakobsweg 1, 71364 Winnenden',
        position: [48.8740, 9.3985],
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
        name: 'Rems-Murr-Klinikum Schorndorf',
        shortName: 'Schorndorf',
        address: 'Schlichtener Straße 105, 73614 Schorndorf',
        position: [48.8045, 9.5285],
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
}

// Globale Instanz
window.HospitalService = HospitalService;
window.HOSPITALS = HOSPITALS;

console.log('🏥 Hospital Service initialisiert: Winnenden & Schorndorf');