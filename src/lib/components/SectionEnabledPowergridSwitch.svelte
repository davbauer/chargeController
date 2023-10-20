<script lang="ts">
	import ServiceEnabledPowergrid from '$lib/api/services/ServiceEnabledPowergrid';
	import { newSuccessToast, newErrorToast } from '$lib/api/Utilities/UtilStoreToast';
	import { config } from '$lib/store';

	async function onEnabledPowergridChange(event: any) {
		await ServiceEnabledPowergrid.postEnabledPowergrid(event.target.checked)
			.then(() => {
				newSuccessToast('Powergrid state changed: ' + event.target.checked);
			})
			.catch((err) => {
				newErrorToast('Powergrid state change error: ' + err.message);
			});
	}
</script>

<div class="mt-3 p-3 bg-neutral rounded-md">
	<p class="text-2xl underline">Use Powergrid</p>
	<div class="flex flex-col items-center">
		<input
			on:change={onEnabledPowergridChange}
			bind:checked={$config.UsePowergrid}
			type="checkbox"
			class="toggle toggle-warning toggle-lg"
		/>
	</div>
</div>
