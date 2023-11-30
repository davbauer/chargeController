export default interface InterfaceAppInfo {
	webSocketPort: number;
	gitCommitId: string | null;
	gitBranchName: string | null;
	uptime: number;
	environment: string;
	nodeVersion: string;
}
