export default interface BackendLogs {
    items: {
        type: string;
        msg: string;
        ts: string
    }[];
}
