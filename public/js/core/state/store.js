/**
 * 🏪 REDUX-STYLE STORE
 * Framework-Ready State-Management mit Actions/Reducers
 */

class Store {
  constructor(reducer, initialState = {}, middleware = []) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = new Map();
    this.middleware = middleware;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
    
    console.log('🏪 Store initialisiert');
  }

  /**
   * 🎬 DISPATCH ACTION (wie Redux!)
   */
  dispatch(action) {
    console.log('🎬 Action:', action.type, action.payload);
    
    // Store old state for history
    const oldState = JSON.parse(JSON.stringify(this.state));
    
    // Apply middleware
    let processedAction = action;
    for (const mw of this.middleware) {
      processedAction = mw(this, processedAction) || processedAction;
    }
    
    // Run reducer (IMMUTABLE!)
    const newState = this.reducer(this.state, processedAction);
    
    // Update state
    this.state = newState;
    
    // Add to history (Time-Travel Debugging!)
    this.addToHistory(action, oldState, newState);
    
    // Notify listeners
    this.notifyListeners(action.type, newState, oldState);
    
    return action;
  }

  /**
   * 📖 GET STATE (Immutable!)
   */
  getState(path = null) {
    if (!path) return this.state;
    
    // Support nested paths: 'vehicles.RTW-1-1'
    return path.split('.').reduce((acc, part) => acc?.[part], this.state);
  }

  /**
   * 👂 SUBSCRIBE (wie Redux!)
   */
  subscribe(actionType, callback) {
    if (!this.listeners.has(actionType)) {
      this.listeners.set(actionType, []);
    }
    
    this.listeners.get(actionType).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(actionType);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    };
  }

  /**
   * 🔔 NOTIFY LISTENERS
   */
  notifyListeners(actionType, newState, oldState) {
    // Notify specific action listeners
    if (this.listeners.has(actionType)) {
      this.listeners.get(actionType).forEach(cb => {
        cb(newState, oldState, actionType);
      });
    }
    
    // Notify wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => {
        cb(newState, oldState, actionType);
      });
    }
  }

  /**
   * 🕐 TIME-TRAVEL DEBUGGING
   */
  addToHistory(action, oldState, newState) {
    // Remove future states if we're in the past
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    this.history.push({
      action,
      oldState,
      newState,
      timestamp: Date.now()
    });
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  /**
   * ⏮️ UNDO (Time-Travel!)
   */
  undo() {
    if (this.historyIndex <= 0) {
      console.warn('⚠️ Nichts zum Rückgängig machen');
      return;
    }
    
    this.historyIndex--;
    const entry = this.history[this.historyIndex];
    this.state = entry.oldState;
    this.notifyListeners('TIME_TRAVEL_UNDO', this.state, entry.newState);
    
    console.log('⏮️ Undo:', entry.action.type);
  }

  /**
   * ⏭️ REDO
   */
  redo() {
    if (this.historyIndex >= this.history.length - 1) {
      console.warn('⚠️ Nichts zum Wiederherstellen');
      return;
    }
    
    this.historyIndex++;
    const entry = this.history[this.historyIndex];
    this.state = entry.newState;
    this.notifyListeners('TIME_TRAVEL_REDO', this.state, entry.oldState);
    
    console.log('⏭️ Redo:', entry.action.type);
  }

  /**
   * 🧹 RESET
   */
  reset(initialState) {
    this.state = initialState;
    this.history = [];
    this.historyIndex = -1;
    this.notifyListeners('STORE_RESET', this.state, {});
    console.log('🧹 Store zurückgesetzt');
  }

  /**
   * 📊 DEBUGGING
   */
  getHistory() {
    return this.history;
  }

  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  importState(jsonState) {
    this.state = JSON.parse(jsonState);
    this.notifyListeners('STORE_IMPORTED', this.state, {});
  }
}

export default Store;
