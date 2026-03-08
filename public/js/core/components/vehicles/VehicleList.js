/**
 * 🚗 VEHICLE LIST COMPONENT
 * Displays a list of all vehicles and their status.
 */

import StatefulComponent from '../base/StatefulComponent.js';
import VehicleCard from './VehicleCard.js';

class VehicleList extends StatefulComponent {
  constructor(props = {}) {
    const stateSelector = (state) => ({
      vehicles: Array.from(state.vehicles.values()),
      selectedVehicle: state.ui.selectedVehicle
    });
    
    super(props, stateSelector);
  }

  render() {
    const container = this.createElement('div', {
      className: 'vehicles-overview',
      id: 'vehicles-overview'
    });

    if (this.state.vehicles.length === 0) {
      const noData = this.createElement('p', {}, ['Keine Fahrzeuge verfügbar.']);
      container.appendChild(noData);
      return container;
    }

    this.state.vehicles.forEach(vehicle => {
      const card = new VehicleCard({
        vehicle,
        isSelected: vehicle.id === this.state.selectedVehicle
      });
      container.appendChild(card.mount());
    });

    return container;
  }
}

export default VehicleList;
