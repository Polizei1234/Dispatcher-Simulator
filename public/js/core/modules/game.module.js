/**
 * 🎮 GAME MODULE
 * ES6 Module Export (statt globale Variablen!)
 */

import store from '../state/index.js';
import { GameActions, IncidentActions, VehicleActions } from '../state/actions.js';
import EventBridge from '../event-bridge.js';
import GameTimer from '../../systems/game-timer.js';

class GameModule {
  constructor() {
    this.nextIncidentTime = 0;
    this.gameTimer = new GameTimer();
    
    console.log('🎮 GameModule initialized');
  }

  /**
   * ▶️ START GAME
   */
  start(mode = 'free') {
    console.log(`🎮 Starting game in ${mode} mode`);
    
    // Dispatch to store
    store.dispatch(GameActions.start(mode));
    
    // Initialize vehicles
    this.initializeVehicles();
    
    // Start the game timer
    this.gameTimer.start();

    // Emit event
    EventBridge.emit('game_started', { mode });
    
    return true;
  }

  /**
   * ⏸️ TOGGLE PAUSE
   */
  togglePause() {
    store.dispatch(GameActions.togglePause());
    
    const isPaused = store.getState('game.isPaused');
    if (isPaused) {
      this.gameTimer.stop();
    } else {
      this.gameTimer.start();
    }

    EventBridge.emit('game_pause_toggled', { isPaused });
    
    return isPaused;
  }

  /**
   * 🔄 UPDATE (Game Loop)
   */
  update() {
    const gameState = store.getState('game');
    
    if (gameState.isPaused) return;
    
    // Update game time
    this.gameTimer.update();
    
    // Check for new incidents
    if (this.gameTimer.getCurrentTime() >= this.nextIncidentTime) {
      this.spawnIncident();
    }
  }

  /**
   * 🚨 SPAWN INCIDENT
   */
  async spawnIncident() {
    console.log('🚨 Spawning new incident...');
    
    // Generate incident (call CallSystem module)
    if (typeof CallSystem !== 'undefined') {
      await CallSystem.generateIncomingCall();
    }
    
    // Set next incident time
    const frequency = store.getState('game.settings.incidentFrequency');
    const variance = frequency * 0.25;
    const interval = (frequency - variance) + (Math.random() * variance * 2);
    
    this.nextIncidentTime = this.gameTimer.getCurrentTime() + (interval * 1000);
  }

  /**
   * 🚑 DISPATCH VEHICLE
   */
  dispatchVehicle(vehicleId, incidentId) {
    // Dispatch actions
    store.dispatch(VehicleActions.dispatch(vehicleId, incidentId));
    store.dispatch(IncidentActions.assignVehicle(incidentId, vehicleId));
    
    // Emit event
    EventBridge.emit('vehicle_dispatched', { vehicleId, incidentId });
    
    console.log(`🚑 ${vehicleId} dispatched to ${incidentId}`);
  }

  /**
   * 🚗 INITIALIZE VEHICLES
   */
  initializeVehicles() {
    const vehicles = store.getState('vehicles');
    
    // Convert VEHICLES array to Map
    if (typeof VEHICLES !== 'undefined' && Array.isArray(VEHICLES)) {
      const vehicleMap = new Map();
      
      VEHICLES.forEach(v => {
        vehicleMap.set(v.id, {
          ...v,
          status: 'available',
          currentStatus: 2,
          position: v.position || STATIONS[v.station]?.position
        });
      });
      
      // Initialize in store
      store.dispatch({
        type: 'VEHICLES_INITIALIZED',
        payload: vehicleMap
      });
      
      console.log(`✅ ${vehicleMap.size} vehicles initialized`);
    }
  }
}

// =============================
// EXPORT MODULE INSTANCE
// =============================

const gameModule = new GameModule();
export default gameModule;
