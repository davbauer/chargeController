<script lang="ts">
	import '../app.css';
	import { appInfo, config, toasts } from '$lib/store';
	import Toast from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import ServiceAppInfo from '$lib/api/services/ServiceAppInfo';
	import { newErrorToast, newSuccessToast } from '$lib/utilities/UtilStoreToast';
	import ServiceConfig from '$lib/api/services/ServiceConfig';
	import { dev } from '$app/environment';
	import BackendTerminalWindow from '$lib/components/SectionBackendTerminal.svelte';
	import SectionBackendTerminal from '$lib/components/SectionBackendTerminal.svelte';
	import moment from 'moment';

	let initApplication: 'ERROR' | 'SUCCESS' | 'LOADING' = 'LOADING';

	onMount(() => {
		Promise.all([ServiceAppInfo.getAppInfo(), ServiceConfig.getConfig()])
			.then(([appInfoResponse, configResponse]) => {
				appInfo.set(appInfoResponse);
				console.log(JSON.stringify(configResponse, null, 2));
				config.set(configResponse);
				newSuccessToast('Loaded app info and config');
				initApplication = 'SUCCESS';
			})
			.catch((_error) => {
				newErrorToast('Error loading app info or config');
				initApplication = 'ERROR';
			});
	});

	function formatUptime(uptimeSeconds: number): string {
		const duration = moment.duration(uptimeSeconds, 'seconds');
		return [
			...(duration.years() > 0 ? [`${duration.years()}y`] : []),
			...(duration.months() > 0 || duration.years() > 0 ? [`${duration.months()}mo`] : []),
			...(duration.days() > 0 || duration.months() > 0 ? [`${duration.days()}d`] : []),
			...(duration.hours() > 0 || duration.days() > 0 ? [`${duration.hours()}h`] : []),
			...(duration.minutes() > 0 || duration.hours() > 0 ? [`${duration.minutes()}m`] : []),
			`${duration.seconds()}s`
		].join(' ');
	}
</script>

<svelte:head>
	<title>{dev ? 'DEBUG-' : ''}chargeController</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	{#if initApplication === 'SUCCESS'}
		<div class="flex items-center justify-center w-full navbar bg-neutral">
			<p class="font-mono text-xl">
				{dev ? 'DEBUG-' : ''}chargeController
			</p>
			<span class="ml-10">
				<BackendTerminalWindow />
			</span>
		</div>

		<div class="flex-grow">
			<div class="md:container md:mx-auto">
				<slot />
			</div>
		</div>
		<footer class="p-4 footer footer-center bg-neutral text-base-content">
			<div class="font-mono align-baseline text-l">
				<!-- Only works in production not in dev!!-->
				<button class="underline" on:click={() => (window.location.href = '/api-docs')}
					>/api-docs</button
				>
				<a class="underline" href="https://github.com/davbauer">github/davbauer</a>

				<p class="text-gray-500">
					Branch: {$appInfo.gitBranchName}
				</p>
				<p class="text-gray-500">
					CommitId: {$appInfo.gitCommitId}
				</p>
				<p class="text-gray-500">
					Uptime:
					{#if $appInfo.uptime === -1}
						/
					{:else}
						{formatUptime($appInfo.uptime)}
					{/if}
				</p>
			</div>
		</footer>
	{:else if initApplication === 'ERROR' || initApplication === 'LOADING'}
		<div class="flex flex-col items-center justify-center min-h-screen">
			{#if initApplication === 'ERROR'}
				<p class="mb-10 text-3xl">Connection to backend failed</p>
				<button class="btn btn-lg btn-error" on:click={() => window.location.reload()}
					>Retry again</button
				>
			{:else}
				<span class="w-24 h-24 loading loading-spinner text-primary" />
			{/if}
		</div>
		<SectionBackendTerminal />
	{/if}
</div>
<div class="toast toast-end">
	{#each $toasts as toast}
		<Toast alertType={toast.alertType} message={toast.message} />
	{/each}
</div>
