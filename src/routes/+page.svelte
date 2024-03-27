<script lang="ts">
	import SectionChargeControl from '$lib/components/SectionChargeControl.svelte';
	import SectionLiveData from '$lib/components/SectionLiveData.svelte';
	import SectionAmpereMapping from '$lib/components/SectionAmpereMapping.svelte';
	import SectionSettings from '$lib/components/SectionSettings.svelte';
	import SectionPhaseSwitch from '$lib/components/SectionPhaseSwitch.svelte';
	import SectionModeSwitch from '$lib/components/SectionModeSwitch.svelte';
</script>

<div class="m-3 text-lg leading-loose">
	<SectionModeSwitch />

	<SectionPhaseSwitch />

	<SectionChargeControl />

	<SectionLiveData />

	<div class="flex flex-col p-3 mx-auto mt-3 rounded-md bg-neutral md:flex-row">
		<SectionSettings />

		<SectionAmpereMapping />
	</div>
</div>
