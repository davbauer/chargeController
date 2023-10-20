<script lang="ts">
	import ServiceEnabled from '$lib/api/services/ServiceEnabled';
	import { newSuccessToast, newErrorToast } from '$lib/api/Utilities/UtilStoreToast';
	import { config } from '$lib/store';

	async function onEnabledChange(event: any) {
		await ServiceEnabled.postEnabled(event.target.checked)
			.then(() => {
				newSuccessToast('Enabled state changed: ' + event.target.checked);
			})
			.catch((err) => {
				newErrorToast('Enabled state change error: ' + err.message);
			});
	}
</script>

<div class="mt-3 p-3 bg-neutral rounded-md">
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
