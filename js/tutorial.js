// =========================
// TUTORIAL-MODUL
// =========================

const TUTORIAL_STEPS = [
    {
        title: 'Willkommen beim Tutorial',
        content: `
            <p>Herzlich willkommen beim Leitstellensimulator der ILS Waiblingen!</p>
            <p>In diesem Tutorial lernen Sie die Grundlagen der Einsatzdisposition.</p>
            <ul>
                <li>Notrufannahme</li>
                <li>Einsatzmittel alarmieren</li>
                <li>Einsätze überwachen</li>
                <li>Funkverkehr</li>
            </ul>
        `
    },
    {
        title: 'Die Spieloberfläche',
        content: `
            <p>Die Oberfläche ist in mehrere Bereiche unterteilt:</p>
            <ul>
                <li><strong>Links:</strong> Einsatzliste und eingehende Anrufe</li>
                <li><strong>Mitte:</strong> Karte mit Einsatzorten und Fahrzeugen</li>
                <li><strong>Rechts:</strong> Verfügbare Fahrzeuge und Einsatzdetails</li>
                <li><strong>Unten:</strong> Funkverkehr</li>
                <li><strong>Oben:</strong> Zeit, Credits und Status</li>
            </ul>
        `
    },
    {
        title: 'Notrufannahme',
        content: `
            <p>Eingehende Notrufe erscheinen als Dialog.</p>
            <p>Sie können dem Anrufer Fragen stellen:</p>
            <ul>
                <li>"Wo genau ist der Einsatzort?"</li>
                <li>"Wie viele Personen sind betroffen?"</li>
                <li>"Ist die Person ansprechbar?"</li>
            </ul>
            <p>Basierend auf den Informationen vergeben Sie ein <strong>Stichwort</strong> nach dem Baden-Württemberg System.</p>
        `
    },
    {
        title: 'Stichwort-System BW',
        content: `
            <p>Baden-Württemberg verwendet ein standardisiertes Stichwort-System:</p>
            <ul>
                <li><strong>RD 1:</strong> Rettungsdienst ohne Notarzt</li>
                <li><strong>RD 2:</strong> Rettungsdienst mit Notarzt</li>
                <li><strong>B 1-6:</strong> Brand (1=klein, 6=sehr groß)</li>
                <li><strong>THL 1-4:</strong> Technische Hilfeleistung</li>
                <li><strong>THL VU:</strong> Verkehrsunfall mit Eingeklemmten</li>
                <li><strong>VU:</strong> Einfacher Verkehrsunfall</li>
            </ul>
        `
    },
    {
        title: 'Fahrzeuge alarmieren',
        content: `
            <p>So alarmieren Sie Einsatzmittel:</p>
            <ol>
                <li>Wählen Sie einen Einsatz aus der Liste</li>
                <li>Prüfen Sie die empfohlenen Fahrzeuge</li>
                <li>Klicken Sie auf "Einsatzmittel alarmieren"</li>
                <li>Wählen Sie verfügbare Fahrzeuge aus</li>
                <li>Die Fahrzeuge werden automatisch alarmiert</li>
            </ol>
            <p><strong>Tipp:</strong> Achten Sie auf die richtigen Fahrzeugtypen für den Einsatz!</p>
        `
    },
    {
        title: 'Funkverkehr',
        content: `
            <p>Der Funkverkehr läuft automatisch:</p>
            <ul>
                <li><span style="color: #28a745;">Grün:</span> Ausgehende Meldungen (Leitstelle)</li>
                <li><span style="color: #17a2b8;">Blau:</span> Eingehende Meldungen (Fahrzeuge)</li>
            </ul>
            <p>Typische Funksprüche:</p>
            <ul>
                <li>"Florian Backnang 83/1, rücken aus"</li>
                <li>"Florian Backnang 83/1 vor Ort"</li>
                <li>"Florian Backnang 83/1, Einsatz abgeschlossen"</li>
            </ul>
        `
    },
    {
        title: 'Credits und Wirtschaft',
        content: `
            <p>Für jeden abgeschlossenen Einsatz erhalten Sie Credits:</p>
            <ul>
                <li>RD 1: 150 €</li>
                <li>RD 2: 300 €</li>
                <li>Brand: 200-800 €</li>
                <li>THL: 250-500 €</li>
            </ul>
            <p>Mit Credits können Sie neue Fahrzeuge kaufen und Ihre Leitstelle erweitern!</p>
        `
    },
    {
        title: 'Tutorial abgeschlossen!',
        content: `
            <p>🎉 Glückwunsch! Sie haben das Tutorial abgeschlossen.</p>
            <p>Sie wissen jetzt:</p>
            <ul>
                <li>✅ Wie Sie Notrufe annehmen</li>
                <li>✅ Wie das Stichwort-System funktioniert</li>
                <li>✅ Wie Sie Fahrzeuge alarmieren</li>
                <li>✅ Wie der Funkverkehr abläuft</li>
            </ul>
            <p><strong>Viel Erfolg beim Disponieren!</strong></p>
        `
    }
];

let currentTutorialStep = 0;

function initTutorial() {
    currentTutorialStep = 0;
    showTutorialStep();
}

function showTutorialStep() {
    const step = TUTORIAL_STEPS[currentTutorialStep];
    const content = document.getElementById('tutorial-content');
    
    content.innerHTML = `
        <h3>${step.title}</h3>
        ${step.content}
        <p style="margin-top: 20px; color: #a0a0a0;">
            Schritt ${currentTutorialStep + 1} von ${TUTORIAL_STEPS.length}
        </p>
    `;
    
    // Update Buttons
    const prevBtn = document.querySelector('.tutorial-buttons .btn-secondary');
    const nextBtn = document.querySelector('.tutorial-buttons .btn-primary');
    
    prevBtn.disabled = currentTutorialStep === 0;
    
    if (currentTutorialStep === TUTORIAL_STEPS.length - 1) {
        nextBtn.innerHTML = 'Tutorial beenden <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Weiter <i class="fas fa-arrow-right"></i>';
    }
}

function nextTutorialStep() {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
        currentTutorialStep++;
        showTutorialStep();
    } else {
        // Tutorial beenden
        document.getElementById('tutorial-overlay').classList.remove('active');
        startNewGame();
    }
}

function previousTutorialStep() {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep();
    }
}