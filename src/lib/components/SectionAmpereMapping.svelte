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

	function handleTableInput(
		e: Event,
		index: number,
		field: keyof (typeof $config.Mapping)[0]
	): void {
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

	$: getClassForRow = (row) => {
		const isPhaseMatch =
			$liveData.Charger.PhaseMode === 0 ||
			($liveData.Charger.PhaseMode === 1 && row.onePhase) ||
			($liveData.Charger.PhaseMode === 2 && !row.onePhase);

		const isAmpCalcMatch =
			row.amp === $liveData.Charger.AmpCalc && $liveData.Charger.AmpCalc !== $liveData.Charger.Amp;

		const isAmpMatch = row.amp === $liveData.Charger.Amp;

		const isOutOfRange = row.amp < $config.MinimumAmps || row.amp > $config.MaximumAmps;

		return {
			isPhaseAndAmpCalcMatch: isPhaseMatch && isAmpCalcMatch,
			isPhaseAndAmpMatch: isPhaseMatch && isAmpMatch,
			isOutOfRange
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
					class:bg-neutral-focus={getClassForRow(row).isPhaseAndAmpCalcMatch}
					class:border-l-2={getClassForRow(row).isPhaseAndAmpCalcMatch}
					class:bg-secondary={getClassForRow(row).isPhaseAndAmpMatch}
					class:opacity-40={getClassForRow(row).isOutOfRange}
				>
					<td class="w-1/3 text-left">
						<label class="swap swap-flip flex justify-center">
							<input
								bind:checked={row.onePhase}
								on:change={(e) => handleTableInput(e, index, 'onePhase')}
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
							on:input={(e) => handleTableInput(e, index, 'amp')}
							class="input input-bordered w-full"
							type="number"
						/>
					</td>
					<td class="w-1/3 text-left">
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
