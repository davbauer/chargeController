<script>
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<div class="w-full navbar bg-neutral flex justify-center items-center">
		<p class="font-mono text-xl">chargeController updateTest</p>
	</div>

	<div class="flex-grow">
		<div class="md:container md:mx-auto">
			<slot />
		</div>
	</div>
	<footer class="footer footer-center p-4 bg-neutral text-base-content">
		<div class="align-baseline">
			<a href="https://github.com/davbauer" class="text-l font-mono underline">github/davbauer</a>
		</div>
	</footer>
</div>
