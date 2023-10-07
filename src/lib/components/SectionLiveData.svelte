<script lang="ts">
	import { liveData, config } from '$lib/store';
	import moment from 'moment';
</script>

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

	<div class="flex flex-row items-center">
		<p class="pr-10 w-56">Charger Phase Mode</p>
		<p class="font-mono badge badge-info gap-2">
			{#if $liveData.Charger.Amp === -1}
				?
			{:else}
				{$liveData.Charger.PhaseMode === 0
					? 'Auto'
					: $liveData.Charger.PhaseMode === 1
					? '1P'
					: $liveData.Charger.PhaseMode === 2
					? '3P'
					: 'unknown'}
			{/if}
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
