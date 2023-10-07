<script lang="ts">
	import { liveData, config } from '$lib/store';

	function isAmpUnique(amp: number, index: number, mapping: any[]): boolean {
		return !mapping.some((row, idx) => row.amp === amp && idx !== index);
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
</script>

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
                    {row.amp === $liveData.Charger.AmpCalc &&
					$liveData.Charger.AmpCalc !== $liveData.Charger.Amp
						? 'bg-neutral-focus border-l-2'
						: ''}
                    {row.amp === $liveData.Charger.Amp ? 'bg-secondary' : ''}
                    {row.amp < $config.MinimumAmps || row.amp > $config.MaximumAmps
						? 'opacity-40'
						: ''}
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
