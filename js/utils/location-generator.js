// =========================
// LOCATION GENERATOR v1.0
// Zufällige Einsatzorte im gesamten Rems-Murr-Kreis
// =========================

const REMS_MURR_HOTSPOTS = [
    // Hauptstädte (höhere Gewichtung)
    { name: 'Waiblingen', lat: 48.8309, lon: 9.3256, radius: 0.015, weight: 5 },
    { name: 'Winnenden', lat: 48.8756, lon: 9.4003, radius: 0.012, weight: 4 },
    { name: 'Schorndorf', lat: 48.8070, lon: 9.5290, radius: 0.012, weight: 4 },
    { name: 'Backnang', lat: 48.9467, lon: 9.4333, radius: 0.015, weight: 4 },
    { name: 'Fellbach', lat: 48.8109, lon: 9.2765, radius: 0.012, weight: 4 },
    
    // Mittelgroße Gemeinden
    { name: 'Weinstadt', lat: 48.8108, lon: 9.3826, radius: 0.010, weight: 3 },
    { name: 'Welzheim', lat: 48.8686, lon: 9.6319, radius: 0.008, weight: 2 },
    { name: 'Murrhardt', lat: 48.9819, lon: 9.5720, radius: 0.010, weight: 2 },
    { name: 'Remshalden', lat: 48.8183, lon: 9.4000, radius: 0.008, weight: 2 },
    { name: 'Kernen im Remstal', lat: 48.7950, lon: 9.3383, radius: 0.007, weight: 2 },
    
    // Kleinere Gemeinden
    { name: 'Korb', lat: 48.8483, lon: 9.3617, radius: 0.006, weight: 1 },
    { name: 'Schwaikheim', lat: 48.8767, lon: 9.3500, radius: 0.005, weight: 1 },
    { name: 'Leutenbach', lat: 48.8983, lon: 9.3967, radius: 0.006, weight: 1 },
    { name: 'Urbach', lat: 48.8167, lon: 9.5784, radius: 0.006, weight: 1 },
    { name: 'Plüderhausen', lat: 48.7915, lon: 9.6055, radius: 0.006, weight: 1 },
    { name: 'Rudersberg', lat: 48.8841, lon: 9.5373, radius: 0.007, weight: 1 },
    { name: 'Winterbach', lat: 48.8013, lon: 9.4768, radius: 0.006, weight: 1 },
    { name: 'Berglen', lat: 48.9017, lon: 9.4833, radius: 0.008, weight: 1 },
    { name: 'Oppenweiler', lat: 48.9805, lon: 9.4606, radius: 0.007, weight: 1 },
    { name: 'Sulzbach an der Murr', lat: 49.0092, lon: 9.4850, radius: 0.006, weight: 1 },
    { name: 'Aspach', lat: 48.9722, lon: 9.3994, radius: 0.007, weight: 1 },
    { name: 'Burgstetten', lat: 48.9276, lon: 9.3739, radius: 0.006, weight: 1 },
    { name: 'Allmersbach im Tal', lat: 48.9456, lon: 9.3667, radius: 0.005, weight: 1 },
    { name: 'Althütte', lat: 48.9817, lon: 9.5944, radius: 0.006, weight: 1 },
    { name: 'Kaisersbach', lat: 48.9556, lon: 9.6361, radius: 0.006, weight: 1 },
    { name: 'Alfdorf', lat: 48.8500, lon: 9.7167, radius: 0.008, weight: 1 },
    { name: 'Großerlach', lat: 49.0333, lon: 9.5500, radius: 0.010, weight: 1 },
    { name: 'Spiegelberg', lat: 49.0167, lon: 9.3833, radius: 0.006, weight: 1 },
    { name: 'Kirchberg an der Murr', lat: 49.0667, lon: 9.4667, radius: 0.005, weight: 1 },
    { name: 'Weissach im Tal', lat: 48.8667, lon: 9.3667, radius: 0.006, weight: 1 },
    { name: 'Allmendingen', lat: 48.7833, lon: 9.4500, radius: 0.005, weight: 1 }
];

class LocationGenerator {
    constructor() {
        this.geocodeCache = {};
        this.lastGeocodeRequest = 0;
    }
    
    /**
     * Wählt zufälligen Hotspot basierend auf Gewichtung
     */
    getRandomHotspot() {
        const totalWeight = REMS_MURR_HOTSPOTS.reduce((sum, zone) => sum + zone.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const zone of REMS_MURR_HOTSPOTS) {
            random -= zone.weight;
            if (random <= 0) {
                return zone;
            }
        }
        
        return REMS_MURR_HOTSPOTS[0];
    }
    
    /**
     * Generiert zufällige Koordinaten innerhalb eines Hotspots
     */
    generateRandomLocation() {
        const hotspot = this.getRandomHotspot();
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * hotspot.radius;
        const lat = hotspot.lat + (distance * Math.cos(angle));
        const lon = hotspot.lon + (distance * Math.sin(angle));
        
        return { 
            lat: lat, 
            lon: lon, 
            hotspot: hotspot.name,
            coordinates: [lat, lon]
        };
    }
    
    /**
     * Reverse Geocoding via Nominatim OpenStreetMap
     */
    async reverseGeocode(lat, lon, retries = 0) {
        const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
        
        if (this.geocodeCache[cacheKey]) {
            console.log(`📦 Geocoding Cache-Hit: ${cacheKey}`);
            return this.geocodeCache[cacheKey];
        }
        
        // Rate Limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastGeocodeRequest;
        if (timeSinceLastRequest < 1000) {
            const waitTime = 1000 - timeSinceLastRequest;
            console.log(`⏳ Warte ${waitTime}ms (Rate Limiting)`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastGeocodeRequest = Date.now();
        
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'ILS-Rems-Murr-Simulator/2.0' }
            });

            if (response.status === 429) {
                if (retries < 3) {
                    const backoff = Math.pow(2, retries) * 1000;
                    console.warn(`⚠️ Nominatim 429 - Retry in ${backoff}ms (Versuch ${retries + 1}/3)`);
                    await new Promise(resolve => setTimeout(resolve, backoff));
                    return this.reverseGeocode(lat, lon, retries + 1);
                } else {
                    console.error('❌ Nominatim Rate Limit erreicht nach 3 Versuchen');
                    return null;
                }
            }

            if (!response.ok) {
                console.error('❌ Nominatim Error:', response.status);
                return null;
            }

            const data = await response.json();
            if (!data || !data.address) {
                console.error('❌ Keine Adresse gefunden');
                return null;
            }

            const addr = data.address;
            const street = addr.road || addr.pedestrian || addr.footway || addr.path || 'Unbekannte Straße';
            const houseNumber = addr.house_number || '';
            const city = addr.city || addr.town || addr.village || addr.municipality || 'Rems-Murr-Kreis';
            
            const address = `${street} ${houseNumber}, ${city}`.trim();
            this.geocodeCache[cacheKey] = address;
            
            console.log(`✅ Geocoding erfolgreich: ${address}`);
            return address;
        } catch (error) {
            console.error('❌ Geocoding Fehler:', error);
            return null;
        }
    }
    
    /**
     * Generiert kompletten Einsatzort mit Adresse
     */
    async generateIncidentLocation() {
        const location = this.generateRandomLocation();
        console.log(`📍 Generiere Einsatzort in ${location.hotspot}`);
        
        const address = await this.reverseGeocode(location.lat, location.lon);
        
        return {
            coordinates: location.coordinates,
            lat: location.lat,
            lon: location.lon,
            address: address || `Unbekannte Adresse in ${location.hotspot}`,
            hotspot: location.hotspot
        };
    }
}

// Globale Instanz
window.LocationGenerator = LocationGenerator;
window.REMS_MURR_HOTSPOTS = REMS_MURR_HOTSPOTS;