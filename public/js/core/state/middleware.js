/**
 * 🔌 MIDDLEWARE
 * Redux-Style Middleware für Store
 */

// =============================
// LOGGER MIDDLEWARE
// =============================

export const loggerMiddleware = (store, action) => {
  console.group(`🎬 Action: ${action.type}`);
  console.log('📦 Payload:', action.payload);
  console.log('🕐 Timestamp:', new Date(action.timestamp).toLocaleTimeString());
  console.log('📊 State (before):', store.getState());
  
  // Let action pass through
  return action;
};

// =============================
// PERSISTENCE MIDDLEWARE
// =============================

export const persistenceMiddleware = (store, action) => {
  // Save to localStorage after certain actions
  const persistActions = [
    'GAME_SETTINGS_UPDATED',
    'GAME_STARTED',
    'INCIDENT_COMPLETED'
  ];
  
  if (persistActions.includes(action.type)) {
    try {
      const state = store.getState();
      localStorage.setItem('dispatcher_sim_state', JSON.stringify({
        game: state.game,
        settings: state.game?.settings
      }));
      console.log('💾 State persisted to localStorage');
    } catch (error) {
      console.error('❌ Persistence failed:', error);
    }
  }
  
  return action;
};

// =============================
// VALIDATION MIDDLEWARE
// =============================

export const validationMiddleware = (store, action) => {
  // Validate action structure
  if (!action.type) {
    console.error('❌ Invalid action: Missing type', action);
    return null; // Cancel action
  }
  
  // Validate specific actions
  switch (action.type) {
    case 'VEHICLE_DISPATCHED':
      if (!action.payload.vehicleId || !action.payload.incidentId) {
        console.error('❌ Invalid VEHICLE_DISPATCHED: Missing IDs');
        return null;
      }
      break;
      
    case 'INCIDENT_ADDED':
      if (!action.payload.id || !action.payload.stichwort) {
        console.error('❌ Invalid INCIDENT_ADDED: Missing required fields');
        return null;
      }
      break;
  }
  
  return action;
};

// =============================
// EVENTBRIDGE MIDDLEWARE
// =============================

export const eventBridgeMiddleware = (store, action) => {
  // Bridge Store actions to EventBridge
  if (typeof EventBridge !== 'undefined') {
    EventBridge.emit('store_action_dispatched', {
      type: action.type,
      payload: action.payload
    });
  }
  
  return action;
};

// =============================
// EXPORT ALL
// =============================

export const defaultMiddleware = [
  validationMiddleware,
  loggerMiddleware,
  eventBridgeMiddleware
];

export default defaultMiddleware;
