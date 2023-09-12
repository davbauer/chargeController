<script lang="ts">
	import '../app.css';
	import { toasts } from '$lib/store';
	import Toast from '$lib/components/Toast.svelte';

	const gitCommit = import.meta.env.FRONTEND_GIT_COMMIT;
	const gitBranch = import.meta.env.FRONTEND_GIT_BRANCH;
</script>

<svelte:head>
	<title>chargeController</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<div class="w-full navbar bg-neutral flex justify-center items-center">
		<p class="font-mono text-xl">chargeController</p>
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
				Branch: {gitBranch === undefined ? '/' : gitBranch} CommitId: {gitCommit === undefined
					? '/'
					: gitCommit}
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
