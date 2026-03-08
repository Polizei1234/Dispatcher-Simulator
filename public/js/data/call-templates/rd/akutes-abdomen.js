// =========================================================================================
// TEMPLATE: AKUTES ABDOMEN
// Beschreibung: Starke Bauchschmerzen - viele mögliche Ursachen
// =========================================================================================

export const AKUTES_ABDOMEN_TEMPLATE = {
    id: 'akutes_abdomen',
    kategorie: 'rd',
    stichwort: 'Akutes Abdomen / Bauchschmerzen',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'schmerzgeplagt',
                variations: [
                    '*stöhnt* Ich habe wahnsinnige Bauchschmerzen!',
                    'Es tut so weh im Bauch, ich halte das nicht aus!',
                    'Mein Bauch ist steinhart und tut furchtbar weh!',
                    'Ich habe unerträgliche Schmerzen im Unterbauch!'
                ]
            },
            angehöriger: {
                probability: 0.55,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat starke Bauchschmerzen und schreit vor Schmerzen!',
                    'Er krümmt sich vor Schmerzen, der Bauch ist ganz hart!',
                    'Meine Tochter hat plötzlich extreme Bauchschmerzen bekommen!',
                    'Sie erbricht und hat starke Schmerzen im Bauch!'
                ],
                background_sounds: ['patient_moaning', 'vomiting']
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit akutem Abdomen, brettharter Bauch, Abwehrspannung.',
                    'Bewohnerin mit starken abdominellen Schmerzen und Erbrechen.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.48 },
            female: { probability: 0.52 }
        },
        alter: {
            distribution: 'normal',
            mean: 52,
            stddev: 20,
            min: 18,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.85 },
            verwirrt: { probability: 0.10 },
            bewusstlos: { probability: 0.05 }
        }
    },
    
    symptome: {
        schmerzlokalisation: {
            oberbauch: { probability: 0.30 },
            unterbauch: { probability: 0.25 },
            rechter_unterbauch: { probability: 0.20 },
            diffus: { probability: 0.25 }
        },
        schmerzcharakter: {
            kolikartig: { probability: 0.30 },
            konstant: { probability: 0.50 },
            krampfartig: { probability: 0.20 }
        },
        begleitsymptome: {
            übelkeit: { probability: 0.70 },
            erbrechen: { probability: 0.60 },
            fieber: { probability: 0.40 },
            abwehrspannung: { probability: 0.35 },
            diarrhö: { probability: 0.25 },
            obstipation: { probability: 0.20 },
            schockzeichen: { probability: 0.15 }
        }
    },
    
    differentialdiagnosen: {
        appendizitis: {
            probability: 0.25,
            lokalisation: 'rechter_unterbauch',
            severity: 'schwer',
            op_indikation: true
        },
        ileus: {
            probability: 0.15,
            symptome: ['erbrechen', 'aufgetriebener_bauch', 'stuhlverhalt'],
            severity: 'kritisch'
        },
        cholezystitis: {
            probability: 0.12,
            lokalisation: 'rechter_oberbauch',
            severity: 'mittel-schwer'
        },
        pankreatitis: {
            probability: 0.10,
            lokalisation: 'oberbauch_gürtel',
            severity: 'schwer'
        },
        perforation: {
            probability: 0.08,
            symptome: ['brettharter_bauch', 'schock'],
            severity: 'kritisch'
        },
        divertikulitis: {
            probability: 0.10,
            lokalisation: 'linker_unterbauch',
            severity: 'mittel'
        },
        gynäkologisch: {
            probability: 0.08,
            details: 'Adnexitis, EUG, Ovarialzyste',
            nur_frauen: true
        },
        andere: {
            probability: 0.12,
            types: ['gastroenteritis', 'nierenkolik', 'harnwegsinfektion']
        }
    },
    
    locations: {
        zuhause: { probability: 0.75, address_types: ['residential'] },
        öffentlich: { probability: 0.15, address_types: ['public_place'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.12,
            triggers: ['schock', 'perforation_verdacht', 'kreislaufinstabilität']
        },
        zielklinik: {
            chirurgie: { probability: 0.60 },
            standard: { probability: 0.40 }
        }
    },
    
    eskalation: {
        schock: {
            probability: 0.10,
            announcement: 'Er wird ganz blass und der Puls rast!'
        },
        bewusstlosigkeit: {
            probability: 0.05,
            announcement: 'Sie wird bewusstlos!'
        }
    },
    
    zeitfaktoren: {
        beginn: {
            plötzlich: { probability: 0.40 },
            langsam_zunehmend: { probability: 0.60 }
        },
        dauer_vor_anruf: {
            unter_1h: { probability: 0.30 },
            1_6h: { probability: 0.40 },
            über_6h: { probability: 0.30 }
        }
    }
};

export default AKUTES_ABDOMEN_TEMPLATE;
