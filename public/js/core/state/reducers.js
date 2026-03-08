/**
 * 🔄 REDUCERS
 * Immutable State Updates (wie Redux!)
 */

// =============================
// HELPER: IMMUTABLE UPDATE
// =============================

const updateObject = (oldObject, newValues) => {
  return { ...oldObject, ...newValues };
};

const updateItemInArray = (array, itemId, updateFn) => {
  return array.map(item => {
    if (item.id !== itemId) return item;
    return updateFn(item);
  });
};

// =============================
// VEHICLE REDUCER
// =============================

const vehiclesReducer = (state = new Map(), action) => {
  switch (action.type) {
    case 'VEHICLE_DISPATCHED': {
      const { vehicleId, incidentId } = action.payload;
      const newState = new Map(state);
      const vehicle = { ...newState.get(vehicleId) };
      
      vehicle.status = 'dispatched';
      vehicle.targetIncident = incidentId;
      vehicle.currentStatus = 4; // FMS 4
      vehicle.dispatchedAt = action.timestamp;
      
      newState.set(vehicleId, vehicle);
      return newState;
    }

    case 'VEHICLE_POSITION_UPDATED': {
      const { vehicleId, position } = action.payload;
      const newState = new Map(state);
      const vehicle = { ...newState.get(vehicleId) };
      
      vehicle.position = position;
      vehicle.lastPositionUpdate = Date.now();
      
      newState.set(vehicleId, vehicle);
      return newState;
    }

    case 'VEHICLE_ARRIVED': {
      const { vehicleId, incidentId } = action.payload;
      const newState = new Map(state);
      const vehicle = { ...newState.get(vehicleId) };
      
      vehicle.status = 'on_scene';
      vehicle.currentStatus = 3; // FMS 3
      vehicle.arrivedAt = action.timestamp;
      
      newState.set(vehicleId, vehicle);
      return newState;
    }

    case 'VEHICLE_STATUS_CHANGED': {
      const { vehicleId, status, fmsCode } = action.payload;
      const newState = new Map(state);
      const vehicle = { ...newState.get(vehicleId) };
      
      vehicle.status = status;
      vehicle.currentStatus = fmsCode;
      vehicle.statusChangedAt = action.timestamp;
      
      newState.set(vehicleId, vehicle);
      return newState;
    }

    case 'VEHICLE_AVAILABLE': {
      const { vehicleId } = action.payload;
      const newState = new Map(state);
      const vehicle = { ...newState.get(vehicleId) };
      
      vehicle.status = 'available';
      vehicle.currentStatus = 2; // FMS 2
      vehicle.targetIncident = null;
      vehicle.availableSince = action.timestamp;
      
      newState.set(vehicleId, vehicle);
      return newState;
    }

    default:
      return state;
  }
};

// =============================
// INCIDENT REDUCER
// =============================

const incidentsReducer = (state = new Map(), action) => {
  switch (action.type) {
    case 'INCIDENT_ADDED': {
      const incident = action.payload;
      const newState = new Map(state);
      newState.set(incident.id, {
        ...incident,
        assignedVehicles: [],
        arrivedVehicles: [],
        status: 'pending',
        createdAt: action.timestamp
      });
      return newState;
    }

    case 'INCIDENT_VEHICLE_ASSIGNED': {
      const { incidentId, vehicleId } = action.payload;
      const newState = new Map(state);
      const incident = { ...newState.get(incidentId) };
      
      incident.assignedVehicles = [...incident.assignedVehicles, vehicleId];
      incident.lastVehicleAssigned = action.timestamp;
      
      newState.set(incidentId, incident);
      return newState;
    }

    case 'INCIDENT_VEHICLE_ARRIVED': {
      const { incidentId, vehicleId } = action.payload;
      const newState = new Map(state);
      const incident = { ...newState.get(incidentId) };
      
      incident.arrivedVehicles = [...incident.arrivedVehicles, vehicleId];
      incident.lastVehicleArrived = action.timestamp;
      
      // Check if all assigned vehicles arrived
      if (incident.arrivedVehicles.length === incident.assignedVehicles.length) {
        incident.status = 'all_on_scene';
      }
      
      newState.set(incidentId, incident);
      return newState;
    }

    case 'INCIDENT_COMPLETED': {
      const { incidentId, outcome } = action.payload;
      const newState = new Map(state);
      const incident = { ...newState.get(incidentId) };
      
      incident.status = 'completed';
      incident.completedAt = action.timestamp;
      incident.outcome = outcome;
      
      newState.set(incidentId, incident);
      return newState;
    }

    case 'INCIDENT_CANCELLED': {
      const { incidentId, reason } = action.payload;
      const newState = new Map(state);
      const incident = { ...newState.get(incidentId) };
      
      incident.status = 'cancelled';
      incident.cancelledAt = action.timestamp;
      incident.cancelReason = reason;
      
      newState.set(incidentId, incident);
      return newState;
    }

    case 'INCIDENT_UPDATED': {
      const { incidentId, updates } = action.payload;
      const newState = new Map(state);
      const incident = { ...newState.get(incidentId), ...updates };
      
      incident.updatedAt = action.timestamp;
      
      newState.set(incidentId, incident);
      return newState;
    }

    default:
      return state;
  }
};

// =============================
// GAME REDUCER
// =============================

const gameReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return updateObject(state, {
        mode: action.payload.mode,
        isPaused: false,
        money: action.payload.mode === 'free' ? 999999999 : 50000,
        reputation: 100,
        startedAt: action.timestamp
      });

    case 'GAME_PAUSE_TOGGLED':
      return updateObject(state, {
        isPaused: !state.isPaused
      });

    case 'GAME_TIME_UPDATED':
      return updateObject(state, {
        gameTime: action.payload.gameTime,
        realTime: action.payload.realTime
      });

    case 'GAME_SETTINGS_UPDATED':
      return updateObject(state, {
        settings: updateObject(state.settings || {}, action.payload)
      });

    case 'GAME_MONEY_UPDATED':
      return updateObject(state, {
        money: action.payload.amount,
        lastMoneyChange: {
          amount: action.payload.amount - state.money,
          reason: action.payload.reason,
          timestamp: action.timestamp
        }
      });

    case 'GAME_REPUTATION_UPDATED':
      return updateObject(state, {
        reputation: action.payload.reputation,
        lastReputationChange: {
          change: action.payload.change,
          timestamp: action.timestamp
        }
      });

    default:
      return state;
  }
};

// =============================
// CALL REDUCER
// =============================

const callReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CALL_INCOMING':
      return updateObject(state, {
        activeCall: action.payload,
        callStatus: 'ringing',
        receivedAt: action.timestamp
      });

    case 'CALL_ANSWERED':
      return updateObject(state, {
        callStatus: 'active',
        answeredAt: action.timestamp,
        askedQuestions: []
      });

    case 'CALL_QUESTION_ASKED':
      return updateObject(state, {
        askedQuestions: [
          ...(state.askedQuestions || []),
          {
            question: action.payload.question,
            answer: action.payload.answer,
            timestamp: action.timestamp
          }
        ]
      });

    case 'CALL_ENDED':
      return updateObject(state, {
        activeCall: null,
        callStatus: 'idle',
        endedAt: action.timestamp,
        callHistory: [
          ...(state.callHistory || []),
          {
            call: state.activeCall,
            questions: state.askedQuestions,
            duration: action.timestamp - state.answeredAt
          }
        ]
      });

    default:
      return state;
  }
};

// =============================
// UI REDUCER
// =============================

const uiReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UI_TAB_SWITCHED':
      return updateObject(state, {
        activeTab: action.payload.tabName
      });

    case 'UI_INCIDENT_SELECTED':
      return updateObject(state, {
        selectedIncident: action.payload.incidentId
      });

    case 'UI_VEHICLE_SELECTED':
      return updateObject(state, {
        selectedVehicle: action.payload.vehicleId
      });

    case 'UI_MAP_INTERACTION':
      return updateObject(state, {
        lastMapInteraction: action.payload
      });

    default:
      return state;
  }
};

// =============================
// ROOT REDUCER (Combine All)
// =============================

const rootReducer = (state = {}, action) => {
  return {
    vehicles: vehiclesReducer(state.vehicles, action),
    incidents: incidentsReducer(state.incidents, action),
    game: gameReducer(state.game, action),
    call: callReducer(state.call, action),
    ui: uiReducer(state.ui, action)
  };
};

export default rootReducer;
