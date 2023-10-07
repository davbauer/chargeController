<script lang="ts">
	import EnabledService from '$lib/api/services/EnabledService';
	import { onMount } from 'svelte';
	import ConfigService from '$lib/api/services/ConfigService';
	import type LiveData from '$lib/api/models/LiveData';
	import ChargeControlService from '$lib/api/services/ChargeControlService';
	import { newInfoToast, newSuccessToast, newErrorToast } from '$lib/api/Utilities/StoreToastUtil';
	import moment from 'moment';
	import { appInfo, config, liveData } from '$lib/store';

	async function onEnabledChange(event: any) {
		await EnabledService.postEnabled(event.target.checked)
			.then(() => {
				newSuccessToast('State changed: ' + event.target.checked);
			})
			.catch((err) => {
				newErrorToast('State change error: ' + err.message);
			});
	}

	async function startCharge() {
		await ChargeControlService.chargeStart()
			.then(() => {
				newSuccessToast('Started charging');
			})
			.catch((err) => {
				newErrorToast('Error starting charging: ' + err.message);
			});
	}
	async function stopCharge() {
		await ChargeControlService.chargeStop()
			.then(() => {
				newSuccessToast('Stopped charging');
			})
			.catch((err) => {
				newErrorToast('Error stopping charging: ' + err.message);
			});
	}

	// Utility function to sort the mapping by amp value
	function sortMapping(mapping: any[]) {
		return mapping.sort((a, b) => a.amp - b.amp);
	}

	// Utility function to ensure there's an empty row at the end
	function ensureEmptyRowAtEnd(mapping: any[]) {
		const lastRow = mapping[mapping.length - 1];
		if (!lastRow || lastRow.amp !== 0 || lastRow.value !== 0) {
			mapping.push({ amp: 0, value: 0 });
		}
		return mapping;
	}

	function isAmpUnique(amp: number, index: number, mapping: any[]): boolean {
		return !mapping.some((row, idx) => row.amp === amp && idx !== index);
	}

	async function handleSaveSettings() {
		// Remove the empty row if it exists
		if ($config.Mapping.length > 0) {
			const lastRow = $config.Mapping[$config.Mapping.length - 1];
			if (lastRow.amp === 0 && lastRow.value === 0) {
				$config.Mapping.pop();
			}
		}

		// Filter out non-unique amp values (optional but may be a good idea)
		$config.Mapping = $config.Mapping.filter((row, index, arr) => {
			const firstIndex = arr.findIndex((r) => r.amp === row.amp);
			return firstIndex === index;
		});

		// Sort the mapping and save
		$config.Mapping = sortMapping($config.Mapping);
		await ConfigService.postConfig($config)
			.then(() => {
				newSuccessToast('Saved settings');
			})
			.catch((err) => {
				newErrorToast('Error saving settings: ' + err.message);
			});
		// Ensure there's always an empty row at the end after saving
		$config.Mapping = ensureEmptyRowAtEnd($config.Mapping);
	}

	function handleTableInput(
		e: Event,
		index: number,
		field: keyof (typeof $config.Mapping)[0]
	): void {
		const target = e.target as HTMLInputElement;
		const value = +target.value;

		if (field === 'amp' && !isAmpUnique(value, index, $config.Mapping)) {
			console.error(`AMP value ${value} already exists!`);
			return; // exit early if amp value isn't unique
		}

		$config.Mapping[index][field] = value;
		const currentRow = $config.Mapping[index];

		// If the last row is filled, add another
		if (index === $config.Mapping.length - 1 && currentRow.amp && currentRow.value) {
			$config.Mapping = [...$config.Mapping, { amp: 0, value: 0 }];
		}

		// If the current row is emptied (and it's not the last row), remove it
		if (!currentRow.amp && !currentRow.value && index !== $config.Mapping.length - 1) {
			$config.Mapping = $config.Mapping.filter((_, i) => i !== index);
		}
	}

	onMount(async () => {
		// Sort the mapping and ensure empty row at the end
		$config.Mapping = ensureEmptyRowAtEnd(sortMapping($config.Mapping));

		const WS_URL = `ws://${window.location.hostname}:${$appInfo.webSocketPort}`;

		let retryDelay = 1000; // Start with 1 second
		const maxRetryDelay = 60000; // Maximum delay is 1 minute

		const setupWebSocket = () => {
			const socket = new WebSocket(WS_URL);

			socket.onopen = () => {
				console.log('WebSocket connection established');
				retryDelay = 1000; // Reset retry delay on successful connection
			};

			socket.onmessage = (event) => {
				const message = JSON.parse(event.data);
				switch (message.event) {
					case 'enabledStateUpdate':
						newInfoToast('Received enabledStateUpdate');
						$config.Enabled = message.data.state as boolean;
						break;
					case 'liveDataUpdate':
						newInfoToast('Received liveDataUpdate');
						console.log(JSON.stringify(message.data, null, 4));
						console.info('received: liveDataUpdate');
						liveData.set(message.data as LiveData);
						break;
				}
			};

			socket.onclose = (event) => {
				if (event.wasClean) {
					console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
				} else {
					console.log('Connection died');
					// Exponential backoff for reconnection
					setTimeout(() => setupWebSocket(), retryDelay);
					retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
				}
			};

			socket.onerror = (error) => {
				console.error(`[WebSocket Error] ${error}`);
				newErrorToast(`Websocket Error: ${error.type}`);
			};
		};

		setupWebSocket();
	});
</script>

<div class="m-3 leading-loose text-lg">
	<!-- Enabled Section -->
	<div class="mt-3 p-3 bg-neutral rounded-md">
		<p class="text-2xl underline">Enabled</p>
		<div class="flex flex-col items-center">
			<input
				on:change={onEnabledChange}
				bind:checked={$config.Enabled}
				type="checkbox"
				class="toggle-success toggle toggle-lg"
			/>
		</div>
	</div>

	<!-- Control Section -->
	<div class="mt-3 p-3 bg-neutral rounded-md">
		<p class="text-2xl underline">Control</p>

		<div class="flex flex-row items-center justify-around pt-5">
			<button on:click={startCharge} class="btn-lg w-2/5 btn btn-active btn-secondary">
				Start Charging
			</button>
			<button on:click={stopCharge} class="btn-lg w-2/5 btn btn-active btn-neutral">
				Stop Charging
			</button>
		</div>
	</div>

	<!-- Live Data Section -->
	<div class="mt-3 p-3 bg-neutral rounded-md">
		<p class="text-2xl underline">Live</p>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Timestamp</p>
			<p class="font-mono">
				{typeof $liveData.Timestamp === 'string'
					? new Date($liveData.Timestamp).toLocaleTimeString('en-US')
					: ''}
			</p>
		</div>

		<!-- Inverter Data -->
		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">MainInverter</p>
			{#if $liveData.MainInverter.Status === 1}
				<input checked type="radio" class="radio radio-success" readonly />
				<p class="ml-2 opacity-60">{'Online'}</p>
			{:else if $liveData.MainInverter.Status === 'OFFLINE'}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Offline'}</p>
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Inverter1</p>
			{#if $liveData.Inverter1.Status === 1}
				<input checked type="radio" class="radio radio-success" readonly />
				<p class="ml-2 opacity-60">{'Online'}</p>
			{:else if $liveData.Inverter1.Status === 'OFFLINE'}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Offline'}</p>
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Sun Power</p>
			<p class="font-mono {$liveData.Inverter.SunPower < 0 ? 'text-red-400' : 'text-green-400'}">
				{$liveData.Inverter.SunPower !== -1 ? $liveData.Inverter.SunPower.toFixed(2) : '?'} W
			</p>
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Export</p>
			<p class="font-mono {$liveData.Inverter.Export < 0 ? 'text-red-400' : 'text-green-400'}">
				{$liveData.Inverter.Export !== -1 ? $liveData.Inverter.Export.toFixed(2) : '?'} W
			</p>
		</div>

		<hr />

		<!-- Battery Data -->
		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Battery</p>
			{#if $liveData.Battery.Status === 0}
				<input checked type="radio" class="radio radio-primary" readonly />
				<p class="ml-2 opacity-60">{'Busy/Checking'}</p>
			{:else if $liveData.Battery.Status === 1}
				<input checked type="radio" class="radio radio-info" readonly />
				<p class="ml-2 opacity-60">{'Ready'}</p>
			{:else if $liveData.Battery.Status === 2}
				<input checked type="radio" class="radio radio-secondary" readonly />
				<p class="ml-2 opacity-60">{'Charging'}</p>
			{:else if $liveData.Battery.Status === 3}
				<input checked type="radio" class="radio radio-info" readonly />
				<p class="ml-2 opacity-60">{'Discharging'}</p>
			{:else if $liveData.Battery.Status === 4}
				<input checked type="radio" class="radio radio-success" readonly />
				<p class="ml-2 opacity-60">{'Standby'}</p>
			{:else if $liveData.Battery.Status === 5}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Error'}</p>
			{:else if $liveData.Battery.Status === 6}
				<input checked type="radio" class="radio radio-info" readonly />
				<p class="ml-2 opacity-60">{'Service/Update'}</p>
			{:else if $liveData.Battery.Status === 7}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Emergency Power'}</p>
			{:else if $liveData.Battery.Status === 'OFFLINE'}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Offline'}</p>
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Percent</p>
			<p class="font-mono opacity-60">
				{$liveData.Battery.Percent !== -1 ? $liveData.Battery.Percent.toFixed(0) : '?'} %
			</p>
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Power</p>
			<p class="font-mono opacity-60">
				{$liveData.Battery.Percent !== -1 ? $liveData.Battery.Power.toFixed(2) : '?'} W
			</p>
		</div>

		<hr />

		<!-- Charger Data -->
		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Charger</p>
			{#if $liveData.Charger.Status === 0}
				<input checked type="radio" class="radio radio-primary" readonly />
				<p class="ml-2 opacity-60">{'Unknown/Error'}</p>
			{:else if $liveData.Charger.Status === 1 || $liveData.Charger.Status === 3}
				<input checked type="radio" class="radio radio-info" readonly />
				<p class="ml-2 opacity-60">{'Idle/WaitCar'}</p>
			{:else if $liveData.Charger.Status === 2}
				<input checked type="radio" class="radio radio-secondary" readonly />
				<p class="ml-2 opacity-60">{'Charging'}</p>
			{:else if $liveData.Charger.Status === 4}
				<input checked type="radio" class="radio radio-success" readonly />
				<p class="ml-2 opacity-60">{'Plugged In'}</p>
			{:else if $liveData.Charger.Status === 5}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Error'}</p>
			{:else if $liveData.Charger.Status === 'OFFLINE'}
				<input checked type="radio" class="radio radio-error" readonly />
				<p class="ml-2 opacity-60">{'Offline'}</p>
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Consumption</p>
			<p class="font-mono text-secondary">
				{$liveData.Charger.Consumption !== -1 ? $liveData.Charger.Consumption.toFixed(2) : '?'} W
			</p>
		</div>

		<div class="flex flex-row items-center">
			<p class="pr-10 w-56">Charger Ampere</p>
			<p class="font-mono text-secondary">
				{$liveData.Charger.Amp !== -1 ? $liveData.Charger.Amp : '?'} Ampere
			</p>
		</div>

		<div class="opacity-60 flex flex-row items-center">
			<p class="pr-10 w-56">Charged Since Link</p>
			<p class="font-mono text-primary">
				{$liveData.Charger.ChargedSinceLink !== -1
					? $liveData.Charger.ChargedSinceLink.toFixed(2)
					: '?'} W ({(($liveData.Charger.ChargedSinceLink / $config.BatteryCapacity) * 100).toFixed(
					2
				)} %) ~ {($liveData.Charger.ChargedSinceLink / $config.CarEfficiency).toFixed(2)}
				km
			</p>
		</div>

		<div class="opacity-60 flex flex-row items-center">
			<p class="pr-10 w-56">Link Time</p>
			<p class="font-mono">
				{$liveData.Charger.LinkTime !== -1
					? $liveData.Charger.LinkTime === 0
						? '/'
						: moment(
								(typeof $liveData.Timestamp === 'string'
									? new Date($liveData.Timestamp).getTime()
									: Date.now()) - $liveData.Charger.LinkTime
						  ).fromNow()
					: '?'}
			</p>
		</div>

		<div class="opacity-60 flex flex-row items-center">
			<p class="pr-10 w-56">Charger Reserved</p>
			<p class="font-mono">
				{$liveData.Charger.Reserved !== -1 ? $liveData.Charger.Reserved.toFixed(2) : '?'} W
			</p>
		</div>

		<div class="opacity-60 flex flex-row items-center">
			<p class="pr-10 w-56">Charger Ampere Calc</p>
			<p class="font-mono">
				{$liveData.Charger.AmpCalc !== -1 ? $liveData.Charger.AmpCalc : '?'} Ampere
			</p>
		</div>

		<div class="opacity-60 flex flex-row items-center">
			<p class="pr-10 w-56">ShouldStop</p>
			{#if $liveData.Charger.ShouldStop}
				<input checked type="radio" class="radio" readonly />
			{:else}
				<input type="radio" class="radio" readonly />
			{/if}
		</div>
	</div>

	<div class="mt-3 p-3 bg-neutral rounded-md flex flex-col md:flex-row">
		<div class="ampere-mapping md:w-1/2">
			<p class="text-2xl underline">Ampere Mapping</p>

			<table class="table w-full md:max-w-lg">
				<thead>
					<tr>
						<th class="w-1/2 text-left">Ampere</th>
						<th class="w-1/2 text-left">W (Sorted)</th>
					</tr>
				</thead>
				<tbody>
					{#each $config.Mapping as row, index}
						<tr
							class="transition-colors duration-300
							{row.amp === $liveData.Charger.AmpCalc && $liveData.Charger.AmpCalc !== $liveData.Charger.Amp
								? 'bg-neutral-focus border-l-2'
								: ''}
							{row.amp === $liveData.Charger.Amp ? 'bg-secondary' : ''}
							{row.amp < $config.MinimumAmps || row.amp > $config.MaximumAmps ? 'opacity-40' : ''}
							"
						>
							<td class="w-1/2 text-left">
								<input
									min="0"
									max="32"
									bind:value={row.amp}
									on:input={(e) => handleTableInput(e, index, 'amp')}
									class="input input-bordered w-full"
									type="number"
								/>
							</td>
							<td class="w-1/2 text-left">
								<input
									min="0"
									max="20000"
									bind:value={row.value}
									on:input={(e) => handleTableInput(e, index, 'value')}
									class="input input-bordered w-full"
									type="number"
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="settings md:w-1/2">
			<form on:submit|preventDefault={handleSaveSettings}>
				<p class="text-2xl underline">Settings</p>

				<table class="table w-full md:max-w-lg">
					<thead>
						<tr>
							<th class="w-1/2 text-left">Property</th>
							<th class="w-1/2 text-left">Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colspan="2">
								<button class="w-full flex self-center btn btn-success">Save Settings</button>
							</td>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Use Powergrid</td>
							<td class="w-1/2 text-left">
								<input
									bind:checked={$config.UsePowergrid}
									type="checkbox"
									class="toggle toggle-primary"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">MainInverter Host</td>
							<td class="w-1/2 text-left">
								<input
									type="string"
									required
									bind:value={$config.MainInverterHost}
									placeholder="192.168.0.1"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Inverter1 Host</td>
							<td class="w-1/2 text-left">
								<input
									type="string"
									required
									bind:value={$config.InverterHost1}
									placeholder="192.168.0.1"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Charger Host</td>
							<td class="w-1/2 text-left">
								<input
									required
									bind:value={$config.ChargerHost}
									type="string"
									placeholder="192.168.0.1"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Battery Host</td>
							<td class="w-1/2 text-left">
								<input
									required
									bind:value={$config.BatteryHost}
									type="string"
									placeholder="192.168.0.1"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Check Seconds</td>
							<td class="w-1/2 text-left">
								<input
									type="number"
									min="3"
									bind:value={$config.CheckSeconds}
									required
									max="360"
									placeholder="30"
									class="input input-bordered w-full max-w-xs"
								/>
							</td>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Minimum Amps</td>
							<td class="w-1/2 text-left">
								<input
									type="number"
									required
									min="6"
									bind:value={$config.MinimumAmps}
									max="16"
									placeholder="6"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left">Maximum Amps</td>
							<td class="w-1/2 text-left">
								<input
									required
									type="number"
									min="6"
									bind:value={$config.MaximumAmps}
									max="16"
									placeholder="16"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left"
								><span
									class="tooltip tooltip-info"
									data-tip="Needed to calculate the charged percent">Battery Capacity (Wh)</span
								></td
							>
							<td class="w-1/2 text-left">
								<input
									required
									type="number"
									min="1000"
									bind:value={$config.BatteryCapacity}
									max="100000"
									placeholder="52000"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
						<tr>
							<td class="w-1/2 text-left"
								><span class="tooltip tooltip-info" data-tip="Needed to calculate the charged km"
									>Car Efficiency (Wh/km)</span
								></td
							>
							<td class="w-1/2 text-left">
								<input
									required
									type="number"
									min="10"
									bind:value={$config.CarEfficiency}
									max="1000"
									placeholder="150"
									class="input input-bordered w-full max-w-xs"
								/></td
							>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	</div>
</div>
