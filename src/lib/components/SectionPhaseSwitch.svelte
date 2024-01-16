<script lang="ts">
	import { newErrorToast, newSuccessToast } from '$lib/utilities/UtilStoreToast';
	import ServiceConfigPreferredPhase from '$lib/api/services/ServiceConfigPreferredPhase';
	import { config } from '$lib/store';

	async function onPreferredPhaseChange() {
		await ServiceConfigPreferredPhase.postEnabled($config.PreferredPhase)
			.then(() => {
				newSuccessToast('Preferred Phase changed: ' + $config.PreferredPhase);
			})
			.catch((err) => {
				newErrorToast('Preferred Phase change error: ' + err.message);
			});
	}
</script>

<div class="p-3 mt-3 rounded-md bg-neutral">
	<p class="text-2xl underline">Preferred Phase</p>
	<div class="flex justify-center">
		<div class="text-center join" on:change={onPreferredPhaseChange}>
			<input
				type="radio"
				bind:group={$config.PreferredPhase}
				value={0}
				name="options"
				aria-label="Auto"
				class="join-item btn"
			/>
			<input
				type="radio"
				bind:group={$config.PreferredPhase}
				value={1}
				name="options"
				aria-label="Phase 1"
				class="join-item btn"
			/>
			<input
				type="radio"
				bind:group={$config.PreferredPhase}
				value={2}
				name="options"
				aria-label="Phase 3"
				class="join-item btn"
			/>
		</div>
	</div>
</div>
