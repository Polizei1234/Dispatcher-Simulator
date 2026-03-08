import RadioSystem from './systems/radio-system.js';
import RadioPanel from './ui/radio-panel.js';
import Game from './core/game.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded: Initializing application...');

    // 1. Initialize Systems
    RadioSystem.initialize().then(() => {
        console.log('✅ RadioSystem Initialized');
    }).catch(error => {
        console.error('❌ RadioSystem Initialization Failed:', error);
    });

    // 2. Initialize UI Components
    const radioPanel = new RadioPanel(RadioSystem);
    radioPanel.initialize();

    // 3. Initialize Game
    const game = new Game();
    window.game = game; // Make game instance globally available if needed

    // 4. Setup Game Start Button
    const startButton = document.getElementById('start-free-game');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            game.start('free');
        });
    } else {
        console.error('Start button not found');
    }
});