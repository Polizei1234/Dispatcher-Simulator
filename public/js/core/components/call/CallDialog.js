/**
 * 📞 CALL DIALOG COMPONENT
 * Manages the UI for an active call.
 */

import StatefulComponent from '../base/StatefulComponent.js';
import QuestionButtons from './QuestionButtons.js';

class CallDialog extends StatefulComponent {
  constructor(props = {}) {
    const stateSelector = (state) => ({
      call: state.call
    });
    super(props, stateSelector);
  }

  render() {
    const { call } = this.state;
    const container = this.createElement('div', { id: 'call-active' });

    if (!call.activeCall) {
      container.style.display = 'none';
      return container;
    }

    const dialog = this.createElement('div', {}, [
      this.createElement('h3', {}, 'Notruf 112 - Gespräch läuft'),
      this.createElement('div', { id: 'caller-messages' }, [
        // Messages will be rendered here
      ]),
      new QuestionButtons({ call: call })
    ]);

    container.appendChild(dialog);
    return container;
  }
}

export default CallDialog;
