import infoLog from '../functions/infoLog.js';
import ConfigFile from './ConfigFile.js';

export default class LoopHandler {
	static currentCheckSeconds: number | null = null;
	static loopTimeout: null | NodeJS.Timeout = null;
	static configMonitor = null;
	static lastLoopTimestamp: null | number = null;
	static MIN_LOOP_DELAY = 3000; // 3 seconds

	static loopTick(callback: () => void) {
		const config = ConfigFile.read();
		callback();

		LoopHandler.currentCheckSeconds = config.CheckSeconds;
		LoopHandler.lastLoopTimestamp = Date.now();
		LoopHandler.startLoop(callback);
	}

	static startLoop(callback: () => void) {
		if (LoopHandler.loopTimeout) {
			clearTimeout(LoopHandler.loopTimeout);
		}

		const config = ConfigFile.read();
		LoopHandler.loopTimeout = setTimeout(
			() => LoopHandler.loopTick(callback),
			config.CheckSeconds * 1000
		);
	}

	static stopLoop() {
		if (LoopHandler.loopTimeout) {
			clearTimeout(LoopHandler.loopTimeout);
			LoopHandler.loopTimeout = null;
		}
	}

	static updateLoop(callback: () => void) {
		const config = ConfigFile.read();

		if (LoopHandler.currentCheckSeconds !== config.CheckSeconds) {
			infoLog('Configuration change detected.');
			LoopHandler.stopLoop();

			if (LoopHandler.lastLoopTimestamp) {
				const timeSinceLastLoop = Date.now() - LoopHandler.lastLoopTimestamp;

				// If the last loop was less than 3 seconds ago, delay the immediate execution.
				if (timeSinceLastLoop < LoopHandler.MIN_LOOP_DELAY) {
					const delay = LoopHandler.MIN_LOOP_DELAY - timeSinceLastLoop;
					setTimeout(() => {
						callback(); // Run the loop after the delay.
						LoopHandler.startLoop(callback);
					}, delay);
					return;
				}
			}

			callback(); // Run the loop immediately.

			LoopHandler.startLoop(callback);
		}
	}
}
