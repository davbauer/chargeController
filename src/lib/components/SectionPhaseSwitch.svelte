<script lang="ts">
	import { newErrorToast, newSuccessToast } from '$lib/utilities/UtilStoreToast';
	import ServiceConfigPreferredPhase from '$lib/api/services/ServiceConfigPreferredPhase';
	import { config } from '$lib/store';
	import type Config from '$lib/models/Config';
	import IconSwitch2 from '$lib/icons/tabler-icons/IconSwitch2.svelte';
	import IconNumber1 from '$lib/icons/tabler-icons/IconNumber1.svelte';
	import IconNumber3 from '$lib/icons/tabler-icons/IconNumber3.svelte';

	async function onPreferredPhaseChange(phase: Config['PreferredPhase']) {
		$config.PreferredPhase = phase;
		await ServiceConfigPreferredPhase.postPreferredPhase(phase)
			.then(() => {
				newSuccessToast('Preferred Phase changed: ' + phase);
			})
			.catch((err) => {
				newErrorToast('Preferred Phase change error: ' + err.message);
			});
	}
</script>

<div class="p-3 mt-3 rounded-md bg-neutral">
	<p class="text-2xl underline">Preferred Phase</p>
	<div class="flex justify-center">
		<div class="text-center join">
			<button
				on:click={() => onPreferredPhaseChange(0)}
				class="join-item btn"
				class:btn-active={$config.PreferredPhase === 0}
				class:btn-info={$config.PreferredPhase === 0}
			>
				<IconSwitch2 />
			</button>
			<button
				on:click={() => onPreferredPhaseChange(1)}
				class="join-item btn"
				class:btn-active={$config.PreferredPhase === 1}
				class:btn-info={$config.PreferredPhase === 1}
			>
				<IconNumber1 />
			</button>
			<button
				on:click={() => onPreferredPhaseChange(2)}
				class="join-item btn"
				class:btn-active={$config.PreferredPhase === 2}
				class:btn-info={$config.PreferredPhase === 2}
			>
				<IconNumber3 />
			</button>
		</div>
	</div>
</div>
