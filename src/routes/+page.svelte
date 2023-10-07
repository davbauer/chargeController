<script lang="ts">
	import { onMount } from 'svelte';
	import SectionEnabledSwitch from '$lib/components/SectionEnabledSwitch.svelte';
	import SectionChargeControl from '$lib/components/SectionChargeControl.svelte';
	import SectionLiveData from '$lib/components/SectionLiveData.svelte';
	import SectionAmpereMapping from '$lib/components/SectionAmpereMapping.svelte';
	import SectionSettings from '$lib/components/SectionSettings.svelte';
	import ServiceWebsocket from '$lib/api/services/ServiceWebsocket';

	onMount(async () => {
		ServiceWebsocket.initSocket();
	});
</script>

<div class="m-3 leading-loose text-lg">
	<SectionEnabledSwitch />

	<SectionChargeControl />

	<SectionLiveData />

	<div class="mt-3 p-3 bg-neutral rounded-md flex flex-col md:flex-row">
		<SectionAmpereMapping />

		<SectionSettings />
	</div>
</div>
