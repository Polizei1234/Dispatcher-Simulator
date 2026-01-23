// =========================================================================================
// REANIMATION TEMPLATE - Höchste Priorität, Herz-Kreislauf-Stillstand
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const REANIMATION_TEMPLATE = {
    
    id: 'reanimation',
    kategorie: 'rd',
    stichwort: 'Reanimation',
    weight: 2,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.55,
                speech_pattern: 'extrem aufgeregt, schreit fast',
                variations: [
                    'Er reagiert nicht mehr! Hilfe!',
                    'Sie atmet nicht! Bitte kommen Sie schnell!',
                    'Ich glaube er ist tot!',
                    'Oh Gott, oh Gott, er bewegt sich nicht!',
                    'HILFE! Mein Mann atmet nicht mehr!'
                ],
                effects: {
                    schwer_zu_beruhigen: 0.9,
                    instruktionen_schwierig: 0.7
                }
            },
            
            angehöriger_schock: {
                probability: 0.25,
                speech_pattern: 'ruhig aber verzweifelt, wie erstarrt',
                variations: [
                    'Ich... ich glaube... er ist tot',
                    'Sie bewegt sich nicht mehr... was soll ich tun?',
                    'Kann das wirklich passieren?'
                ],
                effects: {
                    muss_aktiviert_werden: 0.9
                }
            },
            
            zeuge_öffentlich: {
                probability: 0.12,
                speech_pattern: 'gestresst aber organisiert',
                variations: [
                    'Hier ist jemand zusammengebrochen, atmet nicht!',
                    'Person bewusstlos, keine Atmung!',
                    'Ich glaube der braucht Wiederbelebung!'
                ],
                location: 'öffentlich'
            },
            
            medizinisches_personal: {
                probability: 0.05,
                speech_pattern: 'professionell, klare Angaben',
                variations: [
                    'Patient in Reanimation, bitte NEF und RTW',
                    'Kreislaufstillstand, CPR läuft',
                    'Bewohner reanimationspflichtig'
                ],
                location: ['pflegeheim', 'arztpraxis'],
                effects: {
                    reanimation_bereits_gestartet: 0.9
                }
            },
            
            kind_findet_elternteil: {
                probability: 0.03,
                speech_pattern: 'panisch, weint',
                variations: [
                    'Mama wacht nicht auf! MAMA!',
                    'Papa bewegt sich nicht mehr!',
                    'Hilfe, mit meiner Mama stimmt was nicht!'
                ],
                age: { min: 8, max: 16 },
                effects: {
                    extrem_emotional: 1.0,
                    zusätzliche_betreuung: 1.0
                }
            }
        },
        
        dynamik: {
            wird_hysterisch: {
                probability: 0.3,
                trigger_time: { min: 20, max: 60 },
                change: 'fängt an zu schreien oder weinen',
                effects: {
                    instruktionen_unmöglich: 0.6
                }
            },
            
            bricht_zusammen: {
                probability: 0.05,
                trigger_time: { min: 120, max: 300 },
                change: 'Anrufer kollabiert selbst',
                effects: {
                    zweiter_patient: 1.0,
                    rtw_zusätzlich: 0.8
                }
            },
            
            andere_person_übernimmt: {
                probability: 0.15,
                trigger_time: { min: 30, max: 120 },
                info: 'Andere Person vor Ort übernimmt Telefon'
            }
        },
        
        telefon_reanimation: {
            wird_angeleitet: {
                probability: 0.7,
                erfolg: {
                    macht_mit: 0.6,
                    verweigert: 0.2,  // 'Ich kann das nicht!'
                    bricht_ab: 0.2
                },
                variations: [
                    'Was soll ich tun?',
                    'Ich hab Angst, ich mach was falsch!',
                    'Okay, ich versuch es...',
                    'Ich kann das nicht! Bitte kommen Sie schnell!'
                ]
            },
            
            kennt_reanimation: {
                probability: 0.15,
                variations: [
                    'Ich fange mit Herzdruckmassage an',
                    'Ich hab einen Erste-Hilfe-Kurs, ich mach das',
                    'Ich reanimiere schon'
                ],
                erfolg_wahrscheinlicher: 0.8
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.55,
            female: 0.45
        },
        
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 68, stddev: 12, weight: 0.7 },  // Ältere
            peak2: { mean: 45, stddev: 10, weight: 0.3 },  // Jüngere (Herzinfarkt)
            min: 25,
            max: 95
        },
        
        zustand: {
            bewusstlos: { probability: 1.0 },
            keine_atmung: { probability: 1.0 },
            kein_puls: { probability: 1.0 }
        }
    },
    
    // ========================================
    // 💀 URSACHEN
    // ========================================
    ursachen: {
        herzinfarkt: {
            probability: 0.45,
            variations: [
                'hatte Brustschmerzen vorher',
                'hat sich vorher an die Brust gefasst',
                'klagte über Schmerzen in der Brust'
            ],
            vorwarnung: 0.6
        },
        
        plötzlicher_herztod: {
            probability: 0.25,
            variations: [
                'ist einfach umgekippt',
                'plötzlich zusammengebrochen',
                'ohne Vorwarnung kollabiert'
            ],
            vorwarnung: 0.1
        },
        
        rhythmusstörung: {
            probability: 0.1,
            bekannte_vorerkrankung: 0.7
        },
        
        erstickung: {
            probability: 0.05,
            variations: [
                'hat sich verschluckt',
                'beim Essen passiert',
                'wollte was essen'
            ],
            location: ['restaurant', 'wohnhaus']
        },
        
        trauma: {
            probability: 0.03,
            types: ['Verkehrsunfall', 'Sturz aus Höhe', 'Stromunfall'],
            zusatzverletzungen: 1.0
        },
        
        ertrinken: {
            probability: 0.02,
            location: ['see', 'schwimmbad'],
            wasserrettung: 0.8
        },
        
        intoxikation: {
            probability: 0.05,
            types: ['Drogen', 'Medikamente', 'Alkohol'],
            hinweise_vor_ort: 0.8
        },
        
        unklare_ursache: {
            probability: 0.05,
            info: 'Ursache zunächst unklar'
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        initialrhythmus: {
            vf_vtach: {
                probability: 0.25,
                name: 'Kammerflimmern/Kammertachykardie',
                defibrillation: 1.0,
                prognose: 'besser'
            },
            asystolie: {
                probability: 0.5,
                name: 'Asystolie',
                defibrillation: 0,
                prognose: 'schlecht'
            },
            pea: {
                probability: 0.25,
                name: 'Pulslose elektrische Aktivität',
                defibrillation: 0,
                prognose: 'mittel'
            }
        },
        
        vorerkrankungen: {
            probability: 0.8,
            types: {
                herzerkrankung: { probability: 0.6 },
                früherer_herzinfarkt: { probability: 0.3 },
                bypass_operation: { probability: 0.15 },
                herzklappenerkrankung: { probability: 0.1 },
                rhythmusstörungen: { probability: 0.25 },
                diabetes: { probability: 0.4 },
                copd: { probability: 0.2 }
            }
        },
        
        reanimationsdauer: {
            laienreanimation: {
                probability: 0.5,
                dauer_bis_rtw: { mean: 8, stddev: 3 },
                qualität: {
                    gut: 0.3,
                    mittelmäßig: 0.5,
                    schlecht: 0.2
                }
            },
            
            keine_reanimation: {
                probability: 0.5,
                no_flow_time: { mean: 12, stddev: 5 },
                prognose_verschlechtert: 1.0
            }
        },
        
        rosc: {
            vor_klinik: {
                probability: 0.35,
                trigger_time: { min: 300, max: 1200 },
                funkspruch: '{callsign}, ROSC erreicht, Patient stabilisiert, kommen.'
            },
            
            kein_rosc: {
                probability: 0.65,
                transport_unter_reanimation: 0.8
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.12,
                effects: {
                    feuerwehr_tragehilfe_zwingend: 0.9,
                    zeitverzögerung_kritisch: 1.0
                },
                funkspruch: '{callsign}, Reanimation im {floor} OG ohne Aufzug, FW Tragehilfe dringend, kommen.'
            },
            
            sehr_enge_verhältnisse: {
                probability: 0.15,
                effects: {
                    reanimation_erschwert: 0.9,
                    patient_muss_umgelagert_werden: 0.7
                },
                variations: [
                    'liegt im engen Badezimmer',
                    'zwischen Möbeln eingeklemmt',
                    'im schmalen Flur'
                ]
            }
        },
        
        technik: {
            tür_verschlossen: {
                probability: 0.15,
                reasons: {
                    patient_allein_bewusstlos: 0.8,
                    von_außen_verschlossen: 0.2
                },
                effects: {
                    feuerwehr_sofort: 1.0,
                    zeitverlust_kritisch: 1.0
                },
                funkspruch: '{callsign}, kein Zugang, Patient reanimationspflichtig, FW zur Türöffnung EILIG!'
            }
        },
        
        wetter: {
            öffentlicher_ort_regen: {
                probability: 0.05,
                condition: 'location_öffentlich',
                effects: {
                    sichtschutz_nötig: 0.8,
                    feuerwehr_für_schutz: 0.6
                }
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            extrem_emotional: {
                probability: 0.7,
                manifestations: [
                    'schreit',
                    'weint unkontrolliert',
                    'muss festgehalten werden',
                    'will Patient nicht loslassen'
                ],
                effects: {
                    betreuung_nötig: 0.9,
                    notfallseelsorge_evtl: 0.4
                }
            },
            
            stören_maßnahmen: {
                probability: 0.15,
                ways: [
                    'stehen im Weg',
                    'wollen helfen aber behindern',
                    'reden ständig auf Crew ein',
                    'wollen Reanimation abbrechen'
                ],
                effects: {
                    polizei_evtl: 0.3
                }
            },
            
            kollabiert_selbst: {
                probability: 0.08,
                trigger_time: { min: 180, max: 600 },
                effects: {
                    zweiter_rtw: 1.0,
                    zwei_patienten: 1.0
                }
            }
        },
        
        kinder_anwesend: {
            probability: 0.12,
            age: { min: 4, max: 16 },
            effects: {
                traumatisierung: 0.9,
                wegbringen_wichtig: 1.0,
                jugendamt_evtl: 0.3
            },
            variations: [
                'Kinder sind anwesend und sehen alles',
                'Kind weint im Hintergrund',
                'Kinder müssen betreut werden'
            ]
        },
        
        öffentlichkeit: {
            gaffer: {
                probability: 0.6,
                condition: 'location_öffentlich',
                effects: {
                    sichtschutz_nötig: 0.9,
                    polizei_für_absperrung: 0.7
                }
            },
            
            helfer_vor_ort: {
                probability: 0.4,
                condition: 'location_öffentlich',
                types: {
                    sanitäter_zufällig: 0.2,
                    arzt_zufällig: 0.1,
                    ersthelfer: 0.7
                },
                effects: {
                    reanimation_läuft_bereits: 0.8,
                    bessere_prognose: 0.6
                }
            }
        }
    },
    
    // ========================================
    // ⚠️ GEFAHREN
    // ========================================
    gefahren: {
        gewalt: {
            verdacht_fremdverschulden: {
                probability: 0.02,
                indicators: [
                    'Verletzungsspuren',
                    'Hämatome',
                    'Verdächtige Umstände'
                ],
                effects: {
                    polizei_zwingend: 1.0,
                    tatort_sichern: 1.0,
                    staatsanwaltschaft_info: 0.8
                }
            }
        },
        
        infektion: {
            covid_verdacht: {
                probability: 0.03,
                effects: {
                    schutzausrüstung_trotz_eile: 1.0
                }
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.65,
            address_types: ['residential', 'apartment'],
            räume: {
                schlafzimmer: 0.4,
                badezimmer: 0.2,
                wohnzimmer: 0.25,
                küche: 0.1,
                flur: 0.05
            }
        },
        
        öffentlich_straße: {
            probability: 0.15,
            address_types: ['street', 'pedestrian'],
            zeugen: { min: 2, max: 8 },
            verkehrsbehinderung: 0.9,
            polizei_für_verkehr: 0.9
        },
        
        arbeitsplatz: {
            probability: 0.08,
            address_types: ['commercial', 'industrial', 'office'],
            betriebssanitäter_evtl: 0.3,
            defibrillator_vorhanden: 0.4
        },
        
        pflegeheim: {
            probability: 0.05,
            address_types: ['nursing_home'],
            pfleger_vor_ort: 1.0,
            patientenverfügung_oft: 0.6
        },
        
        fitnessstudio: {
            probability: 0.03,
            address_types: ['sports_centre'],
            defibrillator_vorhanden: 0.9,
            trainer_kennt_reanimation: 0.8,
            variations: ['beim Sport kollabiert', 'auf Laufband umgekippt']
        },
        
        restaurant: {
            probability: 0.02,
            address_types: ['restaurant'],
            erstickung_häufiger: 0.4
        },
        
        arztpraxis: {
            probability: 0.01,
            address_types: ['doctors'],
            arzt_reanimiert_bereits: 0.9,
            equipment_vorhanden: 0.9
        },
        
        verkehrsmittel: {
            probability: 0.01,
            types: ['Zug', 'Bus', 'Bahn'],
            access_schwierig: 0.7
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 1.0,  // IMMER!
            trigger_time: 'sofort',
            funkspruch: 'REANIMATION, NEF sofort!'
        },
        
        rtw_zusätzlich: {
            probability: 0.4,
            trigger_time: { min: 120, max: 300 },
            reasons: {
                angehöriger_kollabiert: { probability: 0.5 },
                ablösung_nötig: { probability: 0.3 },
                mehrere_patienten: { probability: 0.2 }
            },
            funkspruch: '{callsign}, benötigen zweiten RTW, {reason}, kommen.'
        },
        
        feuerwehr: {
            probability: 0.35,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                türöffnung: { probability: 0.4, funkspruch: '{callsign}, REANIMATION, kein Zugang, FW EILIG!' },
                tragehilfe: { probability: 0.4, funkspruch: '{callsign}, Reanimation mehrere Stockwerke, FW Tragehilfe!' },
                sichtschutz: { probability: 0.1 },
                verkehrssicherung: { probability: 0.1 }
            }
        },
        
        polizei: {
            probability: 0.25,
            trigger_time: { min: 60, max: 180 },
            reasons: {
                verkehr_regeln: { probability: 0.5 },
                gaffer_abhalten: { probability: 0.3 },
                fremdverschulden_verdacht: { probability: 0.15 },
                aggressive_angehörige: { probability: 0.05 }
            }
        },
        
        notfallseelsorge: {
            probability: 0.3,
            trigger_time: { min: 600, max: 1200 },
            condition: 'angehörige_sehr_belastet',
            funkspruch: '{callsign}, Notfallseelsorge angefordert, Angehörige benötigen Betreuung.'
        },
        
        rth: {
            probability: 0.05,
            condition: 'ländliche_gegend',
            reason: 'Schnellerer Transport zur Spezialklinik'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verlauf: {
            rosc_erreicht: {
                probability: 0.35,
                trigger_time: { min: 300, max: 900 },
                funkspruch: '{callsign}, ROSC erreicht, Patient wird stabilisiert, kommen.',
                effects: {
                    transport_möglich: 1.0,
                    prognose_besser: 0.6
                }
            },
            
            keine_verbesserung: {
                probability: 0.5,
                trigger_time: { min: 900, max: 1800 },
                funkspruch: '{callsign}, trotz aller Maßnahmen kein ROSC, Transport unter laufender Reanimation.',
                transport_unter_reanimation: 0.9
            },
            
            reanimation_abgebrochen: {
                probability: 0.15,
                trigger_time: { min: 1200, max: 2400 },
                gründe: [
                    'Erfolglose Reanimation >45 Min',
                    'Patientenverfügung gefunden',
                    'Sichere Todeszeichen',
                    'Notarzt bricht ab'
                ],
                funkspruch: '{callsign}, Reanimation beendet, Patient verstorben, Bestatter wird informiert.',
                effects: {
                    polizei_leichenschau: 0.8,
                    bestatter: 1.0,
                    angehörige_betreuung: 1.0
                }
            }
        },
        
        komplikationen: {
            rippenfrakturen: {
                probability: 0.6,
                info: 'Bei korrekter Reanimation häufig'
            },
            
            aspiration: {
                probability: 0.3,
                effects: {
                    intubation_nötig: 0.9
                }
            },
            
            mageninhalt: {
                probability: 0.25,
                info: 'Erbrechen während Reanimation'
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 2,  // Oft zweiter RTW nötig
            nef: 1,  // ZWINGEND
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'nach_rosc',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart', 'rems_murr_klinikum_winnenden'],
                reason: 'Intensivstation mit Herzkatheterlabor',
                kühlung_möglich: 0.8
            },
            
            priorität_2: {
                condition: 'unter_reanimation',
                hospitals: ['nächstgelegenes_mit_intensiv'],
                reason: 'Schnellste Klinik, Zeit kritisch'
            }
        },
        
        voranmeldung: {
            zwingend: 1.0,
            schockraum_alarmierung: 0.9,
            infos: [
                'Reanimation läuft',
                'ROSC: ja/nein',
                'Reanimationsdauer',
                'Rhythmus',
                'Vermutete Ursache'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        einsatzmeldung: [
            'REANIMATION! Kommen mit Sonderrechten!',
            'Eilt! Patient bewusstlos, keine Atmung!',
            'Kreislaufstillstand gemeldet, NEF alarmiert!'
        ],
        
        lagemeldungen: [
            'Patient in Reanimation, CPR läuft',
            'Kammerflimmern, Defibrillation durchgeführt',
            'Patient weiterhin pulslos, Reanimation fortgesetzt',
            'ROSC nach {x} Minuten erreicht',
            'Transport unter laufender Reanimation'
        ],
        
        zusatzkräfte: [
            'Benötigen FW Tragehilfe, Reanimation mehrere Stockwerke!',
            'Kein Zugang, FW zur Türöffnung EILIG!',
            'Zweiter RTW für Angehörigen angefordert'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        patientenverfügung: {
            probability: 0.15,
            gefunden_nach: { min: 300, max: 900 },
            effects: {
                reanimation_abbruch: 0.9,
                ethisches_dilemma: 1.0
            },
            funkspruch: '{callsign}, Patientenverfügung gefunden, keine Reanimation gewünscht, brechen ab.'
        },
        
        organspende: {
            probability: 0.05,
            condition: 'nach_erfolgloser_reanimation',
            info: 'Bei jüngeren Patienten, Hirntod-Diagnostik'
        },
        
        realismus: {
            überlebensrate: {
                mit_laienreanimation: 0.4,
                ohne_laienreanimation: 0.15,
                mit_defibrillation: 0.5,
                gesamt: 0.3
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { REANIMATION_TEMPLATE };
}
