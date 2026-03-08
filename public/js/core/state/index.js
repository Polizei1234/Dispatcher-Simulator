/**
 * 🏪 STORE INITIALIZATION
 * Setup & Export Store Instance
 */

import Store from './store.js';
import rootReducer from './reducers.js';
import { defaultMiddleware, persistenceMiddleware } from './middleware.js';

// =============================
// INITIAL STATE
// =============================

const initialState = {
  vehicles: new Map(),
  incidents: new Map(),
  game: {
    mode: null,
    isPaused: false,
    money: 0,
    reputation: 100,
    gameTime: 0,
    realTime: 0,
    settings: {
      gameSpeed: 1,
      incidentFrequency: 120,
      soundEnabled: true,
      autoZoom: true
    }
  },
  call: {
    activeCall: null,
    callStatus: 'idle',
    callHistory: [],
    askedQuestions: []
  },
  ui: {
    activeTab: 'map',
    selectedIncident: null,
    selectedVehicle: null
  }
};

// =============================
// CREATE STORE INSTANCE
// =============================

const middleware = [
  ...defaultMiddleware,
  persistenceMiddleware
];

const store = new Store(rootReducer, initialState, middleware);

// =============================
// LOAD PERSISTED STATE
// =============================

try {
  const persistedState = localStorage.getItem('dispatcher_sim_state');
  if (persistedState) {
    const parsed = JSON.parse(persistedState);
    store.dispatch({
      type: 'STORE_HYDRATED',
      payload: parsed
    });
    console.log('💾 State loaded from localStorage');
  }
} catch (error) {
  console.warn('⚠️ Could not load persisted state:', error);
}

// =============================
// DEBUGGING (Development)
// =============================

if (typeof window !== 'undefined') {
  window.__STORE__ = store;
  window.__STORE_DEBUG__ = {
    getState: () => store.getState(),
    getHistory: () => store.getHistory(),
    undo: () => store.undo(),
    redo: () => store.redo(),
    export: () => store.exportState(),
    import: (json) => store.importState(json)
  };
  
  console.log('🐛 Store Debug Tools available at window.__STORE_DEBUG__');
}

// =============================
// EXPORT SINGLETON
// =============================

export default store;
export { Store };
