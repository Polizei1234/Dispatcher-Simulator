/**
 * 🚀 MAIN.JS (REFACTORED)
 * The new entry point of the application.
 */

import container from './core/services/ServiceContainer.js';
import uiModule from './core/modules/ui.module.js';
import gameModule from './core/modules/game.module.js';
import initializeEventHandlers from './core/event-handlers.js';
import RadioSystem from './systems/radio-system.js';
import RadioPanel from './ui/radio-panel.js';
import './core/config.js';
import './core/version-config.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded: Initializing application...');

  // Initialize core systems
  RadioSystem.initialize();

  // Initialize UI
  uiModule.initialize();

  const radioPanel = new RadioPanel(RadioSystem);
  radioPanel.initialize();

  // Initialize event handlers
  initializeEventHandlers();

  // Get services from container
  const gameService = container.get('game');
  const incidentService = container.get('incidents');

  // Example: Create a new incident after 5 seconds
  setTimeout(() => {
    incidentService.createIncident({ /* incident data */ });
  }, 5000);

  // Start the game loop
  setInterval(() => {
    gameModule.update();
  }, 1000);
});
