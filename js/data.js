// =========================
// WACHEN & FAHRZEUGE REMS-MURR-KREIS
// Echte Daten aus stations.json + vehicles.json
// =========================

const STATIONS = {
    // HAUPTAMTLICHE RETTUNGSWACHEN (7)
    'rw1': { id: 'rw1', name: 'Rettungswache 1 Waiblingen', address: 'Henri-Dunant-Straße 1, 71334 Waiblingen', position: [48.8309415, 9.3256194], category: 'rettungswache', type: 'hauptamt', cost: 0 },
    'rw2': { id: 'rw2', name: 'Rettungswache 2 Backnang', address: 'Manfred-von-Ardenne-Allee 7, 71522 Backnang', position: [48.9591833, 9.4215388], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    'rw3': { id: 'rw3', name: 'Rettungswache 3 Fellbach', address: 'Ringstraße 7, 70736 Fellbach', position: [48.8204341, 9.2732059], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    'rw4': { id: 'rw4', name: 'Rettungswache 4 Murrhardt', address: 'Hörschbachstraße 11, 71540 Murrhardt', position: [48.9818825, 9.5719644], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    'rw5': { id: 'rw5', name: 'Rettungswache 5 Schorndorf', address: 'Schlichtener Straße 105, 73614 Schorndorf', position: [48.7972867, 9.5296473], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    'rw6': { id: 'rw6', name: 'Rettungswache 6 Welzheim', address: 'Schloßgartenstraße 88, 73642 Welzheim', position: [48.8685887, 9.6318532], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    'rw7': { id: 'rw7', name: 'Rettungswache 7 Winnenden', address: 'Elisabeth-Selbert-Straße 28, 71364 Winnenden', position: [48.870273, 9.3879091], category: 'rettungswache', type: 'hauptamt', cost: 500000 },
    
    // WEITERE RETTUNGSWACHEN (Privatanbieter)
    'rw10': { id: 'rw10', name: 'RW 10 Saniteam Winkler Fellbach', address: 'Ohmstraße 32, 70736 Fellbach', position: [48.8220344, 9.2863874], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw11': { id: 'rw11', name: 'RW 11 ASB Waiblingen', address: 'Schüttelgrabenring 3, 71332 Waiblingen', position: [48.8212481, 9.3179443], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw13': { id: 'rw13', name: 'RW 13 Rems Murr Ambulanz', address: 'Wieslauftalstr. 4, 73614 Schorndorf', position: [48.8308994, 9.5497997], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw14': { id: 'rw14', name: 'RW 14+20 SAG/Brüder', address: 'Ohiostrasse 6, 70806 Kornwestheim-Pattonville', position: [48.8663517, 9.2219033], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw15': { id: 'rw15', name: 'RW 15 Ambulanz Schütt', address: 'Saarstraße 78, 71282 Hemmingen', position: [48.8620612, 9.0477945], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw16': { id: 'rw16', name: 'RW 16 MHD Sulzbach', address: 'Lindenstraße 8, 71560 Sulzbach a.d. Murr', position: [49.0091735, 9.4850142], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw17': { id: 'rw17', name: 'RW 17 MHD Hertmannsweiler', address: 'Johannes-Giesser-Straße 4, 71364 Winnenden', position: [48.8905949, 9.4172431], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw19': { id: 'rw19', name: 'RW 19 JUH Aspach', address: 'Backnanger Straße, 71546 Aspach', position: [48.9722409, 9.39937001], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw20': { id: 'rw20', name: 'RW 20 JUH Schorndorf', address: 'Baumwasenstraße 5, 73614 Schorndorf', position: [48.8095591, 9.5165087], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    'rw21': { id: 'rw21', name: 'RW 21 DECEBA', address: 'Robert-Mayer-Straße 10, 73660 Urbach', position: [48.8103904, 9.5654997], category: 'rettungswache', type: 'hauptamt', cost: 400000 },
    
    // NOTARZTWACHEN (2)
    'naw_winnenden': { id: 'naw_winnenden', name: 'Notarztwache Klinikum Winnenden', address: 'Am Jakobsweg 5, 71364 Winnenden', position: [48.8711979, 9.3926748], category: 'notarztwache', type: 'hauptamt', cost: 0 },
    'naw_murrhardt': { id: 'naw_murrhardt', name: 'Notarztwache Murrhardt', address: 'Harbacher Straße 1, 71540 Murrhardt', position: [48.9893601, 9.552176], category: 'notarztwache', type: 'hauptamt', cost: 300000 },
    
    // ORTSVEREINE (DRK, ehrenamtlich)
    'ov_aspach': { id: 'ov_aspach', name: 'OV Aspach', address: 'Backnanger Straße 23, 71546 Aspach', position: [48.96611, 9.4008672], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_kernen': { id: 'ov_kernen', name: 'OV Kernen im Remstal', address: 'Sonnhalde 20, 71394 Kernen im Remstal', position: [48.8051557, 9.3165014], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_mhd_winnenden': { id: 'ov_mhd_winnenden', name: 'OV MHD Winnenden', address: 'Weinstraße 28, 71364 Winnenden', position: [48.8537599, 9.3864822], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_pluederhausen': { id: 'ov_pluederhausen', name: 'OV Plüderhausen', address: 'Gmünder Str. 2, 73655 Plüderhausen', position: [48.7914862, 9.6054655], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_remshalden': { id: 'ov_remshalden', name: 'OV Remshalden', address: 'Alfred-Klingele-Straße 35, 73630 Remshalden', position: [48.8078506, 9.4320989], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_schorndorf': { id: 'ov_schorndorf', name: 'OV Schorndorf', address: 'Lortzingstraße 48, 73614 Schorndorf', position: [48.7958525, 9.5129172], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_urbach': { id: 'ov_urbach', name: 'OV Urbach', address: 'Hohenackerstr. 10, 73660 Urbach', position: [48.8167952, 9.5784281], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_waiblingen': { id: 'ov_waiblingen', name: 'OV Waiblingen', address: 'Anton-Schmidt-Straße 1, 71334 Waiblingen', position: [48.8238664, 9.3219705], category: 'ortsverein', type: 'ehrenamt', cost: 0 },
    'ov_weinstadt': { id: 'ov_weinstadt', name: 'OV Weinstadt', address: 'Brückenstraße 7, 71384 Weinstadt', position: [48.8168404, 9.3859122], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_wieslauftal': { id: 'ov_wieslauftal', name: 'OV Wieslauftal', address: 'Neue Zumhoferstraße 2, 73635 Rudersberg', position: [48.8832649, 9.5299227], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_winnenden': { id: 'ov_winnenden', name: 'OV Winnenden', address: 'Mühltorstraße 50, 71364 Winnenden', position: [48.8776635, 9.4011986], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_winterbach': { id: 'ov_winterbach', name: 'OV Winterbach', address: 'Florianstr. 2, 73650 Winterbach', position: [48.8012923, 9.4768215], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_backnang': { id: 'ov_backnang', name: 'OV Backnang', address: 'Öhringer Straße 8, 71522 Backnang', position: [48.9627246, 9.4301255], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_rudersberg': { id: 'ov_rudersberg', name: 'OV Rudersberg', address: 'Neue Zumhofer Straße 2/3, 73635 Rudersberg', position: [48.8840848, 9.537257], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_oppenweiler': { id: 'ov_oppenweiler', name: 'OV Oppenweiler', address: 'Murrwiesenstraße 3, 71570 Oppenweiler', position: [48.9804664, 9.4605718], category: 'ortsverein', type: 'ehrenamt', cost: 100000 },
    'ov_burgstetten': { id: 'ov_burgstetten', name: 'OV Burgstetten', address: 'Kelterweg 25, 71576 Burgstetten', position: [48.9275612, 9.3738729], category: 'ortsverein', type: 'ehrenamt', cost: 100000 }
};

// FAHRZEUGE - Echte Fahrzeuge aus vehicles.json
const VEHICLES_CATALOG = [
    // RW1 Waiblingen (8 Fahrzeuge) - START
    { id: 'KDOW_RW1_1_10_1', name: 'Kdow Rotkreuz Rems Murr 1/10-1', type: 'Kdow', station: 'rw1', cost: 0, owned: true },
    { id: 'NEF_RW1_1_82_2', name: 'NEF Rotkreuz Rems Murr 1/82-2', type: 'NEF', station: 'rw1', cost: 0, owned: true },
    { id: 'RTW_RW1_1_83_2', name: 'RTW Rotkreuz Rems Murr 1/83-2', type: 'RTW', station: 'rw1', cost: 0, owned: true },
    { id: 'RTW_RW1_1_83_3', name: 'RTW Rotkreuz Rems Murr 1/83-3', type: 'RTW', station: 'rw1', cost: 0, owned: true },
    { id: 'KTW_RW1_1_85_2', name: 'KTW Rotkreuz Rems Murr 1/85-2', type: 'KTW', station: 'rw1', cost: 60000, owned: false },
    { id: 'KTW_RW1_1_85_3', name: 'KTW Rotkreuz Rems Murr 1/85-3', type: 'KTW', station: 'rw1', cost: 60000, owned: false },
    { id: 'KTW_RW1_1_85_4', name: 'KTW Rotkreuz Rems Murr 1/85-4', type: 'KTW', station: 'rw1', cost: 60000, owned: false },
    { id: 'KTW_RW1_1_85_5', name: 'KTW Rotkreuz Rems Murr 1/85-5', type: 'KTW', station: 'rw1', cost: 60000, owned: false },
    
    // RW2 Backnang (7)
    { id: 'KDOW_RW2_1_10_2', name: 'Kdow Rotkreuz Rems Murr 1/10-2', type: 'Kdow', station: 'rw2', cost: 80000, owned: false },
    { id: 'NEF_RW2_2_82_1', name: 'NEF Rotkreuz Rems Murr 2/82-1', type: 'NEF', station: 'rw2', cost: 150000, owned: false },
    { id: 'RTW_RW2_2_83_1', name: 'RTW Rotkreuz Rems Murr 2/83-1', type: 'RTW', station: 'rw2', cost: 120000, owned: false },
    { id: 'RTW_RW2_2_83_3', name: 'RTW Rotkreuz Rems Murr 2/83-3', type: 'RTW', station: 'rw2', cost: 120000, owned: false },
    { id: 'KTW_RW2_2_85_1', name: 'KTW Rotkreuz Rems Murr 2/85-1', type: 'KTW', station: 'rw2', cost: 60000, owned: false },
    { id: 'KTW_RW2_2_85_2', name: 'KTW Rotkreuz Rems Murr 2/85-2', type: 'KTW', station: 'rw2', cost: 60000, owned: false },
    { id: 'KTW_RW2_2_85_3', name: 'KTW Rotkreuz Rems Murr 2/85-3', type: 'KTW', station: 'rw2', cost: 60000, owned: false },
    
    // RW3 Fellbach (1)
    { id: 'RTW_RW3_3_83_3', name: 'RTW Rotkreuz Rems Murr 3/83-3', type: 'RTW', station: 'rw3', cost: 120000, owned: false },
    
    // RW4 Murrhardt (1)
    { id: 'RTW_RW4_4_83_2', name: 'RTW Rotkreuz Rems Murr 4/83-2', type: 'RTW', station: 'rw4', cost: 120000, owned: false },
    
    // RW5 Schorndorf (7)
    { id: 'NEF_RW5_5_82_1', name: 'NEF Rotkreuz Rems Murr 5/82-1', type: 'NEF', station: 'rw5', cost: 150000, owned: false },
    { id: 'RTW_RW5_5_83_1', name: 'RTW Rotkreuz Rems Murr 5/83-1', type: 'RTW', station: 'rw5', cost: 120000, owned: false },
    { id: 'RTW_RW5_5_83_2', name: 'RTW Rotkreuz Rems Murr 5/83-2', type: 'RTW', station: 'rw5', cost: 120000, owned: false },
    { id: 'KTW_RW5_5_85_1', name: 'KTW Rotkreuz Rems Murr 5/85-1', type: 'KTW', station: 'rw5', cost: 60000, owned: false },
    { id: 'KTW_RW5_5_85_2', name: 'KTW Rotkreuz Rems Murr 5/85-2', type: 'KTW', station: 'rw5', cost: 60000, owned: false },
    { id: 'KTW_RW5_5_85_3', name: 'KTW Rotkreuz Rems Murr 5/85-3', type: 'KTW', station: 'rw5', cost: 60000, owned: false },
    { id: 'KTW_RW5_5_85_4', name: 'KTW Rotkreuz Rems Murr 5/85-4', type: 'KTW', station: 'rw5', cost: 60000, owned: false },
    
    // RW6 Welzheim (3)
    { id: 'NEF_RW6_6_82_1', name: 'NEF Rotkreuz Rems Murr 6/82-1', type: 'NEF', station: 'rw6', cost: 150000, owned: false },
    { id: 'RTW_RW6_6_83_1', name: 'RTW Rotkreuz Rems Murr 6/83-1', type: 'RTW', station: 'rw6', cost: 120000, owned: false },
    { id: 'RTW_RW6_6_83_3', name: 'RTW Rotkreuz Rems Murr 6/83-3', type: 'RTW', station: 'rw6', cost: 120000, owned: false },
    
    // RW7 Winnenden (1)
    { id: 'RTW_RW7_7_83_2', name: 'RTW Rotkreuz Rems Murr 7/83-2', type: 'RTW', station: 'rw7', cost: 120000, owned: false },
    
    // RW10 Saniteam (4)
    { id: 'KTW_SANI_10_85_1', name: 'KTW Sani Team 10/85-1', type: 'KTW', station: 'rw10', cost: 60000, owned: false },
    { id: 'KTW_SANI_10_85_2', name: 'KTW Sani Team 10/85-2', type: 'KTW', station: 'rw10', cost: 60000, owned: false },
    { id: 'KTW_SANI_10_85_4', name: 'KTW Sani Team 10/85-4', type: 'KTW', station: 'rw10', cost: 60000, owned: false },
    { id: 'KTW_SANI_10_85_5', name: 'KTW Sani Team 10/85-5', type: 'KTW', station: 'rw10', cost: 60000, owned: false },
    
    // RW11 ASB (3)
    { id: 'RTW_ASB_11_83_1', name: 'RTW Sama Rems Murr 11/83-1', type: 'RTW', station: 'rw11', cost: 120000, owned: false },
    { id: 'KTW_ASB_11_85_1', name: 'KTW Sama Rems Murr 11/85-1', type: 'KTW', station: 'rw11', cost: 60000, owned: false },
    { id: 'KTW_ASB_11_85_3', name: 'KTW Sama Rems Murr 11/85-3', type: 'KTW', station: 'rw11', cost: 60000, owned: false },
    
    // Weitere Fahrzeuge...
    { id: 'KTW_RMA_13_85_1', name: 'KTW Rems Murr Ambulanz 13/85-1', type: 'KTW', station: 'rw13', cost: 60000, owned: false },
    
    // RW14 SAG (9)
    { id: 'KTW_SAG_14_85_1', name: 'KTW SAG Rems Murr 14/85-1', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_14_85_2', name: 'KTW SAG Rems Murr 14/85-2', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_14_85_3', name: 'KTW SAG Rems Murr 14/85-3', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_14_85_4', name: 'KTW SAG Rems Murr 14/85-4', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_14_85_5', name: 'KTW SAG Rems Murr 14/85-5', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_22_85_1', name: 'KTW SAG Brüder Rems Murr 22/85-1', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_22_85_2', name: 'KTW SAG Brüder Rems Murr 22/85-2', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_22_85_3', name: 'KTW SAG Brüder Rems Murr 22/85-3', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    { id: 'KTW_SAG_22_85_4', name: 'KTW SAG Brüder Rems Murr 22/85-4', type: 'KTW', station: 'rw14', cost: 60000, owned: false },
    
    { id: 'KTW_AS_15_85_1', name: 'KTW AS Rems Murr 15/85-1', type: 'KTW', station: 'rw15', cost: 60000, owned: false },
    { id: 'RTW_MHD16_83_1', name: 'RTW Johannes Rems Murr 16/83-1', type: 'RTW', station: 'rw16', cost: 120000, owned: false },
    { id: 'RTW_MHD17_83_1', name: 'RTW Johannes Rems Murr 17/83-1', type: 'RTW', station: 'rw17', cost: 120000, owned: false },
    { id: 'RTW_JUH19_83_1', name: 'RTW Akkon Rems Murr 19/83-1', type: 'RTW', station: 'rw19', cost: 120000, owned: false },
    { id: 'RTW_JUH20_83_1', name: 'RTW Akkon Rems Murr 20/83-1', type: 'RTW', station: 'rw20', cost: 120000, owned: false },
    
    { id: 'KTW_DECEBA_21_85_1', name: 'KTW Rettung DECEBA Rems Murr 21/85-1', type: 'KTW', station: 'rw21', cost: 60000, owned: false },
    { id: 'KTW_DECEBA_21_85_2', name: 'KTW Rettung DECEBA Rems Murr 21/85-2', type: 'KTW', station: 'rw21', cost: 60000, owned: false },
    
    // Notarztwachen
    { id: 'NEF_WN_JOH18_1', name: 'NEF Johannes Rems Murr 18/82-1', type: 'NEF', station: 'naw_winnenden', cost: 0, owned: true },
    { id: 'NEF_WN_RK7_1', name: 'NEF Rotkreuz Rems Murr 7/82-1', type: 'NEF', station: 'naw_winnenden', cost: 150000, owned: false },
    { id: 'NEF_MH_4_1', name: 'NEF Rotkreuz Rems Murr 4/82-1', type: 'NEF', station: 'naw_murrhardt', cost: 150000, owned: false },
    { id: 'NEF_MH_4_2', name: 'NEF Rotkreuz Rems Murr 4/82-2', type: 'NEF', station: 'naw_murrhardt', cost: 150000, owned: false },
    
    // Ortsvereine (Ehrenamt)
    { id: 'KTW_ASP_54_25_1', name: 'KTW Rotkreuz Rems Murr 54/25-1', type: 'KTW', station: 'ov_aspach', cost: 60000, owned: false },
    { id: 'KTW_KER_25_1', name: 'KTW KER/25-1', type: 'KTW', station: 'ov_kernen', cost: 60000, owned: false },
    { id: 'KTW_JOH12_85_1', name: 'KTW Johannes Rems-Murr 12/85-1', type: 'KTW', station: 'ov_mhd_winnenden', cost: 60000, owned: false },
    { id: 'KTW_PLÜ_25_1', name: 'KTW PLÜ/25-1', type: 'KTW', station: 'ov_pluederhausen', cost: 60000, owned: false },
    { id: 'KTW_PLÜ_25_2', name: 'KTW PLÜ/25-2', type: 'KTW', station: 'ov_pluederhausen', cost: 60000, owned: false },
    { id: 'KTW_REM_25_1', name: 'KTW REM/25-1', type: 'KTW', station: 'ov_remshalden', cost: 60000, owned: false },
    { id: 'KTW_SDF_25_1', name: 'KTW SDF/25-1', type: 'KTW', station: 'ov_schorndorf', cost: 60000, owned: false },
    { id: 'KTW_SDF_25_2', name: 'KTW SDF/25-2', type: 'KTW', station: 'ov_schorndorf', cost: 60000, owned: false },
    { id: 'KTW_URB_25_1', name: 'KTW URB/25-1', type: 'KTW', station: 'ov_urbach', cost: 60000, owned: false },
    { id: 'KTW_URB_25_2', name: 'KTW URB/25-2', type: 'KTW', station: 'ov_urbach', cost: 60000, owned: false },
    { id: 'KTW_WN_25_1', name: 'KTW WN/25-1', type: 'KTW', station: 'ov_waiblingen', cost: 0, owned: true },
    { id: 'KTW_WEI_25_1', name: 'KTW WEI/25-1', type: 'KTW', station: 'ov_weinstadt', cost: 60000, owned: false },
    { id: 'KTW_WLT_25_1', name: 'KTW WLT/25-1', type: 'KTW', station: 'ov_wieslauftal', cost: 60000, owned: false },
    { id: 'KTW_WIN_25_1', name: 'KTW WIN/25-1', type: 'KTW', station: 'ov_winnenden', cost: 60000, owned: false },
    { id: 'KTW_WIN_25_2', name: 'KTW WIN/25-2', type: 'KTW', station: 'ov_winnenden', cost: 60000, owned: false },
    { id: 'KTW_WTB_25_1', name: 'KTW WTB/25-1', type: 'KTW', station: 'ov_winterbach', cost: 60000, owned: false },
    { id: 'KTW_BAC_25_2', name: 'KTW BAC/25-2', type: 'KTW', station: 'ov_backnang', cost: 60000, owned: false },
    { id: 'KTW_RUD_25_1', name: 'KTW RUD/25-1', type: 'KTW', station: 'ov_rudersberg', cost: 60000, owned: false },
    { id: 'KTW_OPP_25_1', name: 'KTW OPP/25-1', type: 'KTW', station: 'ov_oppenweiler', cost: 60000, owned: false },
    { id: 'KDOW_OPP_10_1', name: 'KDOW OPP/10-1', type: 'Kdow', station: 'ov_oppenweiler', cost: 80000, owned: false },
    { id: 'GW_SAN_OPP_28_1', name: 'GW-San OPP/28-1', type: 'GW-San', station: 'ov_oppenweiler', cost: 100000, owned: false },
    { id: 'KTW_BUR_25_1', name: 'KTW BUR/25-1', type: 'KTW', station: 'ov_burgstetten', cost: 60000, owned: false }
];

let VEHICLES = [];

function initializeVehicles() {
    VEHICLES = [];
    
    VEHICLES_CATALOG.forEach(template => {
        const station = STATIONS[template.station];
        if (!station) return;
        
        const vehicle = {
            id: template.id,
            name: template.name,
            type: template.type,
            station: template.station,
            cost: template.cost,
            owned: CONFIG.GAME_MODE === 'free' ? true : template.owned,
            callsign: template.name,
            status: 'available',
            position: [...station.position],
            totalDistance: 0
        };
        
        VEHICLES.push(vehicle);
    });
}

function getVehicleIcon(type) {
    // Pixel Art als Data-URI (wird später implementiert)
    const icons = {
        'RTW': '🚑',
        'NEF': '🚑',
        'KTW': '🚐',
        'Kdow': '🚗',
        'GW-San': '🚛'
    };
    return icons[type] || '🚗';
}

function getStationIcon(category) {
    const icons = {
        'rettungswache': '🏥',
        'notarztwache': '⚕️',
        'ortsverein': '🔴'
    };
    return icons[category] || '🏢';
}