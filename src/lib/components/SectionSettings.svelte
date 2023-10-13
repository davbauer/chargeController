<script lang="ts">
	import ServiceConfig from '$lib/api/services/ServiceConfig';
	import { newSuccessToast, newErrorToast } from '$lib/api/Utilities/UtilStoreToast';
	import { config } from '$lib/store';
	import { onMount } from 'svelte';

	onMount(() => {
		// Sort the mapping and ensure empty row at the end
		$config.Mapping = ensureEmptyRowAtEnd(sortMapping($config.Mapping));
	});

	// Utility function to sort the mapping by amp value
	function sortMapping(mapping: any[]) {
		return mapping.sort((a, b) => a.value - b.value);
	}

	// Utility function to ensure there's an empty row at the end
	function ensureEmptyRowAtEnd(mapping: any[]) {
		const lastRow = mapping[mapping.length - 1];
		if (!lastRow || lastRow.amp !== 0 || lastRow.value !== 0) {
			mapping.push({ amp: 0, value: 0 });
		}
		return mapping;
	}

	async function handleSaveSettings() {
		// Remove the empty row if it exists
		if ($config.Mapping.length > 0) {
			const lastRow = $config.Mapping[$config.Mapping.length - 1];
			if (lastRow.amp === 0 && lastRow.value === 0) {
				$config.Mapping.pop();
			}
		}

		// Sort the mapping and save
		$config.Mapping = sortMapping($config.Mapping);
		await ServiceConfig.postConfig($config)
			.then(() => {
				newSuccessToast('Saved settings');
			})
			.catch((err) => {
				newErrorToast('Error saving settings: ' + err.message);
			});
		// Ensure there's always an empty row at the end after saving
		$config.Mapping = ensureEmptyRowAtEnd($config.Mapping);
	}
</script>

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
					<td class="w-1/2 text-left">Minimum Watts</td>
					<td class="w-1/2 text-left">
						<input
							type="number"
							required
							min="0"
							bind:value={$config.MinimumWatts}
							max="50000"
							placeholder="600"
							class="input input-bordered w-full max-w-xs"
						/></td
					>
				</tr>
				<tr>
					<td class="w-1/2 text-left">Maximum Watts</td>
					<td class="w-1/2 text-left">
						<input
							required
							type="number"
							min="0"
							bind:value={$config.MaximumWatts}
							max="10000"
							placeholder="8000"
							class="input input-bordered w-full max-w-xs"
						/></td
					>
				</tr>
				<tr>
					<td class="w-1/2 text-left"
						><span class="tooltip tooltip-info" data-tip="Needed to calculate the charged percent"
							>Battery Capacity (Wh)</span
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
