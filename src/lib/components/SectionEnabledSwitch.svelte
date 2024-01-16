<script lang="ts">
	import ServiceConfigEnabled from '$lib/api/services/ServiceConfigEnabled';
	import { newSuccessToast, newErrorToast } from '$lib/utilities/UtilStoreToast';
	import { config } from '$lib/store';

	async function onEnabledChange(event: any) {
		await ServiceConfigEnabled.postEnabled(event.target.checked)
			.then(() => {
				newSuccessToast('Enabled state changed: ' + event.target.checked);
			})
			.catch((err) => {
				newErrorToast('Enabled state change error: ' + err.message);
			});
	}
</script>

<div class="p-3 mt-3 rounded-md bg-neutral">
	<p class="text-2xl underline">Enabled</p>
	<div class="flex flex-col items-center">
		<input
			on:change={onEnabledChange}
			bind:checked={$config.Enabled}
			type="checkbox"
			class="toggle-success toggle toggle-lg"
		/>
	</div>
</div>
