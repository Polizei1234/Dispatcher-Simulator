import Component from '../base/Component.js';

class IncidentItem extends Component {
  render() {
    const { incident, isSelected, onSelect } = this.props;

    return this.createElement('div',
      {
        className: `incident-item ${isSelected ? 'selected' : ''}`,
        onClick: onSelect
      },
      [
        this.createElement('p', {}, incident.id),
      ]
    );
  }
}

export default IncidentItem;
