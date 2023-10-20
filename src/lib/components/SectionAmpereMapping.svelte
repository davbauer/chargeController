<script lang="ts">
	import { newErrorToast } from '$lib/api/Utilities/UtilStoreToast';
	import type Config from '$lib/api/models/Config';
	import { liveData, config } from '$lib/store';

	function isRowUnique(
		amp: number,
		onePhase: boolean,
		index: number,
		mapping: Config['Mapping']
	): boolean {
		return !mapping.some(
			(row, idx) => row.amp === amp && row.onePhase === onePhase && idx !== index
		);
	}

	function handleTableInput(index: number, field: keyof (typeof $config.Mapping)[0]): void {
		if (
			(field === 'amp' || 'onePhase') &&
			!isRowUnique(
				$config.Mapping[index].amp,
				$config.Mapping[index].onePhase,
				index,
				$config.Mapping
			)
		) {
			newErrorToast('Duplicate mapping');
			$config.Mapping[index].onePhase = !$config.Mapping[index].onePhase;
			return;
		}

		const currentRow = $config.Mapping[index];

		// If the last row is filled, add another
		if (index === $config.Mapping.length - 1 && currentRow.amp && currentRow.value) {
			$config.Mapping = [...$config.Mapping, { amp: 0, value: 0, onePhase: false }];
		}

		// If the current row is emptied (and it's not the last row), remove it
		if (!currentRow.amp && !currentRow.value && index !== $config.Mapping.length - 1) {
			$config.Mapping = $config.Mapping.filter((_, i) => i !== index);
		}
	}

	$: getClassForRow = (row: Config['Mapping'][0]) => {
		const isCurrentPhaseMatch =
			$liveData.Charger.PhaseMode === 0 || // Match any if PhaseMode is 0
			($liveData.Charger.PhaseMode === 1 && row.onePhase) || // Match only phase 1
			($liveData.Charger.PhaseMode === 2 && !row.onePhase); // Match only phase 3

		// Determine if the row matches the calculated phase settings.
		const isCalcPhaseMatch =
			$liveData.Charger.PhaseModeCalc === 0 || // Match any if PhaseModeCalc is 0
			($liveData.Charger.PhaseModeCalc === 1 && row.onePhase) || // Match only phase 1
			($liveData.Charger.PhaseModeCalc === 2 && !row.onePhase); // Match only phase 3

		// Determine if the row matches the calculated Amp settings.
		const isCalcAmpMatch = row.amp === $liveData.Charger.AmpCalc;

		// Determine if the row matches the current Amp settings.
		const isCurrentAmpMatch = row.amp === $liveData.Charger.Amp;

		return {
			// The row matches both the calculated phase and amp settings.
			isPhaseAndCalcMatch: isCalcPhaseMatch && isCalcAmpMatch,
			// The row matches both the current phase and amp settings.
			isPhaseAndAmpMatch: isCurrentPhaseMatch && isCurrentAmpMatch
		};
	};
</script>

<div class="ampere-mapping md:w-1/2">
	<p class="text-2xl underline">Ampere Mapping</p>

	<table class="table w-full md:max-w-lg">
		<thead>
			<tr>
				<th class="w-1/3 text-left">Phase</th>
				<th class="w-1/3 text-left">Ampere</th>
				<th class="w-1/3 text-left">W (Sorted)</th>
			</tr>
		</thead>
		<tbody>
			{#each $config.Mapping as row, index}
				<tr
					class="transition-colors duration-300"
					class:bg-neutral-focus={getClassForRow(row).isPhaseAndCalcMatch}
					class:border-l-2={getClassForRow(row).isPhaseAndCalcMatch}
					class:bg-secondary={getClassForRow(row).isPhaseAndAmpMatch}
				>
					<td class="w-1/3 text-left">
						<label class="swap swap-flip flex justify-center">
							<input
								bind:checked={row.onePhase}
								on:change={() => handleTableInput(index, 'onePhase')}
								type="checkbox"
							/>

							<div class="swap-on btn btn-neutral">
								<span class="font-extrabold">P1</span>
							</div>
							<div class="swap-off btn btn-neutral">
								<span class="font-extrabold text-primary">P3</span>
							</div>
						</label>
					</td>
					<td class="w-1/3 text-left">
						<input
							min="0"
							max="32"
							bind:value={row.amp}
							on:input={() => handleTableInput(index, 'amp')}
							class="input input-bordered w-full"
							type="number"
						/>
					</td>
					<td class="w-1/3 text-left">
						<input
							min="0"
							max="20000"
							bind:value={row.value}
							on:input={() => handleTableInput(index, 'value')}
							class="input input-bordered w-full"
							type="number"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
