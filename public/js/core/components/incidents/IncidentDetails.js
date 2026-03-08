/**
 * 📋 INCIDENT DETAILS COMPONENT
 * Displays details for the selected incident.
 */

import StatefulComponent from '../base/StatefulComponent.js';

class IncidentDetails extends StatefulComponent {
  constructor(props = {}) {
    const stateSelector = (state) => {
      const selectedId = state.ui.selectedIncident;
      return {
        incident: selectedId ? state.incidents.get(selectedId) : null
      };
    };
    
    super(props, stateSelector);
  }

  render() {
    const container = this.createElement('div', {
      className: 'panel-content',
      id: 'incident-details'
    });

    if (!this.state.incident) {
      const noData = this.createElement('p', { className: 'no-data' }, ['Wählen Sie einen Einsatz aus']);
      container.appendChild(noData);
      return container;
    }

    const { id, stichwort, position, status, assignedVehicles } = this.state.incident;

    const title = this.createElement('h4', {}, [`Einsatz: ${id}`]);
    const keyword = this.createElement('p', {}, [`Stichwort: ${stichwort}`]);
    const location = this.createElement('p', {}, [`Ort: ${position?.lat || 'N/A'}, ${position?.lng || 'N/A'}`]);
    const statusEl = this.createElement('p', {}, [`Status: ${status}`]);
    const vehiclesTitle = this.createElement('h5', { style: { marginTop: '15px' }}, ['Disponierte Fahrzeuge']);
    
    container.appendChild(title);
    container.appendChild(keyword);
    container.appendChild(location);
    container.appendChild(statusEl);
    container.appendChild(vehiclesTitle);

    if (assignedVehicles && assignedVehicles.length > 0) {
      const vehicleList = this.createElement('ul', { style: { listStyle: 'none', padding: 0 }});
      assignedVehicles.forEach(vehicleId => {
        const vehicleItem = this.createElement('li', {}, [vehicleId]);
        vehicleList.appendChild(vehicleItem);
      });
      container.appendChild(vehicleList);
    } else {
      const noVehicles = this.createElement('p', {}, ['Keine Fahrzeuge disponiert.']);
      container.appendChild(noVehicles);
    }

    return container;
  }
}

export default IncidentDetails;
