import './core/event-bridge.js';
import RadioSystem from './systems/radio-system.js';
import RadioPanel from './ui/radio-panel.js';
import Game from './core/game.js';
import tabManager from './ui/tabs.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOMContentLoaded: Initializing application...');

    try {
        console.log('🌉 EventBridge should be available now.');
        
        console.log('🎙️ Initializing RadioSystem...');
        await RadioSystem.initialize();
        console.log('✅ RadioSystem Initialized');

        console.log('📻 Initializing RadioPanel...');
        const radioPanel = new RadioPanel(RadioSystem);
        radioPanel.initialize();
        console.log('✅ RadioPanel Initialized');

        console.log('🎮 Initializing Game...');
        const game = new Game();
        // Temporäre Übergabe von globalen Daten, bis die Datenarchitektur überarbeitet ist
        game.stations = window.STATIONS || []; 
        game.vehicles = window.VEHICLES || [];
        await game.initialize();
        window.game = game; 
        console.log('✅ Game Initialized');

        console.log('📊 Initializing TabManager...');
        // Übergabe der Abhängigkeiten an den TabManager
        tabManager.initialize(game, window.STATIONS || []);
        console.log('✅ TabManager Initialized');

        console.log('🔗 Setting up UI Event Listeners...');
        const startButton = document.getElementById('start-free-game');
        if (startButton) {
            startButton.addEventListener('click', () => {
                document.getElementById('welcome-screen').classList.add('hidden');
                document.getElementById('game-container').classList.remove('hidden');
                game.start('free');
                // Initial das erste Tab aktivieren
                tabManager.switchTab('map'); 
            });
            console.log('✅ Start button event listener attached.');
        } else {
            console.error('❌ Critical: Start button not found!');
        }

        console.log('🎉 Application successfully initialized. Welcome screen should be visible.');

    } catch (error) {
        console.error('❌❌❌ A CRITICAL ERROR OCCURRED DURING APP INITIALIZATION ❌❌❌');
        console.error(error);
        document.body.innerHTML = '<div style="color: red; text-align: center; padding: 50px;"><h1>Application Error</h1><p>Could not start the application. Please check the console for details.</p></div>';
    }
});
