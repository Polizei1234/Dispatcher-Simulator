// =========================
// DATEN - Wachen & Fahrzeuge
// ILS Waiblingen - Rems-Murr-Kreis
// =========================

// Hilfsfunktion für Funkrufnamen
function generateCallsign(type, city, number) {
    const pattern = CALLSIGN_PATTERNS_BW[type];
    if (pattern) {
        return pattern(city, number);
    }
    return `${type} ${city} ${number}`;
}

// Alle Rettungswachen im Rems-Murr-Kreis
const STATIONS = {
    // DRK Rettungswachen
    'backnang': {
        id: 'backnang',
        name: 'DRK RW Backnang',
        city: 'Backnang',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.9458, 9.4325],
        address: 'Sulzbacher Str. 69, 71522 Backnang',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-backnang-1', type: 'RTW', callsign: generateCallsign('RTW', 'Backnang', 1), status: 'available' },
            { id: 'nef-backnang-1', type: 'NEF', callsign: generateCallsign('NEF', 'Backnang', 1), status: 'available' }
        ]
    },
    'waiblingen': {
        id: 'waiblingen',
        name: 'DRK RW Waiblingen',
        city: 'Waiblingen',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8298, 9.3167],
        address: 'Fronackerstraße 5, 71332 Waiblingen',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-waiblingen-1', type: 'RTW', callsign: generateCallsign('RTW', 'Waiblingen', 1), status: 'available' },
            { id: 'rtw-waiblingen-2', type: 'RTW', callsign: generateCallsign('RTW', 'Waiblingen', 2), status: 'available' },
            { id: 'nef-waiblingen-1', type: 'NEF', callsign: generateCallsign('NEF', 'Waiblingen', 1), status: 'available' },
            { id: 'ktw-waiblingen-1', type: 'KTW', callsign: generateCallsign('KTW', 'Waiblingen', 1), status: 'available' }
        ]
    },
    'winnenden': {
        id: 'winnenden',
        name: 'DRK RW Winnenden',
        city: 'Winnenden',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8756, 9.4008],
        address: 'Ringstraße 5, 71364 Winnenden',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-winnenden-1', type: 'RTW', callsign: generateCallsign('RTW', 'Winnenden', 1), status: 'available' }
        ]
    },
    'schorndorf': {
        id: 'schorndorf',
        name: 'DRK RW Schorndorf',
        city: 'Schorndorf',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8056, 9.5278],
        address: 'Johann-Philipp-Palm-Straße 23, 73614 Schorndorf',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-schorndorf-1', type: 'RTW', callsign: generateCallsign('RTW', 'Schorndorf', 1), status: 'available' },
            { id: 'ktw-schorndorf-1', type: 'KTW', callsign: generateCallsign('KTW', 'Schorndorf', 1), status: 'available' }
        ]
    },
    'fellbach': {
        id: 'fellbach',
        name: 'DRK RW Fellbach',
        city: 'Fellbach',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8108, 9.2764],
        address: 'Ringstraße 101, 70736 Fellbach',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-fellbach-1', type: 'RTW', callsign: generateCallsign('RTW', 'Fellbach', 1), status: 'available' },
            { id: 'rtw-fellbach-2', type: 'RTW', callsign: generateCallsign('RTW', 'Fellbach', 2), status: 'available' }
        ]
    },
    'murrhardt': {
        id: 'murrhardt',
        name: 'DRK RW Murrhardt',
        city: 'Murrhardt',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.9767, 9.5719],
        address: 'Seegasse 25, 71540 Murrhardt',
        icon: '🚑',
        vehicles: [
            { id: 'rtw-murrhardt-1', type: 'RTW', callsign: generateCallsign('RTW', 'Murrhardt', 1), status: 'available' }
        ]
    },
    
    // Feuerwehren (Auswahl wichtiger Standorte)
    'fw-waiblingen': {
        id: 'fw-waiblingen',
        name: 'Feuerwehr Waiblingen',
        city: 'Waiblingen',
        type: 'feuerwehr',
        organization: 'Feuerwehr',
        position: [48.8315, 9.3145],
        address: 'Fronackerstraße 3, 71332 Waiblingen',
        icon: '🚒',
        vehicles: [
            { id: 'lf-waiblingen-1', type: 'LF 10', callsign: generateCallsign('LF 10', 'Waiblingen', 1), status: 'available' },
            { id: 'dlk-waiblingen-1', type: 'DLK 23', callsign: generateCallsign('DLK 23', 'Waiblingen', 1), status: 'available' }
        ]
    },
    'fw-backnang': {
        id: 'fw-backnang',
        name: 'Feuerwehr Backnang',
        city: 'Backnang',
        type: 'feuerwehr',
        organization: 'Feuerwehr',
        position: [48.9465, 9.4312],
        address: 'Sulzbacher Str. 67, 71522 Backnang',
        icon: '🚒',
        vehicles: [
            { id: 'lf-backnang-1', type: 'LF 20', callsign: generateCallsign('LF 20', 'Backnang', 1), status: 'available' },
            { id: 'tlf-backnang-1', type: 'TLF', callsign: generateCallsign('TLF', 'Backnang', 1), status: 'available' }
        ]
    },
    
    // Polizei
    'pol-waiblingen': {
        id: 'pol-waiblingen',
        name: 'Polizeirevier Waiblingen',
        city: 'WN',
        type: 'polizei',
        organization: 'Polizei',
        position: [48.8308, 9.3189],
        address: 'Fronackerstraße 14, 71332 Waiblingen',
        icon: '🚓',
        vehicles: [
            { id: 'fustw-waiblingen-1', type: 'FuStW', callsign: generateCallsign('FuStW', 'WN', 1), status: 'available' },
            { id: 'fustw-waiblingen-2', type: 'FuStW', callsign: generateCallsign('FuStW', 'WN', 2), status: 'available' }
        ]
    },
    'pol-backnang': {
        id: 'pol-backnang',
        name: 'Polizeirevier Backnang',
        city: 'BK',
        type: 'polizei',
        organization: 'Polizei',
        position: [48.9451, 9.4335],
        address: 'Erbstetter Straße 26, 71522 Backnang',
        icon: '🚓',
        vehicles: [
            { id: 'fustw-backnang-1', type: 'FuStW', callsign: generateCallsign('FuStW', 'BK', 1), status: 'available' }
        ]
    }
};

// Vordefinierte Einsätze (falls keine KI verfügbar)
// WICHTIG: Nur minimale Infos am Anfang!
const PREDEFINED_INCIDENTS = [
    {
        keyword: 'RD 1',
        initialMessage: 'Hallo... ähm... hier ist jemand gestürzt!',
        location: 'Grabenstraße 12, Backnang',
        position: [48.9468, 9.4289],
        caller: 'Angehöriger',
        fullDetails: {
            description: 'Person gestürzt, Schmerzen im Bein',
            age: '82 Jahre',
            gender: 'weiblich',
            conscious: true,
            breathing: true,
            exactLocation: 'Wohnung im 2. OG',
            injuries: 'Schmerzen im rechten Bein, kann nicht mehr aufstehen'
        }
    },
    {
        keyword: 'RD 2',
        initialMessage: 'Schnell! Hier liegt jemand am Boden und reagiert nicht!',
        location: 'Bahnhofstraße 45, Waiblingen',
        position: [48.8312, 9.3178],
        caller: 'Passant',
        fullDetails: {
            description: 'Bewusstlose Person',
            age: 'ca. 50 Jahre',
            gender: 'männlich',
            conscious: false,
            breathing: true,
            exactLocation: 'Gehweg vor dem Supermarkt',
            injuries: 'Bewusstlos, reagiert nicht auf Ansprache, Atmung vorhanden'
        }
    },
    {
        keyword: 'B 1',
        initialMessage: 'Hier brennt eine Mülltonne!',
        location: 'Schillerstraße 8, Winnenden',
        position: [48.8745, 9.4012],
        caller: 'Anwohner',
        fullDetails: {
            description: 'Mülltonnenbrand',
            exactLocation: 'Hinterhof',
            danger: 'Feuer droht auf Gebäude überzugreifen',
            people: 'Keine Personen in Gefahr'
        }
    },
    {
        keyword: 'B 2',
        initialMessage: 'Feuer! Es kommt Rauch aus einem Fenster!',
        location: 'Kornwestheimer Straße 23, Fellbach',
        position: [48.8115, 9.2756],
        caller: 'Nachbar',
        fullDetails: {
            description: 'Wohnungsbrand',
            exactLocation: '2. Obergeschoss',
            danger: 'Starke Rauchentwicklung',
            people: 'Personen eventuell noch im Gebäude'
        }
    },
    {
        keyword: 'THL 1',
        initialMessage: 'Ein Baum ist auf die Straße gefallen!',
        location: 'B14 zwischen Murrhardt und Backnang',
        position: [48.9612, 9.5123],
        caller: 'Autofahrer',
        fullDetails: {
            description: 'Baum auf Fahrbahn',
            exactLocation: 'B14, Fahrtrichtung Backnang',
            danger: 'Straße komplett blockiert',
            people: 'Keine Verletzten'
        }
    },
    {
        keyword: 'THL VU',
        initialMessage: 'Unfall! Zwei Autos... eine Person ist eingeklemmt!',
        location: 'L1140 bei Schorndorf',
        position: [48.8089, 9.5312],
        caller: 'Ersthelfer',
        fullDetails: {
            description: 'Verkehrsunfall mit eingeklemmter Person',
            vehicles: '2 PKW',
            injured: '3 Personen',
            trapped: '1 Person eingeklemmt',
            danger: 'Benzin läuft aus'
        }
    },
    {
        keyword: 'VU',
        initialMessage: 'Ich hatte gerade einen Unfall...',
        location: 'Winnender Straße 56, Waiblingen',
        position: [48.8289, 9.3201],
        caller: 'Unfallbeteiligter',
        fullDetails: {
            description: 'Verkehrsunfall',
            vehicles: '2 PKW',
            injured: '2 Personen mit Nackenschmerzen',
            danger: 'Keine akute Gefahr'
        }
    },
    {
        keyword: 'RD 2',
        initialMessage: 'Mein Mann... er hat plötzlich Schmerzen in der Brust!',
        location: 'Am Marktplatz 3, Backnang',
        position: [48.9476, 9.4298],
        caller: 'Ehefrau',
        fullDetails: {
            description: 'Brustschmerzen',
            age: '58 Jahre',
            gender: 'männlich',
            symptoms: 'Starke Schmerzen in der Brust, Schwitzen, Atemnot',
            conscious: true,
            breathing: true
        }
    }
];

// Textbausteine für Dispatcher
const DISPATCHER_PHRASES = [
    'Notruf 112, wo genau ist der Notfall?',
    'Wie viele Personen sind betroffen?',
    'Ist die Person ansprechbar?',
    'Atmet die Person normal?',
    'Können Sie die Verletzungen genauer beschreiben?',
    'Sind weitere Personen in Gefahr?',
    'Wie alt ist die Person ungefähr?',
    'Was ist genau passiert?',
    'Wo befinden Sie sich genau?',
    'Bleiben Sie bitte am Telefon, Hilfe ist bereits unterwegs.',
    'Haben Sie bereits Erste Hilfe geleistet?',
    'Sind Sie selbst in Sicherheit?'
];

// Funksprüche Textbausteine
const RADIO_PHRASES = {
    dispatch: [
        'Einsatz für {callsign}: {keyword} in {location}',
        '{callsign}, kommen Sie',
        'Rückmeldung erbeten',
        'Weitere Informationen folgen'
    ],
    vehicle: [
        '{callsign} verstanden, rücken aus',
        '{callsign} vor Ort',
        '{callsign} Patient übernommen',
        '{callsign} auf Transportfahrt',
        '{callsign} am Ziel',
        '{callsign} wieder frei',
        '{callsign} benötigen Nachforderung',
        '{callsign} Einsatz abgeschlossen'
    ]
};