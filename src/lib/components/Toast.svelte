<script lang="ts">
	import { fade } from 'svelte/transition';
	export let alertType = '';
	export let message = '';
	let isVisible = true;

	setTimeout(() => {
		isVisible = false;
	}, 4000);
</script>

{#if isVisible}
	<div transition:fade={{ duration: 300 }} class={`alert ${alertType}`}>
		<span>{message}</span>
	</div>
{/if}
