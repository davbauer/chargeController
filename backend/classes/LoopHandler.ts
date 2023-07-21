import ConfigFile from "./ConfigFile.js";

export default class LoopHandler {
    currentCheckSeconds: number | null = null;
    loopTimeout: NodeJS.Timeout | null = null;
    configMonitor: NodeJS.Timeout | null = null;
    lastLoopTimestamp: number | null = null;
    MIN_LOOP_DELAY = 3000; // 3 seconds

    loopTick(callback: () => void): void {
        const config = ConfigFile.read();

        if (config.Enabled) {
            callback();
        }

        this.currentCheckSeconds = config.CheckSeconds;
        this.lastLoopTimestamp = Date.now();
        this.startLoop(callback);
    }

    startLoop(callback: () => void): void {
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
        }

        const config = ConfigFile.read();
        this.loopTimeout = setTimeout(() => this.loopTick(callback), config.CheckSeconds * 1000);
    }

    stopLoop(): void {
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }
    }

    updateLoop(callback: () => void): void {
        const config = ConfigFile.read();

        if (this.currentCheckSeconds !== config.CheckSeconds) {
            console.log("Configuration change detected.");
            this.stopLoop();

            if (this.lastLoopTimestamp) {
                const timeSinceLastLoop = Date.now() - this.lastLoopTimestamp;

                // If the last loop was less than 3 seconds ago, delay the immediate execution.
                if (timeSinceLastLoop < this.MIN_LOOP_DELAY) {
                    const delay = this.MIN_LOOP_DELAY - timeSinceLastLoop;
                    setTimeout(() => {
                        if (config.Enabled) {
                            callback(); // Run the loop after the delay.
                        }
                        this.startLoop(callback);
                    }, delay);
                    return;
                }
            }

            if (config.Enabled) {
                callback(); // Run the loop immediately.
            }

            this.startLoop(callback);
        }
    }
}
