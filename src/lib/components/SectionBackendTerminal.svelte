<script lang="js">
	import { backendLogs } from '$lib/store';

	// Function to handle showing the modal
	function showModal() {
		const backendLiveModal = document.getElementById('backendLive');
		if (backendLiveModal) backendLiveModal.showModal();
	}
</script>

<button class="btn btn-xs" on:click={showModal}>LIVE BACKEND</button>
<dialog id="backendLive" class="mx-auto modal md:w-auto">
	<div class="w-11/12 max-w-5xl modal-box">
		<form method="dialog">
			<button class="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
		</form>
		<h3 class="pb-5 text-lg font-bold text-center">Backend</h3>
		<div class="border mockup-window bg-base-200">
			{#each [...$backendLogs.items].reverse() as log, index (log)}
				<p class="py-1 px-5 font-mono {log.type === 'error' ? 'text-warning' : 'text-info'}">
					<span class="opacity-50">{log.ts}</span>
					{log.msg}
				</p>
			{/each}
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
