// =========================================================================================
// TEMPLATE: ARBEITSUNFALL
// Beschreibung: Unfälle am Arbeitsplatz - vielfältige Verletzungsmuster
// =========================================================================================

export const ARBEITSUNFALL_TEMPLATE = {
    id: 'arbeitsunfall',
    kategorie: 'rd',
    stichwort: 'Arbeitsunfall',
    weight: 2,
    
    anrufer: {
        typen: {
            arbeitskollege: {
                probability: 0.60,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Arbeitsunfall! Kollege hat sich schwer verletzt!',
                    'Er ist mit der Maschine verunglückt!',
                    'Sie ist von der Leiter gefallen auf der Baustelle!',
                    'Betriebsunfall! Hand in der Maschine eingeklemmt!',
                    'Er wurde von einem Teil getroffen!'
                ]
            },
            sicherheitsbeauftragter: {
                probability: 0.25,
                speech_pattern: 'professionell',
                variations: [
                    'Sicherheitsbeauftragter, Arbeitsunfall mit Quetschverletzung.',
                    'Betriebsunfall, Mitarbeiter unter Paletten eingeklemmt.',
                    'Arbeitsunfall Baustelle, Sturz aus Höhe.'
                ]
            },
            vorgesetzter: {
                probability: 0.10,
                speech_pattern: 'sachlich_besorgt',
                variations: [
                    'Arbeitsunfall in meinem Betrieb, Mitarbeiter verletzt.',
                    'Unfall in der Werkstatt, bitte schnell kommen!'
                ]
            },
            ersthelfer_betrieb: {
                probability: 0.05,
                speech_pattern: 'ruhig_professionell',
                variations: [
                    'Betrieblicher Ersthelfer, Patient versorgt, Verdacht auf Fraktur.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.85 },
            female: { probability: 0.15 }
        },
        alter: {
            distribution: 'normal',
            mean: 38,
            stddev: 12,
            min: 18,
            max: 67
        },
        bewusstsein: {
            wach: { probability: 0.80 },
            verwirrt: { probability: 0.15 },
            bewusstlos: { probability: 0.05 }
        }
    },
    
    unfalltyp: {
        sturz: {
            probability: 0.25,
            details: 'Leiter, Gerüst, Dach',
            verletzungen: ['frakturen', 'sht', 'prellungen']
        },
        quetschung: {
            probability: 0.20,
            details: 'Maschine, Paletten, Fahrzeug',
            verletzungen: ['quetschverletzung', 'frakturen', 'crush_syndrom']
        },
        schnitt: {
            probability: 0.15,
            details: 'Maschinen, Werkzeuge',
            verletzungen: ['schnittwunde', 'amputation', 'blutung']
        },
        verbrennung_verätzung: {
            probability: 0.12,
            details: 'Chemikalien, Schweißen, heiße_oberflächen',
            verletzungen: ['verbrennung', 'verätzung']
        },
        stromunfall: {
            probability: 0.08,
            details: 'Elektrische_anlage',
            verletzungen: ['verbrennung', 'herzrhythmusstörung', 'bewusstlosigkeit']
        },
        gefahrstoffe: {
            probability: 0.10,
            details: 'Gase, Dämpfe, Chemikalien',
            verletzungen: ['intoxikation', 'verätzung', 'atemwegsreizung']
        },
        andere: {
            probability: 0.10
        }
    },
    
    verletzungsmuster: {
        extremitäten: {
            frakturen: { probability: 0.50 },
            quetschverletzung: { probability: 0.30 },
            amputation: { probability: 0.08 },
            schnittwunde: { probability: 0.35 }
        },
        kopf: {
            sht: { probability: 0.25 },
            kopfplatzwunde: { probability: 0.30 }
        },
        rumpf: {
            thoraxtrauma: { probability: 0.15 },
            abdominaltrauma: { probability: 0.10 },
            wirbelsäule: { probability: 0.12 }
        },
        haut: {
            verbrennung: { probability: 0.15 },
            verätzung: { probability: 0.10 }
        }
    },
    
    locations: {
        baustelle: { probability: 0.35, address_types: ['construction'] },
        fabrik: { probability: 0.25, address_types: ['industrial'] },
        werkstatt: { probability: 0.20, address_types: ['workshop'] },
        lager: { probability: 0.12, address_types: ['warehouse'] },
        andere: { probability: 0.08 }
    },
    
    besonderheiten: {
        ersthelfer_vor_ort: {
            probability: 0.60,
            note: 'Betriebliche Ersthelfer'
        },
        gefahrenstelle: {
            probability: 0.40,
            note: 'Maschinen abschalten, Gefahrenbereich'
        },
        gefahrstoffe: {
            probability: 0.20,
            note: 'Feuerwehr mit Messgerät',
            dekontamination: 'evtl_erforderlich'
        },
        berufsgenossenschaft: {
            probability: 1.0,
            note: 'Dokumentation, Untersuchung, Meldepflicht'
        },
        betriebsarzt: {
            probability: 0.15,
            note: 'In Großbetrieben vor Ort'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.20,
            triggers: ['schwer', 'amputation', 'crush', 'stromunfall']
        },
        feuerwehr: {
            probability: 0.35,
            reasons: ['gefahrstoffe', 'befreiung', 'absicherung', 'dekontamination']
        },
        polizei: {
            probability: 0.40,
            reasons: ['schwerer_unfall', 'arbeitsschutz', 'ermittlung']
        }
    },
    
    komplikationen: {
        blutung_stark: { probability: 0.30 },
        schock: { probability: 0.20 },
        crush_syndrom: { probability: 0.05 },
        intoxikation: { probability: 0.10 }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            arbeitszeit_08_17: 1.5,
            nacht_schicht: 1.2,
            wochenende: 0.3
        }
    },
    
    lernziele: [
        'Verschiedene Arbeitsunfall-Typen',
        'Gefahrenstelle beachten',
        'Zusätzliche Kräfte (Feuerwehr)',
        'Berufsgenossenschaft/Dokumentation',
        'Betriebliche Ersthelfer einbeziehen'
    ]
};

export default ARBEITSUNFALL_TEMPLATE;