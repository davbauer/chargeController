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
		<h3 class="font-bold text-lg">Backend</h3>
		<div class="mockup-code text-left w-full my-10">
			{#each [...$backendLogs.items].reverse() as log, index (log)}
				<pre
					data-prefix={$backendLogs.count - index}
					class={log.type === 'error' ? 'text-warning' : ''}>
                    <code>{log.msg}</code>
                </pre>
			{/each}
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
