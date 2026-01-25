// =========================================================================================
// VERBRENNUNG/VERBRÜHUNG TEMPLATE V2.0 - Neunerregel, Verbrennungszentrum!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const VERBRENNUNG_TEMPLATE = {
    
    id: 'verbrennung',
    kategorie: 'rd',
    stichwort: 'Verbrennung / Verbrühung',
    weight: 2,  // Mittel-häufig
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst_schmerzen: {
                probability: 0.25,
                speech_pattern: 'schmerzgeplagt, weint evtl.',
                variations: [
                    '*weint* Ich habe mich verbrannt! Es tut so weh!',
                    'Ich habe heißes Wasser übergeschüttet bekommen!',
                    'Ich habe mich an der Herdplatte verbrannt!',
                    'Es brennt so sehr!',
                    'Meine Hand! Ich hab sie auf die Herdplatte gelegt!'
                ],
                characteristics: {
                    weint_evtl: 0.4,
                    sehr_schmerzhaft: 0.8
                }
            },
            
            angehöriger_kind_panisch: {
                probability: 0.35,
                speech_pattern: 'panisch, verzweifelt',
                variations: [
                    'Mein Kind hat sich mit heißem Wasser verbrüht! *Kind schreit*',
                    'Mein Baby! Es hat kochenden Tee übergeschüttet bekommen!',
                    'Sie hat sich am Bügeleisen verbrannt!',
                    'Er hat den heißen Topf umgestoßen!'
                ],
                characteristics: {
                    kind_schreit_im_hintergrund: 0.9,
                    eltern_panisch: 0.9
                },
                background_sounds: ['child_crying', 'screaming']
            },
            
            angehöriger_erwachsener: {
                probability: 0.15,
                speech_pattern: 'besorgt, aufgeregt',
                variations: [
                    'Er hat sich schwer verbrannt! Die Haut löst sich ab!',
                    'Grillunfall! Sie hat Verbrennungen!',
                    'Explosion! Er ist verletzt!'
                ]
            },
            
            zeuge_brand: {
                probability: 0.1,
                speech_pattern: 'schockiert, aufgeregt',
                variations: [
                    'Brand! Jemand ist schwer verletzt!',
                    'Explosion! Person mit Verbrennungen!',
                    'Jemand steht in Flammen!'
                ],
                background_sounds: ['sirens', 'fire', 'people_shouting']
            },
            
            feuerwehr_vor_ort: {
                probability: 0.1,
                speech_pattern: 'professionell, strukturiert',
                variations: [
                    'Feuerwehr vor Ort, Person mit Verbrennungen Grad 2-3, ca. 20% KOF',
                    'Brand gelöscht, Patient mit Verbrennungen, NEF erforderlich',
                    'Person aus brennendem Gebäude gerettet, Verbrennungen + V.a. Inhalationstrauma'
                ],
                characteristics: {
                    einschätzung_verbrennungsgrad: 0.8,
                    kof_schätzung: 0.6
                }
            },
            
            betriebsarzt: {
                probability: 0.05,
                speech_pattern: 'ärztlich, fachlich',
                variations: [
                    'Betriebsarzt, Arbeitsunfall, Patient Grad 2b Verbrennungen, ca. 15% KOF',
                    'Chemische Verbrennung, Spülung läuft, Transport erforderlich'
                ]
            }
        },
        
        dynamik: {
            verschlechterung_schock: {
                probability: 0.15,
                trigger_time: { min: 120, max: 360 },
                variations: [
                    'Er wird ganz blass und zittert!',
                    'Sie reagiert kaum noch!',
                    'Der Kreislauf scheint zusammenzubrechen!'
                ],
                bei_großer_kof: 0.8
            },
            
            inhalationstrauma_symptome: {
                probability: 0.1,
                trigger_time: { min: 60, max: 240 },
                variations: [
                    'Er bekommt keine Luft mehr!',
                    'Sie hustet jetzt stark!',
                    'Die Stimme klingt heiser!'
                ],
                kritisch: 0.9
            },
            
            mehr_verbrennungen_entdeckt: {
                probability: 0.15,
                trigger_time: { min: 90, max: 300 },
                variations: [
                    'Es ist schlimmer als gedacht!',
                    'Auch der Rücken ist verbrannt!'
                ]
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.58,  // Männer etwas häufiger
            female: 0.42
        },
        
        alter: {
            distribution: 'risk_groups',
            
            ranges: {
                kleinkinder: {
                    range: [1, 4],
                    probability: 0.2,
                    risiko: 'Verbrühung häufig',
                    besonderheit: 'Großer Kopf = mehr % KOF'
                },
                kinder: {
                    range: [5, 15],
                    probability: 0.15,
                    risiko: 'Unfälle'
                },
                erwachsene: {
                    range: [16, 60],
                    probability: 0.5,
                    risiko: 'Arbeitsunfälle, Grill, Brand'
                },
                ältere: {
                    range: [61, 85],
                    probability: 0.15,
                    risiko: 'Schlechtere Prognose',
                    komplikationen_häufiger: 0.7
                }
            }
        },
        
        bewusstseinszustand: {
            wach_orientiert: {
                probability: 0.75,
                schmerzen_stark: 0.8
            },
            wach_verwirrt: {
                probability: 0.1,
                schock_evtl: 0.6
            },
            somnolent: {
                probability: 0.08,
                kritisch: 0.7,
                inhalationstrauma_evtl: 0.5
            },
            bewusstlos: {
                probability: 0.07,
                kritisch: 1.0,
                ursachen: ['Inhalationstrauma', 'Schock', 'CO-Intoxikation']
            }
        }
    },
    
    // ========================================
    // 🔥 VERBRENNUNGSGRADE
    // ========================================
    verbrennungsgrade: {
        info: 'Einteilung nach Tiefe',
        
        grad_1: {
            probability: 0.35,
            name: 'Erstgradig',
            tiefe: 'Epidermis (Oberhaut)',
            
            symptome: {
                rötung: 1.0,
                schwellung: 0.7,
                schmerzen_stark: 0.9,
                keine_blasen: 1.0
            },
            
            beispiele: ['Sonnenbrand', 'Kurze Berührung heiß'],
            
            heilung: {
                dauer: '3-7 Tage',
                narben: 0.0,
                vollständig: 1.0
            },
            
            behandlung: 'Kühlung, Schmerztherapie',
            meist_ambulant: 0.95
        },
        
        grad_2a: {
            probability: 0.3,
            name: 'Zweitgradig oberflächlich',
            tiefe: 'Epidermis + obere Dermis',
            
            symptome: {
                blasenbildung: 1.0,
                blasen_inhalt: 'Klar, seröse Flüssigkeit',
                rötung_hellrot: 0.9,
                sehr_schmerzhaft: 1.0,
                feucht_glänzend: 0.9
            },
            
            beispiele: ['Verbrühung', 'Kurze Flamme'],
            
            heilung: {
                dauer: '10-14 Tage',
                narben: 0.1,
                meist_ohne_narben: 0.9
            },
            
            behandlung: 'Kühlung, sterile Abdeckung, Schmerzen',
            stationär_oft: 0.5
        },
        
        grad_2b: {
            probability: 0.2,
            name: 'Zweitgradig tief',
            tiefe: 'Epidermis + tiefe Dermis',
            
            symptome: {
                blasenbildung: 1.0,
                blasen_rot_weiß: 0.9,
                schmerzen: 0.7,
                schmerzen_weniger_als_2a: 0.6,
                trocken_evtl: 0.5
            },
            
            beispiele: ['Längere Hitzeexposition', 'Flamme'],
            
            heilung: {
                dauer: '3-6 Wochen',
                narben: 0.8,
                hauttransplantation_evtl: 0.3
            },
            
            behandlung: 'Verbrennungszentrum oft',
            stationär: 0.9
        },
        
        grad_3: {
            probability: 0.12,
            name: 'Drittgradig',
            tiefe: 'Alle Hautschichten + Subkutis',
            
            symptome: {
                haut_weiß_lederartig: 0.6,
                haut_schwarz_verkohlt: 0.4,
                keine_schmerzen: 0.9,
                nerven_zerstört: 1.0,
                trocken: 0.9
            },
            
            beispiele: ['Lange Flamme', 'Hochspannung', 'Chemisch'],
            
            heilung: {
                spontanheilung: 0.0,
                hauttransplantation_zwingend: 1.0,
                dauer: 'Monate',
                narben: 1.0
            },
            
            behandlung: 'Verbrennungszentrum ZWINGEND',
            schwer: 1.0
        },
        
        grad_4: {
            probability: 0.03,
            name: 'Viertgradig',
            tiefe: 'Alle Hautschichten + Muskeln + Knochen',
            
            symptome: {
                verkohlung: 1.0,
                muskeln_sichtbar: 0.7,
                knochen_sichtbar: 0.5,
                keine_schmerzen: 1.0
            },
            
            beispiele: ['Lange Exposition Feuer', 'Hochspannung'],
            
            heilung: {
                amputation_evtl: 0.6,
                langwierig: 1.0
            },
            
            behandlung: 'Verbrennungszentrum, oft OP',
            kritisch: 1.0
        }
    },
    
    // ========================================
    // 📏 KÖRPEROBERFLÄCHE (KOF) - NEUNERREGEL
    // ========================================
    körperoberfläche: {
        info: 'Rule of Nines (Neunerregel) für KOF-Berechnung',
        
        neunerregel_erwachsene: {
            kopf_hals: 9,
            rumpf_vorne: 18,
            rumpf_hinten: 18,
            arm_rechts: 9,
            arm_links: 9,
            bein_rechts: 18,
            bein_links: 18,
            genital: 1,
            gesamt: 100
        },
        
        neunerregel_kinder: {
            info: 'Bei Kindern Kopf größer!',
            kopf_hals: 18,  // DOPPELT!
            rumpf_vorne: 18,
            rumpf_hinten: 18,
            arm_rechts: 9,
            arm_links: 9,
            bein_rechts: 14,  // Kleiner
            bein_links: 14,   // Kleiner
            gesamt: 100
        },
        
        handflächenregel: {
            info: 'Handinnenfläche Patient = ca. 1% KOF',
            verwendung: 'Für kleine Flächen'
        },
        
        kof_kategorien: {
            unter_10_prozent: {
                probability: 0.5,
                schweregrad: 'Leicht bis mittel',
                meist_kein_schock: 0.9
            },
            
            10_bis_20_prozent: {
                probability: 0.25,
                schweregrad: 'Mittel bis schwer',
                schock_risiko: 0.4,
                volumentherapie: 1.0
            },
            
            20_bis_40_prozent: {
                probability: 0.15,
                schweregrad: 'Schwer',
                schock_risiko: 0.8,
                verbrennungszentrum: 1.0,
                intensivstation: 0.9
            },
            
            über_40_prozent: {
                probability: 0.1,
                schweregrad: 'Kritisch',
                lebensbedrohlich: 1.0,
                schock: 0.95,
                mortalität_hoch: 0.7,
                verbrennungszentrum: 1.0
            }
        }
    },
    
    // ========================================
    // 🧪 URSACHEN
    // ========================================
    ursachen: {
        verbrühung: {
            probability: 0.45,
            name: 'Verbrühung (heißes Wasser, Flüssigkeiten)',
            
            details: {
                heißes_wasser: 0.5,
                tee_kaffee: 0.25,
                suppe: 0.15,
                öl: 0.1
            },
            
            temperatur: '60-100°C',
            
            häufig_bei: 'Kindern (70%)',
            
            typische_szenarien: [
                'Kind zieht Topf vom Herd',
                'Tasse mit heißem Tee umgestoßen',
                'Badewanne zu heiß',
                'Wasserkocher umgekippt'
            ],
            
            meist_grad: '2a-2b',
            
            erstmaßnahme: 'Sofort kühlen'
        },
        
        kontaktverbrennung: {
            probability: 0.25,
            name: 'Kontaktverbrennung (heiße Oberflächen)',
            
            details: {
                herdplatte: 0.35,
                bügeleisen: 0.25,
                ofen: 0.2,
                heizkörper: 0.1,
                auspuff: 0.1
            },
            
            temperatur: '100-400°C',
            
            meist_grad: '2a-3',
            
            charakteristisch: 'Abgrenzbare Form (z.B. Bügeleisen-Abdruck)'
        },
        
        flammenverbrennung: {
            probability: 0.15,
            name: 'Flammenverbrennung',
            
            details: {
                grillunfall: 0.3,
                brand: 0.25,
                explosion: 0.2,
                kamin: 0.15,
                andere: 0.1
            },
            
            meist_grad: '2b-3',
            
            besonderheit: {
                inhalationstrauma_risiko: 0.6,
                co_intoxikation_risiko: 0.4,
                gesicht_betroffen_oft: 0.5
            },
            
            schwer: 1.0
        },
        
        chemische_verbrennung: {
            probability: 0.08,
            name: 'Chemische Verbrennung',
            
            substanzen: {
                säuren: {
                    probability: 0.5,
                    beispiele: ['Schwefelsäure', 'Salzsäure'],
                    koagulationsnekrose: 1.0
                },
                laugen: {
                    probability: 0.4,
                    beispiele: ['Natronlauge', 'Ammoniak'],
                    kolliquationsnekrose: 1.0,
                    tiefer_eindringend: 1.0
                },
                andere: { probability: 0.1 }
            },
            
            erstmaßnahme: {
                spülung: 1.0,
                dauer: 'Mindestens 20-30 Min!',
                mit: 'Wasser',
                wichtig: 'Je länger desto besser'
            },
            
            meist_grad: '2b-3',
            
            besonderheit: 'Tiefe oft unterschätzt',
            
            arbeitsunfall_häufig: 0.7
        },
        
        elektrische_verbrennung: {
            probability: 0.05,
            name: 'Elektrische Verbrennung',
            
            arten: {
                niederspannung: {
                    probability: 0.7,
                    spannung: '<1000V',
                    meist_grad: '2-3'
                },
                hochspannung: {
                    probability: 0.3,
                    spannung: '>1000V',
                    meist_grad: '3-4',
                    kritisch: 1.0
                }
            },
            
            charakteristika: {
                ein_und_austrittswunde: 0.8,
                schaden_tiefer_als_sichtbar: 1.0,
                muskelschaden: 0.7,
                gefäßschaden: 0.4,
                nervenschaden: 0.5
            },
            
            komplikationen: {
                herzrhythmusstörungen: 0.3,
                myoglobinurie: 0.4,
                kompartmentsyndrom: 0.3
            },
            
            monitoring: {
                ekg: 1.0,
                info: 'Rhythmusstörungen können verzögert auftreten'
            },
            
            arbeitsunfall_häufig: 0.8
        },
        
        strahlung: {
            probability: 0.02,
            name: 'Strahlenverbrennung',
            beispiele: ['Sonnenbrand', 'UV-Lampe', 'Röntgen'],
            meist_grad: '1'
        }
    },
    
    // ========================================
    // 📍 LOKALISATION
    // ========================================
    lokalisation: {
        extremitäten: {
            probability: 0.5,
            details: {
                arme: 0.6,
                beine: 0.3,
                hände: 0.1  // Separat wichtig
            }
        },
        
        rumpf: {
            probability: 0.3,
            details: {
                brust: 0.4,
                bauch: 0.3,
                rücken: 0.3
            }
        },
        
        kopf_hals: {
            probability: 0.15,
            verbrennungszentrum_indikation: 1.0
        },
        
        genital_perineal: {
            probability: 0.05,
            verbrennungszentrum_indikation: 1.0
        }
    },
    
    besondere_lokalisationen: {
        info: 'Diese Lokalisationen haben besondere Bedeutung!',
        
        gesicht: {
            probability: 0.12,
            kritisch: 1.0,
            
            gründe: [
                'Inhalationstrauma-Risiko (80%)',
                'Ästhetik',
                'Augenbeteiligung möglich',
                'Schwellung kann Atemweg verlegen'
            ],
            
            verbrennungszentrum: 1.0
        },
        
        hände: {
            probability: 0.2,
            verbrennungszentrum: 1.0,
            
            gründe: [
                'Funktionserhalt essentiell',
                'Komplexe Anatomie',
                'Narbenkontrakturen vermeiden',
                'Berufliche Rehabilitation'
            ]
        },
        
        füße: {
            probability: 0.15,
            verbrennungszentrum: 0.8,
            grund: 'Funktionserhalt, Mobilität'
        },
        
        gelenke: {
            probability: 0.2,
            verbrennungszentrum: 0.9,
            grund: 'Narbenkontrakturen'
        },
        
        genital_perineal: {
            probability: 0.05,
            verbrennungszentrum: 1.0,
            grund: 'Spezialisierte Versorgung'
        },
        
        zirkuläre_verbrennung: {
            probability: 0.08,
            name: 'Zirkuläre Verbrennung (rund um Extremität)',
            
            gefahr: {
                kompartmentsyndrom: 0.8,
                durchblutungsstörung: 0.9,
                schwellung: 1.0
            },
            
            therapie: {
                escharotomie_evtl: 0.7,
                info: 'Chirurgische Entlastung'
            },
            
            überwachung_engmaschig: 1.0,
            verbrennungszentrum: 1.0
        }
    },
    
    // ========================================
    // 🚨 KOMPLIKATIONEN
    // ========================================
    komplikationen: {
        // INHALATIONSTRAUMA
        inhalationstrauma: {
            probability: 0.15,
            name: 'Inhalationstrauma',
            hochkritisch: 1.0,
            
            risikofaktoren: {
                brand_geschlossener_raum: 0.9,
                flammenverbrennung: 0.6,
                gesichtsverbrennung: 0.7,
                bewusstlosigkeit_am_brandort: 0.8
            },
            
            pathophysiologie: {
                hitze_schädigt_atemwege: 0.8,
                rauch_toxisch: 0.9,
                co_intoxikation: 0.6,
                zyanid_intoxikation: 0.3,
                ödem_entwicklung: 0.9
            },
            
            klinische_zeichen: {
                rußspuren_gesicht_nase_mund: 0.7,
                versengte_nasenhaare: 0.6,
                heiserkeit: 0.8,
                husten: 0.7,
                dyspnoe: 0.8,
                stridor: 0.4,
                bewusstseinstrübung: 0.5
            },
            
            diagnose: {
                klinisch: 0.8,
                bronchoskopie: 0.6,
                carboxyhb: 0.5
            },
            
            therapie: {
                o2_hochdosiert: 1.0,
                intubation_früh_erwägen: 0.8,
                info: 'Atemweg kann schnell zuschwellen!'
            },
            
            mortalität: 0.3,
            verbrennungszentrum: 1.0
        },
        
        // VERBRENNUNGSSCHOCK
        verbrennungsschock: {
            probability: 0.2,
            name: 'Verbrennungsschock (hypovolämisch)',
            
            pathophysiologie: {
                kapillarschaden: 1.0,
                flüssigkeitsverlust_massiv: 1.0,
                ödem: 1.0,
                hypovolämie: 1.0
            },
            
            risiko_abhängig_von: {
                kof: '>15-20%',
                verbrennungsgrad: '2b-3',
                alter: 'Kinder & Ältere'
            },
            
            klinische_zeichen: {
                tachykardie: 0.9,
                hypotonie: 0.8,
                oligurie: 0.7,
                blässe: 0.8,
                verwirrtheit: 0.6
            },
            
            therapie: {
                volumentherapie_zwingend: 1.0,
                parkland_formel: 1.0,
                ringer_laktat: 0.9
            },
            
            zeitfenster: 'Erste 24h kritisch'
        },
        
        // KOMPARTMENTSYNDROM
        kompartmentsyndrom: {
            probability: 0.08,
            name: 'Kompartmentsyndrom',
            
            bei: {
                zirkuläre_verbrennungen: 0.9,
                tiefe_verbrennungen: 0.7,
                extremitäten: 1.0
            },
            
            pathophysiologie: {
                ödem: 1.0,
                druckanstieg: 1.0,
                durchblutungsstörung: 1.0,
                ischämie: 0.9
            },
            
            zeichen: {
                schmerzen_zunehmend: 0.9,
                puls_distal_abgeschwächt: 0.8,
                blässe_zyanose: 0.7,
                parästhesien: 0.6,
                paralyse: 0.4
            },
            
            therapie: {
                escharotomie: 0.9,
                fasziotomie_evtl: 0.5
            },
            
            zeitkritisch: 1.0
        },
        
        // INFEKTION
        infektion: {
            probability: 0.3,
            name: 'Infektion',
            
            info: 'Häufigste Spätkomplikation',
            
            risiko: {
                große_kof: 0.8,
                grad_3: 0.9,
                kontamination: 0.7
            },
            
            zeitverlauf: 'Tage bis Wochen',
            
            keime: {
                staphylokokken: 0.4,
                pseudomonas: 0.3,
                andere: 0.3
            },
            
            prävention: {
                sterile_abdeckung: 1.0,
                antibiotika_bei_großen_verbrennungen: 0.7
            }
        },
        
        // HYPOTHERMIE
        hypothermie: {
            probability: 0.25,
            name: 'Hypothermie',
            
            pathophysiologie: {
                hautbarriere_zerstört: 1.0,
                wärmeverlust_massiv: 1.0,
                kühlung_verstärkt: 0.8
            },
            
            besonders_bei: {
                große_kof: 0.9,
                kinder: 0.8,
                lange_kühlung: 0.7
            },
            
            prävention: {
                rettungsdecke: 1.0,
                kühlung_limitieren: 1.0,
                wärmeerhalt: 1.0
            }
        }
    },
    
    // ========================================
    // 💧 PARKLAND-FORMEL
    // ========================================
    parkland_formel: {
        info: 'Volumenberechnung erste 24h nach Verbrennung',
        
        formel: {
            definition: '4 ml × Körpergewicht (kg) × % verbrannte KOF',
            beispiel: '70kg Patient, 30% KOF → 4 × 70 × 30 = 8400ml in 24h'
        },
        
        verteilung: {
            erste_8h: '50% der Menge (4200ml)',
            zweite_8h: '25% der Menge (2100ml)',
            dritte_8h: '25% der Menge (2100ml)'
        },
        
        flüssigkeit: 'Ringer-Laktat bevorzugt',
        
        wichtig: [
            'Startzeitpunkt = Unfallzeitpunkt (nicht Ankunft Klinik!)',
            'Anpassung nach Urinausscheidung',
            'Ziel: 0.5-1 ml/kg/h Urin',
            'Nur Richtwert, individuelle Anpassung!'
        ],
        
        ab_wann: '>15-20% KOF Grad 2-3'
    },
    
    // ========================================
    // 🏥 VERBRENNUNGSZENTRUM-KRITERIEN
    // ========================================
    verbrennungszentrum_kriterien: {
        info: 'Diese Patienten MÜSSEN in Verbrennungszentrum!',
        
        kriterien: {
            grad_3: {
                probability: 0.6,
                grund: 'Hauttransplantation erforderlich'
            },
            
            grad_2_über_10_prozent_kof: {
                probability: 0.4,
                grund: 'Großflächig'
            },
            
            gesicht: {
                probability: 0.3,
                grund: 'Ästhetik + Inhalationstrauma-Risiko'
            },
            
            hände: {
                probability: 0.35,
                grund: 'Funktionserhalt'
            },
            
            füße: {
                probability: 0.2,
                grund: 'Funktionserhalt'
            },
            
            gelenke: {
                probability: 0.25,
                grund: 'Narbenkontrakturen'
            },
            
            genital_perineal: {
                probability: 0.1,
                grund: 'Spezialisierte Versorgung'
            },
            
            inhalationstrauma: {
                probability: 0.2,
                grund: 'Kritisch'
            },
            
            elektrische_verbrennung: {
                probability: 0.15,
                grund: 'Tiefenschaden'
            },
            
            chemische_verbrennung: {
                probability: 0.15,
                grund: 'Spezialtherapie'
            },
            
            zirkuläre_verbrennung: {
                probability: 0.15,
                grund: 'Escharotomie evtl.'
            },
            
            kinder: {
                probability: 0.3,
                grund: 'Spezialisierte pädiatrische Versorgung',
                ab: '>5% Grad 2-3'
            },
            
            vorerkrankungen: {
                probability: 0.2,
                grund: 'Komplikationsrisiko erhöht'
            }
        },
        
        deutschland_standorte: [
            'Berlin',
            'Hamburg',
            'Hannover',
            'Köln',
            'Ludwigshafen',
            'München',
            'weitere...'
        ]
    },
    
    // ========================================
    // 🧊 KÜHLUNG & ERSTMAẞNAHMEN
    // ========================================
    erstmaßnahmen: {
        kühlung: {
            probability: 0.7,
            
            protokoll: {
                temperatur: '15-20°C (lauwarmes Wasser)',
                niemals_eis: 1.0,
                dauer: '10-20 Min maximal',
                cave_hypothermie: 1.0
            },
            
            wann: {
                grad_1_2: 1.0,
                grad_3: 0.3,
                info_grad_3: 'Wenig sinnvoll, da Nerven zerstört'
            },
            
            wirkung: {
                schmerzlinderung: 0.9,
                tiefenausdehnung_verhindern: 0.7,
                ödem_reduzieren: 0.6
            },
            
            cave: {
                bei_großer_kof_limitieren: 1.0,
                hypothermie_gefahr: 0.8,
                bei_kindern_vorsichtig: 0.9
            }
        },
        
        ablöschen: {
            probability: 0.2,
            bei: 'Brennende Kleidung',
            
            technik: {
                stop_drop_roll: 1.0,
                wälzen_am_boden: 1.0,
                löschen_mit_wasser_decke: 1.0
            }
        },
        
        kleidung_entfernen: {
            probability: 0.6,
            
            vorgehen: {
                nicht_verklebte_entfernen: 1.0,
                verklebte_belassen: 1.0,
                info: 'Verklebte Kleidung nicht abreißen!'
            }
        },
        
        abdeckung: {
            probability: 0.8,
            
            material: {
                sterile_tücher: 0.9,
                metallisierte_wundauflagen: 0.5,
                cave_flusen: 1.0
            },
            
            grund: 'Infektionsprophylaxe'
        },
        
        schmerztherapie: {
            probability: 0.9,
            wichtig: 1.0,
            medikamente: ['Morphin', 'Fentanyl', 'Ketamin']
        }
    },
    
    // ========================================
    // 👶 PÄDIATRISCHE BESONDERHEITEN
    // ========================================
    pädiatrie: {
        besonderheiten: [
            'Kopf prozentual größer → mehr % KOF',
            'Beine prozentual kleiner',
            'Schneller Hypothermie',
            'Schneller Schock',
            'Dünnere Haut → tiefere Verbrennungen',
            'Oft Verbrühung (70%)'
        ],
        
        neunerregel_modifiziert: {
            kopf: 18,  // Statt 9!
            beine: 'je 14'  // Statt 18!
        },
        
        verbrennungszentrum: {
            ab: '>5% Grad 2-3',
            immer_bei: 'Gesicht, Hände, Genital'
        },
        
        typische_szenarien: [
            'Kind zieht Topf vom Herd',
            'Tasse mit heißem Getränk umgestoßen',
            'Badewanne zu heiß',
            'Wasserkocher'
        ],
        
        verdacht_kindesmisshandlung: {
            bei: [
                'Atypisches Muster',
                'Verzögertes Vorstellen',
                'Unklare Anamnese',
                'Symmetrische Verbrennungen',
                'Zigarettenverbrennungen'
            ],
            meldepflicht: 1.0
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause: {
            probability: 0.7,
            address_types: ['residential', 'apartment'],
            details: {
                küche: 0.5,
                bad: 0.2,
                wohnbereich: 0.3
            }
        },
        
        arbeitsplatz: {
            probability: 0.15,
            address_types: ['industrial', 'commercial', 'office'],
            oft_chemisch_oder_elektrisch: 0.6
        },
        
        öffentlich: {
            probability: 0.1,
            address_types: ['public_place', 'outdoor'],
            beispiele: ['Grillplatz', 'Park', 'Sportplatz']
        },
        
        brandstelle: {
            probability: 0.05,
            address_types: ['fire_scene'],
            feuerwehr_vor_ort: 0.9,
            inhalationstrauma_häufig: 0.7
        }
    },
    
    // ========================================
    // 🚑 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.25,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 0.25,
            
            kriterien: {
                große_kof: '>20%',
                inhalationstrauma: 1.0,
                schock: 1.0,
                kind_schwer: 1.0,
                bewusstlosigkeit: 1.0,
                schmerzen_extrem: 0.7
            }
        },
        
        zielklinik: {
            verbrennungszentrum: {
                probability: 0.3,
                siehe_kriterien: 1.0,
                voranmeldung: 1.0
            },
            
            klinik_mit_chirurgie: {
                probability: 0.4,
                bei: 'Mittelschwere Verbrennungen'
            },
            
            standard: {
                probability: 0.3,
                bei: 'Leichte Verbrennungen Grad 1-2a'
            }
        },
        
        feuerwehr: {
            probability: 0.2,
            bei: ['Brand im Gebäude', 'Person in Flammen', 'Absicherung']
        },
        
        polizei: {
            probability: 0.15,
            bei: ['Arbeitsunfall', 'Verdacht Straftat', 'Kindesmisshandlung']
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            schock: {
                probability: 0.15,
                trigger_time: { min: 120, max: 360 },
                change: 'Patient wird blass, zittert, Kreislauf instabil',
                bei_großer_kof: 0.8
            },
            
            inhalationstrauma_manifestation: {
                probability: 0.1,
                trigger_time: { min: 60, max: 240 },
                change: 'Heiserkeit, Stridor, Dyspnoe nehmen zu',
                kritisch: 1.0
            },
            
            bewusstlosigkeit: {
                probability: 0.05,
                trigger_time: { min: 90, max: 300 },
                change: 'Patient reagiert nicht mehr',
                co_intoxikation_evtl: 0.7
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            verbrennungsgrad: 'FROM_CALL',
            kof_geschätzt: 'FROM_CALL',
            lokalisation: 'FROM_CALL',
            ursache: 'FROM_CALL',
            kühlung_durchgeführt: 'FROM_ASSESSMENT',
            verbrennungszentrum_kriterien: 'FROM_ASSESSMENT',
            richtige_klinik: 'FROM_DISPOSITION'
        },
        
        bewertung: {
            kriterien: {
                verbrennungsgrad_eingeschätzt: {
                    wichtig: 'sehr_hoch',
                    info: 'Grad 1-4?'
                },
                
                kof_abgeschätzt: {
                    wichtig: 'sehr_hoch',
                    info: 'Neunerregel anwenden!'
                },
                
                verbrennungszentrum_kriterien_geprüft: {
                    wichtig: 'kritisch',
                    info: 'Gesicht? Hände? >10% Grad 2? Inhalationstrauma?'
                },
                
                inhalationstrauma_abgefragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Brand in geschlossenem Raum? Flamme? Gesicht?'
                },
                
                kühlung_empfohlen: {
                    wichtig: 'hoch',
                    info: 'Lauwarmes Wasser, 10-20 Min'
                },
                
                nef_bei_bedarf: {
                    wichtig: 'hoch',
                    info: 'Bei großer KOF, Inhalationstrauma, Schock'
                }
            },
            
            kritische_fehler: [
                'Verbrennungszentrum-Kriterien nicht erkannt',
                'Inhalationstrauma übersehen',
                'KOF nicht abgeschätzt',
                'Falsche Zielklinik bei Verbrennungszentrum-Kriterien',
                'Kein NEF bei großer KOF'
            ],
            
            häufige_fehler: [
                'Verbrennungsgrad nicht erfragt',
                'Lokalisation unvollständig',
                'Neunerregel nicht angewendet',
                'Kühlung nicht erwähnt',
                'Ursache nicht erfragt (wichtig für chemisch!)'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit Verbrennungen Grad {grad}, ca. {kof}% KOF',
            'Verbrühung Kind, Oberkörper betroffen',
            'Flammenverbrennung, V.a. Inhalationstrauma',
            'Chemische Verbrennung, Spülung durchgeführt'
        ],
        
        voranmeldung_verbrennungszentrum: [
            '{hospital} Verbrennungszentrum, hier {callsign}',
            'Voranmeldung Verbrennung',
            '{geschlecht}, {alter} Jahre',
            'Verbrennungen Grad {grad}, ca. {kof}% KOF',
            'Lokalisation: {lokalisation}',
            'Ursache: {ursache}',
            'V.a. Inhalationstrauma: {ja/nein}',
            'Patient {bewusstseinszustand}',
            'ETA {eta} Minuten, kommen.'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL
    // ========================================
    special: {
        learning_points: [
            'Neunerregel für KOF-Schätzung',
            'Verbrennungszentrum-Kriterien kennen',
            'Inhalationstrauma bei Brand in Raum',
            'Kühlung: lauwarm, max 10-20 Min',
            'Parkland-Formel: 4 × kg × % KOF',
            'Kinder: Kopf größer = mehr % KOF',
            'Grad 3: keine Schmerzen!',
            'Chemisch: Spülen, spülen, spülen!',
            'Elektrisch: EKG-Monitoring!',
            'Hypothermie vermeiden'
        ],
        
        szenarien: {
            kind_verbrühung: {
                häufigkeit: 0.3,
                ablauf: [
                    'Kind zieht Topf vom Herd',
                    'Kochendes Wasser über Oberkörper',
                    'Grad 2a-2b, ca. 15% KOF',
                    'Kind schreit, Eltern panisch',
                    'Sofort kühlen',
                    'Verbrennungszentrum'
                ]
            },
            
            grillunfall: {
                häufigkeit: 0.15,
                ablauf: [
                    'Spiritus auf Grill',
                    'Stichflamme',
                    'Gesicht + Arme verbrannt',
                    'Grad 2b-3',
                    'V.a. Inhalationstrauma',
                    'NEF + Verbrennungszentrum'
                ]
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VERBRENNUNG_TEMPLATE };
}
