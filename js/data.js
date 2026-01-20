// =========================
// DATEN - Wachen & Fahrzeuge
// ILS Waiblingen - Rems-Murr-Kreis
// =========================

// Alle Rettungswachen im Rems-Murr-Kreis
const STATIONS = {
    // DRK Rettungswachen
    'backnang': {
        id: 'backnang',
        name: 'DRK RW Backnang',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.9458, 9.4325],
        address: 'Sulzbacher Str. 69, 71522 Backnang',
        vehicles: [
            { id: 'rtw-backnang-1', type: 'RTW', callsign: 'Florian Backnang 83/1', status: 'available' },
            { id: 'nef-backnang-1', type: 'NEF', callsign: 'Florian Backnang 97/1', status: 'available' }
        ]
    },
    'waiblingen': {
        id: 'waiblingen',
        name: 'DRK RW Waiblingen',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8298, 9.3167],
        address: 'Fronackerstraße 5, 71332 Waiblingen',
        vehicles: [
            { id: 'rtw-waiblingen-1', type: 'RTW', callsign: 'Florian Waiblingen 83/1', status: 'available' },
            { id: 'rtw-waiblingen-2', type: 'RTW', callsign: 'Florian Waiblingen 83/2', status: 'available' },
            { id: 'nef-waiblingen-1', type: 'NEF', callsign: 'Florian Waiblingen 97/1', status: 'available' },
            { id: 'ktw-waiblingen-1', type: 'KTW', callsign: 'Florian Waiblingen 85/1', status: 'available' }
        ]
    },
    'winnenden': {
        id: 'winnenden',
        name: 'DRK RW Winnenden',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8756, 9.4008],
        address: 'Ringstraße 5, 71364 Winnenden',
        vehicles: [
            { id: 'rtw-winnenden-1', type: 'RTW', callsign: 'Florian Winnenden 83/1', status: 'available' }
        ]
    },
    'schorndorf': {
        id: 'schorndorf',
        name: 'DRK RW Schorndorf',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8056, 9.5278],
        address: 'Johann-Philipp-Palm-Straße 23, 73614 Schorndorf',
        vehicles: [
            { id: 'rtw-schorndorf-1', type: 'RTW', callsign: 'Florian Schorndorf 83/1', status: 'available' },
            { id: 'ktw-schorndorf-1', type: 'KTW', callsign: 'Florian Schorndorf 85/1', status: 'available' }
        ]
    },
    'fellbach': {
        id: 'fellbach',
        name: 'DRK RW Fellbach',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.8108, 9.2764],
        address: 'Ringstraße 101, 70736 Fellbach',
        vehicles: [
            { id: 'rtw-fellbach-1', type: 'RTW', callsign: 'Florian Fellbach 83/1', status: 'available' },
            { id: 'rtw-fellbach-2', type: 'RTW', callsign: 'Florian Fellbach 83/2', status: 'available' }
        ]
    },
    'murrhardt': {
        id: 'murrhardt',
        name: 'DRK RW Murrhardt',
        type: 'rettungswache',
        organization: 'DRK',
        position: [48.9767, 9.5719],
        address: 'Seegasse 25, 71540 Murrhardt',
        vehicles: [
            { id: 'rtw-murrhardt-1', type: 'RTW', callsign: 'Florian Murrhardt 83/1', status: 'available' }
        ]
    },
    
    // Feuerwehren (Auswahl wichtiger Standorte)
    'fw-waiblingen': {
        id: 'fw-waiblingen',
        name: 'Feuerwehr Waiblingen',
        type: 'feuerwehr',
        organization: 'Feuerwehr',
        position: [48.8315, 9.3145],
        address: 'Fronackerstraße 3, 71332 Waiblingen',
        vehicles: [
            { id: 'lf-waiblingen-1', type: 'LF 10', callsign: 'Florian Waiblingen 42/1', status: 'available' },
            { id: 'dlk-waiblingen-1', type: 'DLK 23', callsign: 'Florian Waiblingen 33/1', status: 'available' }
        ]
    },
    'fw-backnang': {
        id: 'fw-backnang',
        name: 'Feuerwehr Backnang',
        type: 'feuerwehr',
        organization: 'Feuerwehr',
        position: [48.9465, 9.4312],
        address: 'Sulzbacher Str. 67, 71522 Backnang',
        vehicles: [
            { id: 'lf-backnang-1', type: 'LF 20', callsign: 'Florian Backnang 43/1', status: 'available' },
            { id: 'tlf-backnang-1', type: 'TLF', callsign: 'Florian Backnang 26/1', status: 'available' }
        ]
    },
    
    // Polizei
    'pol-waiblingen': {
        id: 'pol-waiblingen',
        name: 'Polizeirevier Waiblingen',
        type: 'polizei',
        organization: 'Polizei',
        position: [48.8308, 9.3189],
        address: 'Fronackerstraße 14, 71332 Waiblingen',
        vehicles: [
            { id: 'fustw-waiblingen-1', type: 'FuStW', callsign: '2/51-1', status: 'available' },
            { id: 'fustw-waiblingen-2', type: 'FuStW', callsign: '2/51-2', status: 'available' }
        ]
    },
    'pol-backnang': {
        id: 'pol-backnang',
        name: 'Polizeirevier Backnang',
        type: 'polizei',
        organization: 'Polizei',
        position: [48.9451, 9.4335],
        address: 'Erbstetter Straße 26, 71522 Backnang',
        vehicles: [
            { id: 'fustw-backnang-1', type: 'FuStW', callsign: '2/52-1', status: 'available' }
        ]
    }
};

// Vordefinierte Einsätze (falls keine KI verfügbar)
const PREDEFINED_INCIDENTS = [
    {
        keyword: 'RD 1',
        description: 'Person gestürzt, Schmerzen im Bein',
        location: 'Grabenstraße 12, Backnang',
        position: [48.9468, 9.4289],
        caller: 'Angehöriger',
        details: 'Ältere Dame ist in der Wohnung gestürzt. Schmerzen im rechten Bein, kann nicht mehr aufstehen.'
    },
    {
        keyword: 'RD 2',
        description: 'Bewusstlose Person',
        location: 'Bahnhofstraße 45, Waiblingen',
        position: [48.8312, 9.3178],
        caller: 'Passant',
        details: 'Person liegt bewusstlos auf dem Gehweg. Atmung vorhanden, reagiert nicht auf Ansprache.'
    },
    {
        keyword: 'B 1',
        description: 'Mülltonnenbrand',
        location: 'Schillerstraße 8, Winnenden',
        position: [48.8745, 9.4012],
        caller: 'Anwohner',
        details: 'Mülltonne brennt im Hinterhof. Feuer droht auf Gebäude überzugreifen.'
    },
    {
        keyword: 'B 2',
        description: 'Wohnungsbrand',
        location: 'Kornwestheimer Straße 23, Fellbach',
        position: [48.8115, 9.2756],
        caller: 'Nachbar',
        details: 'Rauch aus Fenster im 2. OG. Mehrere Anrufe. Personen eventuell noch im Gebäude.'
    },
    {
        keyword: 'THL 1',
        description: 'Baum auf Fahrbahn',
        location: 'B14 zwischen Murrhardt und Backnang',
        position: [48.9612, 9.5123],
        caller: 'Autofahrer',
        details: 'Großer Baum liegt quer über der Fahrbahn. Straße komplett blockiert.'
    },
    {
        keyword: 'THL VU',
        description: 'Verkehrsunfall mit eingeklemmter Person',
        location: 'L1140 bei Schorndorf',
        position: [48.8089, 9.5312],
        caller: 'Ersthelfer',
        details: 'Frontalzusammenstoß zweier PKW. Eine Person eingeklemmt, zwei weitere verletzt.'
    },
    {
        keyword: 'VU',
        description: 'Verkehrsunfall',
        location: 'Winnender Straße 56, Waiblingen',
        position: [48.8289, 9.3201],
        caller: 'Unfallbeteiligter',
        details: 'Auffahrunfall mit zwei PKW. Beide Fahrer klagen über Nackenschmerzen.'
    },
    {
        keyword: 'RD 2',
        description: 'Brustschmerzen',
        location: 'Am Marktplatz 3, Backnang',
        position: [48.9476, 9.4298],
        caller: 'Ehefrau',
        details: 'Mann, 58 Jahre, plötzliche starke Schmerzen in der Brust. Schwitzen, Atemnot.'
    },
    {
        keyword: 'RD 1',
        description: 'Schnittverletzung',
        location: 'Industriestraße 45, Winnenden',
        position: [48.8778, 9.4034],
        caller: 'Arbeitskollege',
        details: 'Arbeitsunfall in Werkstatt. Tiefe Schnittwunde an der Hand. Starke Blutung.'
    },
    {
        keyword: 'B 3',
        description: 'Großbrand Industriehalle',
        location: 'Gewerbegebiet Ost, Schorndorf',
        position: [48.8023, 9.5389],
        caller: 'Betriebsleiter',
        details: 'Lagerhalle steht in Vollbrand. Starke Rauchentwicklung. Alle Personen evakuiert.'
    }
];

// Textbausteine für Dispatcher
const DISPATCHER_PHRASES = [
    'Wo genau ist der Einsatzort?',
    'Wie viele Personen sind betroffen?',
    'Ist die Person ansprechbar?',
    'Atmet die Person?',
    'Haben Sie bereits Erste Hilfe geleistet?',
    'Sind Sie in Sicherheit?',
    'Bleiben Sie am Telefon, Hilfe ist unterwegs.',
    'Können Sie die Verletzungen beschreiben?',
    'Sind weitere Personen in Gefahr?',
    'Welche Symptome zeigt die Person?'
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