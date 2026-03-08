/**
 * ==============================================
 * DISPATCHER SIMULATOR - MAIN BUNDLE v6.2.0
 * Entry Point für Webpack Build System
 * ==============================================
 */

// 📄 VERSION CONFIG (muss zuerst geladen werden)
import './core/version-config.js';

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
import './systems/notification-system.js'; // FIX: Moved from utils
import './utils/scoring-system.js';
import './utils/tutorial.js';
import './systems/debug-menu.js'; // FIX: Moved from utils

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
import './ui/radio-panel.js'; // FIX: Renamed from ui-radio.js

// 🗺️ MAP & AI
import './systems/map.js'; // FIX: Moved from root
import './systems/ai.js'; // FIX: Moved from root

console.log('✅ Main Bundle v6.2.0 geladen - Alle Module importiert');
