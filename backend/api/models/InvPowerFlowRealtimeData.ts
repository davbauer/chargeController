export default interface InvPowerFlowRealtimeData {
	Body: {
		Data: {
			Site: {
				E_Day: number
				E_Total: number
				E_Year: number
				Meter_Location: string
				Mode: string
				P_Akku: any
				P_Grid: number
				P_Load: number
				P_PV: number
				rel_Autonomy: number
				rel_SelfConsumption: number
			}
			Version: string
		}
	}
	Head: {
		RequestArguments: {}
		Status: {
			Code: number
			Reason: string
			UserMessage: string
		}
		Timestamp: string
	}
}