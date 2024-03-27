<script lang="ts">
	import { newErrorToast, newSuccessToast } from '$lib/utilities/UtilStoreToast';
	import { config } from '$lib/store';
	import ServiceConfigMode from '$lib/api/services/ServiceConfigMode';
	import IconZzz from '$lib/icons/tabler-icons/IconZzz.svelte';
	import IconPower from '$lib/icons/tabler-icons/IconPower.svelte';
	import IconSunHigh from '$lib/icons/tabler-icons/IconSunHigh.svelte';
	import IconBatteryCharging from '$lib/icons/tabler-icons/IconBatteryCharging.svelte';
	import type Config from '$lib/models/Config';

	async function onModeChange(mode: Config['Mode']) {
		$config.Mode = mode;
		await ServiceConfigMode.postMode(mode)
			.then(() => {
				newSuccessToast('Mode changed: ' + mode);
			})
			.catch((err) => {
				newErrorToast('Mode change error: ' + err.message);
			});
	}
</script>

<div class="p-3 mt-3 rounded-md bg-neutral">
	<p class="text-2xl underline">Mode</p>
	<div class="flex justify-center">
		<div class="text-center join">
			<button
				data-tip="Force Off"
				class="join-item btn tooltip"
				on:click={() => onModeChange('force_off')}
				class:btn-active={$config.Mode === 'force_off'}
				class:btn-primary={$config.Mode === 'force_off'}
			>
				<IconPower />
			</button>
			<button
				data-tip="Sleep"
				class="join-item btn tooltip"
				on:click={() => onModeChange('sleep')}
				class:btn-active={$config.Mode === 'sleep'}
				class:btn-primary={$config.Mode === 'sleep'}
			>
				<IconZzz />
			</button>
			<button
				data-tip="Sun"
				class="join-item btn tooltip"
				on:click={() => onModeChange('sun')}
				class:btn-active={$config.Mode === 'sun'}
				class:btn-primary={$config.Mode === 'sun'}
			>
				<IconSunHigh />
			</button>
			<button
				data-tip="Sun+Force"
				class="join-item btn tooltip"
				on:click={() => onModeChange('sun_force')}
				class:btn-active={$config.Mode === 'sun_force'}
				class:btn-primary={$config.Mode === 'sun_force'}
			>
				<IconBatteryCharging />
			</button>
		</div>
	</div>
</div>
