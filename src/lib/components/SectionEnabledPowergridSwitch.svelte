<script lang="ts">
	import ServiceConfigEnabledPowergrid from '$lib/api/services/ServiceConfigEnabledPowergrid';
	import { newSuccessToast, newErrorToast } from '$lib/utilities/UtilStoreToast';
	import { config } from '$lib/store';

	async function onEnabledPowergridChange(event: any) {
		await ServiceConfigEnabledPowergrid.postEnabledPowergrid(event.target.checked)
			.then(() => {
				newSuccessToast('Powergrid state changed: ' + event.target.checked);
			})
			.catch((err) => {
				newErrorToast('Powergrid state change error: ' + err.message);
			});
	}
</script>

<div class="p-3 mt-3 rounded-md bg-neutral">
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
