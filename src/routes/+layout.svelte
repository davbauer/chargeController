<script lang="ts">
	import '../app.css';
	import { appInfo, config, toasts } from '$lib/store';
	import Toast from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import ServiceAppInfo from '$lib/api/services/ServiceAppInfo';
	import { newErrorToast, newSuccessToast } from '$lib/api/Utilities/UtilStoreToast';
	import ServiceConfig from '$lib/api/services/ServiceConfig';
	import { dev } from '$app/environment';

	let initApplication: 'ERROR' | 'SUCCESS' | 'LOADING' = 'LOADING';

	onMount(() => {
		Promise.all([ServiceAppInfo.getAppInfo(), ServiceConfig.getConfig()])
			.then(([appInfoResponse, configResponse]) => {
				appInfo.set(appInfoResponse);
				config.set(configResponse);
				newSuccessToast('Loaded app info and config');
				initApplication = 'SUCCESS';
			})
			.catch((_error) => {
				newErrorToast('Error loading app info or config');
				initApplication = 'ERROR';
			});
	});
</script>

<svelte:head>
	<title>{dev ? 'DEBUG-' : ''}chargeController</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	{#if initApplication === 'SUCCESS'}
		<div class="w-full navbar bg-neutral flex justify-center items-center">
			<p class="font-mono text-xl">
				{dev ? 'DEBUG-' : ''}chargeController
			</p>
		</div>

		<div class="flex-grow">
			<div class="md:container md:mx-auto">
				<slot />
			</div>
		</div>
		<footer class="footer footer-center p-4 bg-neutral text-base-content">
			<div class="align-baseline text-l font-mono">
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
			</div>
		</footer>
	{:else if initApplication === 'ERROR' || initApplication === 'LOADING'}
		<div class="flex justify-center flex-col items-center min-h-screen">
			{#if initApplication === 'ERROR'}
				<p class="mb-10 text-3xl">Connection to backend failed</p>
				<button class="btn btn-lg btn-error" on:click={() => window.location.reload()}
					>Retry again</button
				>
			{:else}
				<span class="loading loading-spinner h-36 w-36" />
			{/if}
		</div>
	{/if}
</div>
<div class="toast toast-end">
	{#each $toasts as toast}
		<Toast alertType={toast.alertType} message={toast.message} />
	{/each}
</div>
