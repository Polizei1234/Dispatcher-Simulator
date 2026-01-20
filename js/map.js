class MapManager {
    constructor(game) {
        this.game = game;
        this.map = null;
        this.vehicleMarkers = new Map();
        this.incidentMarkers = new Map();
        this.routes = new Map();
    }

    init() {
        // Initialize Leaflet map centered on Waiblingen
        this.map = L.map('map').setView([48.8290, 9.3158], 11);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add station markers
        this.addStationMarkers();
    }

    addStationMarkers() {
        if (!this.game.stations) return;

        this.game.stations.forEach(station => {
            const icon = this.getStationIcon(station.organization);
            
            const marker = L.marker(station.position, {
                icon: L.divIcon({
                    className: 'station-marker',
                    html: icon,
                    iconSize: [30, 30]
                })
            }).addTo(this.map);

            marker.bindPopup(`
                <strong>${station.name}</strong><br>
                ${station.organization}<br>
                ${station.address}
            `);
        });
    }

    getStationIcon(organization) {
        const icons = {
            'Rettungsdienst': '🚑',
            'Feuerwehr': '🚒',
            'Polizei': '🚓',
            'THW': '🚧'
        };
        return `<div style="font-size: 24px;">${icons[organization] || '📍'}</div>`;
    }

    addIncidentMarker(incident) {
        const marker = L.marker(incident.position, {
            icon: L.divIcon({
                className: 'incident-marker pulsing',
                html: '<div style="font-size: 30px; animation: pulse 2s infinite;">🚨</div>',
                iconSize: [40, 40]
            })
        }).addTo(this.map);

        marker.bindPopup(`
            <strong>${incident.keyword}</strong><br>
            ${incident.location}<br>
            ${incident.description}
        `);

        this.incidentMarkers.set(incident.id, marker);
        
        // Fly to incident
        this.map.flyTo(incident.position, 14);
    }

    addVehicleMarker(vehicle) {
        if (this.vehicleMarkers.has(vehicle.id)) {
            this.updateVehicleMarker(vehicle);
            return;
        }

        const icon = this.getVehicleIcon(vehicle.type);
        
        const marker = L.marker(vehicle.position, {
            icon: L.divIcon({
                className: 'vehicle-marker',
                html: `<div style="font-size: 20px;">${icon}</div>`,
                iconSize: [25, 25]
            })
        }).addTo(this.map);

        marker.bindPopup(`
            <strong>${vehicle.callsign}</strong><br>
            ${vehicle.name}<br>
            Status: ${this.game.getVehicleStatusText(vehicle.status)}
        `);

        this.vehicleMarkers.set(vehicle.id, marker);
    }

    updateVehicleMarker(vehicle) {
        const marker = this.vehicleMarkers.get(vehicle.id);
        if (marker) {
            marker.setLatLng(vehicle.position);
            marker.getPopup().setContent(`
                <strong>${vehicle.callsign}</strong><br>
                ${vehicle.name}<br>
                Status: ${this.game.getVehicleStatusText(vehicle.status)}
            `);
        }
    }

    getVehicleIcon(type) {
        const icons = {
            'RTW': '🚑',
            'NEF': '🚗',
            'KTW': '🚐',
            'LF': '🚒',
            'DLK': '🚒',
            'RW': '🚛',
            'FuStW': '🚓',
            'THW': '🚧'
        };
        return icons[type] || '🚗';
    }

    async dispatchVehicle(vehicle, destination) {
        this.addVehicleMarker(vehicle);
        
        // Calculate route using OpenRouteService
        try {
            const route = await this.calculateRoute(vehicle.position, destination, true);
            
            if (route) {
                // Draw route on map
                const polyline = L.polyline(route.coordinates, {
                    color: '#e94560',
                    weight: 4,
                    opacity: 0.7
                }).addTo(this.map);

                this.routes.set(vehicle.id, {
                    polyline: polyline,
                    coordinates: route.coordinates,
                    currentIndex: 0,
                    destination: destination,
                    duration: route.duration,
                    startTime: Date.now()
                });

                // Fit map to show route
                this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
            }
        } catch (error) {
            console.error('Route calculation failed:', error);
            // Fallback: direct line
            this.routes.set(vehicle.id, {
                polyline: null,
                coordinates: [vehicle.position, destination],
                currentIndex: 0,
                destination: destination,
                duration: 600, // 10 minutes fallback
                startTime: Date.now()
            });
        }
    }

    async calculateRoute(start, end, emergency = false) {
        // For now, return a simple straight line
        // In production, use OpenRouteService API
        return {
            coordinates: [start, end],
            duration: this.calculateDistance(start, end) / (emergency ? 60 : 30) * 60 // seconds
        };
    }

    calculateDistance(pos1, pos2) {
        // Haversine formula for distance in km
        const R = 6371;
        const dLat = this.toRad(pos2[0] - pos1[0]);
        const dLon = this.toRad(pos2[1] - pos1[1]);
        const lat1 = this.toRad(pos1[0]);
        const lat2 = this.toRad(pos2[0]);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(deg) {
        return deg * (Math.PI/180);
    }

    updateVehiclePosition(vehicle) {
        const route = this.routes.get(vehicle.id);
        if (!route) return;

        const elapsed = (Date.now() - route.startTime) / 1000; // seconds
        const progress = Math.min(elapsed / route.duration, 1);

        if (progress >= 1) {
            // Arrived
            vehicle.position = route.destination;
            if (vehicle.status === 'responding') {
                vehicle.status = 'on_scene';
                this.game.addRadioMessage(`${vehicle.callsign} - Vor Ort`);
                
                // Start return after 5 minutes
                setTimeout(() => {
                    this.returnVehicle(vehicle);
                }, 300000 / this.game.timeSpeed);
            } else if (vehicle.status === 'returning') {
                vehicle.status = 'available';
                vehicle.incident = null;
                this.game.addRadioMessage(`${vehicle.callsign} - Einsatzbereit`);
                
                // Remove route
                if (route.polyline) {
                    route.polyline.remove();
                }
                this.routes.delete(vehicle.id);
                
                // Award credits
                this.game.credits += 250;
                this.game.showNotification('Einsatz abgeschlossen! +250 €', 'success');
            }
        } else {
            // Interpolate position
            if (route.coordinates.length === 2) {
                const start = route.coordinates[0];
                const end = route.coordinates[1];
                vehicle.position = [
                    start[0] + (end[0] - start[0]) * progress,
                    start[1] + (end[1] - start[1]) * progress
                ];
            }
        }

        this.updateVehicleMarker(vehicle);
    }

    returnVehicle(vehicle) {
        vehicle.status = 'returning';
        this.game.addRadioMessage(`${vehicle.callsign} - Rückkehr zur Wache`);
        
        const station = this.game.stations.find(s => s.name === vehicle.station);
        if (station) {
            this.dispatchVehicle(vehicle, station.position);
        }
    }
}

export { MapManager };