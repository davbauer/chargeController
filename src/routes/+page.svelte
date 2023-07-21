<script lang="ts">
	import type Config from '$lib/api/models/Config';
	import EnabledService from '$lib/api/services/EnabledService';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ConfigService from '$lib/api/services/ConfigService';
	import { goto } from '$app/navigation';
	import type LiveData from '$lib/api/models/LiveData';

	let config: Config;
	let liveData: LiveData = {
		StatusInverter: 'OFFLINE',
		StatusCharger: 'OFFLINE',
		Export: -1,
		ChargerReserved: -1,
		ChargerAmp: -1,
		ChargerUse: -1
	};
	let liveTimestamp = new Date();

	async function onEnabledChange(event: any) {
		await EnabledService.postEnabled(window.location.hostname, event.target.checked);
	}

	async function handleSaveSettings() {
		await ConfigService.postConfig(window.location.hostname, config);
	}

	onMount(async () => {
		config = await ConfigService.getConfig(window.location.hostname);
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
						liveTimestamp = new Date();
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
	<div class="flex justify-center items-center min-h-screen">
		<span class="loading loading-spinner h-44 w-44" />
	</div>
{:else}
	<div class="m-3 leading-loose">
		<form>
			<!-- Enabled Section -->
			<div class="mt-3 p-3 bg-neutral rounded-md">
				<p class="text-xl underline">Enabled</p>
				<div class="flex flex-col items-center">
					<input
						on:change={onEnabledChange}
						bind:checked={config.Enabled}
						type="checkbox"
						class="toggle-success toggle toggle-lg"
					/>
				</div>
			</div>

			<!-- Live Data Section -->
			<div class="mt-3 p-3 bg-neutral rounded-md">
				<p class="text-xl underline">Live</p>

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
						<p class="ml-2 opacity-60">{'Done'}</p>
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
					<p class="font-mono">{liveTimestamp.toLocaleTimeString('en-US')}</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Export</p>
					<p class="font-mono {liveData.Export < 0 ? 'text-red-400' : 'text-green-400'}">
						{liveData.Export !== -1 ? liveData.Export : '?'} kW
					</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">ChargerReserved</p>
					<p class="font-mono">{'2934.67'} kW</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">ChargerAmp</p>
					<p class="font-mono">{liveData.ChargerAmp !== -1 ? liveData.ChargerAmp : '?'} Ampere</p>
				</div>
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">ChargerUse</p>
					<p class="font-mono">{liveData.ChargerUse !== -1 ? liveData.ChargerUse : '?'} kW</p>
				</div>
			</div>

			<!-- Settings Section -->
			<div class="mt-3 p-3 bg-neutral rounded-md">
				<p class="text-xl underline">Settings</p>

				<!-- Inverter Host Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Inverter Host</p>
					<div class="w-full">
						<input
							type="string"
							required
							bind:value={config.InverterHost}
							placeholder="192.168.0.1"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<!-- Charger Host Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Charger Host</p>
					<div class="w-full">
						<input
							required
							bind:value={config.ChargerHost}
							type="string"
							placeholder="192.168.0.1"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<!-- Check Seconds Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Check Seconds</p>
					<div class="w-full">
						<input
							type="number"
							min="3"
							bind:value={config.CheckSeconds}
							required
							max="360"
							placeholder="30"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<!-- Minimum Amps Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Minimum Amps</p>
					<div class="w-full">
						<input
							type="number"
							required
							min="6"
							bind:value={config.MinimumAmps}
							max="16"
							placeholder="6"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<!-- Maximum Amps Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Maximum Amps</p>
					<div class="w-full">
						<input
							required
							type="number"
							min="6"
							bind:value={config.MaximumAmps}
							max="16"
							placeholder="16"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<!-- Battery Capacity Data -->
				<div class="flex flex-row items-center">
					<p class="pr-10 w-48">Battery Capacity</p>
					<div class="w-full">
						<input
							required
							type="number"
							min="1000"
							bind:value={config.BatteryCapacity}
							max="50000"
							placeholder="20000"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				</div>

				<div class="flex flex-row items-center">
					<p class="w-44">Use Powergrid</p>
					<input
						bind:checked={config.UsePowergrid}
						type="checkbox"
						class="toggle toggle-secondary"
					/>
				</div>

				<!-- Save Button -->
				<div class="flex flex-col">
					<button on:click={handleSaveSettings} class="flex self-center btn btn-outline btn-success"
						>Save Settings</button
					>
				</div>
			</div>
		</form>
	</div>
{/if}
