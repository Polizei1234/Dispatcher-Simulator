class StateManager {
    constructor() {
        this.state = {};
        this.initialState = {};
    }

    initialize(initialState) {
        this.state = JSON.parse(JSON.stringify(initialState));
        this.initialState = JSON.parse(JSON.stringify(initialState));
    }

    getState() {
        return this.state;
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
    }

    resetState() {
        this.state = JSON.parse(JSON.stringify(this.initialState));
    }
}

const stateManager = new StateManager();
