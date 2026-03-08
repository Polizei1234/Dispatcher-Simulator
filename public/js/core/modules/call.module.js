/**
 * 📞 CALL MODULE
 * Manages incoming calls and the conversation flow.
 */

import store from '../state/index.js';
import { CallActions } from '../state/actions.js';

class CallModule {
  constructor() {
    console.log('📞 CallModule initialized');
  }

  /**
   * 📞 GENERATE INCOMING CALL
   */
  generateIncomingCall() {
    // This will be replaced by the new conversation engine
    const callData = {
      id: `call_${Date.now()}`,
      caller: 'Unknown',
      message: 'Mayday! Mayday!'
    };

    store.dispatch(CallActions.incoming(callData));
  }

  /**
   * ✅ ANSWER CALL
   */
  answerCall(callId) {
    store.dispatch(CallActions.answer(callId));
  }

  /**
   * 📴 HANG UP
   */
  hangUp(callId) {
    store.dispatch(CallActions.hangUp(callId));
  }
}

const callModule = new CallModule();
export default callModule;
