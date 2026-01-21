// =========================
// ADDRESS SERVICE
// Konvertiert Koordinaten ↔ Adressen (Nominatim API)
// =========================

const AddressService = {
    cache: new Map(),
    rateLimitDelay: 1000, // Nominatim: max 1 Request/Sekunde
    lastRequest: 0,

    /**
     * Konvertiert Koordinaten zu Adresse
     */
    async coordsToAddress(lat, lon) {
        const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        
        // Check Cache
        if (this.cache.has(cacheKey)) {
            console.log('📦 Address aus Cache:', this.cache.get(cacheKey));
            return this.cache.get(cacheKey);
        }

        // Rate Limiting
        await this.waitForRateLimit();

        try {
            console.log(`📍 Reverse Geocoding: ${lat}, ${lon}`);
            
            const url = `https://nominatim.openstreetmap.org/reverse?` +
                       `format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ILS-Waiblingen-Simulator/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`Nominatim Error: ${response.status}`);
            }

            const data = await response.json();
            
            const address = this.formatAddress(data);
            
            // Cache speichern
            this.cache.set(cacheKey, address);
            
            console.log('✅ Adresse gefunden:', address);
            return address;

        } catch (error) {
            console.error('❌ Geocoding-Fehler:', error);
            // Fallback
            return this.generateFallbackAddress(lat, lon);
        }
    },

    /**
     * Formatiert Nominatim-Response zu lesbarer Adresse
     */
    formatAddress(data) {
        const addr = data.address;
        
        let parts = [];

        // Straße + Hausnummer
        if (addr.road) {
            let street = addr.road;
            if (addr.house_number) {
                street += ' ' + addr.house_number;
            }
            parts.push(street);
        } else if (addr.hamlet || addr.suburb) {
            parts.push(addr.hamlet || addr.suburb);
        }

        // Stadt/Ort
        const city = addr.city || addr.town || addr.village || addr.municipality;
        if (city) {
            parts.push(city);
        }

        return parts.join(', ');
    },

    /**
     * Generiert Fallback-Adresse bei Fehler
     */
    generateFallbackAddress(lat, lon) {
        // Bestimme nächste Stadt im Rems-Murr-Kreis basierend auf Koordinaten
        const cities = [
            { name: 'Waiblingen', lat: 48.83, lon: 9.32 },
            { name: 'Backnang', lat: 48.95, lon: 9.42 },
            { name: 'Fellbach', lat: 48.82, lon: 9.27 },
            { name: 'Schorndorf', lat: 48.80, lon: 9.53 },
            { name: 'Winnenden', lat: 48.87, lon: 9.39 },
            { name: 'Murrhardt', lat: 48.98, lon: 9.57 },
            { name: 'Welzheim', lat: 48.87, lon: 9.63 }
        ];

        // Finde nächste Stadt
        let nearest = cities[0];
        let minDist = this.distance(lat, lon, nearest.lat, nearest.lon);

        cities.forEach(city => {
            const dist = this.distance(lat, lon, city.lat, city.lon);
            if (dist < minDist) {
                minDist = dist;
                nearest = city;
            }
        });

        return `Bereich ${nearest.name}`;
    },

    /**
     * Berechnet Distanz zwischen zwei Punkten
     */
    distance(lat1, lon1, lat2, lon2) {
        const dx = lat2 - lat1;
        const dy = lon2 - lon1;
        return Math.sqrt(dx*dx + dy*dy);
    },

    /**
     * Wartet auf Rate Limit
     */
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.rateLimitDelay) {
            const waitTime = this.rateLimitDelay - timeSinceLastRequest;
            console.log(`⏳ Rate Limit: Warte ${waitTime}ms`);
            await this.sleep(waitTime);
        }
        
        this.lastRequest = Date.now();
    },

    /**
     * Sleep Helper
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Konvertiert Adresse zu Koordinaten (Search)
     */
    async addressToCoords(address) {
        // Rate Limiting
        await this.waitForRateLimit();

        try {
            console.log(`🔍 Geocoding: ${address}`);
            
            const url = `https://nominatim.openstreetmap.org/search?` +
                       `format=json&q=${encodeURIComponent(address)}&` +
                       `countrycodes=de&limit=1`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ILS-Waiblingen-Simulator/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`Nominatim Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                throw new Error('Keine Koordinaten gefunden');
            }

            const coords = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };

            console.log('✅ Koordinaten gefunden:', coords);
            return coords;

        } catch (error) {
            console.error('❌ Geocoding-Fehler:', error);
            return null;
        }
    },

    /**
     * Generiert zufällige Koordinaten im Rems-Murr-Kreis
     */
    generateRandomCoords() {
        // Rems-Murr-Kreis Bounding Box
        const bounds = {
            latMin: 48.75,
            latMax: 49.05,
            lonMin: 9.20,
            lonMax: 9.70
        };

        const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
        const lon = bounds.lonMin + Math.random() * (bounds.lonMax - bounds.lonMin);

        return {
            lat: parseFloat(lat.toFixed(5)),
            lon: parseFloat(lon.toFixed(5))
        };
    },

    /**
     * Generiert Koordinaten in der Nähe eines Hotspots
     */
    generateHotspotCoords(hotspotType) {
        const hotspots = {
            'autobahn': [
                { lat: 48.95, lon: 9.42, radius: 0.05 }, // A81 bei Backnang
                { lat: 48.82, lon: 9.27, radius: 0.03 }  // B14 bei Fellbach
            ],
            'stadt': [
                { lat: 48.83, lon: 9.32, radius: 0.02 }, // Waiblingen
                { lat: 48.95, lon: 9.42, radius: 0.02 }, // Backnang
                { lat: 48.80, lon: 9.53, radius: 0.02 }  // Schorndorf
            ],
            'landstrasse': [
                { lat: 48.87, lon: 9.39, radius: 0.04 }, // B14
                { lat: 48.90, lon: 9.50, radius: 0.04 }  // B29
            ]
        };

        const spots = hotspots[hotspotType] || hotspots['stadt'];
        const spot = spots[Math.floor(Math.random() * spots.length)];

        // Zufällige Position im Radius
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * spot.radius;

        const lat = spot.lat + distance * Math.cos(angle);
        const lon = spot.lon + distance * Math.sin(angle);

        return {
            lat: parseFloat(lat.toFixed(5)),
            lon: parseFloat(lon.toFixed(5))
        };
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('📍 Address Service bereit');
    });
}
