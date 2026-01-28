/**
 * ==============================================
 * DISPATCHER SIMULATOR - MAIN BUNDLE v6.2.0
 * Entry Point für Webpack Build System
 * ==============================================
 */

// 📄 VERSION CONFIG (muss zuerst geladen werden)
import '../js/core/version-config.js';

// ⚙️ CORE MODULES
import './core/config.js';
import './core/incident-manager.js';
import './core/game.js';
import './core/main.js';
import './core/bridge.js';

// 📊 DATA
import './data/hospitals.js';
import './data/incidents.js';
import './data/data.js';

// 🛠️ UTILS
import './utils/settings-manager.js';
import './utils/location-generator.js';
import './utils/incident-numbering.js';
import './utils/vehicle-analyzer.js';
import './utils/address-service.js';
import './utils/notification-system.js';
import './utils/scoring-system.js';
import './utils/tutorial.js';
import './utils/debug-menu.js';

// 🎮 SYSTEMS
import './systems/weather-system.js';
import './systems/ai-incident-generator.js';
import './systems/mission-timer.js';
import './systems/escalation-system.js';
import './systems/groq-validator.js';
import './systems/call-system.js';
import './systems/vehicle-movement.js';

// 📺 UI MODULES
import './ui/ui-helpers.js';
import './ui/priority-dropdown.js';
import './ui/universal-dropdown.js';
import './ui/keywords-dropdown.js';
import './ui/protocol-form.js';
import './ui/assignment-ui.js';
import './ui/manual-incident.js';
import './ui/tabs.js';
import './ui/ui.js';
import './ui/draggable.js';
import './ui/ui-radio.js';

// 🗺️ MAP & AI
import './map.js';
import './ai.js';

console.log('✅ Main Bundle v6.2.0 geladen - Alle Module importiert');
