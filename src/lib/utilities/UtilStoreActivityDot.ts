import type SignalState from '$lib/api/models/SignalState';
import { activitySignal } from '$lib/store';
import { writable } from 'svelte/store';

const ACTIVITY_DURATION = 1400;

export function sendActivitySignal(signalType: string) {
	activitySignal.update((current: SignalState) => {
		const timestamp = new Date().getTime();
		return { ...current, [signalType]: timestamp };
	});
}

export function getDerivedSignal(signalType: string) {
	const activeSignal = writable(false);
	let timeoutId: NodeJS.Timeout | null = null;

	const unsubscribe = activitySignal.subscribe(($activitySignal) => {
		if (
			$activitySignal[signalType] &&
			new Date().getTime() - $activitySignal[signalType] < ACTIVITY_DURATION
		) {
			activeSignal.set(true);

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				activeSignal.set(false);
				timeoutId = null;
			}, ACTIVITY_DURATION);
		}
	});

	return {
		subscribe: activeSignal.subscribe,
		unsubscribe: () => {
			unsubscribe();
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}
	};
}
