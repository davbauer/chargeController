<script lang="ts">
	import '../app.css';
	import { toasts } from '$lib/store';
	import Toast from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';

	let gitInfo: { branch: string | null; commit: string | null; debug: boolean } = {
		debug: false,
		branch: null,
		commit: null
	};
	onMount(() => {
		fetch('/git-info.json')
			.then((response) => response.json())
			.then((data) => {
				gitInfo = data;
			});
	});
</script>

<svelte:head>
	<title>{gitInfo.debug ? 'DEBUG' : ''}-chargeController</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<div class="w-full navbar bg-neutral flex justify-center items-center">
		<p class="font-mono text-xl">
			{gitInfo.debug ? 'DEBUG' : ''}-chargeController
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
				Branch: {gitInfo.branch === null ? '/' : gitInfo.branch}
			</p>
			<p class="text-gray-500">
				CommitId: {gitInfo.commit === null ? '/' : gitInfo.commit}
			</p>
			<p />
		</div>
	</footer>
</div>
<div class="toast toast-end">
	{#each $toasts as toast}
		<Toast alertType={toast.alertType} message={toast.message} />
	{/each}
</div>
