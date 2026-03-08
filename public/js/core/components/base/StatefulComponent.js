/**
 * 🔗 STATEFUL COMPONENT
 * Store-Connected Component (wie Redux connect!)
 */

import Component from './Component.js';
import store from '../../state/index.js';

class StatefulComponent extends Component {
  constructor(props = {}, stateSelector = null) {
    super(props);
    
    this.stateSelector = stateSelector || (() => ({}));
    this.state = this.stateSelector(store.getState());
    this._unsubscribe = null;
  }

  /**
   * 🔌 CONNECT TO STORE
   */
  afterMount() {
    super.afterMount();
    
    // Subscribe to store
    this._unsubscribe = store.subscribe('*', (newState, oldState, actionType) => {
      const newMappedState = this.stateSelector(newState);
      const oldMappedState = this.stateSelector(oldState);
      
      // Check if relevant state changed
      if (JSON.stringify(newMappedState) !== JSON.stringify(oldMappedState)) {
        this.state = newMappedState;
        this.onStateChanged(newMappedState, oldMappedState, actionType);
      }
    });
    
    console.log('🔌 Component connected to store');
  }

  /**
   * 🗑️ DISCONNECT FROM STORE
   */
  beforeUnmount() {
    super.beforeUnmount();
    
    if (this._unsubscribe) {
      this._unsubscribe();
      console.log('🔌 Component disconnected from store');
    }
  }

  /**
   * 🎣 STATE CHANGED HOOK
   */
  onStateChanged(newState, oldState, actionType) {
    // Override in subclass
    // Default: re-render
    this.update();
  }

  /**
   * 🎬 DISPATCH ACTION
   */
  dispatch(action) {
    store.dispatch(action);
  }

  /**
   * 📖 GET STORE STATE
   */
  getStoreState(path = null) {
    return store.getState(path);
  }
}

export default StatefulComponent;
