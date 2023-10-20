export default interface BackendLogs {
    count: number;
    items: {
        type: string;
        msg: string;
        ts: string
    }[];
}
