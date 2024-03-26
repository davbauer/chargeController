<script lang="ts">
	import { newErrorToast, newSuccessToast } from '$lib/utilities/UtilStoreToast';
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

<div class="p-3 mt-3 rounded-md bg-neutral">
	<p class="text-2xl underline">Control</p>

	<div class="flex flex-row items-center justify-around pt-5">
		<button on:click={startCharge} class="w-2/5 btn-lg btn btn-active btn-outline btn-neutral">
			Start Charging
		</button>
		<button on:click={stopCharge} class="w-2/5 btn-lg btn btn-active btn-neutral">
			Stop Charging
		</button>
	</div>
</div>
