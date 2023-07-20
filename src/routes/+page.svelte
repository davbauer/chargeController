<script lang="ts">
	import FaDiceD20 from 'svelte-icons/fa/FaDiceD20.svelte';

	const formatDate = (date: Date) =>
		date.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		});
	let currentDate = new Date();
</script>

<div class="m-3 leading-loose">
	<form method="POST" action="?/save">
		<div class="mt-3 p-3 bg-neutral rounded-md">
			<p class="text-xl underline">Enabled</p>
			<div class="flex flex-col items-center">
				<input name="Enabled" type="checkbox" class="toggle-success toggle toggle-lg" checked />
			</div>
		</div>

		<div class="mt-3 p-3 bg-neutral rounded-md">
			<p class="text-xl underline">Status</p>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Inverter</p>
				<input checked type="radio" class="radio radio-success" readonly />
			</div>

			<div class="flex flex-row">
				<p class="pr-10 w-48">Charger</p>
				<input checked type="radio" class="radio radio-success" readonly />
			</div>
		</div>

		<div class="mt-3 p-3 bg-neutral rounded-md">
			<p class="text-xl underline">LiveData</p>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Timestamp</p>
				<p class="font-mono">{formatDate(new Date())}</p>
			</div>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Export</p>
				<p class="font-mono">{'4367.56'} kw/h</p>
			</div>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">ChargerReserved</p>
				<p class="font-mono">{'2934.67'} kw/h</p>
			</div>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">ChargerAmp</p>
				<p class="font-mono">{8} Ampere</p>
			</div>
			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">ChargerUse</p>
				<p class="font-mono">{'3923.48'} kw/h</p>
			</div>
		</div>

		<div class="mt-3 p-3 bg-neutral rounded-md">
			<p class="text-xl underline">Settings</p>

			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Inverter Host</p>
				<div class="w-full">
					<input
						type="string"
						required
						name="InverterHost"
						placeholder="192.168.0.1"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Charger Host</p>
				<div class="w-full">
					<input
						name="ChargerHost"
						required
						type="string"
						placeholder="192.168.0.1"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Check Seconds</p>
				<div class="w-full">
					<input
						name="CheckSeconds"
						type="number"
						min="3"
						required
						max="360"
						placeholder="30"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Minimum Amps</p>
				<div class="w-full">
					<input
						name="MinimumAmps"
						type="number"
						required
						min="6"
						max="16"
						placeholder="6"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<p class="pr-10 w-48">Maximum Amps</p>
				<div class="w-full">
					<input
						name="MaximumAmps"
						required
						type="number"
						min="6"
						max="16"
						placeholder="16"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<p class="w-44">Use Powergrid</p>
				<input name="UsePowergrid" type="checkbox" class="toggle toggle-secondary" checked />
			</div>
			<div class="flex flex-col">
				<button type="submit" class="flex self-center btn btn-outline btn-success"
					>Save Settings</button
				>
			</div>
		</div>
	</form>
</div>
