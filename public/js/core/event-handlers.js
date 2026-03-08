/**
 * 🎮 EVENT HANDLERS
 * Centralized event handling for the application.
 */

import { onClick } from '../utils/event-delegator.js';
import container from './services/ServiceContainer.js';
import uiModule from './modules/ui.module.js';
import gameModule from './modules/game.module.js';
import callModule from './modules/call.module.js';

const initializeEventHandlers = () => {
  console.log('🔥 Initializing event handlers...');

  const gameService = container.get('game');

  // Welcome Screen
  onClick('#start-free-game', () => gameModule.start('free'));
  onClick('#start-career-mode', () => alert('Career mode coming soon!'));
  onClick('#start-tutorial', () => alert('Tutorial coming soon!'));
  onClick('#show-settings', () => uiModule.showSettings());

  // Settings Overlay
  onClick('#close-settings', () => uiModule.hideSettings());
  onClick('#save-settings', () => {
    // Implement save settings logic here
    uiModule.hideSettings();
  });
  onClick('#toggle-api-key-visibility', () => uiModule.toggleAPIKeyVisibility());

  // In-Game UI
  onClick('#pause-btn', () => gameModule.togglePause());
  onClick('#radio-toggle-btn', () => uiModule.toggleRadioPanel());
  onClick('#debug-menu-toggle', () => {
      // Implement debug menu toggle here
  });
  onClick('#open-shop', () => alert('Shop coming soon!'));
  onClick('#show-settings-ingame', () => uiModule.showSettings());

  // Map Controls
  onClick('#center-map', () => {
      // Implement center map logic here
  });
  onClick('#toggle-stations', () => {
      // Implement toggle stations logic here
  });

  // Call Handling
  onClick('#hang-up-call', () => {
    const callId = document.querySelector('#call-active').dataset.callId;
    if(callId) {
      callModule.hangUp(callId);
    }
  });

  // Tabs
  onClick('.tab-btn', (event) => {
    const tabName = event.target.closest('.tab-btn').dataset.tab;
    uiModule.switchTab(tabName);
  });

  console.log('✅ Event handlers initialized.');
};

export default initializeEventHandlers;
