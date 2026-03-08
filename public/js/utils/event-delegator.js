/**
 * 🎯 EVENT DELEGATOR
 * Efficient Event Handling (Event Delegation Pattern)
 */

class EventDelegator {
  constructor(root = document.body) {
    this.root = root;
    this.handlers = new Map();
    
    console.log('🎯 EventDelegator initialized');
  }

  /**
   * 📌 REGISTER HANDLER
   */
  on(selector, eventType, handler) {
    const key = `${eventType}:${selector}`;
    
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map());
      
      // Attach single listener to root
      this.root.addEventListener(eventType, (e) => {
        this.handleEvent(e, eventType);
      });
    }
    
    const eventHandlers = this.handlers.get(eventType);
    if (!eventHandlers.has(selector)) {
      eventHandlers.set(selector, []);
    }
    
    eventHandlers.get(selector).push(handler);
    
    console.log(`📌 Registered: ${key}`);
  }

  /**
   * 🗑️ REMOVE HANDLER
   */
  off(selector, eventType, handler) {
    if (!this.handlers.has(eventType)) return;
    
    const eventHandlers = this.handlers.get(eventType);
    if (!eventHandlers.has(selector)) return;
    
    const handlers = eventHandlers.get(selector);
    const index = handlers.indexOf(handler);
    
    if (index > -1) {
      handlers.splice(index, 1);
      console.log(`🗑️ Removed handler for: ${eventType}:${selector}`);
    }
  }

  /**
   * 🎯 HANDLE EVENT (Delegation)
   */
  handleEvent(event, eventType) {
    if (!this.handlers.has(eventType)) return;
    
    const eventHandlers = this.handlers.get(eventType);
    
    // Check each selector
    eventHandlers.forEach((handlers, selector) => {
      // Check if event target matches selector
      const target = event.target.closest(selector);
      
      if (target) {
        handlers.forEach(handler => {
          handler.call(target, event, target);
        });
      }
    });
  }

  /**
   * 🧹 CLEANUP
   */
  destroy() {
    this.handlers.clear();
    console.log('🧹 EventDelegator destroyed');
  }
}

// =============================
// SINGLETON INSTANCE
// =============================

const globalDelegator = new EventDelegator();

// =============================
// CONVENIENCE HELPERS
// =============================

export const onClick = (selector, handler) => {
  globalDelegator.on(selector, 'click', handler);
};

export const onChange = (selector, handler) => {
  globalDelegator.on(selector, 'change', handler);
};

export const onSubmit = (selector, handler) => {
  globalDelegator.on(selector, 'submit', handler);
};

export default globalDelegator;
