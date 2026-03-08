/**
 * 🖼️ UI MODULE
 * Manages all UI-related logic and components.
 */

import store from '../state/index.js';
import { UIActions } from '../state/actions.js';
import IncidentList from '../components/incidents/IncidentList.js';
import IncidentDetails from '../components/incidents/IncidentDetails.js';
import VehicleList from '../components/vehicles/VehicleList.js';
import CallDialog from '../components/call/CallDialog.js';

class UIModule {
  constructor() {
    this.components = {};
    console.log('🖼️ UIModule initialized');
  }

  /**
   * 🎨 INITIALIZE UI
   */
  initialize() {
    console.log('🎨 Initializing UI components...');

    this.mountComponents();
    this.registerEventListeners();
  }

  mountComponents() {
    this.components.incidentList = new IncidentList();
    this.components.incidentList.mount(document.getElementById('incident-list-container'));

    this.components.incidentDetails = new IncidentDetails();
    this.components.incidentDetails.mount(document.getElementById('incident-details-container'));

    this.components.vehicleList = new VehicleList();
    this.components.vehicleList.mount(document.getElementById('vehicle-list-container'));

    this.components.callDialog = new CallDialog();
    this.components.callDialog.mount(document.getElementById('call-dialog-container'));
  }

  registerEventListeners() {
    // Example of using the event delegator
    // import { onClick } from '../../utils/event-delegator.js';
    //
    // onClick('.some-button', (event) => {
    //   console.log('Button clicked!', event.target);
    // });
  }
}

const uiModule = new UIModule();
export default uiModule;
