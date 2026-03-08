/**
 * 🚀 MAIN.JS (REFACTORED)
 * The new entry point of the application.
 */

import container from './core/services/ServiceContainer.js';
import uiModule from './core/modules/ui.module.js';
import initializeEventHandlers from './core/event-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded: Initializing application...');

  // Initialize UI
  uiModule.initialize();

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
  const gameLoop = () => {
    // The game logic will be driven by events and state changes
    // and updated in the respective modules.
    requestAnimationFrame(gameLoop);
  };

  gameLoop();
});
