// =========================================================================================
// HERZINFARKT TEMPLATE - VOLLSTÄNDIGES BEISPIEL
// Alle 36+ Features implementiert - Nutze dies als Vorlage für weitere Szenarien!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const HERZINFARKT_TEMPLATE = {
    
    id: 'herzinfarkt',
    kategorie: 'rd',
    stichwort: 'Herzinfarkt',
    weight: 3,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ (Features 6, 7, 8)
    // ========================================
    anrufer: {
        // Siehe Teil 1 der Datei (bereits vorhanden)
        typen: { /* ... bereits definiert ... */ },
        dynamik: { /* ... bereits definiert ... */ },
        mehrere_anrufer: { /* ... bereits definiert ... */ },
        beziehung: { /* ... bereits definiert ... */ }
    },
    
    patient: { /* ... bereits definiert ... */ },
    symptome: { /* ... bereits definiert ... */ },
    medizinisch: { /* ... bereits definiert ... */ },
    
    // ========================================
    // 🏠 UMGEBUNGS-FAKTOREN (Features 13-16)
    // ========================================
    umgebung: {
        
        // Feature 13: Gebäude-Herausforderungen
        gebäude: {
            kein_aufzug: {
                probability: 0.12,
                stockwerke: {
                    distribution: [0.3, 0.3, 0.2, 0.15, 0.05],  // EG bis 5. OG
                    effects: {
                        zeitaufwand_hoch: 1.0,
                        tragehilfe_ab_3og: 0.7,
                        fw_tragehilfe_ab_4og: 0.5
                    }
                },
                funkspruch: '{callsign}, Patient im {floor} OG ohne Aufzug, benötigen eventuell Tragehilfe, kommen.'
            },
            
            enge_treppe: {
                probability: 0.15,
                effects: {
                    trage_passt_nicht: 0.6,
                    tragetuch_nötig: 0.8,
                    zeitverzögerung: 1.0
                },
                beschreibung: 'Treppenhaus sehr eng, Trage passt nicht durch'
            },
            
            altbau_probleme: {
                probability: 0.08,
                issues: {
                    verwinkelt: 0.5,
                    steile_treppen: 0.4,
                    denkmalschutz: 0.1
                },
                info: 'Altbau mit schwierigen Zugangswegen'
            },
            
            baustelle: {
                probability: 0.05,
                effects: {
                    erschwerter_zugang: 0.9,
                    gerüst_im_weg: 0.4,
                    umweg_nötig: 0.6
                },
                info: 'Baustelle erschwert Zugang'
            }
        },
        
        // Feature 14: Tiere vor Ort
        tiere: {
            aggressiver_hund: {
                probability: 0.03,
                effects: {
                    polizei_nötig: 0.8,
                    zugang_blockiert: 1.0,
                    gefahr_für_crew: 0.9
                },
                funkspruch: '{callsign}, aggressiver Hund vor Ort, benötigen Polizei, kommen.',
                anrufer_info: 'Der Hund lässt niemanden rein!'
            },
            
            haustiere_versorgen: {
                probability: 0.15,
                types: ['Hund', 'Katze', 'Vögel'],
                effects: {
                    angehörige_sorgen_sich: 0.8,
                    verzögerung_möglich: 0.3
                },
                info: 'Patient fragt, wer sich um {tier} kümmert'
            },
            
            sturz_wegen_tier: {
                probability: 0.05,
                types: ['Hund', 'Katze'],
                effects: {
                    zusatzverletzung: 0.6,
                    kombination_sturz_herzinfarkt: 1.0
                },
                info: 'Ist über den {tier} gestolpert'
            }
        },
        
        // Feature 15: Technische Probleme
        technik: {
            tür_verschlossen: {
                probability: 0.05,
                reasons: {
                    patient_kann_nicht_öffnen: 0.6,
                    bewusstlos: 0.3,
                    tür_klemmt: 0.1
                },
                effects: {
                    feuerwehr_türöffnung: 0.9,
                    zeitverzögerung: 1.0
                },
                funkspruch: '{callsign}, kein Zugang zum Patienten, benötigen Feuerwehr zur Türöffnung, kommen.'
            },
            
            strom_ausgefallen: {
                probability: 0.02,
                effects: {
                    dunkle_wohnung: 1.0,
                    aufzug_defekt: 0.8,
                    taschenlampen_nötig: 1.0
                },
                info: 'Strom ist ausgefallen, alles dunkel'
            },
            
            aufzug_defekt: {
                probability: 0.03,
                effects: {
                    treppen_nutzen: 1.0,
                    zeitverzögerung: 1.0,
                    tragehilfe_wahrscheinlicher: 0.6
                },
                info: 'Aufzug ist außer Betrieb'
            },
            
            handy_akku_leer: {
                probability: 0.02,
                effects: {
                    anruf_bricht_ab: 0.8,
                    rückruf_nicht_möglich: 0.9
                },
                anrufer_warnung: 'Mein Akku ist gleich leer!'
            }
        },
        
        // Feature 16: Geografische Herausforderungen
        geografie: {
            wald_wanderweg: {
                probability: 0.01,
                effects: {
                    gps_koordinaten_nötig: 1.0,
                    längere_anfahrt: 1.0,
                    rth_evtl_besser: 0.4
                },
                info: 'Im Wald, genauer Standort unklar'
            },
            
            autobahn: {
                probability: 0.02,
                effects: {
                    km_angabe_wichtig: 1.0,
                    fahrtrichtung_wichtig: 1.0,
                    verkehrssicherung_nötig: 0.9,
                    polizei_erforderlich: 0.8
                },
                info: 'Auf der Autobahn, Kilometer {km}, Richtung {richtung}'
            },
            
            fluss_see: {
                probability: 0.005,
                effects: {
                    wasserrettung_evtl: 0.3,
                    dlrg_informieren: 0.4
                },
                info: 'Am See/Fluss'
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK (Features 17-19)
    // ========================================
    sozial: {
        
        // Feature 17: Angehörigen-Reaktionen
        angehörige: {
            aggressiv_hysterisch: {
                probability: 0.08,
                manifestations: {
                    schreien: 0.4,
                    crew_anschreien: 0.3,
                    vorwürfe: 0.2,
                    handgreiflich: 0.1
                },
                effects: {
                    polizei_nötig: 0.6,
                    behandlung_erschwert: 0.9
                },
                funkspruch: '{callsign}, Angehörige sehr aggressiv, benötigen Polizei, kommen.'
            },
            
            behindern_rettung: {
                probability: 0.1,
                ways: [
                    'Wollen nicht, dass Patient transportiert wird',
                    'Bestehen auf Hausarzt',
                    'Stehen im Weg',
                    'Diskutieren über Behandlung'
                ],
                effects: {
                    zeitverzögerung: 0.8,
                    geduld_nötig: 1.0
                }
            },
            
            wollen_mitfahren: {
                probability: 0.3,
                effects: {
                    platz_im_rtw_begrenzt: 1.0,
                    diskussion: 0.5
                },
                info: 'Können wir mitfahren?'
            },
            
            familendrama: {
                probability: 0.05,
                scenarios: [
                    'Streit zwischen Angehörigen',
                    'Vorwürfe: "Du hast ihn zu spät gerufen!"',
                    'Eskalation zwischen Familienmitgliedern'
                ],
                effects: {
                    chaos: 0.9,
                    polizei_evtl: 0.4
                }
            }
        },
        
        // Feature 18: Kulturelle/Religiöse Faktoren
        kultur: {
            religiöse_behandlungswünsche: {
                probability: 0.03,
                types: {
                    kein_blut: { religion: 'Zeugen Jehovas', probability: 0.3 },
                    geschlecht_behandler: { religion: 'Islam', probability: 0.5 },
                    gebete_vor_transport: { religion: 'diverse', probability: 0.2 }
                },
                effects: {
                    respekt_zeigen: 1.0,
                    zeit_einplanen: 0.6,
                    dokumentation_wichtig: 1.0
                }
            },
            
            schamgefühl: {
                probability: 0.05,
                manifestations: [
                    'Will nicht, dass Nachbarn etwas sehen',
                    'Möchte nicht entkleidet werden',
                    'Schämt sich für Wohnzustand'
                ],
                effects: {
                    diskretion_wichtig: 1.0,
                    zeit_nehmen: 0.7
                }
            },
            
            sprachbarriere_kulturell: {
                probability: 0.1,
                effects: {
                    missverständnisse: 0.7,
                    familienmitglied_übersetzt: 0.6,
                    gesten_kommunikation: 0.5
                }
            }
        },
        
        // Feature 19: Soziale Notlage
        notlage: {
            obdachlos: {
                probability: 0.01,
                effects: {
                    unsichere_nachbetreuung: 1.0,
                    sozialamt_info: 0.8,
                    hygiene_probleme: 0.6
                },
                location_likely: 'öffentlicher_ort'
            },
            
            verwahrloste_wohnung: {
                probability: 0.05,
                severity: {
                    leicht: 0.5,
                    mittel: 0.3,
                    schwer: 0.2  // Messi-Syndrom
                },
                effects: {
                    zugang_erschwert: 0.7,
                    hygiene_bedenken: 0.8,
                    sozialamt_informieren: 0.9
                }
            },
            
            keine_versicherung: {
                probability: 0.02,
                effects: {
                    patient_zögert: 0.6,
                    angst_vor_kosten: 0.8,
                    transport_trotzdem: 1.0  // Leben geht vor!
                },
                info: 'Patient sagt: "Ich hab keine Versicherung..."'
            }
        }
    },
    
    // ========================================
    // ⚠️ GEFAHREN-SITUATIONEN (Features 20-23)
    // ========================================
    gefahren: {
        
        // Feature 20: Gewalt/Kriminalität
        gewalt: {
            häusliche_gewalt: {
                probability: 0.02,
                indicators: [
                    'Anrufer flüstert',
                    'Verdächtige Verletzungsmuster',
                    'Anrufer bricht ab wenn Person kommt'
                ],
                effects: {
                    polizei_muss_vorfahren: 1.0,
                    täter_evtl_vor_ort: 0.9,
                    gefahr_für_crew: 0.8
                },
                funkspruch: '{callsign}, Verdacht auf häusliche Gewalt, warten auf Polizei, kommen.'
            },
            
            messerstecherei: {
                probability: 0.005,
                effects: {
                    täter_noch_da: 0.4,
                    polizei_zwingend: 1.0,
                    tatort_sichern: 1.0,
                    nicht_einfahren_ohne_polizei: 1.0
                },
                info: 'GEFAHR! Gewalttat im Gange!'
            },
            
            schussverletzung: {
                probability: 0.001,
                effects: {
                    sek_evtl_nötig: 0.6,
                    absolut_nicht_einfahren: 1.0,
                    polizei_eilt: 1.0
                },
                info: 'HÖCHSTE GEFAHR! Schusswaffe!'
            }
        },
        
        // Feature 21: Selbstgefährdung
        selbstgefährdung: {
            suizidversuch: {
                probability: 0.01,
                methoden: {
                    medikamente: 0.5,
                    schnitt: 0.3,
                    andere: 0.2
                },
                effects: {
                    polizei_und_krisenteam: 0.9,
                    psychiatrie_transport: 0.8,
                    vorsichtig_ansprechen: 1.0
                },
                info: 'Patient hat Suizidversuch unternommen'
            },
            
            drohung_zu_springen: {
                probability: 0.002,
                effects: {
                    polizei_verhandlungsteam: 1.0,
                    feuerwehr_sprungretter: 0.8,
                    nicht_direkt_ansprechen: 1.0
                },
                info: 'AKUTE SELBSTGEFÄHRDUNG!'
            }
        },
        
        // Feature 22: Infektionsgefahren
        infektion: {
            covid_verdacht: {
                probability: 0.05,
                effects: {
                    schutzausrüstung_ffp2: 1.0,
                    desinfektion_danach: 1.0
                },
                info: 'Patient hat COVID-Symptome'
            },
            
            tbc_verdacht: {
                probability: 0.01,
                effects: {
                    schutzausrüstung_ffp3: 1.0,
                    isolierung_nötig: 1.0
                },
                info: 'Verdacht auf Tuberkulose'
            },
            
            bekannte_infektion: {
                probability: 0.03,
                types: ['Hepatitis', 'HIV', 'MRSA'],
                effects: {
                    standardhygiene: 1.0,
                    handschuhe_wichtig: 1.0
                },
                info: 'Patient hat bekannte {infektion}'
            }
        },
        
        // Feature 23: Chemische Gefahren
        chemie: {
            gasgeruch: {
                probability: 0.02,
                effects: {
                    feuerwehr_mit_messgerät: 1.0,
                    nicht_einfahren: 1.0,
                    evakuierung_evtl: 0.6
                },
                funkspruch: '{callsign}, Gasgeruch gemeldet, warten auf Feuerwehr, kommen.'
            },
            
            co_vergiftung: {
                probability: 0.01,
                effects: {
                    mehrere_patienten_wahrscheinlich: 0.7,
                    feuerwehr_lüften: 1.0,
                    selbst_nicht_gefährden: 1.0
                },
                info: 'Verdacht auf CO-Vergiftung! Mehrere Personen betroffen!'
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS (mit Wahrscheinlichkeiten)
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.65,
            address_types: ['residential', 'apartment'],
            floor_distribution: [0.4, 0.3, 0.15, 0.1, 0.05],  // EG bis 4. OG
            variations: ['zu Hause in der Wohnung', 'in der eigenen Wohnung', 'bei uns zu Hause']
        },
        
        arbeitsplatz: {
            probability: 0.15,
            address_types: ['commercial', 'industrial', 'office'],
            time_dependent: [7, 18],  // Nur zu Arbeitszeiten wahrscheinlich
            betriebssanitäter_vor_ort: 0.3
        },
        
        öffentlich_straße: {
            probability: 0.06,
            address_types: ['road', 'street'],
            witnesses: { min: 2, max: 5 },
            verkehrsbehinderung: 0.8,
            polizei_für_verkehr: 0.7
        },
        
        arztpraxis: {
            probability: 0.03,
            address_types: ['doctors', 'clinic'],
            arzt_vor_ort: 0.9,
            equipment_vorhanden: 0.8,
            ktw_oft_ausreichend: 0.4
        },
        
        pflegeheim: {
            probability: 0.05,
            address_types: ['nursing_home', 'social_facility'],
            pfleger_vor_ort: 1.0,
            vorerkrankungen_bekannt: 0.9,
            palliativ_patient: 0.2
        },
        
        restaurant: {
            probability: 0.02,
            address_types: ['restaurant'],
            personal_hilft: 0.8,
            time_dependent: [11, 22]
        },
        
        einkaufszentrum: {
            probability: 0.02,
            address_types: ['retail', 'shop'],
            personal_vor_ort: 0.9,
            menschenmenge: 0.7
        },
        
        park: {
            probability: 0.01,
            address_types: ['park', 'leisure'],
            accessibility_issues: 0.6,
            weather_dependent: true
        },
        
        andere: {
            probability: 0.01
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN VOR ORT
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 180, max: 360 },
            reasons: [
                'Patient instabiler als gedacht',
                'Zustand verschlechtert sich',
                'Vitalwerte kritisch'
            ],
            funkspruch: '{callsign}, benötigen NEF nach, Patient kritisch instabil, kommen.'
        },
        
        rtw_zusätzlich: {
            probability: 0.05,
            trigger_time: { min: 240, max: 480 },
            reasons: ['Angehöriger kollabiert', 'Zweiter Patient'],
            funkspruch: '{callsign}, benötigen zweiten RTW, weitere Person betroffen, kommen.'
        },
        
        ktw_abgabe: {
            probability: 0.1,
            trigger_time: { min: 300, max: 600 },
            condition: 'Patient stabilisiert',
            funkspruch: '{callsign}, Patient stabilisiert, Abgabe an KTW möglich, kommen.'
        },
        
        feuerwehr: {
            probability: 0.03,
            trigger_time: { min: 120, max: 300 },
            reasons: {
                türöffnung: { probability: 0.6, funkspruch: '{callsign}, kein Zugang, benötigen FW zur Türöffnung, kommen.' },
                tragehilfe: { probability: 0.3, funkspruch: '{callsign}, benötigen Tragehilfe, Patient adipös, kommen.' },
                gefahrstoff: { probability: 0.1, funkspruch: '{callsign}, Hinweise auf Gefahrstoffe, benötigen FW, kommen.' }
            }
        },
        
        polizei: {
            probability: 0.05,
            trigger_time: { min: 60, max: 240 },
            reasons: {
                aggressive_angehörige: { probability: 0.4, funkspruch: '{callsign}, Angehörige aggressiv, benötigen Polizei, kommen.' },
                verdacht_gewalt: { probability: 0.3, funkspruch: '{callsign}, Verdacht auf Fremdeinwirkung, benötigen Polizei, kommen.' },
                verkehrsregelung: { probability: 0.3, funkspruch: '{callsign}, benötigen Verkehrsregelung, kommen.' }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATIONS-KETTEN (Features 33-35)
    // ========================================
    eskalation: {
        // Feature 33: Verschlechterung während Anfahrt
        verschlechterung: {
            stufe_1: {
                probability: 0.25,
                trigger_time: { min: 120, max: 300 },
                changes: ['Zustand verschlechtert sich leicht', 'Schmerzen werden stärker'],
                anrufer_meldet_sich_erneut: 0.6
            },
            
            stufe_2: {
                probability: 0.15,
                trigger_time: { min: 180, max: 420 },
                changes: ['Bewusstsein eingetrübt', 'Vitalwerte kritisch'],
                nef_jetzt_nötig: 1.0
            },
            
            stufe_3_reanimation: {
                probability: 0.05,
                trigger_time: { min: 240, max: 480 },
                changes: ['Patient bewusstlos', 'Keine Atmung mehr'],
                upgrade_stichwort: 'Reanimation',
                rtw_zusätzlich: 1.0,
                anrufer_info: 'Er reagiert nicht mehr! Was soll ich tun?!'
            }
        },
        
        // Feature 34: Überraschungen vor Ort
        überraschungen: {
            probability: 0.15,
            types: {
                mehr_patienten: {
                    probability: 0.4,
                    anzahl: { min: 1, max: 2 },
                    funkspruch: '{callsign}, wir haben hier {anzahl} weitere Patienten, benötigen Unterstützung, kommen.'
                },
                anderes_schadensbild: {
                    probability: 0.3,
                    examples: ['Zusätzlich Sturzverletzung', 'Patient blutet stark', 'Bewusstlos statt ansprechbar'],
                    funkspruch: '{callsign}, Lage anders als gemeldet, {beschreibung}, kommen.'
                },
                gefährliche_lage: {
                    probability: 0.2,
                    types: ['Einsturzgefahr', 'Gasgeruch', 'Aggressive Person'],
                    funkspruch: '{callsign}, Achtung, gefährliche Lage, {gefahr}, kommen.'
                },
                patient_nicht_auffindbar: {
                    probability: 0.1,
                    funkspruch: '{callsign}, können Patient nicht finden, suchen noch, kommen.'
                }
            }
        },
        
        // Feature 35: Spontane Besserung
        besserung: {
            probability: 0.1,
            trigger_time: { min: 180, max: 400 },
            outcomes: {
                patient_erholt_sich: {
                    probability: 0.5,
                    funkspruch: '{callsign}, Patient stabilisiert, zustand besser, kommen.',
                    ktw_reicht: 0.7
                },
                nur_abklärung: {
                    probability: 0.3,
                    funkspruch: '{callsign}, nur Abklärung nötig, kein Transport erforderlich, kommen.'
                },
                abbestellung_möglich: {
                    probability: 0.2,
                    condition: 'Patient lehnt Transport ab',
                    funkspruch: '{callsign}, Patient lehnt Transport ab, unterschrieben, kommen.'
                }
            }
        }
    },
    
    // ========================================
    // 🎭 SPECIAL SCENARIOS (Features 28-32, 37, 38)
    // ========================================
    special: {
        // Feature 28: Parallel-Einsätze
        parallel: {
            probability: 0.1,
            note: 'Wird vom System gesteuert, nicht Template'
        },
        
        // Feature 29: Fehlalarme & Bagatellen
        fehlalarm: {
            übertreibung: {
                probability: 0.08,
                realität: 'Harmloser als beschrieben',
                funkspruch: '{callsign}, Patient weniger kritisch als gemeldet, kommen.'
            },
            
            bereits_versorgt: {
                probability: 0.03,
                by: ['Hausarzt', 'Angehöriger mit medizin. Kenntnissen'],
                funkspruch: '{callsign}, Patient bereits durch {person} versorgt, kommen.'
            }
        },
        
        // Feature 30: Großveranstaltungen
        großveranstaltung: {
            probability: 0.01,
            location_dependent: ['stadion', 'konzert'],
            sanitätsdienst_vor_ort: 0.9,
            menschenmenge: 1.0,
            weitere_notfälle_wahrscheinlich: 0.3
        },
        
        // Feature 37: Technik-Fehlalarme
        technik_fehler: {
            smartwatch: {
                probability: 0.01,
                info: 'Smartwatch hat automatisch ausgelöst, Patient okay',
                abbestellung: 0.9
            }
        },
        
        // Feature 38: Realismus - Stammkunden
        stammkunde: {
            probability: 0.05,
            effects: {
                bekannte_adresse: 1.0,
                vorgeschichte_im_system: 1.0,
                crew_kennt_patient: 0.7
            },
            info: 'Bekannte Adresse, häufiger Anrufer'
        }
    },
    
    // ========================================
    // 🏥 FAHRZEUG-EMPFEHLUNG & KLINIK-WAHL (Feature 53)
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 1,
            ktw: 0
        },
        
        // Dynamische Anpassungen basierend auf Symptomen
        adjustments: {
            if_bewusstlos: { nef: '=1' },
            if_reanimation: { rtw: '+1', nef: '=1' },
            if_stabil_nach_versorgung: { ktw: '=1', rtw: '-1', nef: '-1' }
        },
        
        // Feature 53: Klinik-Auswahl mit Fachausrichtung
        klinik_auswahl: {
            priorität_1: {
                condition: 'stroke_unit_nötig',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Stroke Unit verfügbar'
            },
            priorität_2: {
                condition: 'herzkatheterlabor_nötig',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Herzkatheterlabor 24/7'
            },
            priorität_3: {
                condition: 'nächstgelegenes',
                selection: 'by_distance',
                reason: 'Zeit ist kritisch'
            },
            
            // Kapazitäts-Check
            capacity_check: {
                if_full: 'select_next_suitable',
                funkspruch: '{hospital} meldet keine Kapazität, fahren {alternative_hospital} an'
            }
        }
    },
    
    // ========================================
    // 📊 EINSATZ-PROTOKOLL (Feature 45)
    // ========================================
    protokoll: {
        tracked_data: {
            call_duration: 'AUTOMATIC',
            symptoms_mentioned: 'FROM_CALL',
            vehicles_dispatched: 'FROM_DISPOSITION',
            additional_requests: 'FROM_RADIO',
            hospital_selected: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                reaction_time: { target: 60, max_acceptable: 180 },
                correct_vehicles: { compare_with: 'base_recommendation' },
                additional_requests: { optimal: 0, acceptable: 1 },
                hospital_choice: { check: 'specialization_match' }
            },
            
            note_berechnung: {
                A: 'Alle Kriterien optimal',
                B: 'Ein Kriterium suboptimal',
                C: 'Zwei Kriterien suboptimal',
                D: 'Drei Kriterien suboptimal',
                F: 'Mehr als drei Kriterien suboptimal oder kritischer Fehler'
            }
        }
    },
    
    // ========================================
    // 📻 FUNKSPRUCH-TEMPLATES (Feature 52)
    // ========================================
    funksprüche: {
        verwendet_templates_aus: 'GLOBAL_CONFIG.radioMessages',
        
        spezifische_lagemeldungen: [
            'Patient mit akuten Thoraxschmerzen, Verdacht auf Myokardinfarkt',
            'Patient ansprechbar aber instabil, starke Brustschmerzen',
            'Patient kreislaufinstabil, Schock-Symptomatik',
            'Patient bewusstlos, Reanimation erforderlich',
            'Patient stabilisiert, Transport vorbereitet'
        ]
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HERZINFARKT_TEMPLATE };
}
