/**
 * 📋 INCIDENT LIST COMPONENT
 * Framework-Ready UI Component
 */

import StatefulComponent from '../base/StatefulComponent.js';
import IncidentItem from './IncidentItem.js';
import { UIActions } from '../../state/actions.js';

class IncidentList extends StatefulComponent {
  constructor(props = {}) {
    // State selector: Map store state to component state
    const stateSelector = (state) => ({
      incidents: Array.from(state.incidents.values())
        .filter(i => i.status !== 'completed' && i.status !== 'cancelled'),
      selectedIncident: state.ui.selectedIncident
    });
    
    super(props, stateSelector);
    
    this.incidentComponents = [];
  }

  /**
   * 🎨 RENDER
   */
  render() {
    const container = this.createElement('div', {
      className: 'incident-list-container',
      style: { height: '100%', overflowY: 'auto' }
    });

    // Header
    const header = this.createElement('div', {
      className: 'panel-header'
    }, [
      this.createElement('h3', {}, [
        '🚨 Aktive Einsätze'
      ]),
      this.createElement('span', {
        className: 'badge',
        id: 'incident-count'
      }, [
        String(this.state.incidents.length)
      ])
    ]);

    container.appendChild(header);

    // Content
    const content = this.createElement('div', {
      className: 'panel-content',
      style: { padding: '10px' }
    });

    // No incidents message
    if (this.state.incidents.length === 0) {
      const noData = this.createElement('p', {
        className: 'no-data'
      }, ['Keine aktiven Einsätze']);
      
      content.appendChild(noData);
    } else {
      // Render incident items
      this.incidentComponents = this.state.incidents.map(incident => {
        const item = new IncidentItem({
          incident,
          isSelected: incident.id === this.state.selectedIncident,
          onSelect: () => this.handleIncidentSelect(incident.id)
        });
        
        return item;
      });

      this.incidentComponents.forEach(comp => {
        content.appendChild(comp.mount());
      });
    }

    container.appendChild(content);
    return container;
  }

  /**
   * 🖱️ HANDLE INCIDENT SELECT
   */
  handleIncidentSelect(incidentId) {
    this.dispatch(UIActions.selectIncident(incidentId));
  }

  /**
   * 🔄 ON STATE CHANGED
   */
  onStateChanged(newState, oldState, actionType) {
    // Only re-render if incidents changed
    if (newState.incidents.length !== oldState.incidents.length ||
        newState.selectedIncident !== oldState.selectedIncident) {
      
      // Unmount old incident components
      this.incidentComponents.forEach(comp => comp.unmount());
      
      // Re-render
      this.update();
    }
  }

  /**
   * 🗑️ CLEANUP
   */
  beforeUnmount() {
    super.beforeUnmount();
    this.incidentComponents.forEach(comp => comp.unmount());
  }
}

export default IncidentList;
