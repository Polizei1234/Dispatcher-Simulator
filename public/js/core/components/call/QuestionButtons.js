/**
 * ❓ QUESTION BUTTONS COMPONENT
 * Displays buttons for asking questions during a call.
 */

import Component from '../base/Component.js';
import { CallActions } from '../../state/actions.js';
import store from '../../state/index.js';

class QuestionButtons extends Component {
  constructor(props = {}) {
    super(props);
  }

  handleQuestionClick(question, answer) {
    store.dispatch(CallActions.askQuestion(this.props.call.activeCall.id, question, answer));
  }

  render() {
    const container = this.createElement('div', { id: 'question-buttons' });

    const questions = {
      "Wo genau ist der Notfallort?": "Hier...",
      "Was ist passiert?": "Es gab einen Unfall.",
      "Wie viele Verletzte gibt es?": "Ich sehe eine Person.",
    };

    Object.entries(questions).forEach(([question, answer]) => {
      const button = this.createElement('button', {
        className: 'btn',
        onclick: () => this.handleQuestionClick(question, answer)
      }, [question]);
      container.appendChild(button);
    });

    return container;
  }
}

export default QuestionButtons;
