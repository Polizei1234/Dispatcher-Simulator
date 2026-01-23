// =========================================================================================
// TEMPLATE: NIERENKOLIK
// Beschreibung: Starke krampfartige Schmerzen durch Nierenstein
// =========================================================================================

export const NIERENKOLIK_TEMPLATE = {
    id: 'nierenkolik',
    kategorie: 'rd',
    stichwort: 'Nierenkolik',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.40,
                speech_pattern: 'schmerzgeplagt',
                variations: [
                    '*stöhnt* Ich habe wahnsinnige Schmerzen in der Seite!',
                    'Die Schmerzen sind unerträglich, wellenförmig!',
                    'Ich glaube es ist ein Nierenstein, die Schmerzen sind extrem!',
                    '*weint* Es tut so weh, ich halte das nicht aus!'
                ]
            },
            angehöriger: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Mann hat wahnsinnige Schmerzen in der Seite!',
                    'Sie krümmt sich vor Schmerzen und erbricht!',
                    'Er schreit vor Schmerzen, es kommt wellenförmig!',
                    'Sie hat schon öfter Nierensteine, aber diesmal ist es schlimmer!'
                ],
                background_sounds: ['patient_moaning', 'vomiting']
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit typischer Nierenkolik-Symptomatik.',
                    'Bewohner mit starken flankenschmerzen, kolikartig.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.70 },
            female: { probability: 0.30 }
        },
        alter: {
            distribution: 'normal',
            mean: 48,
            stddev: 15,
            min: 20,
            max: 75
        },
        bewusstsein: {
            wach: { probability: 0.95 },
            verwirrt: { probability: 0.05 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            flankenschmerz: {
                probability: 1.0,
                seite: {
                    rechts: 0.48,
                    links: 0.48,
                    beidseitig: 0.04
                }
            },
            kolik: {
                probability: 0.90,
                details: 'Wellenförmig, krampfartig'
            },
            ausstrahlung: {
                leiste: { probability: 0.70 },
                genitalien: { probability: 0.40 },
                oberschenkel: { probability: 0.30 }
            }
        },
        begleitsymptome: {
            übelkeit: { probability: 0.80 },
            erbrechen: { probability: 0.60 },
            harndrang: { probability: 0.50 },
            dysurie: { probability: 0.40 },
            hämaturie: { probability: 0.35 },
            unruhe: { probability: 0.85 },
            schweißausbrüche: { probability: 0.50 }
        }
    },
    
    besonderheiten: {
        frühere_koliken: {
            probability: 0.45,
            note: 'Patient kennt Symptomatik'
        },
        bekannte_nierensteine: {
            probability: 0.40
        },
        schmerzmittel_genommen: {
            probability: 0.50,
            wirkung: {
                keine: 0.70,
                leichte: 0.25,
                gut: 0.05
            }
        },
        fieber: {
            probability: 0.15,
            note: 'Bei Fieber: Komplikation! (Pyelonephritis)'
        }
    },
    
    locations: {
        zuhause: { probability: 0.80, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.12, address_types: ['office'] },
        öffentlich: { probability: 0.08, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        zielklinik: {
            urologie: { probability: 0.30 },
            standard: { probability: 0.70 }
        },
        schmerztherapie: {
            probability: 1.0,
            note: 'Dringend erforderlich'
        }
    },
    
    verlauf: {
        spontanabgang: {
            probability: 0.15,
            announcement: 'Plötzlich ist der Schmerz weg! Ich glaube der Stein ist raus!',
            transport: 'trotzdem_empfohlen'
        },
        keine_besserung: {
            probability: 0.75,
            note: 'Anhaltende starke Schmerzen'
        },
        komplikation: {
            probability: 0.10,
            types: ['harnstau', 'infektion', 'urosepsis']
        }
    },
    
    zeitfaktoren: {
        beginn: {
            plötzlich: { probability: 0.85 },
            langsam: { probability: 0.15 }
        },
        tageszeit_modifikator: {
            nacht: 1.2,
            tag: 1.0
        },
        jahreszeit_modifikator: {
            sommer: 1.3,
            frühling: 1.1,
            herbst: 1.0,
            winter: 0.9
        }
    },
    
    lernziele: [
        'Typische Nierenkolik-Symptomatik erkennen',
        'Schmerzintensität einschätzen',
        'Komplikationen (Fieber) erkennen',
        'Dringlichkeit für Schmerztherapie kommunizieren'
    ]
};

export default NIERENKOLIK_TEMPLATE;
