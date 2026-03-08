class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.memory = 0;
        this.entities = 0;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.updateInterval = 1000;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => this.update(), this.updateInterval);
    }

    stop() {
        clearInterval(this.intervalId);
    }

    update() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.fps = Math.round(this.frameCount / (delta / 1000));
        this.memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        this.entities = window.stateManager ? window.stateManager.getState().vehicles.length : 0;
        this.frameCount = 0;
        this.lastFrameTime = now;
    }

    tick() {
        this.frameCount++;
    }
}

const performanceMonitor = new PerformanceMonitor();
