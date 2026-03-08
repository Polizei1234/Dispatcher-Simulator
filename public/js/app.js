import store from './core/state/index.js';
import { IncidentActions } from './core/state/actions.js';
import IncidentList from './core/components/incidents/IncidentList.js';

// Test Store
store.dispatch({ type: 'GAME_STARTED', payload: { mode: 'free' } });
console.log("Initial game state:", store.getState('game'));

// Add some incidents to the store for testing
store.dispatch(IncidentActions.add({ id: 'I-1', stichwort: 'Brandmeldeanlage' }));
store.dispatch(IncidentActions.add({ id: 'I-2', stichwort: 'Verkehrsunfall' }));

console.log("Incidents in store:", store.getState('incidents'));


// Test Component
const incidentListElement = document.getElementById('incident-list');
if (incidentListElement) {
  const list = new IncidentList();
  list.mount(incidentListElement);
  console.log("IncidentList component mounted.");
} else {
    console.error("Element with id 'incident-list' not found. Can't mount IncidentList component.");
}


// Test Undo/Redo
if (typeof window !== 'undefined' && window.__STORE_DEBUG__) {
  console.log("Testing Undo/Redo...");
  window.__STORE_DEBUG__.undo();
  console.log("After undo, incidents:", store.getState('incidents'));
  window.__STORE_DEBUG__.redo();
  console.log("After redo, incidents:", store.getState('incidents'));
}
