export default interface InterfaceBatData {
	root: {
		Timestamp: string;
		id: string;
		ChargerCount: string;
		Description: string;
		inverter: {
			id: string;
			var: Array<{
				name: 'P' | 'SOC' | 'Capacity' | 'State' | 'OG' | 'UG';
				value: string;
			}>;
		};
	};
}
