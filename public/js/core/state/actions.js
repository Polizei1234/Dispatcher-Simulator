/**
 * 🎬 ACTION CREATORS
 * Framework-Ready Actions für State-Änderungen
 */

// =============================
// VEHICLE ACTIONS
// =============================

export const VehicleActions = {
  /**
   * 🚑 DISPATCH VEHICLE
   */
  dispatch(vehicleId, incidentId) {
    return {
      type: 'VEHICLE_DISPATCHED',
      payload: { vehicleId, incidentId },
      timestamp: Date.now()
    };
  },

  /**
   * 📍 UPDATE POSITION
   */
  updatePosition(vehicleId, position) {
    return {
      type: 'VEHICLE_POSITION_UPDATED',
      payload: { vehicleId, position }
    };
  },

  /**
   * 🎯 ARRIVED
   */
  arrive(vehicleId, incidentId) {
    return {
      type: 'VEHICLE_ARRIVED',
      payload: { vehicleId, incidentId },
      timestamp: Date.now()
    };
  },

  /**
   * 🔄 STATUS CHANGE
   */
  setStatus(vehicleId, status, fmsCode) {
    return {
      type: 'VEHICLE_STATUS_CHANGED',
      payload: { vehicleId, status, fmsCode },
      timestamp: Date.now()
    };
  },

  /**
   * ✅ AVAILABLE
   */
  makeAvailable(vehicleId) {
    return {
      type: 'VEHICLE_AVAILABLE',
      payload: { vehicleId },
      timestamp: Date.now()
    };
  }
};

// =============================
// INCIDENT ACTIONS
// =============================

export const IncidentActions = {
  /**
   * ➕ ADD INCIDENT
   */
  add(incident) {
    return {
      type: 'INCIDENT_ADDED',
      payload: incident,
      timestamp: Date.now()
    };
  },

  /**
   * 🚑 ASSIGN VEHICLE
   */
  assignVehicle(incidentId, vehicleId) {
    return {
      type: 'INCIDENT_VEHICLE_ASSIGNED',
      payload: { incidentId, vehicleId },
      timestamp: Date.now()
    };
  },

  /**
   * 🎯 VEHICLE ARRIVED
   */
  vehicleArrived(incidentId, vehicleId) {
    return {
      type: 'INCIDENT_VEHICLE_ARRIVED',
      payload: { incidentId, vehicleId },
      timestamp: Date.now()
    };
  },

  /**
   * ✅ COMPLETE
   */
  complete(incidentId, outcome) {
    return {
      type: 'INCIDENT_COMPLETED',
      payload: { incidentId, outcome },
      timestamp: Date.now()
    };
  },

  /**
   * ❌ CANCEL
   */
  cancel(incidentId, reason) {
    return {
      type: 'INCIDENT_CANCELLED',
      payload: { incidentId, reason },
      timestamp: Date.now()
    };
  },

  /**
   * 📝 UPDATE
   */
  update(incidentId, updates) {
    return {
      type: 'INCIDENT_UPDATED',
      payload: { incidentId, updates },
      timestamp: Date.now()
    };
  }
};

// =============================
// GAME ACTIONS
// =============================

export const GameActions = {
  /**
   * ▶️ START GAME
   */
  start(mode) {
    return {
      type: 'GAME_STARTED',
      payload: { mode },
      timestamp: Date.now()
    };
  },

  /**
   * ⏸️ PAUSE/UNPAUSE
   */
  togglePause() {
    return {
      type: 'GAME_PAUSE_TOGGLED',
      timestamp: Date.now()
    };
  },

  /**
   * ⏱️ UPDATE TIME
   */
  updateTime(gameTime, realTime) {
    return {
      type: 'GAME_TIME_UPDATED',
      payload: { gameTime, realTime }
    };
  },

  /**
   * ⚙️ UPDATE SETTINGS
   */
  updateSettings(settings) {
    return {
      type: 'GAME_SETTINGS_UPDATED',
      payload: settings,
      timestamp: Date.now()
    };
  },

  /**
   * 💰 UPDATE MONEY
   */
  updateMoney(amount, reason) {
    return {
      type: 'GAME_MONEY_UPDATED',
      payload: { amount, reason },
      timestamp: Date.now()
    };
  },

  /**
   * 🏆 UPDATE REPUTATION
   */
  updateReputation(reputation, change) {
    return {
      type: 'GAME_REPUTATION_UPDATED',
      payload: { reputation, change },
      timestamp: Date.now()
    };
  }
};

// =============================
// CALL ACTIONS
// =============================

export const CallActions = {
  /**
   * 📞 INCOMING CALL
   */
  incoming(callData) {
    return {
      type: 'CALL_INCOMING',
      payload: callData,
      timestamp: Date.now()
    };
  },

  /**
   * ✅ ANSWER CALL
   */
  answer(callId) {
    return {
      type: 'CALL_ANSWERED',
      payload: { callId },
      timestamp: Date.now()
    };
  },

  /**
   * ❓ ASK QUESTION
   */
  askQuestion(callId, question, answer) {
    return {
      type: 'CALL_QUESTION_ASKED',
      payload: { callId, question, answer },
      timestamp: Date.now()
    };
  },

  /**
   * 📴 HANG UP
   */
  hangUp(callId) {
    return {
      type: 'CALL_ENDED',
      payload: { callId },
      timestamp: Date.now()
    };
  }
};

// =============================
// UI ACTIONS
// =============================

export const UIActions = {
  /**
   * 📑 SWITCH TAB
   */
  switchTab(tabName) {
    return {
      type: 'UI_TAB_SWITCHED',
      payload: { tabName },
      timestamp: Date.now()
    };
  },

  /**
   * 🔍 SELECT INCIDENT
   */
  selectIncident(incidentId) {
    return {
      type: 'UI_INCIDENT_SELECTED',
      payload: { incidentId },
      timestamp: Date.now()
    };
  },

  /**
   * 🚗 SELECT VEHICLE
   */
  selectVehicle(vehicleId) {
    return {
      type: 'UI_VEHICLE_SELECTED',
      payload: { vehicleId },
      timestamp: Date.now()
    };
  },

  /**
   * 🗺️ MAP INTERACTION
   */
  mapInteraction(type, data) {
    return {
      type: 'UI_MAP_INTERACTION',
      payload: { type, data },
      timestamp: Date.now()
    };
  }
};

// =============================
// EXPORT ALL
// =============================

export const Actions = {
  Vehicle: VehicleActions,
  Incident: IncidentActions,
  Game: GameActions,
  Call: CallActions,
  UI: UIActions
};

export default Actions;
