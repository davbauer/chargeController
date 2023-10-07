export default interface AppInfo {
    webSocketPort: number,
    gitCommitId: string | null,
    gitBranchName: string | null,
    upime: number,
    environment: string,
    nodeVersion: string,
}
