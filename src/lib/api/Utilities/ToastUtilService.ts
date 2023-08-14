import { toasts } from '$lib/store';

export function newInfoToast(message: string) {
	addToasts('alert-info', message);
}

export function newSuccessToast(message: string) {
	addToasts('alert-success', message);
}

export function newErrorToast(message: string) {
	addToasts('alert-error', message);
}

function addToasts(alertType: string, message: string) {
	toasts.update((allToasts) => [...allToasts, { alertType, message }]);
	setTimeout(() => {
		toasts.update((allToasts) => {
			if (allToasts.length) {
				return allToasts.slice(1);
			}
			return allToasts;
		});
	}, 4000);
}
