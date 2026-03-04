/**
 * Startup Sequence Tester
 * Überprüft ob alle kritischen Module geladen sind
 */
window.StartupTest = {
    requiredModules: [
        'VERSION_CONFIG',
        'GameConfig',
        'IncidentManager',
        'eventBridge',
        'MapSystem',
        'UI',
        'VehicleMovement',
        'SettingsManager',
        'GameTimer',
        'WeatherSystem'
    ],
    
    test() {
        console.log('🧪 Running Startup Tests...');
        console.log('═══════════════════════════════════');
        
        const results = this.requiredModules.map(moduleName => {
            const exists = window[moduleName] !== undefined;
            const status = exists ? '✅' : '❌';
            console.log(`${status} ${moduleName}: ${exists ? 'LOADED' : 'MISSING'}`);
            return { moduleName, exists };
        });
        
        console.log('═══════════════════════════════════');
        
        const allPassed = results.every(r => r.exists);
        
        if (allPassed) {
            console.log('✅ ALL STARTUP TESTS PASSED');
            return true;
        } else {
            const missing = results.filter(r => !r.exists).map(r => r.moduleName);
            console.error('❌ STARTUP TESTS FAILED');
            console.error('Missing modules:', missing);
            
            if (typeof showCriticalError === 'function') {
                showCriticalError(`Module fehlen: ${missing.join(', ')}`);
            }
            return false;
        }
    }
};

// Auto-Test nach allScriptsLoaded Event
window.addEventListener('allScriptsLoaded', () => {
    setTimeout(() => {
        window.StartupTest.test();
    }, 500); // Kurz warten damit alle Module sich registrieren können
});

console.log('✅ Startup Test Modul geladen');
