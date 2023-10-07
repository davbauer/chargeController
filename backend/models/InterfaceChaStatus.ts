/**
 * Charging unit status.
 */
export default interface InterfaceChaStatus {
	/** Signal strength of the RSSI. */
	rssi: number;

	/** The current requested for charging in Ampere. */
	amp: number;

	/** The maximum current available for charging in Ampere. */
	ama: number;

	/**
	 * State of the car's charging process:
	 * 0=Unknown/Error, 1=Idle, 2=Charging, 3=WaitCar, 4=Complete, 5=Error
	 */
	car: 0 | 1 | 2 | 3 | 4 | 5;

	/**
	 * Boolean flags indicating the status of each phase.
	 * Indices 0-2 represent L1-L3, and 3-5 represent Neutral for L1-L3 respectively.
	 */
	pha: [boolean, boolean, boolean, boolean, boolean, boolean];

	/** Indicator if the single-phase charge is currently being enforced. */
	fsp: boolean;

	/** Mode that indicates the desired phase configuration. */
	pwm: number;

	/** The number of phases currently in use. */
	pnp: number;

	/** Accumulated energy since the car got connected, measured in Wh. */
	wh: number;

	/** Timestamp of the last time the car transitioned from an idle state. */
	lccfi: number | null;

	/**
	 * Array detailing energy metrics:
	 * [0], [1], [2], [3] - Voltage for L1, L2, L3, and N respectively.
	 * [4], [5], [6], [7] - Current for L1, L2, L3, and N respectively.
	 * [8], [9], [10], [11] - Power for L1, L2, L3, and N respectively.
	 * [12], [13], [14], [15] - Power factor for L1, L2, L3, and N respectively.
	 */
	nrg: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	];
}
