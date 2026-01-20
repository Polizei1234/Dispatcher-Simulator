// =========================
// TUTORIAL-SYSTEM
// =========================

let currentTutorialStep = 0;

const TUTORIAL_STEPS = [
    {
        title: 'Willkommen bei der ILS Waiblingen',
        content: `
            <p>Willkommen im Leitstellensimulator für den Rems-Murr-Kreis!</p>
            <p>Sie sind verantwortlich für die Disposition von Rettungsdienst, Feuerwehr und Polizei.</p>
            <img src="https://via.placeholder.com/400x200/1e2a38/ffffff?text=ILS+Waiblingen" alt="ILS" style="width: 100%; border-radius: 8px; margin: 10px 0;">
            <p>Ihr Ziel: Schnelle und effiziente Hilfe für Notfälle im gesamten Kreisgebiet.</p>
        `
    },
    {
        title: 'Notrufannahme',
        content: `
            <p><strong>Schritt 1: Notruf annehmen</strong></p>
            <p>Wenn ein Notruf eingeht, sehen Sie nur:</p>
            <div style="background: #dc3545; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>📢 EINGEHENDER NOTRUF 112</strong>
            </div>
            <p>Klicken Sie auf "Annehmen" um das Gespräch zu beginnen.</p>
            <p><em>Wichtig: Keine Details vor der Anrufannahme!</em></p>
        `
    },
    {
        title: 'Telefondialog',
        content: `
            <p><strong>Schritt 2: Informationen sammeln</strong></p>
            <p>Der Anrufer gibt zunächst nur vage Infos:</p>
            <blockquote style="background: #1e2a38; padding: 10px; border-left: 4px solid #4a9eff; margin: 10px 0;">
                🗣️ "Hier ist jemand gestürzt!"
            </blockquote>
            <p>Stellen Sie gezielte Fragen:</p>
            <ul>
                <li>📍 "Wo genau befinden Sie sich?"</li>
                <li>❓ "Was ist genau passiert?"</li>
                <li>🩺 "Ist die Person ansprechbar?"</li>
            </ul>
            <p>Oder geben Sie eine eigene Nachricht ein!</p>
        `
    },
    {
        title: 'Einsatz erstellen',
        content: `
            <p><strong>Schritt 3: Einsatz disponieren</strong></p>
            <p>Sobald Sie die Adresse haben, klicken Sie:</p>
            <button class="btn btn-success" disabled>✅ Einsatz erstellen und disponieren</button>
            <p style="margin-top: 15px;">Das System erstellt automatisch ein Protokoll mit allen gesammelten Informationen.</p>
            <p>Sie können alle Felder nachträglich bearbeiten!</p>
        `
    },
    {
        title: 'Fahrzeuge alarmieren',
        content: `
            <p><strong>Schritt 4: Einsatzmittel auswählen</strong></p>
            <p>Wählen Sie passende Fahrzeuge per Checkbox:</p>
            <div style="background: #1e2a38; padding: 10px; border-radius: 6px; margin: 10px 0;">
                <label style="display: block; margin: 5px 0;">
                    <input type="checkbox" checked disabled> <strong>Florian Backnang 83/1</strong> (RTW)
                </label>
                <label style="display: block; margin: 5px 0;">
                    <input type="checkbox" checked disabled> <strong>Florian Backnang 82/1</strong> (NEF)
                </label>
            </div>
            <p>Das System schlägt automatisch benötigte Fahrzeuge vor!</p>
        `
    },
    {
        title: 'Funkrufnamen Baden-Württemberg',
        content: `
            <p><strong>Realistischer Funkverkehr</strong></p>
            <p>Alle Funkrufnamen entsprechen dem offiziellen Digitalfunkatlas BW 2023:</p>
            <ul style="list-style: none; padding: 0;">
                <li>🚑 <strong>Florian Backnang 83/1</strong> → RTW</li>
                <li>🚑 <strong>Florian Backnang 82/1</strong> → NEF</li>
                <li>🚒 <strong>Florian Waiblingen 40/1</strong> → LF 10</li>
                <li>🚓 <strong>2/WN-1</strong> → Polizei Waiblingen</li>
            </ul>
            <p>Alle Wachen haben die korrekten Adressen von BOS-Fahrzeuge.info!</p>
        `
    },
    {
        title: 'Los geht\'s!',
        content: `
            <p><strong>🎉 Sie sind bereit!</strong></p>
            <p>Tipps für den Start:</p>
            <ul>
                <li>🔑 Groq API-Key in Einstellungen für KI-Telefonate (optional)</li>
                <li>⏱️ Spielgeschwindigkeit anpassen für schnelleres Gameplay</li>
                <li>💰 Kaufen Sie weitere Fahrzeuge um komplexere Einsätze zu bewältigen</li>
                <li>🎯 Achten Sie auf die benötigten Fahrzeuge je Stichwort</li>
            </ul>
            <p style="margin-top: 20px; font-size: 1.1em;">
                <strong>Viel Erfolg bei Ihrem Dienst in der ILS Waiblingen! 🚑</strong>
            </p>
        `
    }
];

function loadTutorialStep(stepIndex) {
    currentTutorialStep = stepIndex;
    const step = TUTORIAL_STEPS[stepIndex];
    
    const content = document.getElementById('tutorial-content');
    content.innerHTML = `
        <h3>${step.title}</h3>
        <div class="tutorial-step-content">
            ${step.content}
        </div>
        <p style="text-align: center; margin-top: 20px; color: #a0a0a0;">
            Schritt ${stepIndex + 1} von ${TUTORIAL_STEPS.length}
        </p>
    `;
}

function nextTutorialStep() {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
        loadTutorialStep(currentTutorialStep + 1);
    } else {
        // Tutorial beenden
        document.getElementById('tutorial-overlay').classList.remove('active');
        startNewGame();
    }
}

function previousTutorialStep() {
    if (currentTutorialStep > 0) {
        loadTutorialStep(currentTutorialStep - 1);
    }
}