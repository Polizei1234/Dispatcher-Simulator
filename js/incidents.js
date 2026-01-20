class IncidentManager {
    constructor(game) {
        this.game = game;
        this.generationInterval = null;
        this.incidentCounter = 0;
    }

    startGeneration() {
        // Generate incidents based on time speed
        this.generationInterval = setInterval(() => {
            this.generateRandomIncident();
        }, 120000 / this.game.timeSpeed); // Every 2 minutes game time
    }

    stopGeneration() {
        if (this.generationInterval) {
            clearInterval(this.generationInterval);
        }
    }

    async generateRandomIncident() {
        const incident = await this.createIncident();
        this.game.incidents.push(incident);
        this.game.mapManager.addIncidentMarker(incident);
        this.game.showNotification(`Neuer Einsatz: ${incident.keyword}`, 'warning');
        this.game.addLogMessage(`Neuer Einsatz: ${incident.keyword} - ${incident.location}`);
        this.game.updateUI();
    }

    async createIncident() {
        const keyword = this.selectRandomKeyword();
        const location = this.generateRandomLocation();
        const description = await this.generateDescription(keyword, location);

        return {
            id: `INC-${Date.now()}-${this.incidentCounter++}`,
            keyword: keyword.keyword,
            location: location.address,
            position: location.position,
            description: description,
            time: this.game.gameTime.getTime(),
            status: 'new',
            assignedVehicles: [],
            priority: keyword.priority
        };
    }

    selectRandomKeyword() {
        if (!this.game.keywords || this.game.keywords.length === 0) {
            return {
                keyword: 'RD 1',
                category: 'Rettungsdienst',
                priority: 2,
                suggestedVehicles: ['RTW']
            };
        }

        // Weight by priority (higher priority = less frequent)
        const weights = this.game.keywords.map(k => {
            const priorityWeight = k.priority === 1 ? 5 : k.priority === 2 ? 3 : 1;
            return priorityWeight;
        });

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < this.game.keywords.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return this.game.keywords[i];
            }
        }

        return this.game.keywords[0];
    }

    generateRandomLocation() {
        // Locations in Rems-Murr-Kreis around Backnang
        const locations = [
            { address: 'Marktplatz, Backnang', position: [48.9456, 9.4336] },
            { address: 'Bahnhofstraße 12, Backnang', position: [48.9445, 9.4298] },
            { address: 'Wilhelmstraße 5, Backnang', position: [48.9470, 9.4350] },
            { address: 'Stuttgarter Straße 45, Backnang', position: [48.9412, 9.4289] },
            { address: 'Maubacher Straße 8, Backnang', position: [48.9489, 9.4401] },
            { address: 'Industriestraße 23, Backnang', position: [48.9501, 9.4267] },
            { address: 'Kirchplatz, Backnang-Waldrems', position: [48.9389, 9.4512] },
            { address: 'Hauptstraße 67, Maubach', position: [48.9523, 9.4445] },
            { address: 'Sulzbacher Straße 34, Backnang', position: [48.9534, 9.4378] },
            { address: 'Grabenstraße 15, Backnang', position: [48.9467, 9.4312] }
        ];

        return locations[Math.floor(Math.random() * locations.length)];
    }

    async generateDescription(keyword, location) {
        // Template-based descriptions
        const templates = {
            'RD 1': [
                'Person mit Atemnot',
                'Starke Brustschmerzen',
                'Bewusstlose Person',
                'Verkehrsunfall mit verletzter Person'
            ],
            'RD 2': [
                'Person gestürzt, Schmerzen im Bein',
                'Starke Bauchschmerzen',
                'Schwindelgefühl und Übelkeit',
                'Schnittverletzung an der Hand'
            ],
            'RD 3': [
                'Leichte Verletzung',
                'Allgemeines Unwohlsein',
                'Leichte Schmerzen'
            ],
            'B 1': [
                'Zimmerbrand',
                'Rauchentwicklung aus Gebäude',
                'Brand in Wohnung'
            ],
            'B 2': [
                'Dachstuhlbrand',
                'Wohnungsbrand',
                'Brand in Gewerbegebäude'
            ],
            'THL 1': [
                'Verkehrsunfall, Person eingeklemmt',
                'Technische Hilfeleistung nach Unfall',
                'Türöffnung dringend'
            ]
        };

        const keywordTemplates = templates[keyword.keyword] || templates['RD 2'];
        return keywordTemplates[Math.floor(Math.random() * keywordTemplates.length)];
    }
}

export { IncidentManager };