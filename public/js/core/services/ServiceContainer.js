/**
 * 💉 SERVICE CONTAINER
 * Dependency Injection für bessere Testbarkeit
 */
import store from '../state/index.js';
import eventBridge from '../event-bridge.js';
import GameService from './GameService.js';
import IncidentService from './IncidentService.js';
import VehicleService from './VehicleService.js';

class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    
    console.log('💉 ServiceContainer initialized');
  }

  /**
   * 📝 REGISTER SERVICE
   */
  register(name, factory, singleton = true) {
    if (singleton) {
      // Create instance immediately
      this.services.set(name, factory(this));
      console.log(`📝 Registered singleton: ${name}`);
    } else {
      // Store factory for later
      this.factories.set(name, factory);
      console.log(`📝 Registered factory: ${name}`);
    }
  }

  /**
   * 📦 GET SERVICE
   */
  get(name) {
    // Check if singleton exists
    if (this.services.has(name)) {
      return this.services.get(name);
    }
    
    // Check if factory exists
    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      // For non-singletons, create a new instance each time
      const service = factory(this);
      // If it was supposed to be a singleton, cache it now.
      // This logic assumes if it's not pre-instantiated, it's a singleton on first get.
      // The original `register` logic with `singleton=true` already handles instantiation.
      // This part handles lazy singletons if we decide to implement them.
      // For now, let's stick to the original plan: singletons are created upfront.
      return service;
    }
    
    throw new Error(`Service not found: ${name}`);
  }

  /**
   * ❓ HAS SERVICE
   */
  has(name) {
    return this.services.has(name) || this.factories.has(name);
  }
}

// =============================
// GLOBAL CONTAINER
// =============================

const container = new ServiceContainer();

// =============================
// REGISTER CORE SERVICES
// =============================

// Store
container.register('store', () => store);

// EventBridge
container.register('eventBridge', () => eventBridge);

// Game Service
container.register('game', (c) => GameService(c.get('store'), c.get('eventBridge')));

// Incident Service
container.register('incidents', (c) => IncidentService(c.get('store')));

// Vehicle Service
container.register('vehicles', (c) => VehicleService(c.get('store')));

export default container;
