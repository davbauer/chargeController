export default interface Config {
    Enabled: boolean,
    InverterHost: string;
    ChargerHost: string;
    CheckSeconds: number;
    MinimumAmps: number;
    MaximumAmps: number;
    UsePowergrid: boolean;
}
