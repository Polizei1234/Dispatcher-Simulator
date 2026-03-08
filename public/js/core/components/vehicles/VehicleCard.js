/**
 * 🚗 VEHICLE CARD COMPONENT
 * Displays information about a single vehicle.
 */

import Component from '../base/Component.js';

class VehicleCard extends Component {
  render() {
    const { vehicle, isSelected } = this.props;
    const classes = ['vehicle-card'];
    if (isSelected) {
      classes.push('selected');
    }

    const element = this.createElement('div', {
      className: classes.join(' '),
      onclick: this.props.onSelect
    }, [
      this.createElement('div', { className: 'vehicle-card-header' }, [
        this.createElement('span', {}, vehicle.name),
        this.createElement('span', {}, `Status: ${vehicle.currentStatus}`)
      ]),
      this.createElement('div', { className: 'vehicle-card-body' }, [
        this.createElement('p', {}, `Typ: ${vehicle.type}`),
        this.createElement('p', {}, `Station: ${vehicle.station}`)
      ])
    ]);

    return element;
  }
}

export default VehicleCard;
