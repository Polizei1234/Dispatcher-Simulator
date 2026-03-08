// =========================================================================================
// TEMPLATE: KOHLENMONOXID-VERGIFTUNG (CO-VERGIFTUNG)
// Beschreibung: Unsichtbare, geruchlose Gefahr - häufig mehrere Betroffene
// =========================================================================================

export const CO_VERGIFTUNG_TEMPLATE = {
    id: 'co_vergiftung',
    kategorie: 'rd',
    stichwort: 'CO-Vergiftung / Kohlenmonoxid',
    weight: 1,
    
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Uns ist allen übel und wir haben Kopfschmerzen!',
                    'Mein Partner ist bewusstlos! Der Kohlenmonoxid-Melder hat Alarm geschlagen!',
                    'Wir sind alle krank seit heute morgen! Kopfschmerzen, Übelkeit!',
                    'Der CO-Melder piept! Uns ist schwindlig!'
                ]
            },
            nachbar: {
                probability: 0.20,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Der CO-Melder vom Nachbarn piept laut! Keiner macht auf!',
                    'Ich rieche Abgase! Die Nachbarn reagieren nicht!'
                ]
            },
            feuerwehr: {
                probability: 0.25,
                speech_pattern: 'professionell',
                variations: [
                    'Feuerwehr vor Ort, CO-Messung positiv, mehrere Personen betroffen.',
                    'Kohlenmonoxid-Alarm, drei bewusstlose Personen, Wohnung gelüftet.'
                ]
            },
            arbeitskollege: {
                probability: 0.10,
                speech_pattern: 'besorgt',
                variations: [
                    'In der Werkstatt sind mehrere Kollegen umgekippt!',
                    'Uns wird allen schlecht, Abgase in der Halle!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.50 },
            female: { probability: 0.50 }
        },
        alter: {
            distribution: 'uniform',
            min: 5,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.40 },
            verwirrt: { probability: 0.25 },
            somnolent: { probability: 0.20 },
            bewusstlos: { probability: 0.15 }
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.35,
            co_hb: '10-20%',
            symptome: ['kopfschmerzen', 'übelkeit', 'schwindel']
        },
        mittel: {
            probability: 0.40,
            co_hb: '20-40%',
            symptome: ['verwirrtheit', 'sehstörungen', 'schwäche', 'erbrechen']
        },
        schwer: {
            probability: 0.20,
            co_hb: '40-60%',
            symptome: ['bewusstlosigkeit', 'krampfanfälle', 'herzrhythmusstörung']
        },
        tödlich: {
            probability: 0.05,
            co_hb: '>60%',
            symptome: ['koma', 'atemstillstand', 'herzstillstand']
        }
    },
    
    symptome: {
        unspezifisch: {
            kopfschmerzen: { probability: 0.90 },
            übelkeit: { probability: 0.80 },
            schwindel: { probability: 0.75 },
            schwäche: { probability: 0.70 },
            müdigkeit: { probability: 0.65 }
        },
        schwerer: {
            verwirrtheit: { probability: 0.50 },
            sehstörungen: { probability: 0.40 },
            brustschmerz: { probability: 0.35 },
            atemnot: { probability: 0.30 },
            bewusstlosigkeit: { probability: 0.25 },
            krampfanfall: { probability: 0.10 }
        },
        kirschrote_haut: {
            probability: 0.15,
            note: 'Klassisches Zeichen, aber selten!'
        }
    },
    
    quelle: {
        defekte_heizung: {
            probability: 0.40,
            types: ['gastherme', 'ölofen', 'kamin']
        },
        abgase_fahrzeug: {
            probability: 0.25,
            scenarios: ['garage', 'werkstatt', 'defekter_auspuff']
        },
        shisha: {
            probability: 0.15,
            note: 'In geschlossenen Räumen'
        },
        grill_holzkohle: {
            probability: 0.10,
            note: 'Indoor-Grillunfall'
        },
        brand: {
            probability: 0.08,
            note: 'Rauchgasinhalation'
        },
        andere: {
            probability: 0.02
        }
    },
    
    locations: {
        wohnung: { probability: 0.60, address_types: ['residential'] },
        einfamilienhaus: { probability: 0.20, address_types: ['house'] },
        werkstatt_garage: { probability: 0.12, address_types: ['garage', 'workshop'] },
        gewerbe: { probability: 0.05, address_types: ['commercial'] },
        andere: { probability: 0.03 }
    },
    
    besonderheiten: {
        mehrere_patienten: {
            probability: 0.60,
            note: 'CO betrifft oft ganze Familie/Haushalt',
            manv_potential: true,
            anzahl: '2-5 Personen'
        },
        haustiere_betroffen: {
            probability: 0.30,
            note: 'Tiere reagieren empfindlicher'
        },
        chronische_exposition: {
            probability: 0.20,
            note: 'Symptome seit Tagen/Wochen',
            oft_fehldiagnose: 'Grippe'
        },
        akute_exposition: {
            probability: 0.80,
            note: 'Plötzlicher Beginn'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.25,
            triggers: ['bewusstlosigkeit', 'schwere_symptome', 'herzprobleme']
        },
        feuerwehr: {
            probability: 0.90,
            zwingend: true,
            reasons: ['co_messung', 'lüftung', 'quellensuche', 'gefahrenabwehr'],
            note: 'Feuerwehr mit CO-Messerät erforderlich!'
        },
        mehrere_rtw: {
            probability: 0.50,
            bei: 'mehrere_patienten'
        },
        druckkammer: {
            probability: 0.15,
            indikation: 'schwere_vergiftung_schwanger_kinder',
            note: 'Hyperbare Sauerstofftherapie'
        },
        eigenschutz: {
            note: 'NICHT in Wohnung ohne Freigabe Feuerwehr!',
            kritisch: 'Eigenschutz!'
        }
    },
    
    eskalation: {
        weitere_patienten: {
            probability: 0.50,
            announcement: 'Noch mehr Personen in der Wohnung! Auch denen ist schlecht!'
        },
        verschlechterung: {
            probability: 0.20,
            announcement: 'Er wird bewusstlos!'
        },
        reanimation: {
            probability: 0.05,
            announcement: 'Sie reagiert nicht mehr! Atmet nicht!'
        }
    },
    
    zeitfaktoren: {
        jahreszeit: {
            winter: 2.5,
            herbst: 1.5,
            frühling: 0.8,
            sommer: 0.5
        },
        tageszeit: {
            morgen_06_10: 1.5,
            abend_18_22: 1.3,
            andere: 0.9
        }
    },
    
    spätfolgen: {
        note: 'Neurologische Spätfolgen möglich',
        beispiele: ['gedächtnis', 'persönlichkeitsveränderung', 'parkinsoniod'],
        zeitraum: 'Tage bis Wochen nach Vergiftung'
    },
    
    lernziele: [
        'CO-Vergiftung als "stiller Killer"',
        'Mehrere Patienten typisch',
        'Feuerwehr IMMER erforderlich',
        'Eigenschutz - nicht in Wohnung!',
        'Unspezifische Symptome ernst nehmen',
        'Winterzeit = Häufungszeit'
    ]
};

export default CO_VERGIFTUNG_TEMPLATE;