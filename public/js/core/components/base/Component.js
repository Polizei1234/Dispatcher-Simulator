/**
 * 🧩 BASE COMPONENT
 * React-Style Component für Vanilla JS
 */

class Component {
  constructor(props = {}) {
    this.props = props;
    this.element = null;
    this.children = [];
    this._mounted = false;
    
    // Bind methods
    this.render = this.render.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * 🎨 RENDER (Override in subclass!)
   */
  render() {
    throw new Error('Component must implement render() method');
  }

  /**
   * 📦 MOUNT
   */
  mount(container) {
    if (this._mounted) {
      console.warn('⚠️ Component already mounted');
      return;
    }
    
    this.beforeMount();
    
    // Render component
    this.element = this.render();
    
    // Append to container
    if (container) {
      container.appendChild(this.element);
    }
    
    this._mounted = true;
    this.afterMount();
    
    return this.element;
  }

  /**
   * 🗑️ UNMOUNT
   */
  unmount() {
    if (!this._mounted) return;
    
    this.beforeUnmount();
    
    // Unmount children first
    this.children.forEach(child => child.unmount());
    
    // Remove from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this._mounted = false;
    this.afterUnmount();
  }

  /**
   * 🔄 UPDATE (Re-render)
   */
  update(newProps = {}) {
    if (!this._mounted) return;
    
    this.beforeUpdate(this.props, newProps);
    
    const oldElement = this.element;
    this.props = { ...this.props, ...newProps };
    this.element = this.render();
    
    // Replace in DOM
    if (oldElement && oldElement.parentNode) {
      oldElement.parentNode.replaceChild(this.element, oldElement);
    }
    
    this.afterUpdate();
  }

  /**
   * 🎣 LIFECYCLE HOOKS
   */
  beforeMount() {}
  afterMount() {}
  beforeUpdate(oldProps, newProps) {}
  afterUpdate() {}
  beforeUnmount() {}
  afterUnmount() {}

  /**
   * 🛠️ HELPERS
   */
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on')) {
        // Event listener
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Append children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else if (child instanceof Component) {
        this.children.push(child);
        element.appendChild(child.mount());
      }
    });
    
    return element;
  }

  /**
   * 🔍 QUERY
   */
  $(selector) {
    return this.element?.querySelector(selector);
  }

  $$(selector) {
    return Array.from(this.element?.querySelectorAll(selector) || []);
  }
}

export default Component;
