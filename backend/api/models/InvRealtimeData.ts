export default interface InvRealtimeData {
    Body: {
        Data: {
            [key: string]: {
                Current_AC_Phase_1: number;
                Current_AC_Phase_2: number;
                Current_AC_Phase_3: number;
                Details: {
                    Manufacturer: string;
                    Model: string;
                    Serial: string;
                };
                Enable: number;
                EnergyReactive_VArAC_Sum_Consumed: number;
                EnergyReactive_VArAC_Sum_Produced: number;
                EnergyReal_WAC_Minus_Absolute: number;
                EnergyReal_WAC_Plus_Absolute: number;
                EnergyReal_WAC_Sum_Consumed: number;
                EnergyReal_WAC_Sum_Produced: number;
                Frequency_Phase_Average: number;
                Meter_Location_Current: number;
                PowerApparent_S_Phase_1: number;
                PowerApparent_S_Phase_2: number;
                PowerApparent_S_Phase_3: number;
                PowerApparent_S_Sum: number;
                PowerFactor_Phase_1: number;
                PowerFactor_Phase_2: number;
                PowerFactor_Phase_3: number;
                PowerFactor_Sum: number;
                PowerReactive_Q_Phase_1: number;
                PowerReactive_Q_Phase_2: number;
                PowerReactive_Q_Phase_3: number;
                PowerReactive_Q_Sum: number;
                PowerReal_P_Phase_1: number;
                PowerReal_P_Phase_2: number;
                PowerReal_P_Phase_3: number;
                PowerReal_P_Sum: number;
                TimeStamp: number;
                Visible: number;
                Voltage_AC_PhaseToPhase_12: number;
                Voltage_AC_PhaseToPhase_23: number;
                Voltage_AC_PhaseToPhase_31: number;
                Voltage_AC_Phase_1: number;
                Voltage_AC_Phase_2: number;
                Voltage_AC_Phase_3: number;
            }
        }
    };
    Head: {
        RequestArguments: {
            DeviceClass: string;
            Scope: string;
        };
        Status: {
            Code: number;
            Reason: string;
            UserMessage: string;
        };
        Timestamp: string;
    };
}