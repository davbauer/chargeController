export default interface LiveData {
    StatusInverter: 1 | "OFFLINE",
    // (Unknown/Error=0, Idle=1, Charging=2, WaitCar=3, Complete=4, Error=5)
    StatusCharger: 0 | 1 | 2 | 3 | 4 | 5 | "OFFLINE"
    Export: number,
    ShouldStop: boolean,
    ChargerReserved: number,
    ChargerUse: number,
    LiveChargerAmp: number,
    CalcChargerAmp: number,
}