<script lang="ts">
	import type Config from '$lib/api/models/Config';
	import EnabledService from '$lib/api/services/EnabledService';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ConfigService from '$lib/api/services/ConfigService';
	import { goto } from '$app/navigation';
	import type LiveData from '$lib/api/models/LiveData';
	import ChargeControlService from '$lib/api/services/ChargeControlService';
	import { AxiosError } from 'axios';
	import { redirect } from '@sveltejs/kit';

	let config: Config;
	let errorOnLoad: boolean = false;
	let liveData: LiveData = {
		StatusInverter: 'OFFLINE',
		StatusCharger: 'OFFLINE',
		Timestamp: null,
		Export: -1,
		ShouldStop: true,
		ChargerReserved: -1,
		ChargerUse: -1,
		LiveChargerAmp: -1,
		CalcChargerAmp: -1
	};

	async function onEnabledChange(event: any) {
		await EnabledService.postEnabled(window.location.hostname, event.target.checked);
	}

	async function startCharge() {
		await ChargeControlService.chargeStart(window.location.hostname);
	}
	async function stopCharge() {
		await ChargeControlService.chargeStop(window.location.hostname);
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
		if (config.Mapping.length > 0) {
			const lastRow = config.Mapping[config.Mapping.length - 1];
			if (lastRow.amp === 0 && lastRow.value === 0) {
				config.Mapping.pop();
			}
		}

		// Filter out non-unique amp values (optional but may be a good idea)
		config.Mapping = config.Mapping.filter((row, index, arr) => {
			const firstIndex = arr.findIndex((r) => r.amp === row.amp);
			return firstIndex === index;
		});

		// Sort the mapping and save
		config.Mapping = sortMapping(config.Mapping);
		await ConfigService.postConfig(window.location.hostname, config);

		// Ensure there's always an empty row at the end after saving
		config.Mapping = ensureEmptyRowAtEnd(config.Mapping);
	}

	function handleTableInput(
		e: Event,
		index: number,
		field: keyof (typeof config.Mapping)[0]
	): void {
		const target = e.target as HTMLInputElement;
		const value = +target.value;

		if (field === 'amp' && !isAmpUnique(value, index, config.Mapping)) {
			console.error(`AMP value ${value} already exists!`);
			return; // exit early if amp value isn't unique
		}

		config.Mapping[index][field] = value;
		const currentRow = config.Mapping[index];

		// If the last row is filled, add another
		if (index === config.Mapping.length - 1 && currentRow.amp && currentRow.value) {
			config.Mapping = [...config.Mapping, { amp: 0, value: 0 }];
		}

		// If the current row is emptied (and it's not the last row), remove it
		if (!currentRow.amp && !currentRow.value && index !== config.Mapping.length - 1) {
			config.Mapping = config.Mapping.filter((_, i) => i !== index);
		}
	}

	onMount(async () => {
		try {
			config = await ConfigService.getConfig(window.location.hostname);
		} catch (error: any) {
			if (error instanceof AxiosError) {
				errorOnLoad = true;
				return;
			}
		}

		// Sort the mapping and ensure empty row at the end
		config.Mapping = ensureEmptyRowAtEnd(sortMapping(config.Mapping));

		const WS_URL = 'ws://' + window.location.hostname + ':2001';

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
						console.info('received: enabledStateUpdate');
						config.Enabled = message.data.state as boolean;
						break;
					case 'liveDataUpdate':
						console.info('received: liveDataUpdate');
						console.log(JSON.stringify(message.data, null, 4));
						liveData = message.data as LiveData;
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
			};
		};

		setupWebSocket();
	});
</script>

{#if !config}
	<div class="flex justify-center flex-col items-center min-h-screen">
		{#if errorOnLoad}
			<p class="mb-10 text-3xl">Connection to backend failed!</p>
			<button class="btn btn-lg btn-error" on:click={() => window.location.reload()}
				>Retry again</button
			>
		{:else}
			<span class="loading loading-spinner h-44 w-44" />
		{/if}
	</div>
{:else}
	<form on:submit|preventDefault={handleSaveSettings}>
		<div class="m-3 leading-loose text-xl">
			<!-- Enabled Section -->
			<div class="mt-3 p-3 bg-neutral rounded-md">
				<p class="text-2xl underline">Enabled</p>
				<div class="flex flex-col items-center">
					<input
						on:change={onEnabledChange}
						bind:checked={config.Enabled}
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

				<!-- Inverter Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Inverter</p>
					{#if liveData.StatusInverter === 1}
						<input checked type="radio" class="radio radio-success" readonly />
						<p class="ml-2 opacity-60">{'Online'}</p>
					{:else if liveData.StatusInverter === 'OFFLINE'}
						<input checked type="radio" class="radio radio-error" readonly />
						<p class="ml-2 opacity-60">{'Offline'}</p>
					{/if}
				</div>

				<!-- Charger Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Charger</p>
					{#if liveData.StatusCharger === 0}
						<input checked type="radio" class="radio radio-primary" readonly />
						<p class="ml-2 opacity-60">{'Unknown/Error'}</p>
					{:else if liveData.StatusCharger === 1 || liveData.StatusCharger === 3}
						<input checked type="radio" class="radio radio-info" readonly />
						<p class="ml-2 opacity-60">{'Idle/WaitCar'}</p>
					{:else if liveData.StatusCharger === 2}
						<input checked type="radio" class="radio radio-secondary" readonly />
						<p class="ml-2 opacity-60">{'Charging'}</p>
					{:else if liveData.StatusCharger === 4}
						<input checked type="radio" class="radio radio-success" readonly />
						<p class="ml-2 opacity-60">{'Plugged In'}</p>
					{:else if liveData.StatusCharger === 5}
						<input checked type="radio" class="radio radio-error" readonly />
						<p class="ml-2 opacity-60">{'Error'}</p>
					{:else if liveData.StatusCharger === 'OFFLINE'}
						<input checked type="radio" class="radio radio-error" readonly />
						<p class="ml-2 opacity-60">{'Offline'}</p>
					{/if}
				</div>

				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Timestamp</p>
					<p class="font-mono">
						{typeof liveData.Timestamp === 'string'
							? new Date(liveData.Timestamp).toLocaleTimeString('en-US')
							: ''}
					</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Export</p>
					<p class="font-mono {liveData.Export < 0 ? 'text-red-400' : 'text-green-400'}">
						{liveData.Export !== -1 ? liveData.Export.toFixed(2) : '?'} W
					</p>
				</div>

				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">ChargerUse</p>
					<p class="font-mono text-secondary">
						{liveData.ChargerUse !== -1 ? liveData.ChargerUse.toFixed(2) : '?'} W
					</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">LiveChargerAmp</p>
					<p class="font-mono text-secondary">
						{liveData.LiveChargerAmp !== -1 ? liveData.LiveChargerAmp : '?'} Ampere
					</p>
				</div>
				<div class="opacity-60 flex flex-row items-center">
					<p class="pr-10 w-48">ChargerReserved</p>
					<p class="font-mono">
						{liveData.ChargerReserved !== -1 ? liveData.ChargerReserved.toFixed(2) : '?'} W
					</p>
				</div>
				<div class="opacity-60 flex flex-row items-center">
					<p class="pr-10 w-48">CalcChargerAmp</p>
					<p class="font-mono">
						{liveData.CalcChargerAmp !== -1 ? liveData.CalcChargerAmp : '?'} Ampere
					</p>
				</div>
				<div class="opacity-60 flex flex-row items-center">
					<p class="pr-10 w-48">ShouldStop</p>
					<p class="font-mono">
						{liveData.ShouldStop ? '✔️' : '✖️'}
					</p>
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
							{#each config.Mapping as row, index}
								<tr
									class="transition-colors duration-300
							{row.amp === liveData.CalcChargerAmp && liveData.CalcChargerAmp !== liveData.LiveChargerAmp
										? 'bg-neutral-focus border-l-2'
										: ''}
							{row.amp === liveData.LiveChargerAmp ? 'bg-secondary' : ''}
							{row.amp < config.MinimumAmps || row.amp > config.MaximumAmps ? 'opacity-40' : ''}
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
								<td class="w-1/2 text-left">Inverter Host</td>
								<td class="w-1/2 text-left">
									<input
										type="string"
										required
										bind:value={config.InverterHost}
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
										bind:value={config.ChargerHost}
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
										bind:value={config.CheckSeconds}
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
										bind:value={config.MinimumAmps}
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
										bind:value={config.MaximumAmps}
										max="16"
										placeholder="16"
										class="input input-bordered w-full max-w-xs"
									/></td
								>
							</tr>
							<tr>
								<td class="w-1/2 text-left">Battery Capacity</td>
								<td class="w-1/2 text-left">
									<input
										required
										type="number"
										min="1000"
										bind:value={config.BatteryCapacity}
										max="50000"
										placeholder="20000"
										class="input input-bordered w-full max-w-xs"
									/></td
								>
							</tr>
							<tr>
								<td class="w-1/2 text-left">Use Powergrid</td>
								<td class="w-1/2 text-left">
									<input
										bind:checked={config.UsePowergrid}
										type="checkbox"
										class="toggle toggle-secondary"
									/></td
								>
							</tr>
							<tr>
								<td colspan="2">
									<button class="w-full flex self-center btn btn-outline btn-success"
										>Save Settings</button
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</form>
{/if}
