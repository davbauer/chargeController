<script lang="js">
	import { backendLogs } from '$lib/store';

	// Function to handle showing the modal
	function showModal() {
		const backendLiveModal = document.getElementById('backendLive');
		if (backendLiveModal) backendLiveModal.showModal();
	}
</script>

<button class="btn btn-xs" on:click={showModal}>LIVE BACKEND</button>
<dialog id="backendLive" class="modal md:w-auto mx-auto">
	<div class="modal-box w-11/12 max-w-5xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg text-center pb-5">Backend</h3>
		<div class="mockup-window border bg-base-200">
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
