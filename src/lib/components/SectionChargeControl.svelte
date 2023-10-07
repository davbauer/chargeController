<script lang="ts">
	import { newErrorToast, newSuccessToast } from '$lib/api/Utilities/UtilStoreToast';
	import ServiceChargeControl from '$lib/api/services/ServiceChargeControl';

	async function startCharge() {
		await ServiceChargeControl.chargeStart()
			.then(() => {
				newSuccessToast('Started charging');
			})
			.catch((err) => {
				newErrorToast('Error starting charging: ' + err.message);
			});
	}
	async function stopCharge() {
		await ServiceChargeControl.chargeStop()
			.then(() => {
				newSuccessToast('Stopped charging');
			})
			.catch((err) => {
				newErrorToast('Error stopping charging: ' + err.message);
			});
	}
</script>

<div class="mt-3 p-3 bg-neutral rounded-md">
	<p class="text-2xl underline">Control</p>

	<div class="flex flex-row items-center justify-around pt-5">
		<button on:click={startCharge} class="btn-lg w-2/5 btn btn-active btn-secondary">
			Start Charging
		</button>
		<button on:click={stopCharge} class="btn-lg w-2/5 btn btn-active btn-neutral">
			Stop Charging
		</button>
	</div>
</div>
